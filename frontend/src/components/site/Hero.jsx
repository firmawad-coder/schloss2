import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative min-h-[100vh] flex items-end overflow-hidden bg-[#f9f7f4]"
      data-testid="lx-hero"
    >
      {/* Background image right side */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
          <img
            src="https://images.unsplash.com/photo-1622618991746-fe6004db3a47?crop=entropy&cs=srgb&fm=jpg&w=1600&q=85"
            alt="LUXÉLLE Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f9f7f4] via-[#f9f7f4]/40 to-transparent lg:from-[#f9f7f4]/95 lg:via-transparent" />
        </div>
        <div className="absolute inset-y-0 left-0 hidden lg:block w-[42%] bg-[#f9f7f4]" />
      </div>

      {/* Decorative vertical brand text */}
      <div className="hidden xl:flex absolute left-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 overline z-10">
        <span>Maison · Est. 2024 · Berlin / Paris</span>
      </div>

      <div className="relative z-10 w-full max-w-[1480px] mx-auto px-6 lg:px-12 pt-32 pb-20 lg:pb-32">
        <div className="max-w-[640px] lx-reveal" style={{ animationDelay: "0.1s" }}>
          <p className="overline mb-8" data-testid="lx-hero-overline">— Maison de Beauté</p>
          <h1
            className="font-serif-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] text-[#1a1a1a] mb-10"
            data-testid="lx-hero-headline"
          >
            Schönheit,<br />
            <span className="italic text-[#a8861e]">die man</span> spürt.
          </h1>
          <p className="text-[#5a5a5a] text-base lg:text-lg leading-relaxed font-light max-w-md mb-12">
            Eine kuratierte Welt aus Medical Beauty und seltenen Parfüms.
            Sorgfältig ausgewählt — jenseits des Gewöhnlichen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button
              onClick={() => document.getElementById("maisons")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center justify-center gap-3 bg-[#1a1a1a] text-[#f9f7f4] hover:bg-[#a8861e] transition-colors duration-500 px-9 py-4 uppercase text-[11px] tracking-[0.28em]"
              data-testid="lx-hero-cta-primary"
            >
              Maisons entdecken
              <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => document.getElementById("bestsellers")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-3 border border-[#1a1a1a]/40 text-[#1a1a1a] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f9f7f4] transition-colors duration-500 px-9 py-4 uppercase text-[11px] tracking-[0.28em]"
              data-testid="lx-hero-cta-secondary"
            >
              Bestseller ansehen
            </button>
          </div>

          <div className="mt-20 flex items-center gap-10 text-[#5a5a5a]">
            <div>
              <div className="font-serif-display text-3xl text-[#1a1a1a]">07</div>
              <div className="overline mt-1">Maisons</div>
            </div>
            <div className="w-px h-12 bg-[#e6dfd7]" />
            <div>
              <div className="font-serif-display text-3xl text-[#1a1a1a]">240+</div>
              <div className="overline mt-1">Kuratierte Stücke</div>
            </div>
            <div className="w-px h-12 bg-[#e6dfd7] hidden sm:block" />
            <div className="hidden sm:block">
              <div className="font-serif-display text-3xl text-[#1a1a1a]">5★</div>
              <div className="overline mt-1">Beratung</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 right-6 lg:right-12 z-10 flex items-center gap-3 overline">
        <span className="hidden sm:inline">Scroll</span>
        <span className="block w-12 h-px bg-[#1a1a1a]" />
      </div>
    </section>
  );
}
