import { useQuery } from "@tanstack/react-query";
import { productService } from "./product-service";

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: () => productService.list(), staleTime: Infinity });
}
