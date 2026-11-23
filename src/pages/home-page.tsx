import { useState } from "react";
import { ProductCard } from "../components/product-card";
import { productService } from "../features/product/product-service";
import { categorySchema, type Category, type ProductFilter, type ProductSort } from "../features/product/product.types";
import { useProducts } from "../features/product/use-products";

const CATEGORIES = categorySchema.options;

const SORTS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name" },
];

function isSort(value: string): value is ProductSort {
  return SORTS.some((s) => s.value === value);
}

export function HomePage() {
  const { data: products, isLoading, isError } = useProducts();
  const [filter, setFilter] = useState<ProductFilter>({ search: "", category: "all", sort: "featured" });

  const setCategory = (category: Category | "all") => setFilter((f) => ({ ...f, category }));
  const visible = products ? productService.filter([...products], filter) : [];

  return (
    <>
      <section className="hero">
        <h1>Everyday essentials, delivered.</h1>
        <p>Fresh groceries and household basics. Free delivery over $35.</p>
      </section>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search products…"
          value={filter.search}
          onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
          aria-label="Search products"
        />
        <select
          value={filter.sort}
          onChange={(e) => {
            const value = e.target.value;
            if (isSort(value)) setFilter((f) => ({ ...f, sort: value }));
          }}
          aria-label="Sort products"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="chips" role="tablist" aria-label="Categories">
        <button type="button" className={filter.category === "all" ? "chip active" : "chip"} onClick={() => setCategory("all")}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className={filter.category === c ? "chip active" : "chip"} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="card skeleton" />
          ))}
        </div>
      )}
      {isError && <p className="empty">Couldn't load products.</p>}
      {products && visible.length === 0 && <p className="empty">No products match your search.</p>}
      <div className="grid">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
