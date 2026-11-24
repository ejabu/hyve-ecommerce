import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FlightTimes } from "../components/flight-summary";
import { draftService } from "../features/draft/draft-service";
import { flightService, type FlightSort } from "../features/flight/flight-service";
import type { Flight } from "../features/flight/flight.types";
import { useFlightSearch } from "../features/flight/use-flights";
import { longDate, money } from "../lib/format";

const SORTS: FlightSort[] = ["cheapest", "fastest", "earliest"];

export function ResultsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = flightService.parseQuery(params);
  const { data, isPending, error } = useFlightSearch(query);
  const [sort, setSort] = useState<FlightSort>("cheapest");

  if (!query) return <p className="muted">Missing search. <Link to="/">Start again</Link>.</p>;

  function select(flight: Flight) {
    if (!query) return;
    draftService.selectFlight(flight, query.passengers);
    navigate("/shop");
  }

  const flights = data ? flightService.sort(data, sort) : [];

  return (
    <>
      <div className="row between wrap">
        <div>
          <h1>
            {query.from} → {query.to}
          </h1>
          <p className="muted">
            {longDate(query.date)} · {query.passengers} passenger{query.passengers > 1 ? "s" : ""}
          </p>
        </div>
        <div className="chips">
          {SORTS.map((s) => (
            <button key={s} className={`chip ${sort === s ? "active" : ""}`} onClick={() => setSort(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {isPending && <p className="muted">Searching flights…</p>}
      {error && <p className="error">{error.message}</p>}
      {flights.length === 0 && !isPending && !error && <p className="muted">No flights found.</p>}

      <ul className="list">
        {flights.map((f) => (
          <li key={f.id} className="card flight">
            <div className="airline">
              <strong>{f.airline}</strong>
              <span className="muted small">{f.flightNo}</span>
            </div>
            <FlightTimes flight={f} />
            <div className="price">
              <strong>{money(f.price * query.passengers)}</strong>
              <span className="muted small">{money(f.price)} / person</span>
              <button className="btn btn-sm" onClick={() => select(f)}>
                Select
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
