import { Link } from "react-router-dom";
import { OrderSummary } from "../components/order-summary";
import { ProductArt } from "../components/product-art";
import { QuantityStepper } from "../components/quantity-stepper";
import { cartService } from "../features/cart/cart-service";
import { useCart } from "../features/cart/use-cart";
import { formatMoney } from "../lib/format";

export function CartPage() {
  const { lines, totals, isLoading } = useCart();

  if (isLoading) return <div className="card skeleton detail-skeleton" />;
  if (lines.length === 0) {
    return (
      <div className="empty">
        <p>Your cart is empty.</p>
        <Link to="/" className="btn btn-primary">
          Start shopping
        </Link>
      </div>
    );
  }
  return (
    <>
      <h1>Your cart</h1>
      <div className="cart-layout">
        <ul className="lines">
          {lines.map(({ product, quantity, subtotalCents }) => (
            <li key={product.id} className="line">
              <ProductArt product={product} />
              <div className="line-info">
                <Link to={`/product/${product.id}`}>
                  <strong>{product.name}</strong>
                </Link>
                <span className="muted small">
                  {formatMoney(product.priceCents)} · {product.unit}
                </span>
                <button type="button" className="link" onClick={() => cartService.remove(product.id)}>
                  Remove
                </button>
              </div>
              <QuantityStepper
                quantity={quantity}
                max={product.stock}
                label={product.name}
                onChange={(q) => cartService.setQuantity(product, q)}
              />
              <strong className="line-total">{formatMoney(subtotalCents)}</strong>
            </li>
          ))}
        </ul>
        <aside className="panel">
          <h2>Summary</h2>
          {totals.freeDeliveryRemainingCents > 0 && (
            <p className="notice">Add {formatMoney(totals.freeDeliveryRemainingCents)} more for free delivery.</p>
          )}
          <OrderSummary totals={totals} />
          <Link to="/checkout" className="btn btn-primary block">
            Checkout
          </Link>
          <button type="button" className="link" onClick={() => cartService.clear()}>
            Clear cart
          </button>
        </aside>
      </div>
    </>
  );
}
