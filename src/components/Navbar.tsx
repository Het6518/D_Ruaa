import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const navItems = [
  ["Home", "/"], ["Catalogue", "/catalogue"], ["Fragrances", "/fragrances"], ["Candles", "/candles"], ["About", "/about"], ["Contact", "/contact"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navClass = ({ isActive }: { isActive: boolean }) => `text-sm font-medium transition hover:text-clay ${isActive ? "text-clay" : "text-charcoal"}`;
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-ivory backdrop-blur">
      <nav className="container-px mx-auto flex max-w-7xl items-center justify-between py-4">
        <Link to="/" className="font-display text-2xl font-bold leading-none tracking-wide" onClick={() => setOpen(false)}>
          Fragrances<br /><span className="text-base tracking-[0.2em]">by D_Ruaa</span>
        </Link>
        <div className="hidden  gap-7 lg:flex">
          {navItems.map(([label, href]) => <NavLink key={href} to={href} className={navClass}>{label}</NavLink>)}
        </div>
        <Link to="/contact" className="hidden rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-cocoa focus-visible:ring-2 focus-visible:ring-clay lg:inline-flex">Enquire Now</Link>
        <button className="rounded-full border border-border p-3 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div className="container-px border-t border-border bg-ivory py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col  gap-4">
            {navItems.map(([label, href]) => <NavLink key={href} to={href} className={navClass} onClick={() => setOpen(false)}>{label}</NavLink>)}
            <Link to="/contact" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-charcoal px-5 py-3 text-center text-sm font-semibold text-ivory">Enquire Now</Link>
          </div>
        </div>
      )}
    </header>
  );
}
