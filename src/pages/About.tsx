import { Link } from "react-router-dom";
import { SectionHeading } from "../components/SectionHeading";
import { CTASection } from "../components/CTASection";
import { usePageMeta } from "../utils/usePageMeta";

export function About() {
  usePageMeta("About | Fragrances by D'Ruaa", "Learn about Fragrances by D'Ruaa and its fragrance catalogue.");
  return <main><section className="container-px section-y"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]"><div><p className="eyebrow">About D'Ruaa</p><h1 className="mt-4 font-display text-6xl font-semibold leading-none">The story behind D'Ruaa.</h1><p className="mt-6 text-base leading-8 text-muted">Fragrances by D'Ruaa is presented as a calm, premium catalogue for discovering fragrance materials and scented candles with clarity and care. We believe fragrance is more than a scent, it’s an experience. Every candle and fragrance is lovingly handcrafted to add warmth, personality, and a touch of luxury to your space.</p><Link to="/catalogue" className="mt-8 inline-flex bg-charcoal px-6 py-4 text-sm font-semibold text-ivory">Explore the Collection</Link></div><img src="/c1.jpeg" alt="Elegant fragrance bottles" className="aspect-[5/4] w-full object-cover" /></div></section>
  
  <section className="container-px section-y bg-linen/45"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="What We Offer" title="Fragrance materials and scented candles." text="The catalogue is structured for easy exploration, with scent profiles, notes, sizes and enquiry pathways kept simple to update as product information grows." /><div className="mt-10 grid gap-6 md:grid-cols-2"><div className="border border-border bg-ivory p-8"><h2 className="font-display text-3xl font-semibold">Fragrance Materials</h2><p className="mt-4 text-sm leading-7 text-muted">Aromatic profiles arranged for discovery by family, notes and intended applications where supplied.</p></div><div className="border border-border bg-ivory p-8"><h2 className="font-display text-3xl font-semibold">Scented Candles</h2><p className="mt-4 text-sm leading-7 text-muted">Candles presented through mood, fragrance direction and available product information.</p></div></div></div></section>
  <CTASection />
  </main>;
}
