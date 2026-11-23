import type { CartTotals } from "../features/cart/cart.types";
import { formatMoney } from "../lib/format";

export function OrderSummary({ totals }: { totals: CartTotals }) {
  return (
    <dl className="summary">
      <div>
        <dt>Subtotal ({totals.itemCount} items)</dt>
        <dd>{formatMoney(totals.subtotalCents)}</dd>
      </div>
      <div>
        <dt>Delivery</dt>
        <dd>{totals.deliveryCents === 0 ? "Free" : formatMoney(totals.deliveryCents)}</dd>
      </div>
      <div>
        <dt>Tax</dt>
        <dd>{formatMoney(totals.taxCents)}</dd>
      </div>
      <div className="total">
        <dt>Total</dt>
        <dd>{formatMoney(totals.totalCents)}</dd>
      </div>
    </dl>
  );
}
