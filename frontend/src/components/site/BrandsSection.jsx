import { ArrowUpRight } from "lucide-react";

export default function BrandsSection({ brands }) {
  return (
    <section id="haeuser" className="py-32 lg:py-52 bg-[#f5f0e8] relative" data-testid="bas-brands">
      <div className="max-w-[1520px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-24 gap-10">
          <div>
            <div className="flex items-center gap-5 mb-9">
              <span className="h-px w-16 bg-[#a8814a]" />
              <span className="font-italiana text-[#a8814a] tracking-[0.5em] text-xs">N°II · DIE HÄUSER</span>
            </div>
            <h2 className="font-display text-[clamp(2.75rem,6.5vw,6rem)] text-[#1c1714] leading-[0.95] font-light max-w-[820px] tracking-[-0.012em]">
              Vier Häuser.<br />
              <span className="italic text-[#a8814a]">Eine</span> kompromisslose Vision.
            </h2>
          </div>
          <p className="text-[#4a3f37] max-w-md font-light leading-[1.95] text-[15.5px]">
            Beauty Am Schloss vertritt ausschließlich Häuser, die olfaktorische
            Kunst über Mode stellen. Jede Komposition wird in kleinen Chargen
            abgefüllt — jeder Flakon durchquert Europa von Hand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {brands.map((brand, idx) => (
            <a
              key={brand.id}
              href={`#haus-${brand.slug}`}
              className="group relative block aspect-[3/4.4] overflow-hidden bg-[#1c1714] bas-img-hover"
              data-testid={`bas-brand-${idx}`}
            >
              <img src={brand.image} alt={brand.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-65 transition-opacity duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1714] via-[#1c1714]/35 to-[#1c1714]/5" />

              <div className="absolute top-7 left-7">
                <span className="font-italiana text-[#a8814a] text-[10px] tracking-[0.5em]">N°{String(idx + 1).padStart(2, "0")}</span>
              </div>

              <div className="absolute top-7 right-7 w-12 h-12 rounded-full border border-[#a8814a]/55 flex items-center justify-center text-[#f5f0e8] opacity-0 group-hover:opacity-100 group-hover:rotate-45 group-hover:bg-[#a8814a] transition-all duration-700">
                <ArrowUpRight size={15} strokeWidth={1.2} />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-9 text-[#f5f0e8]">
                <div className="text-[10px] tracking-[0.5em] uppercase text-[#a8814a] mb-4 font-italiana">{brand.house}</div>
                <h3 className="font-display text-[28px] lg:text-[32px] leading-[1.04] mb-4 font-light tracking-[-0.005em]">{brand.name}</h3>
                <p className="text-[12.5px] tracking-wide text-[#ddd2bf]/85 font-light leading-[1.8] mb-5 max-w-[280px]">
                  {brand.tagline}
                </p>
                <div className="flex items-center gap-3 text-[10px] tracking-[0.36em] uppercase text-[#ddd2bf]/55 font-italiana">
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
