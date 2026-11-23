import { Link, useParams } from "react-router-dom";
import { AddToCart } from "../components/add-to-cart";
import { ProductArt } from "../components/product-art";
import { useProduct } from "../features/product/use-products";
import { formatMoney } from "../lib/format";

export function ProductPage() {
  const { id = "" } = useParams();
  const { data: product, isLoading } = useProduct(id);

  if (isLoading) return <div className="card skeleton detail-skeleton" />;
  if (!product) {
    return (
      <p className="empty">
        Product not found. <Link to="/">Back to shop</Link>
      </p>
    );
  }
  return (
    <>
      <Link to="/" className="back">
        ← Back to shop
      </Link>
      <div className="detail">
        <ProductArt product={product} size="lg" />
        <div className="detail-info">
          <span className="muted small">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="muted">
            {product.unit} · ★ {product.rating.toFixed(1)}
          </p>
          <p>{product.description}</p>
          <p className="price">{formatMoney(product.priceCents)}</p>
          <p className={product.stock <= 10 ? "warn small" : "muted small"}>
            {product.stock === 0 ? "Out of stock" : product.stock <= 10 ? `Only ${product.stock} left` : "In stock"}
          </p>
          <AddToCart product={product} />
        </div>
      </div>
    </>
  );
}
