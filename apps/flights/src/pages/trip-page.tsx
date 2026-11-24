import { Link, useParams } from "react-router-dom";
import { FlightHeading, FlightTimes } from "../components/flight-summary";
import { useBooking, useCancelBooking } from "../features/booking/use-bookings";
import { CABIN_LABEL } from "../features/flight/flight.types";
import { money } from "../lib/format";

function boarding(departTime: string): string {
  const [h = "0", m = "0"] = departTime.split(":");
  const total = (Number(h) * 60 + Number(m) - 45 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function TripPage() {
  const { id = "" } = useParams();
  const { data: booking, isPending } = useBooking(id);
  const cancel = useCancelBooking();

  if (isPending) return <p className="muted">Loading…</p>;
  if (!booking) {
    return (
      <p className="muted">
        Booking not found. <Link to="/trips">Back to trips</Link>.
      </p>
    );
  }

  const cancelled = booking.status === "cancelled";

  return (
    <>
      <div className={`card pass ${cancelled ? "cancelled" : ""}`}>
        <div className="row between">
          <FlightHeading flight={booking.flight} />
          <div className="right">
            <span className="muted small">Booking ref</span>
            <div className="pnr">{booking.id}</div>
          </div>
        </div>
        <FlightTimes flight={booking.flight} />
        <div className="row between wrap">
          <div className={`status ${booking.status}`}>{cancelled ? "Cancelled" : "Confirmed ✓"}</div>
          <div className="gate">
            <span>
              <small>Cabin</small>
              {CABIN_LABEL[booking.cabin]}
            </span>
            <span>
              <small>Gate</small>
              {booking.gate}
            </span>
            <span>
              <small>Boarding</small>
              {boarding(booking.flight.departTime)}
            </span>
          </div>
        </div>

        <h3>Passengers</h3>
        <ul className="plain">
          {booking.passengers.map((p, i) => (
            <li key={i} className="line">
              <span>{p.name}</span>
              <strong>Seat {p.seat}</strong>
            </li>
          ))}
        </ul>
        {!cancelled && <div className="barcode" aria-hidden="true" />}

        {booking.items.length > 0 && (
          <>
            <h3>Airport store pickup — {booking.flight.from}</h3>
            <ul className="plain">
              {booking.items.map((it) => (
                <li key={it.productId} className="line">
                  <span>
                    {it.emoji} {it.name} × {it.qty}
                  </span>
                  <span>{money(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="line total">
          <span>Total paid</span>
          <span>{money(booking.total)}</span>
        </div>
        <p className="muted small">Confirmation sent to {booking.contactEmail} (demo).</p>
      </div>

      <div className="row">
        <Link to="/trips" className="btn btn-ghost">
          All trips
        </Link>
        {!cancelled && (
          <button className="btn btn-danger" disabled={cancel.isPending} onClick={() => cancel.mutate(booking.id)}>
            {cancel.isPending ? "Cancelling…" : "Cancel booking"}
          </button>
        )}
      </div>
    </>
  );
}
