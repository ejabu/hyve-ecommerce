import type { PoolClient } from "@neondatabase/serverless";
import { z } from "zod";
import { ordersSchema, type Order } from "../../src/features/order/order.types";
import { pool } from "../db";

const lockedProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  emoji: z.string(),
  priceCents: z.number().int(),
  stock: z.number().int(),
});
export type LockedProduct = z.infer<typeof lockedProductSchema>;

interface NewOrderRow {
  id: string;
  clientId: string;
  customer: Order["customer"];
  deliveryCents: number;
  taxCents: number;
  totalCents: number;
}

export class OrderTx {
  constructor(private readonly client: PoolClient) {}

  // Row locks serialize concurrent orders for the same products, so stock can't oversell.
  async lockProducts(ids: string[]): Promise<LockedProduct[]> {
    const { rows } = await this.client.query(
      `SELECT id, name, emoji, price_cents AS "priceCents", stock
       FROM products WHERE id = ANY($1) ORDER BY id FOR UPDATE`,
      [ids],
    );
    return z.array(lockedProductSchema).parse(rows);
  }

  async insertOrder(row: NewOrderRow): Promise<string> {
    const { rows } = await this.client.query(
      `INSERT INTO orders (id, client_id, customer_name, customer_email, customer_address, delivery_cents, tax_cents, total_cents)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "createdAt"`,
      [row.id, row.clientId, row.customer.name, row.customer.email, row.customer.address, row.deliveryCents, row.taxCents, row.totalCents],
    );
    return z.object({ createdAt: z.string() }).parse(rows[0]).createdAt;
  }

  async insertItem(orderId: string, item: Order["items"][number]): Promise<void> {
    await this.client.query(
      `INSERT INTO order_items (order_id, product_id, name, emoji, unit_price_cents, quantity) VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, item.productId, item.name, item.emoji, item.unitPriceCents, item.quantity],
    );
  }

  async decrementStock(productId: string, quantity: number): Promise<void> {
    await this.client.query(`UPDATE products SET stock = stock - $2 WHERE id = $1`, [productId, quantity]);
  }
}

class OrderRepo {
  async withTransaction<T>(fn: (tx: OrderTx) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await fn(new OrderTx(client));
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw err;
    } finally {
      client.release();
    }
  }

  async listByClient(clientId: string): Promise<Order[]> {
    const { rows } = await pool.query(
      `SELECT o.id,
              to_char(o.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "createdAt",
              json_build_object('name', o.customer_name, 'email', o.customer_email, 'address', o.customer_address) AS customer,
              o.delivery_cents AS "deliveryCents", o.tax_cents AS "taxCents", o.total_cents AS "totalCents",
              COALESCE(json_agg(json_build_object(
                'productId', i.product_id, 'name', i.name, 'emoji', i.emoji,
                'unitPriceCents', i.unit_price_cents, 'quantity', i.quantity
              ) ORDER BY i.id) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
       FROM orders o LEFT JOIN order_items i ON i.order_id = o.id
       WHERE o.client_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [clientId],
    );
    return ordersSchema.parse(rows);
  }
}

export const orderRepo = new OrderRepo();
