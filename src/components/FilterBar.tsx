import type { ProductCategory } from "../types/product";

type Props = { category: string; family: string; families: string[]; onCategory: (value: string) => void; onFamily: (value: string) => void };
const categories: Array<[string, string]> = [["all", "All"], ["fragrance", "Fragrance Materials"], ["candle", "Scented Candles"]];

export function FilterBar({ category, family, families, onCategory, onFamily }: Props) {
  return <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2">{categories.map(([value, label]) => <button key={value} onClick={() => onCategory(value as ProductCategory | "all")} className={`border px-4 py-2 text-sm font-medium transition ${category === value ? "border-charcoal bg-charcoal text-ivory" : "border-border bg-white/60 hover:border-clay"}`}>{label}</button>)}</div>{families.length > 0 && <label className="text-sm"><span className="mr-3 font-semibold">Family</span><select value={family} onChange={(event) => onFamily(event.target.value)} className="border border-border bg-white/70 px-4 py-2"><option value="all">All</option>{families.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>}</div>;
}
