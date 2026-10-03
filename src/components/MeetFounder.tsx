export function MeetFounder() {
  return (
    <section className="container-px section-y bg-cream/45">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="relative overflow-hidden bg-cream border border-border/70">
            <img
              src="/founder.jpeg"
              alt="Founder of Fragrances by D'Ruaa"
              loading="lazy"
              className="aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] w-full object-cover object-center transition duration-500 hover:scale-[1.02]"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="eyebrow">The Artisan Behind the Scent</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Meet the Founder
            </h2>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-2xl font-semibold text-charcoal">D'Ruaa</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">Founder & Artisan</span>
            </div>

            <div className="mt-5 space-y-4 text-base leading-8 text-muted">
              <p>
                “What started as a love for beautiful fragrances and thoughtfully made candles grew into a passion for creating scents that make everyday moments feel a little more special.”
              </p>
              <p>
                Every fragrance blend and scented candle is lovingly handcrafted with intention, bringing together refined aromatic notes and gentle warmth to turn any room into a memorable experience.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border/70 pt-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              <span>Handcrafted In Small Batches</span>
              <span className="h-1 w-1 rounded-full bg-clay" />
              <span>Carefully Sourced Notes</span>
              <span className="h-1 w-1 rounded-full bg-clay" />
              <span>Made With Intention</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
