import { z } from "zod";
import { flightSchema } from "../flight/flight.types";
import type { Product } from "../product/product.types";

export const draftSchema = z.object({
  flight: flightSchema.nullable(),
  passengers: z.number().int().min(1).max(9),
  /** productId -> quantity */
  items: z.record(z.string(), z.number().int().positive()),
});

export type Draft = z.infer<typeof draftSchema>;

export interface SummaryLine {
  product: Product;
  qty: number;
  subtotal: number;
}

export interface TripSummary {
  lines: SummaryLine[];
  itemCount: number;
  flightTotal: number;
  itemsTotal: number;
  total: number;
}
