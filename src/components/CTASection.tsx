import { Link } from "react-router-dom";
import { createWhatsAppUrl } from "../utils/whatsapp";

export function CTASection() {
  return <section className="container-px section-y"><div className="mx-auto max-w-7xl bg-charcoal px-6 py-14 text-center text-ivory sm:px-10"><p className="eyebrow text-linen">Personal Enquiry</p><h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Have a fragrance in mind?</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-linen">Tell us what you are looking for and we will help you find the right product from the catalogue.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><a href={createWhatsAppUrl("Hi, I am looking for a fragrance product from Fragrances by D_Ruaa.")} target="_blank" rel="noreferrer" className="bg-ivory px-6 py-4 text-sm font-semibold text-charcoal">WhatsApp Us</a><Link to="/contact" className="border border-ivory/40 px-6 py-4 text-sm font-semibold">Contact Us</Link></div></div></section>;
}
