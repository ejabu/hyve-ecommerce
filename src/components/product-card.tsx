import { Link } from "react-router-dom";
import type { Product } from "../features/product/product.types";
import { formatMoney } from "../lib/format";
import { AddToCart } from "./add-to-cart";
import { ProductArt } from "./product-art";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card">
      <Link to={`/product/${product.id}`} className="card-link">
        <ProductArt product={product} />
        <div className="card-body">
          <span className="muted small">{product.category}</span>
          <h3>{product.name}</h3>
          <span className="muted small">
            {product.unit} · ★ {product.rating.toFixed(1)}
          </span>
        </div>
      </Link>
      <div className="card-foot">
        <strong>{formatMoney(product.priceCents)}</strong>
        <AddToCart product={product} />
      </div>
    </article>
  );
}
