import { Navigate, useNavigate } from "react-router-dom";
import { FlightHeading, FlightTimes } from "../components/flight-summary";
import { draftService } from "../features/draft/draft-service";
import { useDraft } from "../features/draft/use-draft";
import { flightService } from "../features/flight/flight-service";
import { CABIN_LABEL, CABIN_MULTIPLIER, CABIN_ROWS, type Cabin } from "../features/flight/flight.types";
import { money } from "../lib/format";

const CABINS: Cabin[] = ["economy", "premium", "business"];
const LEFT = ["A", "B", "C"];
const RIGHT = ["D", "E", "F"];

const CABIN_PERKS: Record<Cabin, string> = {
  economy: "Standard seat · 23kg bag",
  premium: "Extra legroom · 2 bags · priority boarding",
  business: "Lie-flat seat · lounge access · chauffeur",
};

export function SeatsPage() {
  const draft = useDraft();
  const navigate = useNavigate();

  if (!draft.flight) return <Navigate to="/" replace />;
  const { flight } = draft;

  const taken = flightService.takenSeats(flight, draft.cabin);
  const [first, last] = CABIN_ROWS[draft.cabin];
  const rows = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const ready = draft.seats.length === draft.passengers;

  function seat(id: string) {
    const isTaken = taken.has(id);
    const idx = draft.seats.indexOf(id);
    return (
      <button
        key={id}
        type="button"
        disabled={isTaken}
        className={`seat ${isTaken ? "taken" : ""} ${idx >= 0 ? "mine" : ""} ${draft.cabin}`}
        onClick={() => draftService.toggleSeat(id)}
        aria-label={`Seat ${id}${isTaken ? " (taken)" : ""}`}
      >
        {idx >= 0 ? idx + 1 : ""}
      </button>
    );
  }

  return (
    <div className="split">
      <section>
        <h1>Choose your cabin & seats</h1>
        <div className="cabins">
          {CABINS.map((c) => (
            <button
              key={c}
              type="button"
              className={`cabin ${draft.cabin === c ? "active" : ""}`}
              onClick={() => draftService.setCabin(c)}
            >
              <strong>{CABIN_LABEL[c]}</strong>
              <span className="small">{CABIN_PERKS[c]}</span>
              <span className="cabin-price">{money(Math.round(flight.price * CABIN_MULTIPLIER[c]))} / person</span>
            </button>
          ))}
        </div>

        <p className="muted">
          Pick {draft.passengers} seat{draft.passengers > 1 ? "s" : ""} — numbers show passenger order.
        </p>

        <div className="plane">
          <div className="nose">{CABIN_LABEL[draft.cabin]}</div>
          {rows.map((row) => (
            <div key={row} className="seat-row">
              <div className="seat-group">{LEFT.map((c) => seat(`${row}${c}`))}</div>
              <span className="row-no">{row}</span>
              <div className="seat-group">{RIGHT.map((c) => seat(`${row}${c}`))}</div>
            </div>
          ))}
        </div>
      </section>

      <aside className="card sticky">
        <h2>Your flight</h2>
        <FlightHeading flight={flight} />
        <FlightTimes flight={flight} />
        <div className="line">
          <span>
            {CABIN_LABEL[draft.cabin]} × {draft.passengers}
          </span>
          <span>{money(Math.round(flight.price * CABIN_MULTIPLIER[draft.cabin]) * draft.passengers)}</span>
        </div>
        <div className="line">
          <span>Seats</span>
          <strong>{draft.seats.length ? draft.seats.join(", ") : "—"}</strong>
        </div>
        <button className="btn full" disabled={!ready} onClick={() => navigate("/shop")}>
          {ready ? "Continue to shop" : `Select ${draft.passengers - draft.seats.length} more`}
        </button>
      </aside>
    </div>
  );
}
