import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Star, Check, Gift } from "lucide-react";
import { toast } from "sonner";
import SiteLayout from "@/components/site/SiteLayout";
import { fetchProduct, resolveImage } from "@/lib/api";
import { cartStore, formatEUR } from "@/lib/cart";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setNotFound(false);
    fetchProduct(slug)
      .then((p) => {
        if (!active) return;
        setProduct(p);
        setSize(p.size || "");
        setQty(1);
      })
      .catch(() => active && setNotFound(true));
    return () => {
      active = false;
    };
  }, [slug]);

  const sizes = product?.size ? [product.size] : [];

  const handleAdd = () => {
    for (let i = 0; i < qty; i += 1) cartStore.add({ ...product, size });
    toast.success(`${product.name} (${qty}×) wurde Ihrem Cabinet hinzugefügt.`);
  };

  if (notFound) {
    return (
      <SiteLayout>
        <section className="max-w-[640px] mx-auto px-6 py-24 lg:py-32 text-center" data-testid="bas-product-notfound">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#1c1714] mb-5">Produkt nicht gefunden.</h1>
          <Link to="/" className="inline-flex items-center gap-3 bg-[#1c1714] text-[#f5f0e8] hover:bg-[#a8814a] transition-colors duration-500 px-9 py-4 uppercase text-[10px] tracking-[0.32em]">
            Zur Startseite
          </Link>
        </section>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="py-32 flex justify-center">
          <div className="w-8 h-8 border border-[#ddd2bf] border-t-[#a8814a] rounded-full animate-spin" />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 lg:py-16" data-testid="bas-product-detail">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-[#6a5f55] hover:text-[#a8814a] transition-colors mb-10"
          data-testid="bas-product-back"
        >
          <ArrowLeft size={13} strokeWidth={1.4} /> Weiter shoppen
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Image */}
          <div className="relative overflow-hidden bg-[#ede5d5] aspect-[3/4]">
            {product.tag && (
              <span className="absolute top-6 left-6 z-10 text-[9px] tracking-[0.4em] uppercase text-[#1c1714] bg-[#f5f0e8]/95 backdrop-blur-sm px-4 py-2 font-medium">
                {product.tag}
              </span>
            )}
            <img
              src={resolveImage(product.image)}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="bas-product-detail-image"
            />
          </div>

          {/* Details */}
          <div className="lg:py-4">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="text-[10px] tracking-[0.4em] uppercase text-[#a8814a] font-medium">{product.brand}</div>
              {product.rating && product.review_count > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-[#6a5f55]">
                  <Star size={12} className="fill-[#a8814a] text-[#a8814a]" strokeWidth={0} />
                  <span className="font-medium text-[#1c1714]">{product.rating.toFixed(1)}</span>
                  <span className="text-[#8a7a6c]">({product.review_count})</span>
                </div>
              )}
            </div>

            <h1 className="font-display text-[clamp(2.4rem,4.5vw,3.6rem)] text-[#1c1714] font-light leading-[1.02] tracking-[-0.01em]">
              {product.name}
            </h1>
            {product.subtitle && (
              <p className="font-display italic text-[#6a5f55] text-[18px] mt-3 font-light">{product.subtitle}</p>
            )}

            <div className="font-display text-[30px] text-[#1c1714] mt-8">{formatEUR(product.price)}</div>

            {product.notes && product.notes.length > 0 && (
              <p className="text-[12px] tracking-[0.16em] text-[#8a7a6c] font-light leading-[1.9] mt-6">
                {product.notes.join(" · ")}
              </p>
            )}

            <hr className="border-[#ddd2bf] my-8" />

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <div className="text-[10px] tracking-[0.34em] uppercase text-[#6a5f55] mb-3">Größe</div>
                <div className="flex flex-wrap gap-3" data-testid="bas-product-sizes">
                  {sizes.map((s) => {
                    const active = s === size;
                    return (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`inline-flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.2em] uppercase border transition-colors duration-300 ${
                          active
                            ? "border-[#1c1714] bg-[#1c1714] text-[#f5f0e8]"
                            : "border-[#ddd2bf] text-[#1c1714] hover:border-[#a8814a]"
                        }`}
                        data-testid={`bas-product-size-${s.replace(/\s+/g, "")}`}
                      >
                        {active && <Check size={12} strokeWidth={1.6} />} {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity + add to cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-[#ddd2bf] shrink-0" data-testid="bas-product-qty">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-[52px] flex items-center justify-center text-[#1c1714] hover:text-[#a8814a]"
                  aria-label="Weniger"
                >
                  <Minus size={13} strokeWidth={1.4} />
                </button>
                <span className="w-10 text-center text-sm" data-testid="bas-product-qty-value">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-[52px] flex items-center justify-center text-[#1c1714] hover:text-[#a8814a]"
                  aria-label="Mehr"
                >
                  <Plus size={13} strokeWidth={1.4} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 inline-flex items-center justify-center gap-3 bg-[#1c1714] text-[#f5f0e8] hover:bg-[#a8814a] transition-colors duration-700 py-[18px] uppercase text-[11px] tracking-[0.32em]"
                data-testid="bas-product-add-to-cart"
              >
                <Plus size={14} strokeWidth={1.5} /> In den Warenkorb
              </button>
            </div>

            <div className="flex items-center gap-2.5 mt-6 text-[11px] tracking-[0.18em] uppercase text-[#6a5f55]">
              <Gift size={14} strokeWidth={1.2} className="text-[#a8814a]" />
              Versandkostenfrei ab €150 · Drei kuratierte Proben gratis
            </div>

            {product.description && (
              <>
                <hr className="border-[#ddd2bf] my-8" />
                <div className="text-[10px] tracking-[0.34em] uppercase text-[#a8814a] mb-4 font-italiana">Die Komposition</div>
                <p className="text-[15px] text-[#4a3f37] font-light leading-[1.95]" data-testid="bas-product-description">
                  {product.description}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
