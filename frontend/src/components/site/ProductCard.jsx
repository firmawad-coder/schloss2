import { Plus, Star } from "lucide-react";
import { cartStore, formatEUR } from "@/lib/cart";
import { toast } from "sonner";

export default function ProductCard({ product, index }) {
  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cartStore.add(product);
    toast.success(`${product.name} wurde dem Warenkorb hinzugefügt.`);
  };

  return (
    <article className="group relative" data-testid={`bas-product-${index}`}>
      <a href="#" className="block">
        <div className="relative overflow-hidden bg-[#ede5d5] aspect-[3/4] bas-img-hover">
          {product.tag && (
            <span className="absolute top-4 left-4 z-10 text-[9px] tracking-[0.3em] uppercase text-[#1c1714] bg-[#f5f0e8]/95 backdrop-blur-sm px-3.5 py-2 font-medium">
              {product.tag}
            </span>
          )}
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />

          {/* Quick-add overlay */}
          <button
            onClick={handleAdd}
            className="absolute inset-x-0 bottom-0 bg-[#1c1714]/95 backdrop-blur-md text-[#f5f0e8] py-4 uppercase text-[10px] tracking-[0.36em] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out flex items-center justify-center gap-3 border-t border-[#a8814a]/40"
            data-testid={`bas-product-add-${index}`}
          >
            <Plus size={12} strokeWidth={1.4} />
            In den Warenkorb
          </button>
        </div>
      </a>

      <div className="pt-7">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="overline text-[#a8814a]">{product.brand}</div>
          {product.rating && product.review_count > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-[#6a5f55]">
              <Star size={11} className="fill-[#a8814a] text-[#a8814a]" strokeWidth={0} />
              <span className="font-medium text-[#1c1714]">{product.rating.toFixed(1)}</span>
              <span className="text-[#8a7a6c]">({product.review_count})</span>
            </div>
          )}
        </div>
        <h3 className="font-display text-[22px] lg:text-[24px] text-[#1c1714] leading-[1.15] font-light mb-1.5">
          {product.name}
        </h3>
        {product.subtitle && (
          <p className="font-display italic text-[#6a5f55] text-sm mb-4">{product.subtitle}</p>
        )}
        {product.notes && product.notes.length > 0 && (
          <p className="text-[11px] tracking-[0.12em] text-[#8a7a6c] font-light leading-relaxed mb-5">
            {product.notes.join(" · ")}
          </p>
        )}
        <div className="flex items-center justify-between border-t border-[#ddd2bf] pt-4">
          <div>
            <div className="font-display text-[19px] text-[#1c1714]">{formatEUR(product.price)}</div>
            {product.size && <div className="text-[10px] tracking-[0.25em] uppercase text-[#8a7a6c] mt-0.5">{product.size}</div>}
          </div>
          <button
            onClick={handleAdd}
            className="text-[10px] tracking-[0.32em] uppercase text-[#1c1714] hover:text-[#a8814a] bas-link transition-colors"
            data-testid={`bas-product-add-inline-${index}`}
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </article>
  );
}
