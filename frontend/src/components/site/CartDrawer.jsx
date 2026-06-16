import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart, formatEUR } from "@/lib/cart";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Gift } from "lucide-react";

export default function CartDrawer({ open, onOpenChange }) {
  const { items, subtotal, count, setQty, remove, clear } = useCart();
  const FREE_SHIP = 150;
  const remaining = Math.max(0, FREE_SHIP - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[460px] bg-[#f5f0e8] text-[#1c1714] border-l border-[#ddd2bf] p-0 [&>button]:hidden"
        data-testid="bas-cart-drawer"
      >
        <SheetTitle className="sr-only">Warenkorb</SheetTitle>
        <SheetDescription className="sr-only">Ihre ausgewählten Parfums und Pflege-Stücke.</SheetDescription>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-7 pt-9 pb-6 border-b border-[#ddd2bf]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-italiana text-[10px] tracking-[0.4em] text-[#a8814a]">— PRIVAT —</span>
              </div>
              <button onClick={() => onOpenChange(false)} className="text-[#1c1714] hover:text-[#a8814a] transition-colors" data-testid="bas-cart-close" aria-label="Schließen">
                <X size={18} strokeWidth={1.2} />
              </button>
            </div>
            <h2 className="font-display text-3xl text-[#1c1714] font-light leading-none mt-3">
              Ihr <span className="italic text-[#a8814a]">Cabinet</span>
            </h2>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#6a5f55] mt-3">{count} {count === 1 ? "Stück" : "Stücke"}</p>

            {subtotal > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-[#4a3f37] mb-2">
                  <span className="flex items-center gap-2"><Gift size={13} strokeWidth={1.2} className="text-[#a8814a]" /> Versandkostenfrei</span>
                  <span>{remaining > 0 ? `noch ${formatEUR(remaining)}` : "freigeschaltet ✦"}</span>
                </div>
                <div className="h-px bg-[#ddd2bf] relative">
                  <div className="absolute top-0 left-0 h-px bg-[#a8814a] transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-7 py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center pt-20" data-testid="bas-cart-empty">
                <ShoppingBag size={28} strokeWidth={1} className="text-[#a8814a] mb-6" />
                <h3 className="font-display text-2xl text-[#1c1714] font-light mb-3">Ihr Cabinet ist leer</h3>
                <p className="text-[13px] text-[#6a5f55] font-light max-w-[260px] leading-relaxed">
                  Beginnen Sie Ihre olfaktorische Reise — vier Häuser warten auf Sie.
                </p>
                <button
                  onClick={() => onOpenChange(false)}
                  className="mt-9 inline-flex items-center gap-3 border border-[#1c1714] text-[#1c1714] px-8 py-3.5 uppercase text-[10px] tracking-[0.32em] hover:bg-[#1c1714] hover:text-[#f5f0e8] transition-colors duration-500"
                >
                  Parfums entdecken
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-[#ddd2bf]">
                {items.map((item) => (
                  <li key={item.id} className="py-6 flex gap-5" data-testid={`bas-cart-item-${item.id}`}>
                    <div className="w-20 h-24 bg-[#ede5d5] overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="overline text-[#a8814a] text-[9px] mb-1">{item.brand}</div>
                      <h4 className="font-display text-[16px] text-[#1c1714] font-light leading-tight mb-1">{item.name}</h4>
                      {item.size && <div className="text-[10px] tracking-[0.2em] uppercase text-[#8a7a6c] mb-3">{item.size}</div>}
                      <div className="flex items-center justify-between gap-4 mt-3">
                        <div className="flex items-center border border-[#ddd2bf]">
                          <button onClick={() => setQty(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-[#1c1714] hover:text-[#a8814a]" aria-label="Weniger"><Minus size={11} strokeWidth={1.3} /></button>
                          <span className="w-7 text-center text-xs">{item.qty}</span>
                          <button onClick={() => setQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-[#1c1714] hover:text-[#a8814a]" aria-label="Mehr"><Plus size={11} strokeWidth={1.3} /></button>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-[15px] text-[#1c1714]">{formatEUR(item.price * item.qty)}</div>
                          <button onClick={() => remove(item.id)} className="text-[9px] tracking-[0.25em] uppercase text-[#6a5f55] hover:text-[#5a1d24] transition-colors mt-1">Entfernen</button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-7 py-6 border-t border-[#ddd2bf] bg-[#ede5d5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] tracking-[0.3em] uppercase text-[#6a5f55]">Zwischensumme</span>
                <span className="font-display text-2xl text-[#1c1714] font-light">{formatEUR(subtotal)}</span>
              </div>
              <p className="text-[10px] tracking-[0.2em] text-[#8a7a6c] mb-6">Steuern und Versand werden beim Checkout berechnet.</p>
              <button
                className="w-full inline-flex items-center justify-center gap-3 bg-[#1c1714] text-[#f5f0e8] hover:bg-[#a8814a] transition-colors duration-700 py-[18px] uppercase text-[11px] tracking-[0.32em]"
                data-testid="bas-cart-checkout"
              >
                Zur Kasse
                <ArrowRight size={14} strokeWidth={1.4} />
              </button>
              <button onClick={clear} className="w-full text-center text-[10px] tracking-[0.3em] uppercase text-[#6a5f55] hover:text-[#5a1d24] mt-4 transition-colors">Cabinet leeren</button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
