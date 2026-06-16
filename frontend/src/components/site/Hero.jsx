import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-[#1c1714] text-[#f5f0e8] pt-[150px]" data-testid="bas-hero">
      <div className="absolute inset-0">
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/api/static/products/hero-cover.png`}
          alt="Beauty Am Schloss — Haute Parfumerie"
          className="absolute inset-0 w-full h-full object-cover opacity-95 bas-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1714]/95 via-[#1c1714]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1714] via-[#1c1714]/25 to-transparent" />
      </div>
      <div className="absolute inset-0 bas-grain opacity-25" />

      {/* Vertical brand */}
      <div className="hidden xl:flex absolute left-10 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[10px] tracking-[0.5em] uppercase text-[#ddd2bf]/55 z-10 font-italiana">
        <span>Haute Parfumerie · Privatkundenhaus · Berlin · Est. 1894</span>
      </div>

      {/* Right ornament */}
      <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-7 z-10 text-[#a8814a]">
        <span className="bas-crest" />
        <span className="font-italiana text-xs tracking-[0.6em]">N°IV</span>
        <span className="bas-crest" />
      </div>

      <div className="relative z-10 w-full max-w-[1520px] mx-auto px-6 lg:px-16 pb-28 lg:pb-44">
        <div className="max-w-[760px] bas-reveal" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-5 mb-11">
            <span className="h-px w-16 bg-[#a8814a]" />
            <span className="font-italiana text-[#a8814a] tracking-[0.5em] text-xs">HAUTE PARFUMERIE</span>
          </div>

          <h1 className="font-display text-[clamp(3.25rem,9vw,8rem)] leading-[0.92] text-[#f5f0e8] mb-14 font-light tracking-[-0.012em]">
            Düfte, die<br />
            <span className="italic text-[#d4b06a] font-light">Geschichte</span> tragen.
          </h1>

          <p className="text-[#ddd2bf]/85 text-base lg:text-[17.5px] leading-[1.95] font-light max-w-[540px] mb-16 tracking-[0.01em]">
            Beauty Am Schloss — ein privates Haus für die seltensten Parfums der Welt.
            Handverlesen aus den Häusern Roja, Xerjoff, Boadicea und Fragrance Du Bois.
            Jedes Flakon ein Manuskript. Jeder Tropfen eine Signatur.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-24">
            <button
              onClick={() => document.getElementById("fragrances")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center justify-center gap-5 bg-[#f5f0e8] text-[#1c1714] hover:bg-[#a8814a] hover:text-[#f5f0e8] transition-all duration-700 px-11 py-[20px] uppercase text-[11px] tracking-[0.4em]"
              data-testid="bas-hero-cta-primary"
            >
              Parfums entdecken
              <ArrowRight size={14} strokeWidth={1.4} className="group-hover:translate-x-1 transition-transform duration-500" />
            </button>
            <button
              onClick={() => document.getElementById("haeuser")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-5 border border-[#ddd2bf]/45 text-[#f5f0e8] hover:bg-[#f5f0e8]/10 hover:border-[#a8814a] transition-all duration-700 px-11 py-[20px] uppercase text-[11px] tracking-[0.4em]"
              data-testid="bas-hero-cta-secondary"
            >
              Unsere Häuser
            </button>
          </div>

          <div className="flex items-end gap-12 lg:gap-16 text-[#ddd2bf]">
            <div>
              <div className="font-display text-4xl lg:text-[44px] text-[#f5f0e8] font-light leading-none">04</div>
              <div className="text-[10px] tracking-[0.4em] uppercase mt-3 text-[#a8814a]">Haute Parfumerie</div>
            </div>
            <span className="w-px h-14 bg-[#ddd2bf]/25" />
            <div>
              <div className="font-display text-4xl lg:text-[44px] text-[#f5f0e8] font-light leading-none">130<span className="text-[#a8814a]">+</span></div>
              <div className="text-[10px] tracking-[0.4em] uppercase mt-3 text-[#a8814a]">Jahre Tradition</div>
            </div>
            <span className="w-px h-14 bg-[#ddd2bf]/25 hidden sm:block" />
            <div className="hidden sm:block">
              <div className="font-display text-4xl lg:text-[44px] text-[#f5f0e8] font-light leading-none flex items-center gap-2">
                4,9 <Sparkles size={16} className="text-[#a8814a]" />
              </div>
              <div className="text-[10px] tracking-[0.4em] uppercase mt-3 text-[#a8814a]">Concierge-Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom signature */}
      <div className="absolute bottom-8 right-6 lg:right-16 z-10 flex items-center gap-4 text-[#a8814a] text-[10px] tracking-[0.5em] uppercase font-italiana">
        <span className="hidden sm:inline">Scroll</span>
        <span className="block w-16 h-px bg-[#a8814a]" />
      </div>
    </section>
  );
}
