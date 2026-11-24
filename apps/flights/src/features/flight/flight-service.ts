import { todayIso } from "../../lib/format";
import { seeded } from "../../lib/seeded";
import { flightRepo } from "./flight-repo";
import { CABIN_ROWS, type Airport, type Cabin, type Flight, type FlightQuery } from "./flight.types";

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

  /** Seats already taken on a flight (deterministic mock). */
  takenSeats(flight: Flight, cabin: Cabin): Set<string> {
    const rand = seeded(`seats-${flight.id}`);
    const [first, last] = CABIN_ROWS[cabin];
    const taken = new Set<string>();
    for (let row = first; row <= last; row++) {
      for (const col of "ABCDEF") if (rand() < 0.35) taken.add(`${row}${col}`);
    }
    return taken;
  }

  sort(flights: Flight[], by: FlightSort): Flight[] {
    const copy = [...flights];
    if (by === "cheapest") return copy.sort((a, b) => a.price - b.price);
    if (by === "fastest") return copy.sort((a, b) => a.durationMin - b.durationMin);
    return copy.sort((a, b) => a.departTime.localeCompare(b.departTime));
  }
}

export const flightService = new FlightService();
