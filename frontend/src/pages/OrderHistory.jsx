import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import { formatEUR } from "@/lib/cart";
import { fetchOrders } from "@/lib/api";

const STATUS_STYLES = {
  Geliefert: "text-[#3f6b4a] border-[#3f6b4a]/30 bg-[#3f6b4a]/8",
  Versandt: "text-[#a8814a] border-[#a8814a]/40 bg-[#a8814a]/8",
  "In Bearbeitung": "text-[#6a5f55] border-[#6a5f55]/30 bg-[#6a5f55]/8",
};

export const formatOrderDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
};

export default function OrderHistory() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  return (
    <SiteLayout>
      <section className="max-w-[1040px] mx-auto px-6 lg:px-10 py-16 lg:py-24" data-testid="bas-orders-page">
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-[#6a5f55] hover:text-[#a8814a] transition-colors mb-12"
          data-testid="bas-orders-back"
        >
          <ArrowLeft size={13} strokeWidth={1.4} /> Mein Konto
        </Link>

        <div className="flex items-center gap-5 mb-4">
          <span className="h-px w-12 bg-[#a8814a]" />
          <span className="font-italiana text-[#a8814a] tracking-[0.5em] text-[11px]">— ARCHIV —</span>
        </div>
        <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-light leading-[0.98] text-[#1c1714] mb-14">
          Bestell<span className="italic text-[#a8814a]">historie.</span>
        </h1>

        {orders === null ? (
          <div className="py-24 flex justify-center">
            <div className="w-8 h-8 border border-[#ddd2bf] border-t-[#a8814a] rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-[#ddd2bf] py-24 flex flex-col items-center text-center" data-testid="bas-orders-empty">
            <Package size={28} strokeWidth={1} className="text-[#a8814a] mb-6" />
            <p className="font-display text-2xl text-[#1c1714] font-light mb-3">Noch keine Bestellungen</p>
            <p className="text-[13px] text-[#6a5f55] font-light max-w-[300px] leading-relaxed">
              Sobald Sie Ihre erste Bestellung aufgegeben haben, erscheint sie hier.
            </p>
            <Link to="/" className="mt-8 text-[10px] tracking-[0.32em] uppercase text-[#1c1714] hover:text-[#a8814a] bas-link">
              Parfums entdecken
            </Link>
          </div>
        ) : (
          <ul className="space-y-6">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border border-[#ddd2bf] bg-[#faf6ef] hover:border-[#a8814a]/50 transition-colors duration-500"
                data-testid={`bas-order-${order.order_number}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-6 border-b border-[#ddd2bf]">
                  <div>
                    <div className="font-display text-[22px] text-[#1c1714] font-light leading-none">{order.order_number}</div>
                    <div className="text-[10px] tracking-[0.28em] uppercase text-[#8a7a6c] mt-2">{formatOrderDate(order.created_at)}</div>
                  </div>
                  <span
                    className={`text-[9px] tracking-[0.3em] uppercase px-4 py-2 border ${STATUS_STYLES[order.status] || STATUS_STYLES["In Bearbeitung"]}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="px-7 py-6">
                  <ul className="divide-y divide-[#ddd2bf]/70">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          {item.brand && <div className="text-[9px] tracking-[0.32em] uppercase text-[#a8814a] mb-1">{item.brand}</div>}
                          <div className="font-display text-[17px] text-[#1c1714] font-light leading-tight truncate">
                            {item.name} <span className="text-[#8a7a6c] text-[13px]">× {item.qty}</span>
                          </div>
                        </div>
                        <div className="font-display text-[15px] text-[#1c1714] shrink-0">{formatEUR(item.price * item.qty)}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between gap-4 px-7 py-5 border-t border-[#ddd2bf] bg-[#f0e9dc]">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#6a5f55]">Gesamtbetrag</span>
                  <span className="font-display text-2xl text-[#1c1714] font-light">{formatEUR(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteLayout>
  );
}
