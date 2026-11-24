import { todayIso } from "../../lib/format";
import { flightRepo } from "./flight-repo";
import type { Airport, Flight, FlightQuery } from "./flight.types";

export type FlightSort = "cheapest" | "fastest" | "earliest";

class FlightService {
  airports(): Promise<Airport[]> {
    return flightRepo.airports();
  }

  /** Returns a user-facing error message, or null when the query is searchable. */
  validate(q: FlightQuery): string | null {
    if (q.from === q.to) return "Departure and destination must differ.";
    if (!q.from || !q.to) return "Choose both airports.";
    if (q.date < todayIso()) return "Pick a date from today onward.";
    if (!Number.isInteger(q.passengers) || q.passengers < 1 || q.passengers > 9) {
      return "Passengers must be between 1 and 9.";
    }
    return null;
  }

  parseQuery(params: URLSearchParams): FlightQuery | null {
    const from = params.get("from");
    const to = params.get("to");
    const date = params.get("date");
    if (!from || !to || !date) return null;
    return { from, to, date, passengers: Number(params.get("pax") ?? "1") };
  }

  toParams(q: FlightQuery): string {
    return new URLSearchParams({ from: q.from, to: q.to, date: q.date, pax: String(q.passengers) }).toString();
  }

  async search(q: FlightQuery): Promise<Flight[]> {
    const error = this.validate(q);
    if (error) throw new Error(error);
    return flightRepo.search(q);
  }

  sort(flights: Flight[], by: FlightSort): Flight[] {
    const copy = [...flights];
    if (by === "cheapest") return copy.sort((a, b) => a.price - b.price);
    if (by === "fastest") return copy.sort((a, b) => a.durationMin - b.durationMin);
    return copy.sort((a, b) => a.departTime.localeCompare(b.departTime));
  }
}

export const flightService = new FlightService();
