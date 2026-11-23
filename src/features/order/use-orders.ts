import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CartLine } from "../cart/cart.types";
import { orderService } from "./order-service";
import type { CheckoutInput } from "./order.types";

export function useOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: () => orderService.list() });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lines }: { input: CheckoutInput; lines: CartLine[] }) => orderService.place(input, lines),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }), // stock changed
      ]),
  });
}
