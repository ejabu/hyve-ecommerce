import { readStorage, writeStorage } from "../../lib/storage";
import { cartSchema, type CartItem } from "./cart.types";

const KEY = "corner-shop:cart";

class CartRepo {
  load(): CartItem[] {
    return readStorage(KEY, cartSchema, []);
  }

  save(items: CartItem[]): void {
    writeStorage(KEY, items);
  }
}

export const cartRepo = new CartRepo();
