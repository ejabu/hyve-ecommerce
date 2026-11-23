import { Link, useSearchParams } from "react-router-dom";
import { useOrders } from "../features/order/use-orders";
import { formatMoney } from "../lib/format";

export function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const [params] = useSearchParams();
  const placed = params.get("placed");

  if (isLoading) return <div className="card skeleton detail-skeleton" />;
  return (
    <>
      <h1>Your orders</h1>
      {placed && (
        <p className="notice success">
          Order <strong>{placed}</strong> placed. Thanks for shopping!
        </p>
      )}
      {(!orders || orders.length === 0) && (
        <div className="empty">
          <p>No orders yet.</p>
          <Link to="/" className="btn btn-primary">
            Start shopping
          </Link>
        </div>
      )}
      <ul className="orders">
        {orders?.map((order) => (
          <li key={order.id} className="panel">
            <div className="order-head">
              <strong>{order.id}</strong>
              <span className="muted small">{new Date(order.createdAt).toLocaleString()}</span>
              <strong>{formatMoney(order.totalCents)}</strong>
            </div>
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={item.productId}>
                  <span>
                    {item.emoji} {item.name} × {item.quantity}
                  </span>
                  <span>{formatMoney(item.unitPriceCents * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="muted small">Delivering to {order.customer.address}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
