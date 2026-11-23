import { z } from "zod";
import { productSchema, type Product } from "../../src/features/product/product.types";
import { pool } from "../db";

const COLUMNS = `id, name, description, category, price_cents AS "priceCents", unit, emoji, hue, stock, rating`;

class ProductRepo {
  async list(): Promise<Product[]> {
    const { rows } = await pool.query(`SELECT ${COLUMNS} FROM products ORDER BY length(id), id`);
    return z.array(productSchema).parse(rows);
  }

  async get(id: string): Promise<Product | null> {
    const { rows } = await pool.query(`SELECT ${COLUMNS} FROM products WHERE id = $1`, [id]);
    return rows[0] ? productSchema.parse(rows[0]) : null;
  }
}

export const productRepo = new ProductRepo();
