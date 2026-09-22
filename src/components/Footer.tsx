import { Link } from "react-router-dom";
import { businessConfig } from "../data/config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-linen/55">
      <div className="container-px mx-auto grid max-w-7xl gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-bold leading-none">Fragrances<br /><span className="text-xl tracking-[0.18em]">by D'Ruaa</span></p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted">A warm, refined catalogue of fragrance materials and scented candles for people who choose scent with intention.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Explore</h2>
          <div className="mt-5 grid gap-3 text-sm text-muted">
            <Link to="/">Home</Link><Link to="/catalogue">Catalogue</Link><Link to="/fragrances">Fragrances</Link><Link to="/candles">Candles</Link><Link to="/about">About</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Connect</h2>
          <div className="mt-5 grid gap-3 text-sm text-muted">
            <a href={`https://wa.me/${businessConfig.whatsappNumber}`}>WhatsApp</a>
            <a href={businessConfig.instagramUrl}>Instagram</a>
            <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>
            <a href={`tel:${businessConfig.phone.replace(/\s/g, "")}`}>{businessConfig.phone}</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted">� 2026 Fragrances by D'Ruaa. All rights reserved.</div>
    </footer>
  );
}
