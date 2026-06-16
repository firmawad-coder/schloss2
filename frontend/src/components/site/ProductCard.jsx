import { Plus } from "lucide-react";

const formatEUR = (price) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price);

export default function ProductCard({ product, index }) {
  return (
    <article className="group" data-testid={`lx-product-${index}`}>
      <div className="relative overflow-hidden bg-[#efeae2] aspect-[4/5]">
        {product.tag && (
          <span className="absolute top-4 left-4 z-10 overline text-[#1a1a1a] bg-[#f9f7f4]/90 backdrop-blur-sm px-3 py-1.5">
            {product.tag}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />
        <button
          className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] text-[#f9f7f4] py-4 uppercase text-[10px] tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-center gap-2"
          data-testid={`lx-product-add-${index}`}
        >
          <Plus size={13} strokeWidth={1.5} />
          In den Warenkorb
        </button>
      </div>
      <div className="pt-6">
        <p className="overline text-[#a8861e] mb-2">{product.brand}</p>
        <h3 className="font-serif-display text-[17px] lg:text-[18px] text-[#1a1a1a] leading-snug mb-3 min-h-[2.6em]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-[#1a1a1a] text-sm tracking-wide">{formatEUR(product.price)}</span>
          <span className="overline text-[#8a8275]">Entdecken</span>
        </div>
      </div>
    </article>
  );
}
