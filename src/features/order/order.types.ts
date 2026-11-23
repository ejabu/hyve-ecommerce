import { z } from "zod";

export const orderSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  customer: z.object({ name: z.string(), email: z.string(), address: z.string() }),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      emoji: z.string(),
      unitPriceCents: z.number(),
      quantity: z.number(),
    }),
  ),
  deliveryCents: z.number(),
  taxCents: z.number(),
  totalCents: z.number(),
});
export type Order = z.infer<typeof orderSchema>;

export const ordersSchema = z.array(orderSchema);

export interface CheckoutInput {
  name: string;
  email: string;
  address: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutInput, string>>;

// Request body for POST /api/orders. Prices are never sent; the server looks them up.
export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Enter your full name."),
    email: z.email("Enter a valid email.").trim(),
    address: z.string().trim().min(6, "Enter a delivery address."),
  }),
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().positive().max(99) }))
    .min(1, "Your cart is empty.")
    .max(100),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
