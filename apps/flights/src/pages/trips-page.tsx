import { Link } from "react-router-dom";
import { FlightHeading } from "../components/flight-summary";
import { useBookings } from "../features/booking/use-bookings";
import { money } from "../lib/format";

export function TripsPage() {
  const { data: bookings, isPending } = useBookings();

  return (
    <>
      <h1>My trips</h1>
      {isPending && <p className="muted">Loading…</p>}
      {bookings?.length === 0 && (
        <p className="muted">
          No bookings yet. <Link to="/">Find a flight</Link>.
        </p>
      )}
      <ul className="list">
        {bookings?.map((b) => (
          <li key={b.id}>
            <Link to={`/trips/${b.id}`} className="card row between link">
              <FlightHeading flight={b.flight} />
              <div className="right">
                <strong>{b.id}</strong>
                <div className={`status ${b.status}`}>{b.status}</div>
                <span className="muted small">{money(b.total)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
