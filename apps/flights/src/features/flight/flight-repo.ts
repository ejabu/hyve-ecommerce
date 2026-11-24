import { seeded } from "../../lib/seeded";
import type { Airport, Flight, FlightQuery } from "./flight.types";

const AIRPORTS: Airport[] = [
  { code: "DXB", city: "Dubai", country: "UAE", lat: 25.25, lon: 55.36 },
  { code: "AUH", city: "Abu Dhabi", country: "UAE", lat: 24.43, lon: 54.65 },
  { code: "LHR", city: "London", country: "UK", lat: 51.47, lon: -0.45 },
  { code: "CDG", city: "Paris", country: "France", lat: 49.01, lon: 2.55 },
  { code: "IST", city: "Istanbul", country: "Türkiye", lat: 41.28, lon: 28.75 },
  { code: "JFK", city: "New York", country: "USA", lat: 40.64, lon: -73.78 },
  { code: "DEL", city: "Delhi", country: "India", lat: 28.56, lon: 77.1 },
  { code: "SIN", city: "Singapore", country: "Singapore", lat: 1.36, lon: 103.99 },
  { code: "KUL", city: "Kuala Lumpur", country: "Malaysia", lat: 2.75, lon: 101.71 },
  { code: "CGK", city: "Jakarta", country: "Indonesia", lat: -6.13, lon: 106.66 },
  { code: "HND", city: "Tokyo", country: "Japan", lat: 35.55, lon: 139.78 },
  { code: "SYD", city: "Sydney", country: "Australia", lat: -33.94, lon: 151.18 },
];

const AIRLINES: { name: string; code: string }[] = [
  { name: "Skyline Air", code: "SK" },
  { name: "Gulf Wings", code: "GW" },
  { name: "Meridian", code: "MD" },
  { name: "Aurora Airways", code: "AU" },
];

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function distanceKm(a: Airport, b: Airport): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

class FlightRepo {
  async airports(): Promise<Airport[]> {
    return AIRPORTS;
  }

  async search(q: FlightQuery): Promise<Flight[]> {
    await delay(500);
    const a = AIRPORTS.find((x) => x.code === q.from);
    const b = AIRPORTS.find((x) => x.code === q.to);
    if (!a || !b) return [];
    const km = distanceKm(a, b);
    const rand = seeded(`${q.from}${q.to}${q.date}`);

    return Array.from({ length: 7 }, (_, i): Flight => {
      const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)] ?? AIRLINES[0];
      const stops = rand() < 0.3 ? 1 : 0;
      const departMin = 300 + Math.floor((i + rand() * 0.8) * (1000 / 7));
      const durationMin = Math.round((km / 820) * 60) + 30 + stops * 100;
      const price = Math.round((60 + km * 0.085) * (0.8 + rand() * 0.8) * (stops ? 0.82 : 1));
      const hh = String(Math.floor(departMin / 60)).padStart(2, "0");
      const mm = String(departMin % 60).padStart(2, "0");
      const flightNo = `${airline?.code ?? "SK"}${100 + Math.floor(rand() * 900)}`;
      return {
        id: `${q.from}-${q.to}-${q.date}-${i}`,
        airline: airline?.name ?? "Skyline Air",
        flightNo,
        from: q.from,
        to: q.to,
        date: q.date,
        departTime: `${hh}:${mm}`,
        durationMin,
        stops,
        price,
      };
    });
  }
}

export const flightRepo = new FlightRepo();
