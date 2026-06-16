import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";

export default function ProductSection({ id, eyebrow, title, italicWord, description, products, ctaLabel = "Alle ansehen" }) {
  return (
    <section id={id} className="py-24 lg:py-36 bg-[#f9f7f4]" data-testid={`lx-section-${id}`}>
      <div className="max-w-[1480px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <p className="overline mb-5">— {eyebrow}</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a1a] leading-[1.05]">
              {title}{" "}
              <span className="italic text-[#a8861e]">{italicWord}</span>
            </h2>
            {description && <p className="text-[#5a5a5a] mt-5 max-w-md font-light">{description}</p>}
          </div>
          <button
            className="self-start md:self-end inline-flex items-center gap-3 uppercase text-[11px] tracking-[0.28em] text-[#1a1a1a] hover:text-[#a8861e] transition-colors group"
            data-testid={`lx-section-${id}-cta`}
          >
            {ctaLabel}
            <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10">
          {products.map((p, idx) => (
            <ProductCard key={p.id} product={p} index={`${id}-${idx}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
