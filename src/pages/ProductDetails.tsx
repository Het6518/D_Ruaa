import { type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Accordion } from "../components/Accordion";
import { EnquiryButton } from "../components/EnquiryButton";
import { ProductGallery } from "../components/ProductGallery";
import { ProductGrid } from "../components/ProductGrid";
import { SectionHeading } from "../components/SectionHeading";
import { getProductBySlug, getRelatedProducts } from "../utils/productService";
import { usePageMeta } from "../utils/usePageMeta";

const list = (items?: string[]) => items?.length ? <ul className="flex flex-wrap gap-2">{items.map((item) => <li key={item} className="border border-border px-3 py-2 text-charcoal">{item}</li>)}</ul> : null;

export function ProductDetails() {
  const { slug = "" } = useParams();
  const product = getProductBySlug(slug);
  usePageMeta(product ? `${product.name} | Fragrances by D'Ruaa` : "Product Not Found | Fragrances by D'Ruaa", product ? `Explore ${product.name} from Fragrances by D'Ruaa.` : "Product not found.");
  if (!product) return <main className="container-px section-y mx-auto max-w-4xl text-center"><h1 className="font-display text-5xl">Product not found</h1><Link to="/catalogue" className="mt-6 inline-flex bg-charcoal px-6 py-4 text-sm font-semibold text-ivory">Back to Catalogue</Link></main>;
  const accordionItems = [
    product.description && { title: "Description", content: product.description },
    product.profile?.length && { title: "Fragrance Profile", content: list(product.profile) },
    product.sizes?.length && { title: "Available Sizes", content: list(product.sizes) },
    product.applications?.length && { title: "Applications", content: list(product.applications) },
    product.usageInfo && { title: "Usage Information", content: product.usageInfo },
  ].filter(Boolean) as Array<{ title: string; content: ReactNode }>;
  return <main><section className="container-px section-y"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr]"><ProductGallery images={product.images} name={product.name} /><div className="lg:sticky lg:top-28 lg:self-start"><p className="eyebrow">{product.category === "fragrance" ? "Fragrance Material" : "Scented Candle"}</p><h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">{product.name}</h1><p className="mt-5 text-base leading-8 text-muted">{product.shortDescription}</p>{product.profile?.length && <div className="mt-7"><h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Profile</h2><div className="mt-3">{list(product.profile)}</div></div>}{product.notes && <div className="mt-7 grid gap-3 text-sm text-muted"><h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-charcoal">Notes</h2>{product.notes.top?.length ? <p><strong className="text-charcoal">Top:</strong> {product.notes.top.join(", ")}</p> : null}{product.notes.heart?.length ? <p><strong className="text-charcoal">Heart:</strong> {product.notes.heart.join(", ")}</p> : null}{product.notes.base?.length ? <p><strong className="text-charcoal">Base:</strong> {product.notes.base.join(", ")}</p> : null}</div>}{product.sizes?.length && <div className="mt-7"><h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Available Sizes</h2><div className="mt-3">{list(product.sizes)}</div></div>}<div className="mt-8 grid gap-3 sm:grid-cols-2"><EnquiryButton product={product} /><EnquiryButton product={product} label="WhatsApp Us" variant="secondary" /></div><div className="mt-9"><Accordion items={accordionItems} /></div></div></div></section><section className="container-px section-y bg-white/45"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Related" title="You May Also Like" /><div className="mt-10"><ProductGrid products={getRelatedProducts(product, 4)} /></div></div></section></main>;
}
