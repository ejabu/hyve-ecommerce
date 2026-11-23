import { api } from "../../lib/api";
import { ordersSchema, orderSchema, type CreateOrderInput, type Order } from "./order.types";

class OrderRepo {
  list(): Promise<Order[]> {
    return api.get("/orders", ordersSchema);
  }

  create(input: CreateOrderInput): Promise<Order> {
    return api.post("/orders", orderSchema, input);
  }
}

export const orderRepo = new OrderRepo();
