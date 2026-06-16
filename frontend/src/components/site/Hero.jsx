import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-[#1c1714] text-[#f5f0e8]" data-testid="bas-hero">
      {/* Background imagery */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1615368144592-35d2b37fa49b?crop=entropy&cs=srgb&fm=jpg&w=2000&q=92"
          alt="Beauty Am Schloss — Maison de Parfum"
          className="absolute inset-0 w-full h-full object-cover opacity-95 bas-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1714]/95 via-[#1c1714]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1714] via-[#1c1714]/30 to-transparent" />
      </div>
      <div className="absolute inset-0 bas-grain opacity-30" />

      {/* Vertical brand */}
      <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[10px] tracking-[0.4em] uppercase text-[#ddd2bf]/60 z-10">
        <span>Maison de Parfum · Privatkundenhaus · Berlin · Est. 1894</span>
      </div>

      {/* Right ornament */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-10 text-[#a8814a]">
        <span className="bas-crest" />
        <span className="font-italiana text-xs tracking-[0.5em]">N°IV</span>
        <span className="bas-crest" />
      </div>

      <div className="relative z-10 w-full max-w-[1520px] mx-auto px-6 lg:px-14 pt-36 pb-24 lg:pb-36">
        <div className="max-w-[720px] bas-reveal" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-4 mb-9">
            <span className="h-px w-12 bg-[#a8814a]" />
            <span className="font-italiana text-[#a8814a] tracking-[0.4em] text-xs">HAUTE PARFUMERIE</span>
          </div>

          <h1 className="font-display text-[clamp(3rem,8.5vw,7.5rem)] leading-[0.95] text-[#f5f0e8] mb-10 font-light">
            Düfte, die<br />
            <span className="italic text-[#d4b06a] font-light">Geschichte</span> tragen.
          </h1>

          <p className="text-[#ddd2bf]/80 text-base lg:text-[17px] leading-[1.85] font-light max-w-[520px] mb-14">
            Eine private Maison für die seltensten Parfums der Welt — handverlesen
            aus den Häusern Roja, Xerjoff, Boadicea und Fragrance Du Bois.
            Jedes Flakon ein Manuskript. Jeder Tropfen eine Signatur.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-20">
            <button
              onClick={() => document.getElementById("fragrances")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center justify-center gap-4 bg-[#f5f0e8] text-[#1c1714] hover:bg-[#a8814a] hover:text-[#f5f0e8] transition-all duration-700 px-10 py-[18px] uppercase text-[11px] tracking-[0.32em]"
              data-testid="bas-hero-cta-primary"
            >
              Parfums entdecken
              <ArrowRight size={14} strokeWidth={1.4} className="group-hover:translate-x-1 transition-transform duration-500" />
            </button>
            <button
              onClick={() => document.getElementById("maisons")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-4 border border-[#ddd2bf]/40 text-[#f5f0e8] hover:bg-[#f5f0e8]/10 hover:border-[#a8814a] transition-all duration-700 px-10 py-[18px] uppercase text-[11px] tracking-[0.32em]"
              data-testid="bas-hero-cta-secondary"
            >
              Unsere Maisons
            </button>
          </div>

          <div className="flex items-end gap-10 lg:gap-14 text-[#ddd2bf]">
            <div>
              <div className="font-display text-3xl lg:text-4xl text-[#f5f0e8] font-light">04</div>
              <div className="text-[10px] tracking-[0.3em] uppercase mt-2 text-[#a8814a]">Haute Maisons</div>
            </div>
            <span className="w-px h-12 bg-[#ddd2bf]/25" />
            <div>
              <div className="font-display text-3xl lg:text-4xl text-[#f5f0e8] font-light">130<span className="text-[#a8814a]">+</span></div>
              <div className="text-[10px] tracking-[0.3em] uppercase mt-2 text-[#a8814a]">Jahre Tradition</div>
            </div>
            <span className="w-px h-12 bg-[#ddd2bf]/25 hidden sm:block" />
            <div className="hidden sm:block">
              <div className="font-display text-3xl lg:text-4xl text-[#f5f0e8] font-light flex items-center gap-1">
                4,9 <Sparkles size={14} className="text-[#a8814a]" />
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase mt-2 text-[#a8814a]">Concierge Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom signature line */}
      <div className="absolute bottom-7 right-6 lg:right-14 z-10 flex items-center gap-4 text-[#a8814a] text-[10px] tracking-[0.4em] uppercase">
        <span className="hidden sm:inline">Scroll</span>
        <span className="block w-14 h-px bg-[#a8814a]" />
      </div>
    </section>
  );
}
