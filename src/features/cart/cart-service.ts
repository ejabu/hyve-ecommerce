import type { Product } from "../product/product.types";
import { computePricing, FREE_DELIVERY_THRESHOLD_CENTS } from "../../lib/pricing";
import { cartRepo } from "./cart-repo";
import type { CartItem, CartLine, CartTotals } from "./cart.types";


type Listener = () => void;

class CartService {
  private items: CartItem[] = cartRepo.load();
  private listeners = new Set<Listener>();

  // Arrow properties so they can be passed straight to useSyncExternalStore.
  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): CartItem[] => this.items;

  quantityOf(productId: string): number {
    return this.items.find((i) => i.productId === productId)?.quantity ?? 0;
  }

  add(product: Product, quantity = 1): void {
    this.setQuantity(product, this.quantityOf(product.id) + quantity);
  }

  setQuantity(product: Product, quantity: number): void {
    const clamped = Math.min(Math.floor(quantity), product.stock);
    if (clamped <= 0) {
      this.remove(product.id);
      return;
    }
    const exists = this.items.some((i) => i.productId === product.id);
    this.commit(
      exists
        ? this.items.map((i) => (i.productId === product.id ? { ...i, quantity: clamped } : i))
        : [...this.items, { productId: product.id, quantity: clamped }],
    );
  }

  remove(productId: string): void {
    this.commit(this.items.filter((i) => i.productId !== productId));
  }

  clear(): void {
    this.commit([]);
  }

  buildLines(items: CartItem[], products: Product[]): CartLine[] {
    const lines: CartLine[] = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      lines.push({ product, quantity: item.quantity, subtotalCents: product.priceCents * item.quantity });
    }
    return lines;
  }

  totals(lines: CartLine[]): CartTotals {
    const subtotalCents = lines.reduce((sum, l) => sum + l.subtotalCents, 0);
    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
    const pricing = computePricing(subtotalCents);
    return {
      itemCount,
      subtotalCents,
      ...pricing,
      freeDeliveryRemainingCents: Math.max(0, FREE_DELIVERY_THRESHOLD_CENTS - subtotalCents),
    };
  }

  private commit(items: CartItem[]): void {
    this.items = items;
    cartRepo.save(items);
    this.listeners.forEach((l) => l());
  }
}

export const cartService = new CartService();
