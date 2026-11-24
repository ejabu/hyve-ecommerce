import { z } from "zod";

export const flightSchema = z.object({
  id: z.string(),
  airline: z.string(),
  flightNo: z.string(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  departTime: z.string(),
  durationMin: z.number(),
  stops: z.number(),
  /** Price per passenger, whole USD. */
  price: z.number(),
});

export const cabinSchema = z.enum(["economy", "premium", "business"]);
export type Cabin = z.infer<typeof cabinSchema>;

export const CABIN_MULTIPLIER: Record<Cabin, number> = { economy: 1, premium: 1.7, business: 3 };
/** Seat rows available per cabin on the mock aircraft (6 abreast, A-F). */
export const CABIN_ROWS: Record<Cabin, [number, number]> = { business: [1, 4], premium: [5, 9], economy: [10, 26] };
export const CABIN_LABEL: Record<Cabin, string> = { economy: "Economy", premium: "Premium", business: "Business" };

export type Flight = z.infer<typeof flightSchema>;

export interface Airport {
  code: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export interface FlightQuery {
  from: string;
  to: string;
  date: string;
  passengers: number;
}
