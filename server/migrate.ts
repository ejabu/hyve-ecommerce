import { pool } from "./db";
import { SEED_PRODUCTS } from "./seed-data";

// Idempotent: safe to run on every boot.
export async function migrate(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id text PRIMARY KEY,
      name text NOT NULL,
      description text NOT NULL,
      category text NOT NULL,
      price_cents integer NOT NULL CHECK (price_cents >= 0),
      unit text NOT NULL,
      emoji text NOT NULL,
      hue integer NOT NULL,
      stock integer NOT NULL CHECK (stock >= 0),
      rating double precision NOT NULL
    )`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id text PRIMARY KEY,
      client_id text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      customer_name text NOT NULL,
      customer_email text NOT NULL,
      customer_address text NOT NULL,
      delivery_cents integer NOT NULL,
      tax_cents integer NOT NULL,
      total_cents integer NOT NULL
    )`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id bigserial PRIMARY KEY,
      order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id text NOT NULL,
      name text NOT NULL,
      emoji text NOT NULL,
      unit_price_cents integer NOT NULL,
      quantity integer NOT NULL CHECK (quantity > 0)
    )`);
  await pool.query(`CREATE INDEX IF NOT EXISTS orders_client_idx ON orders (client_id, created_at DESC)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id)`);

  const { rows } = await pool.query("SELECT count(*)::int AS n FROM products");
  if (rows[0]?.n === 0) {
    await pool.query(
      `INSERT INTO products (id, name, description, category, price_cents, unit, emoji, hue, stock, rating)
       SELECT id, name, description, category, "priceCents", unit, emoji, hue, stock, rating
       FROM jsonb_to_recordset($1::jsonb) AS x(
         id text, name text, description text, category text, "priceCents" int,
         unit text, emoji text, hue int, stock int, rating double precision
       )
       ON CONFLICT (id) DO NOTHING`,
      [JSON.stringify(SEED_PRODUCTS)],
    );
    console.log(`Seeded ${SEED_PRODUCTS.length} products`);
  }
}
