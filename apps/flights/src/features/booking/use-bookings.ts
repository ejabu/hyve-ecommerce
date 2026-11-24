import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Draft, TripSummary } from "../draft/draft.types";
import { bookingService } from "./booking-service";
import type { CreateBookingInput } from "./booking.types";

export function useBookings() {
  return useQuery({ queryKey: ["bookings"], queryFn: () => bookingService.list() });
}

export function useBooking(id: string) {
  return useQuery({ queryKey: ["bookings", id], queryFn: () => bookingService.get(id) });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { draft: Draft; summary: TripSummary; input: CreateBookingInput }) =>
      bookingService.create(v.draft, v.summary, v.input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}
