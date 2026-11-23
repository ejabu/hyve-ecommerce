import { useSyncExternalStore } from "react";
import { useProducts } from "../product/use-products";
import { cartService } from "./cart-service";

export function useCart() {
  const items = useSyncExternalStore(cartService.subscribe, cartService.getSnapshot);
  const { data: products = [], isLoading } = useProducts();
  const lines = cartService.buildLines(items, products);
  const totals = cartService.totals(lines);
  return { lines, totals, isLoading };
}

export function useCartQuantity(productId: string): number {
  const items = useSyncExternalStore(cartService.subscribe, cartService.getSnapshot);
  return items.find((i) => i.productId === productId)?.quantity ?? 0;
}
