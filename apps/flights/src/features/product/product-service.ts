import { productRepo } from "./product-repo";
import type { Product, ProductCategory } from "./product.types";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "duty-free": "Duty free",
  travel: "Travel essentials",
  snacks: "Snacks & gifts",
  tech: "Tech",
};

class ProductService {
  list(): Promise<Product[]> {
    return productRepo.list();
  }

  categories(): ProductCategory[] {
    return ["duty-free", "travel", "snacks", "tech"];
  }
}

export const productService = new ProductService();
