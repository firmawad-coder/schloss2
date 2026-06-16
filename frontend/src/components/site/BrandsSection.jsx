import { ArrowUpRight } from "lucide-react";

export default function BrandsSection({ brands }) {
  return (
    <section id="maisons" className="py-24 lg:py-36 bg-[#f9f7f4]" data-testid="lx-brands-section">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <p className="overline mb-5">— Kuratiert</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a1a] leading-[1.05] max-w-[640px]">
              Nach Maison<br />
              <span className="italic text-[#a8861e]">entdecken.</span>
            </h2>
          </div>
          <p className="text-[#5a5a5a] max-w-sm font-light leading-relaxed">
            Vier Häuser, eine Vision: kompromisslose Qualität, seltene
            Inhaltsstoffe und eine Tradition, die man auf der Haut spürt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {brands.map((brand, idx) => (
            <a
              key={brand.id}
              href={`#${brand.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-[#1a1a1a]"
              data-testid={`lx-brand-card-${idx}`}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:scale-[1.04] transition-all duration-[1200ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/30 to-transparent" />

              <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#f9f7f4]/40 flex items-center justify-center text-[#f9f7f4] opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500">
                <ArrowUpRight size={16} strokeWidth={1.25} />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-7 text-[#f9f7f4]">
                <div className="overline text-[#d4af37] mb-3">Maison {String(idx + 1).padStart(2, "0")}</div>
                <h3 className="font-serif-display text-2xl lg:text-[26px] leading-tight mb-2">
                  {brand.name}
                </h3>
                <p className="text-[12px] tracking-wide text-[#f9f7f4]/70 font-light">
                  {brand.tagline}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
