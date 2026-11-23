import { z } from "zod";
import { ApiError, api } from "../../lib/api";
import { productSchema, type Product } from "./product.types";

class ProductRepo {
  list(): Promise<Product[]> {
    return api.get("/products", z.array(productSchema));
  }

  async get(id: string): Promise<Product | null> {
    try {
      return await api.get(`/products/${encodeURIComponent(id)}`, productSchema);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }
  }
}

export const productRepo = new ProductRepo();
