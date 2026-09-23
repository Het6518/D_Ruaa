import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types/product";

export function ProductCard({ product }: { product: Product }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <article className="group">
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden bg-cream aspect-[4/5] w-full">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream">
            <div className="w-10 h-10 rounded-full border-2 border-clay/20 border-t-clay animate-spin flex items-center justify-center">
              <img src="/logo.jpeg" alt="" className="w-5 h-5 rounded-full object-contain" />
            </div>
          </div>
        )}
        <img
          src={product.images[0]}
          alt={`${product.name} by Fragrances by D'Ruaa`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </Link>
      <div className="pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">{product.category === "fragrance" ? "Fragrance Material" : "Scented Candle"}</p>
        <Link to={`/product/${product.slug}`} className="mt-2 block font-display text-2xl font-semibold hover:text-clay">{product.name}</Link>
        <p className="mt-2 min-h-12 text-sm leading-6 text-muted">{product.shortDescription}</p>
        <Link to={`/product/${product.slug}`} className="mt-4 inline-flex text-sm font-semibold text-charcoal underline-offset-4 hover:text-clay hover:underline">View Product →</Link>
      </div>
    </article>
  );
}
