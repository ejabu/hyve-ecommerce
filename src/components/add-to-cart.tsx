import { cartService } from "../features/cart/cart-service";
import { useCartQuantity } from "../features/cart/use-cart";
import type { Product } from "../features/product/product.types";
import { QuantityStepper } from "./quantity-stepper";

export function AddToCart({ product }: { product: Product }) {
  const quantity = useCartQuantity(product.id);

  if (product.stock === 0) {
    return (
      <button type="button" className="btn" disabled>
        Out of stock
      </button>
    );
  }
  if (quantity === 0) {
    return (
      <button type="button" className="btn btn-primary" onClick={() => cartService.add(product)}>
        Add to cart
      </button>
    );
  }
  return (
    <QuantityStepper
      quantity={quantity}
      max={product.stock}
      label={product.name}
      onChange={(q) => cartService.setQuantity(product, q)}
    />
  );
}
