import type { Product } from "../types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="border border-border bg-cream/60 p-10 text-center"><h2 className="font-display text-3xl">No fragrances found</h2><p className="mt-2 text-muted">Try another search or browse all collections.</p></div>;
  return <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
