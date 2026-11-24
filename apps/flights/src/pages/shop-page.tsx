import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FlightHeading } from "../components/flight-summary";
import { QuantityStepper } from "../components/quantity-stepper";
import { draftService } from "../features/draft/draft-service";
import { useDraft } from "../features/draft/use-draft";
import { CABIN_LABEL } from "../features/flight/flight.types";
import { CATEGORY_LABELS, productService } from "../features/product/product-service";
import type { ProductCategory } from "../features/product/product.types";
import { useProducts } from "../features/product/use-products";
import { money } from "../lib/format";

export function ShopPage() {
  const draft = useDraft();
  const navigate = useNavigate();
  const { data: products = [], isPending } = useProducts();
  const [category, setCategory] = useState<ProductCategory | "all">("all");

  if (!draft.flight) return <Navigate to="/" replace />;
  if (draft.seats.length < draft.passengers) return <Navigate to="/seats" replace />;

  const summary = draftService.summarize(draft, products);
  const visible = category === "all" ? products : products.filter((p) => p.category === category);

  return (
    <div className="split">
      <section>
        <h1>Add to your trip</h1>
        <p className="muted">Pre-order now, collect at the {draft.flight.from} airport store before you fly.</p>

        <div className="chips">
          <button className={`chip ${category === "all" ? "active" : ""}`} onClick={() => setCategory("all")}>
            All
          </button>
          {productService.categories().map((c) => (
            <button key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {isPending && <p className="muted">Loading store…</p>}
        <ul className="grid">
          {visible.map((p) => (
            <li key={p.id} className="card product">
              <div className="art">{p.emoji}</div>
              <strong>{p.name}</strong>
              <span className="muted small">{p.blurb}</span>
              <div className="row between">
                <strong>{money(p.price)}</strong>
                <QuantityStepper
                  qty={draft.items[p.id] ?? 0}
                  label={p.name}
                  onChange={(q) => draftService.setItemQty(p.id, q)}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="card sticky">
        <h2>Your trip</h2>
        <FlightHeading flight={draft.flight} />
        <div className="line">
          <span>
            {CABIN_LABEL[draft.cabin]} × {draft.passengers} · {draft.seats.join(", ")}
          </span>
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
        <button className="btn full" onClick={() => navigate("/checkout")}>
          Continue to checkout
        </button>
        <Link to="/" className="muted small center">
          Change flight
        </Link>
      </aside>
    </div>
  );
}
