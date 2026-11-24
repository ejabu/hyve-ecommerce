import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAirports } from "../features/flight/use-flights";
import { flightService } from "../features/flight/flight-service";
import { todayIso } from "../lib/format";

const POPULAR: [string, string][] = [
  ["DXB", "LHR"],
  ["AUH", "SIN"],
  ["JFK", "CDG"],
  ["SIN", "SYD"],
];

export function SearchPage() {
  const navigate = useNavigate();
  const { data: airports = [] } = useAirports();
  const [from, setFrom] = useState("DXB");
  const [to, setTo] = useState("LHR");
  const [date, setDate] = useState(todayIso(7));
  const [passengers, setPassengers] = useState(1);
  const [error, setError] = useState<string | null>(null);

  function go(query: { from: string; to: string; date: string; passengers: number }) {
    const problem = flightService.validate(query);
    setError(problem);
    if (!problem) navigate(`/flights?${flightService.toParams(query)}`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    go({ from, to, date, passengers });
  }

  const options = airports.map((a) => (
    <option key={a.code} value={a.code}>
      {a.city} ({a.code})
    </option>
  ));

  return (
    <>
      <section className="hero">
        <h1>Fly. Shop. Board with your bags full.</h1>
        <p>Book your flight, then pre-order duty-free and travel essentials for pickup at the airport store.</p>
      </section>

      <form className="card search" onSubmit={onSubmit}>
        <label>
          From
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {options}
          </select>
        </label>
        <button
          type="button"
          className="swap"
          aria-label="Swap airports"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          ⇄
        </button>
        <label>
          To
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {options}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={date} min={todayIso()} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Passengers
          <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}>
            {Array.from({ length: 9 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <button className="btn" type="submit">
          Search flights
        </button>
        {error && <p className="error full">{error}</p>}
      </form>

      <h2 className="section-title">Popular routes</h2>
      <div className="chips">
        {POPULAR.map(([f, t]) => (
          <button key={f + t} className="chip" onClick={() => go({ from: f, to: t, date, passengers })}>
            {f} → {t}
          </button>
        ))}
      </div>
    </>
  );
}
