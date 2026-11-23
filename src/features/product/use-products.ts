import { useQuery } from "@tanstack/react-query";
import { productService } from "./product-service";

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: () => productService.list() });
}

export function useProduct(id: string) {
  return useQuery({ queryKey: ["products", id], queryFn: () => productService.get(id) });
}
