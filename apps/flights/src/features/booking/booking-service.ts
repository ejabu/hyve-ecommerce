import type { Draft, TripSummary } from "../draft/draft.types";
import { bookingRepo } from "./booking-repo";
import type { Booking, CreateBookingInput } from "./booking.types";

const PNR_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function newReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => PNR_ALPHABET.charAt(b % PNR_ALPHABET.length)).join("");
}

class BookingService {
  list(): Promise<Booking[]> {
    return bookingRepo.list();
  }

  get(id: string): Promise<Booking | null> {
    return bookingRepo.get(id);
  }

  /** Returns a user-facing error message, or null when the form is valid. */
  validate(input: CreateBookingInput): string | null {
    if (input.passengerNames.some((n) => n.trim().length < 2)) return "Enter the full name of every passenger.";
    if (!/^\S+@\S+\.\S+$/.test(input.contactEmail.trim())) return "Enter a valid contact email.";
    return null;
  }

  async create(draft: Draft, summary: TripSummary, input: CreateBookingInput): Promise<Booking> {
    if (!draft.flight) throw new Error("No flight selected.");
    const error = this.validate(input);
    if (error) throw new Error(error);

    return bookingRepo.save({
      id: newReference(),
      createdAt: new Date().toISOString(),
      status: "confirmed",
      flight: draft.flight,
      passengers: input.passengerNames.map((name) => ({ name: name.trim() })),
      contactEmail: input.contactEmail.trim(),
      items: summary.lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        emoji: l.product.emoji,
        price: l.product.price,
        qty: l.qty,
      })),
      flightTotal: summary.flightTotal,
      itemsTotal: summary.itemsTotal,
      total: summary.total,
    });
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await bookingRepo.get(id);
    if (!booking) throw new Error("Booking not found.");
    return bookingRepo.save({ ...booking, status: "cancelled" });
  }
}

export const bookingService = new BookingService();
