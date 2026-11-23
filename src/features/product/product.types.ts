import { z } from "zod";

export const categorySchema = z.enum(["Fruits & Veg", "Dairy & Eggs", "Bakery", "Snacks", "Drinks", "Household"]);
export type Category = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: categorySchema,
  priceCents: z.number().int().nonnegative(),
  unit: z.string(),
  emoji: z.string(),
  hue: z.number(),
  stock: z.number().int().nonnegative(),
  rating: z.number(),
});
export type Product = z.infer<typeof productSchema>;

export type ProductSort = "featured" | "price-asc" | "price-desc" | "name";

export interface ProductFilter {
  search: string;
  category: Category | "all";
  sort: ProductSort;
}
