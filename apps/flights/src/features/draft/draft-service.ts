import { CABIN_MULTIPLIER, type Cabin, type Flight } from "../flight/flight.types";
import type { Product } from "../product/product.types";
import { draftRepo, EMPTY_DRAFT } from "./draft-repo";
import type { Draft, SummaryLine, TripSummary } from "./draft.types";

/** The in-progress trip: chosen flight plus pickup items. Client state, persisted locally. */
class DraftService {
  get = (): Draft => draftRepo.get();
  subscribe = (listener: () => void): (() => void) => draftRepo.subscribe(listener);

  selectFlight(flight: Flight, passengers: number): void {
    draftRepo.set({ ...draftRepo.get(), flight, passengers, cabin: "economy", seats: [] });
  }

  setCabin(cabin: Cabin): void {
    draftRepo.set({ ...draftRepo.get(), cabin, seats: [] });
  }

  toggleSeat(seat: string): void {
    const draft = draftRepo.get();
    if (draft.seats.includes(seat)) {
      draftRepo.set({ ...draft, seats: draft.seats.filter((s) => s !== seat) });
    } else if (draft.seats.length < draft.passengers) {
      draftRepo.set({ ...draft, seats: [...draft.seats, seat] });
    }
  }

  setItemQty(productId: string, qty: number): void {
    const draft = draftRepo.get();
    const items = { ...draft.items };
    if (qty <= 0) delete items[productId];
    else items[productId] = Math.min(qty, 20);
    draftRepo.set({ ...draft, items });
  }

  clear(): void {
    draftRepo.set(EMPTY_DRAFT);
  }

  summarize(draft: Draft, products: Product[]): TripSummary {
    const lines = Object.entries(draft.items).flatMap<SummaryLine>(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      return product ? [{ product, qty, subtotal: product.price * qty }] : [];
    });
    const itemsTotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
    const flightTotal = draft.flight ? Math.round(draft.flight.price * CABIN_MULTIPLIER[draft.cabin]) * draft.passengers : 0;
    return {
      lines,
      itemCount: lines.reduce((sum, l) => sum + l.qty, 0),
      flightTotal,
      itemsTotal,
      total: flightTotal + itemsTotal,
    };
  }
}

export const draftService = new DraftService();
