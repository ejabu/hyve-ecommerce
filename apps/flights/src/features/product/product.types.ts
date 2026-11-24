export type ProductCategory = "duty-free" | "travel" | "snacks" | "tech";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  /** Whole USD. */
  price: number;
  emoji: string;
  blurb: string;
}
