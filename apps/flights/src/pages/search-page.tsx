import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAirports } from "../features/flight/use-flights";
import { flightService } from "../features/flight/flight-service";
import { todayIso } from "../lib/format";

interface Destination {
  emoji: string;
  tagline: string;
  hue: number;
}

const DESTINATIONS: Record<string, Destination> = {
  LHR: { emoji: "💂", tagline: "Tea, theatre & rain", hue: 225 },
  CDG: { emoji: "🥐", tagline: "Croissants at the Eiffel", hue: 330 },
  JFK: { emoji: "🗽", tagline: "The city that never sleeps", hue: 265 },
  HND: { emoji: "🍣", tagline: "Neon, sushi & sakura", hue: 350 },
  SIN: { emoji: "🌴", tagline: "Garden city, hawker feasts", hue: 150 },
  SYD: { emoji: "🦘", tagline: "Harbour, surf & sun", hue: 195 },
  IST: { emoji: "🕌", tagline: "Where continents meet", hue: 20 },
  DXB: { emoji: "🏙️", tagline: "Sky-high & sun-soaked", hue: 35 },
};

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
        <div className="clouds" aria-hidden="true">
          <span>☁️</span>
          <span>☁️</span>
          <span>☁️</span>
        </div>
        <div className="plane-fly" aria-hidden="true">✈️</div>
        <h1>Fly. Shop. Board with your bags full.</h1>
        <p>Book your flight, pick your seat, then pre-order duty-free and travel essentials for pickup at the airport store.</p>
        <div className="steps">
          <span>1 · Search</span>
          <span>2 · Seats</span>
          <span>3 · Shop</span>
          <span>4 · Fly</span>
        </div>
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

      <h2 className="section-title">Where to next?</h2>
      <ul className="dest-grid">
        {airports
          .filter((a) => a.code !== from && DESTINATIONS[a.code])
          .map((a) => {
            const d = DESTINATIONS[a.code];
            if (!d) return null;
            return (
              <li key={a.code}>
                <button
                  className="dest"
                  style={{ background: `linear-gradient(145deg, hsl(${d.hue} 80% 58%), hsl(${d.hue + 40} 75% 40%))` }}
                  onClick={() => {
                    setTo(a.code);
                    go({ from, to: a.code, date, passengers });
                  }}
                >
                  <span className="dest-emoji">{d.emoji}</span>
                  <strong>{a.city}</strong>
                  <span className="small">{d.tagline}</span>
                </button>
              </li>
            );
          })}
      </ul>
    </>
  );
}
