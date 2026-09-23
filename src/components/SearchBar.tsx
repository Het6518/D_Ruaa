import { Search } from "lucide-react";

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label className="relative block"><span className="sr-only">Search products</span><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search products..." className="w-full border border-border bg-white/70 py-4 pl-12 pr-4 text-sm shadow-soft transition focus:border-clay" /></label>;
}
