import { Link, NavLink } from "react-router-dom";
import { useCart } from "../features/cart/use-cart";

export function Header() {
  const { totals } = useCart();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          🛒 Corner Shop
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Shop
          </NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/cart" className="cart-link">
            Cart
            {totals.itemCount > 0 && <span className="badge">{totals.itemCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
