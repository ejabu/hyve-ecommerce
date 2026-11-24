import { z } from "zod";
import { cabinSchema, flightSchema } from "../flight/flight.types";

export const bookingSchema = z.object({
  /** 6-character booking reference (PNR). */
  id: z.string(),
  createdAt: z.string(),
  status: z.enum(["confirmed", "cancelled"]),
  flight: flightSchema,
  cabin: cabinSchema,
  passengers: z.array(z.object({ name: z.string(), seat: z.string() })),
  /** Mock gate and boarding time shown on the pass. */
  gate: z.string(),
  contactEmail: z.string(),
  items: z.array(z.object({ productId: z.string(), name: z.string(), emoji: z.string(), price: z.number(), qty: z.number() })),
  flightTotal: z.number(),
  itemsTotal: z.number(),
  total: z.number(),
});

export type Booking = z.infer<typeof bookingSchema>;

export interface CreateBookingInput {
  passengerNames: string[];
  contactEmail: string;
}
