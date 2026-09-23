import type { Product } from "../types/product";
import { createWhatsAppUrl, productEnquiryMessage } from "../utils/whatsapp";

export function EnquiryButton({ product, label = "Enquire About This Product", variant = "primary" }: { product: Product; label?: string; variant?: "primary" | "secondary" })
{
  const classes = variant === "primary" ? "bg-charcoal text-ivory hover:bg-cocoa" : "border border-border bg-transparent text-charcoal hover:border-clay";
  return <a href={createWhatsAppUrl(productEnquiryMessage(product))} target="_blank" rel="noreferrer" className={`inline-flex justify-center px-6 py-4 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-clay ${classes}`}>{label}</a>;
}
