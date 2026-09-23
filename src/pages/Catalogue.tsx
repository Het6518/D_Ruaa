import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterBar } from "../components/FilterBar";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import { SectionHeading } from "../components/SectionHeading";
import { getProducts } from "../utils/productService";
import { usePageMeta } from "../utils/usePageMeta";
import type { ProductCategory } from "../types/product";

export function Catalogue({ fixedCategory }: { fixedCategory?: ProductCategory }) {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = fixedCategory ?? params.get("category") ?? "all";
  const family = params.get("family") ?? "all";
  const title = fixedCategory === "fragrance" ? "Fragrance Materials" : fixedCategory === "candle" ? "Scented Candles" : "Explore Our Collection";
  usePageMeta(`${title} | Fragrances by D'Ruaa`, `Browse ${title.toLowerCase()} from Fragrances by D_Ruaa.`);
  const allProducts = getProducts();
  const families = [...new Set(allProducts.map((p) => p.fragranceFamily).filter(Boolean))] as string[];
  const filtered = useMemo(() => allProducts.filter((product) => {
    const haystack = [product.name, product.shortDescription, product.description, product.category, product.fragranceFamily, ...(product.profile ?? []), ...(product.notes?.top ?? []), ...(product.notes?.heart ?? []), ...(product.notes?.base ?? [])].join(" ").toLowerCase();
    return (!q || haystack.includes(q.toLowerCase())) && (category === "all" || product.category === category) && (family === "all" || product.fragranceFamily === family);
  }), [allProducts, q, category, family]);
  const update = (key: string, value: string) => { const next = new URLSearchParams(params); value && value !== "all" ? next.set(key, value) : next.delete(key); if (fixedCategory && key === "category") return; setParams(next); };
  return <section className="container-px section-y"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Catalogue" title={title} text="Browse fragrance materials and scented candles from Fragrances by D_Ruaa." align="center" /><div className="mx-auto mt-10 max-w-2xl"><SearchBar value={q} onChange={(value) => update("q", value)} /></div><div className="mt-8"><FilterBar category={category} family={family} families={families} onCategory={(value) => update("category", value)} onFamily={(value) => update("family", value)} /></div><p className="mt-6 text-sm text-muted">Showing {filtered.length} of {allProducts.filter((p) => category === "all" || p.category === category).length}</p><div className="mt-8"><ProductGrid products={filtered} /></div></div></section>;
}
