import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";

export default function ProductSection({ id, eyebrow, eyebrowNumber, title, italicWord, description, products, ctaLabel = "Alle entdecken", dark = false }) {
  const bg = dark ? "bg-[#1c1714] text-[#f5f0e8]" : "bg-[#f5f0e8] text-[#1c1714]";
  const titleColor = dark ? "text-[#f5f0e8]" : "text-[#1c1714]";
  const goldText = dark ? "text-[#d4b06a]" : "text-[#a8814a]";
  const descColor = dark ? "text-[#ddd2bf]/75" : "text-[#4a3f37]";
  const ctaColor = dark ? "text-[#f5f0e8] hover:text-[#d4b06a]" : "text-[#1c1714] hover:text-[#a8814a]";

  return (
    <section id={id} className={`py-28 lg:py-44 relative ${bg}`} data-testid={`bas-section-${id}`}>
      <div className="max-w-[1520px] mx-auto px-6 lg:px-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-7">
              <span className={`h-px w-12 ${dark ? "bg-[#d4b06a]" : "bg-[#a8814a]"}`} />
              <span className={`font-italiana ${goldText} tracking-[0.4em] text-xs`}>
                {eyebrowNumber && `${eyebrowNumber} · `}{eyebrow}
              </span>
            </div>
            <h2 className={`font-display text-[clamp(2.5rem,6vw,5.5rem)] ${titleColor} leading-[0.98] font-light`}>
              {title} <span className={`italic ${goldText}`}>{italicWord}</span>
            </h2>
            {description && <p className={`${descColor} mt-7 max-w-md font-light text-[15px] leading-[1.85]`}>{description}</p>}
          </div>
          <button
            className={`self-start md:self-end inline-flex items-center gap-3 uppercase text-[11px] tracking-[0.32em] ${ctaColor} transition-colors group`}
            data-testid={`bas-section-${id}-cta`}
          >
            {ctaLabel}
            <ArrowRight size={14} strokeWidth={1.4} className="group-hover:translate-x-1 transition-transform duration-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-14 lg:gap-x-8 lg:gap-y-20">
          {products.map((p, idx) => (
            <ProductCard key={p.id} product={p} index={`${id}-${idx}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
