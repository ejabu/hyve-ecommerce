import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FlightHeading, FlightTimes } from "../components/flight-summary";
import { useCreateBooking } from "../features/booking/use-bookings";
import { bookingService } from "../features/booking/booking-service";
import { draftService } from "../features/draft/draft-service";
import { useDraft } from "../features/draft/use-draft";
import { useProducts } from "../features/product/use-products";
import { money } from "../lib/format";

export function CheckoutPage() {
  const draft = useDraft();
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();
  const create = useCreateBooking();
  const [names, setNames] = useState<string[]>(() => Array.from({ length: draft.passengers }, () => ""));
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!draft.flight) return <Navigate to="/" replace />;

  const summary = draftService.summarize(draft, products);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const input = { passengerNames: names, contactEmail: email };
    const problem = bookingService.validate(input);
    setError(problem);
    if (problem) return;
    create.mutate(
      { draft, summary, input },
      {
        onSuccess: (booking) => {
          draftService.clear();
          navigate(`/trips/${booking.id}`, { replace: true });
        },
      },
    );
  }

  return (
    <form className="split" onSubmit={onSubmit}>
      <section>
        <h1>Passenger details</h1>
        {names.map((name, i) => (
          <label key={i} className="field">
            Passenger {i + 1} — full name as on passport
            <input
              value={name}
              onChange={(e) => setNames(names.map((n, j) => (j === i ? e.target.value : n)))}
              autoComplete="name"
            />
          </label>
        ))}
        <label className="field">
          Contact email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <p className="muted small">Demo mode: no payment is taken and nothing leaves this browser.</p>
      </section>

      <aside className="card sticky">
        <h2>Summary</h2>
        <FlightHeading flight={draft.flight} />
        <FlightTimes flight={draft.flight} />
        <div className="line">
          <span>Flight × {draft.passengers}</span>
          <span>{money(summary.flightTotal)}</span>
        </div>
        {summary.lines.map((l) => (
          <div key={l.product.id} className="line">
            <span>
              {l.product.emoji} {l.product.name} × {l.qty}
            </span>
            <span>{money(l.subtotal)}</span>
          </div>
        ))}
        <div className="line total">
          <span>Total</span>
          <span>{money(summary.total)}</span>
        </div>
        {(error ?? create.error?.message) && <p className="error">{error ?? create.error?.message}</p>}
        <button className="btn full" type="submit" disabled={create.isPending}>
          {create.isPending ? "Booking…" : `Confirm & book ${money(summary.total)}`}
        </button>
      </aside>
    </form>
  );
}
