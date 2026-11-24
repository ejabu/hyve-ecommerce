import { arrival, duration, longDate } from "../lib/format";
import type { Flight } from "../features/flight/flight.types";

export function FlightTimes({ flight }: { flight: Flight }) {
  const arr = arrival(flight.departTime, flight.durationMin);
  return (
    <div className="times">
      <div>
        <strong>{flight.departTime}</strong>
        <span className="muted">{flight.from}</span>
      </div>
      <div className="route">
        <span className="muted small">{duration(flight.durationMin)}</span>
        <div className="route-line" />
        <span className="muted small">{flight.stops === 0 ? "Direct" : `${flight.stops} stop`}</span>
      </div>
      <div>
        <strong>
          {arr.time}
          {arr.dayOffset > 0 && <sup> +{arr.dayOffset}</sup>}
        </strong>
        <span className="muted">{flight.to}</span>
      </div>
    </div>
  );
}

export function FlightHeading({ flight }: { flight: Flight }) {
  return (
    <div>
      <strong>
        {flight.from} → {flight.to}
      </strong>
      <div className="muted small">
        {flight.airline} {flight.flightNo} · {longDate(flight.date)}
      </div>
    </div>
  );
}
