import { Link } from "react-router-dom";

export function CategoryCard({ title, text, image, href }: { title: string; text: string; image: string; href: string }) {
  return <Link to={href} className="group grid overflow-hidden border border-border bg-cream md:grid-cols-[1fr_0.9fr]"><img src={image} alt={title} loading="lazy" className="h-72 w-full object-cover transition duration-500 group-hover:scale-105 md:h-full" /><div className="flex flex-col justify-end p-8"><p className="eyebrow">Collection</p><h3 className="mt-3 font-display text-4xl font-semibold">{title}</h3><p className="mt-4 text-sm leading-7 text-muted">{text}</p><span className="mt-8 text-sm font-semibold text-clay">Explore Collection </span></div></Link>;
}
