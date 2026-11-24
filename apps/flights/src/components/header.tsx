import { Link, NavLink } from "react-router-dom";
import { useDraft } from "../features/draft/use-draft";

export function Header() {
  const draft = useDraft();
  const itemCount = Object.values(draft.items).reduce((a, b) => a + b, 0);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          ✈️ Skyline
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Flights
          </NavLink>
          {draft.flight && (
            <NavLink to="/shop">
              Shop{itemCount > 0 && <span className="badge">{itemCount}</span>}
            </NavLink>
          )}
          <NavLink to="/trips">My trips</NavLink>
        </nav>
      </div>
    </header>
  );
}
