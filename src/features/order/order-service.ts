import { cartService } from "../cart/cart-service";
import type { CartLine } from "../cart/cart.types";
import { orderRepo } from "./order-repo";
import type { CheckoutErrors, CheckoutInput, Order } from "./order.types";

class OrderService {
  list(): Promise<Order[]> {
    return orderRepo.list();
  }

  validate(input: CheckoutInput): CheckoutErrors {
    const errors: CheckoutErrors = {};
    if (input.name.trim().length < 2) errors.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) errors.email = "Enter a valid email.";
    if (input.address.trim().length < 6) errors.address = "Enter a delivery address.";
    return errors;
  }

  async place(input: CheckoutInput, lines: CartLine[]): Promise<Order> {
    if (lines.length === 0) throw new Error("Your cart is empty.");
    if (Object.keys(this.validate(input)).length > 0) throw new Error("Check your details.");
    // Server recomputes prices and totals from the database; only ids and quantities are sent.
    const order = await orderRepo.create({
      customer: { name: input.name.trim(), email: input.email.trim(), address: input.address.trim() },
      items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
    });
    cartService.clear();
    return order;
  }
}

export const orderService = new OrderService();
