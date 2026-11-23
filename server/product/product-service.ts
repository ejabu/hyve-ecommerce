import type { Product } from "../../src/features/product/product.types";
import { HttpError } from "../http-error";
import { productRepo } from "./product-repo";

class ProductService {
  list(): Promise<Product[]> {
    return productRepo.list();
  }

  async get(id: string): Promise<Product> {
    const product = await productRepo.get(id);
    if (!product) throw new HttpError(404, "Product not found.");
    return product;
  }
}

export const productService = new ProductService();
