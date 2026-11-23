import { productRepo } from "./product-repo";
import type { Product, ProductFilter } from "./product.types";

class ProductService {
  list(): Promise<Product[]> {
    return productRepo.list();
  }

  get(id: string): Promise<Product | null> {
    return productRepo.get(id);
  }

  filter(products: Product[], filter: ProductFilter): Product[] {
    const term = filter.search.trim().toLowerCase();
    const result = products.filter((p) => {
      if (filter.category !== "all" && p.category !== filter.category) return false;
      if (!term) return true;
      return p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term);
    });
    switch (filter.sort) {
      case "price-asc":
        return result.sort((a, b) => a.priceCents - b.priceCents);
      case "price-desc":
        return result.sort((a, b) => b.priceCents - a.priceCents);
      case "name":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case "featured":
        return result.sort((a, b) => b.rating - a.rating);
    }
  }
}

export const productService = new ProductService();
