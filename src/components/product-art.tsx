import type { Product } from "../features/product/product.types";

interface Props {
  product: Product;
  size?: "md" | "lg";
}

export function ProductArt({ product, size = "md" }: Props) {
  return (
    <div
      className={`art art-${size}`}
      style={{ background: `linear-gradient(135deg, hsl(${product.hue} 80% 92%), hsl(${product.hue} 70% 82%))` }}
      aria-hidden="true"
    >
      {product.emoji}
    </div>
  );
}
