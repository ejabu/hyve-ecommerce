import { z } from "zod";
import type { Product } from "../product/product.types";

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});
export type CartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.array(cartItemSchema);

export interface CartLine {
  product: Product;
  quantity: number;
  subtotalCents: number;
}

export interface CartTotals {
  itemCount: number;
  subtotalCents: number;
  deliveryCents: number;
  taxCents: number;
  totalCents: number;
  freeDeliveryRemainingCents: number;
}
