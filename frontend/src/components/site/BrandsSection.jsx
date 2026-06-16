import { ArrowUpRight } from "lucide-react";

export default function BrandsSection({ brands }) {
  return (
    <section id="maisons" className="py-28 lg:py-44 bg-[#f5f0e8] relative" data-testid="bas-brands">
      <div className="max-w-[1520px] mx-auto px-6 lg:px-14">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-7">
              <span className="h-px w-12 bg-[#a8814a]" />
              <span className="font-italiana text-[#a8814a] tracking-[0.4em] text-xs">LES MAISONS</span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] text-[#1c1714] leading-[0.98] font-light max-w-[820px]">
              Vier Häuser.<br />
              <span className="italic text-[#a8814a]">Eine</span> kompromisslose Vision.
            </h2>
          </div>
          <p className="text-[#4a3f37] max-w-md font-light leading-[1.85] text-[15px]">
            Wir vertreten ausschließlich Maisons, die olfaktorische Kunst über
            Mode stellen. Jede Komposition wird in kleinen Chargen abgefüllt,
            jeder Flakon durchquert Europa von Hand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {brands.map((brand, idx) => (
            <a
              key={brand.id}
              href={`#maison-${brand.slug}`}
              className="group relative block aspect-[3/4.2] overflow-hidden bg-[#1c1714] bas-img-hover"
              data-testid={`bas-brand-${idx}`}
            >
              <img src={brand.image} alt={brand.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-65 transition-opacity duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1714] via-[#1c1714]/35 to-[#1c1714]/5" />

              <div className="absolute top-6 left-6 flex items-center gap-3">
                <span className="font-italiana text-[#a8814a] text-[10px] tracking-[0.4em]">N°{String(idx + 1).padStart(2, "0")}</span>
              </div>

              <div className="absolute top-6 right-6 w-11 h-11 rounded-full border border-[#a8814a]/50 flex items-center justify-center text-[#f5f0e8] opacity-0 group-hover:opacity-100 group-hover:rotate-45 group-hover:bg-[#a8814a] transition-all duration-700">
                <ArrowUpRight size={15} strokeWidth={1.2} />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-[#f5f0e8]">
                <div className="text-[10px] tracking-[0.4em] uppercase text-[#a8814a] mb-3">{brand.house}</div>
                <h3 className="font-display text-[26px] lg:text-[30px] leading-[1.05] mb-3 font-light">{brand.name}</h3>
                <p className="text-[12px] tracking-wide text-[#ddd2bf]/85 font-light leading-relaxed mb-4 max-w-[280px]">
                  {brand.tagline}
                </p>
                <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[#ddd2bf]/55">
                  <span>{brand.origin}</span>
                  <span className="w-1 h-1 rounded-full bg-[#a8814a]" />
                  <span>Est. {brand.established}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
