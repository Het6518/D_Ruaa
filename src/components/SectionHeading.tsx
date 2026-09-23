export function SectionHeading({ eyebrow, title, text, align = "left" }: { eyebrow?: string; title: string; text?: string; align?: "left" | "center" }) {
  return <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">{title}</h2>{text && <p className="mt-4 text-base leading-7 text-muted">{text}</p>}</div>;
}
