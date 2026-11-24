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
