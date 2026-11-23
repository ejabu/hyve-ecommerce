import { randomBytes } from "node:crypto";
import { createOrderSchema, type Order } from "../../src/features/order/order.types";
import { computePricing } from "../../src/lib/pricing";
import { HttpError } from "../http-error";
import { orderRepo } from "./order-repo";

class OrderService {
  list(clientId: string): Promise<Order[]> {
    return orderRepo.listByClient(clientId);
  }

  // Prices and totals come from the DB, never from the client.
  async place(clientId: string, body: unknown): Promise<Order> {
    const input = createOrderSchema.parse(body);

    const quantities = new Map<string, number>();
    for (const item of input.items) {
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    }

    return orderRepo.withTransaction(async (tx) => {
      const products = await tx.lockProducts([...quantities.keys()]);
      const items: Order["items"] = [];

      for (const [productId, quantity] of quantities) {
        const product = products.find((p) => p.id === productId);
        if (!product) throw new HttpError(400, "An item in your cart is no longer available.");
        if (quantity > product.stock) {
          throw new HttpError(409, product.stock === 0 ? `${product.name} is out of stock.` : `Only ${product.stock} of ${product.name} left.`);
        }
        items.push({ productId, name: product.name, emoji: product.emoji, unitPriceCents: product.priceCents, quantity });
      }

      const subtotalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
      const pricing = computePricing(subtotalCents);
      const id = `ORD-${randomBytes(4).toString("hex").toUpperCase()}`;

      const createdAt = await tx.insertOrder({ id, clientId, customer: input.customer, ...pricing });
      for (const item of items) {
        await tx.insertItem(id, item);
        await tx.decrementStock(item.productId, item.quantity);
      }
      return { id, createdAt, customer: input.customer, items, ...pricing };
    });
  }
}

export const orderService = new OrderService();
