import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OrderSummary } from "../components/order-summary";
import { useCart } from "../features/cart/use-cart";
import { orderService } from "../features/order/order-service";
import type { CheckoutErrors, CheckoutInput } from "../features/order/order.types";
import { usePlaceOrder } from "../features/order/use-orders";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, totals, isLoading } = useCart();
  const placeOrder = usePlaceOrder();
  const [input, setInput] = useState<CheckoutInput>({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState<CheckoutErrors>({});

  if (isLoading) return <div className="card skeleton detail-skeleton" />;
  if (lines.length === 0 && !placeOrder.isSuccess) {
    return (
      <div className="empty">
        <p>Nothing to check out.</p>
        <Link to="/" className="btn btn-primary">
          Back to shop
        </Link>
      </div>
    );
  }

  const field = (key: keyof CheckoutInput, label: string, type = "text", autoComplete?: string) => (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        autoComplete={autoComplete}
        value={input[key]}
        onChange={(e) => setInput((prev) => ({ ...prev, [key]: e.target.value }))}
        aria-invalid={errors[key] ? true : undefined}
      />
      {errors[key] && <span className="error">{errors[key]}</span>}
    </label>
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = orderService.validate(input);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    placeOrder.mutate({ input, lines }, { onSuccess: (order) => navigate(`/orders?placed=${order.id}`) });
  };

  return (
    <>
      <h1>Checkout</h1>
      <div className="cart-layout">
        <form className="panel" onSubmit={submit} noValidate>
          <h2>Delivery details</h2>
          {field("name", "Full name", "text", "name")}
          {field("email", "Email", "email", "email")}
          {field("address", "Delivery address", "text", "street-address")}
          <p className="muted small">Payment is mocked: no card needed. Pay on delivery.</p>
          {placeOrder.isError && <p className="error">{placeOrder.error.message}</p>}
          <button type="submit" className="btn btn-primary block" disabled={placeOrder.isPending}>
            {placeOrder.isPending ? "Placing order…" : "Place order"}
          </button>
        </form>
        <aside className="panel">
          <h2>Order summary</h2>
          <OrderSummary totals={totals} />
        </aside>
      </div>
    </>
  );
}
