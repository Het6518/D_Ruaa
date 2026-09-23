import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ items }: { items: Array<{ title: string; content: ReactNode }> }) {
  const [open, setOpen] = useState(0);
  // accordion is a component that displays a list of items, each with a title and content. When the title is clicked, the content is displayed below it. Only one item can be open at a time.
  return <div className="divide-y divide-border border-y border-border">{items.map((item, index) => <section key={item.title}><button className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold uppercase tracking-[0.14em]" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>{item.title}<ChevronDown size={18} className={`transition ${open === index ? "rotate-180" : ""}`} /></button>{open === index && <div className="pb-6 text-sm leading-7 text-muted">{item.content}</div>}</section>)}</div>;
}
