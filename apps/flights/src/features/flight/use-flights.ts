import { useQuery } from "@tanstack/react-query";
import { flightService } from "./flight-service";
import type { FlightQuery } from "./flight.types";

export function useAirports() {
  return useQuery({ queryKey: ["airports"], queryFn: () => flightService.airports(), staleTime: Infinity });
}

export function useFlightSearch(query: FlightQuery | null) {
  return useQuery({
    queryKey: ["flights", query],
    queryFn: () => (query ? flightService.search(query) : Promise.resolve([])),
    enabled: query !== null,
  });
}
