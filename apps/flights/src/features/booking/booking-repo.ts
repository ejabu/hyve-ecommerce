import { z } from "zod";
import { bookingSchema, type Booking } from "./booking.types";

const KEY = "skyline.bookings.v2";
const schema = z.array(bookingSchema);

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function load(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = schema.safeParse(raw === null ? [] : JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function persist(bookings: Booking[]): void {
  localStorage.setItem(KEY, JSON.stringify(bookings));
}

/** Async on purpose: swap the body for fetch() calls when the backend exists. */
class BookingRepo {
  async list(): Promise<Booking[]> {
    await delay(150);
    return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async get(id: string): Promise<Booking | null> {
    await delay(100);
    return load().find((b) => b.id === id) ?? null;
  }

  async save(booking: Booking): Promise<Booking> {
    await delay(600);
    persist([...load().filter((b) => b.id !== booking.id), booking]);
    return booking;
  }
}

export const bookingRepo = new BookingRepo();
