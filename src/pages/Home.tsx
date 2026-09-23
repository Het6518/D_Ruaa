import { Link } from "react-router-dom";
import { Sparkles, HandHeart, Home as HomeIcon, MessageCircle, type LucideIcon } from "lucide-react";
import { CategoryCard } from "../components/CategoryCard";
import { CTASection } from "../components/CTASection";
import { ProductGrid } from "../components/ProductGrid";
import { SectionHeading } from "../components/SectionHeading";
import { getFeaturedProducts } from "../utils/productService";
import { usePageMeta } from "../utils/usePageMeta";

const heroImage = "/c1.jpeg";
const candleImage = "/c1.jpeg";
const fragranceImage = "/c1.jpeg";

export function Home() {
  usePageMeta("Fragrances by D'Ruaa | Premium Fragrance Catalogue", "Explore fragrance materials and scented candles from Fragrances by D'Ruaa.");
  const featured = getFeaturedProducts().slice(0, 4);
  const values: Array<[LucideIcon, string, string]> = [
    [Sparkles, "Curated Fragrances", "Explore a carefully presented range of fragrance profiles."],
    [HandHeart, "Thoughtful Craft", "Products arranged with attention to scent and presentation."],
    [HomeIcon, "For Every Space", "Discover fragrances suited to different moods and environments."],
    [MessageCircle, "Personal Enquiries", "Connect directly for product information and enquiries."],
  ];
  return <>
    <section className="container-px mx-auto grid max-w-7xl items-center gap-10 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:py-10">
      <div><p className="eyebrow">The Art of Fragrance</p><h1 className="mt-4 font-display text-5xl font-semibold leading-[0.98] sm:text-7xl">Scents that turn spaces into experiences.</h1><p className="mt-6 max-w-xl text-base leading-8 text-muted">Explore carefully selected fragrance materials and beautifully crafted scented candles by Fragrances by D'Ruaa.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/catalogue" className="bg-charcoal px-6 py-4 text-center text-sm font-semibold text-ivory">Explore Collection</Link><Link to="/contact" className="border border-border px-6 py-4 text-center text-sm font-semibold">Enquire Now</Link></div></div>
      <div className="relative"><img src={heroImage} alt="Warm candle and fragrance still life" className="aspect-[5/5] w-full object-cover shadow-soft" /><div className="absolute bottom-6 left-6 bg-ivory/90 p-5 backdrop-blur"><p className="font-display text-2xl font-semibold">Warm. Calm. Intentional.</p></div></div>
    </section>
    <section className="container-px section-y bg-cream/60"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]"><img src={fragranceImage} alt="Fragrance bottle close up" className="aspect-[5/4] w-full object-cover" /><SectionHeading eyebrow="About D'Ruaa" title="Crafted around the beauty of scent." text="D_Ruaa brings together fragrance materials and scented candles for people who appreciate beautiful aromas, calm presentation and thoughtful product discovery.
    We believe fragrance is more than a scent, it’s an experience. Every candle and fragrance is lovingly handcrafted to add warmth, personality, and a touch of luxury to your space." /></div></section>
    <section className="container-px section-y"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Collections" title="Explore Our Collections" align="center" /><div className="mt-12 grid gap-7 lg:grid-cols-2"><CategoryCard title="Fragrance Materials" text="Explore aromatic materials for fragrance creation and various applications." image={fragranceImage} href="/fragrances" /><CategoryCard title="Scented Candles" text="Discover candles designed to bring warmth, character and beautiful aromas into your space." image={candleImage} href="/candles" /></div></div></section>

    <section className="container-px section-y bg-white/45"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Featured" title="Featured Scents" text="A small selection from the current catalogue." /><div className="mt-12"><ProductGrid products={featured} /></div></div></section>
    <section className="container-px section-y"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Why D'Ruaa" title="Quiet details, clear discovery." align="center" /><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{values.map(([Icon, title, text]) => <div key={String(title)} className="border border-border bg-cream/55 p-6"><Icon className="text-clay" size={28} /><h3 className="mt-5 font-display text-2xl font-semibold">{String(title)}</h3><p className="mt-3 text-sm leading-6 text-muted">{String(text)}</p></div>)}</div></div></section>
    <section className="container-px section-y bg-linen/45"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2"><div className="flex flex-col justify-center"><p className="eyebrow">Your Space, Your Scent</p><h2 className="mt-3 font-display text-5xl font-semibold">Find a scent that feels like you.</h2><p className="mt-5 text-base leading-8 text-muted">Fragrance can shape the feeling of a room, mark a memory and bring softness to everyday moments.</p><Link to="/fragrances" className="mt-8 text-sm font-semibold text-clay">Explore Fragrances ?</Link></div><img src="/c1.jpeg" alt="Candle glowing in a calm room" className="aspect-[4/3] w-full object-cover" /></div></section>
    <CTASection />
  </>;
}

