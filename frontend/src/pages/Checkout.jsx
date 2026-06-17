import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ShoppingBag, Lock, CheckCircle2 } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import { useCart, formatEUR } from "@/lib/cart";
import { resolveImage } from "@/lib/api";

const FREE_SHIP = 150;
const SHIP_COST = 9.9;

const FIELDS = [
  { section: "Kontakt", rows: [[{ name: "email", label: "E-Mail", type: "email", w: "full" }]] },
  {
    section: "Lieferadresse",
    rows: [
      [
        { name: "firstName", label: "Vorname", w: "half" },
        { name: "lastName", label: "Nachname", w: "half" },
      ],
      [{ name: "address", label: "Straße & Hausnummer", w: "full" }],
      [
        { name: "postal", label: "PLZ", w: "half" },
        { name: "city", label: "Stadt", w: "half" },
      ],
      [{ name: "country", label: "Land", w: "full" }],
    ],
  },
  {
    section: "Zahlung",
    rows: [
      [{ name: "card", label: "Kartennummer", placeholder: "1234 5678 9012 3456", w: "full" }],
      [
        { name: "expiry", label: "Gültig bis (MM/JJ)", placeholder: "05/29", w: "half" },
        { name: "cvc", label: "CVC", placeholder: "123", w: "half" },
      ],
    ],
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, count, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", address: "",
    postal: "", city: "", country: "Deutschland", card: "", expiry: "", cvc: "",
  });

  const shipping = subtotal >= FREE_SHIP || subtotal === 0 ? 0 : SHIP_COST;
  const total = subtotal + shipping;

  const update = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    const id = `BAS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(id);
    setPlaced(true);
    clear();
    toast.success("Ihre Bestellung wurde aufgenommen.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Order confirmed
  if (placed) {
    return (
      <SiteLayout>
        <section className="max-w-[640px] mx-auto px-6 py-24 lg:py-32 text-center" data-testid="bas-checkout-confirmation">
          <CheckCircle2 size={42} strokeWidth={1} className="text-[#a8814a] mx-auto mb-9" />
          <div className="font-italiana text-[#a8814a] tracking-[0.5em] text-[11px] mb-5">— MERCI —</div>
          <h1 className="font-display text-[clamp(2.2rem,4.5vw,3.4rem)] font-light leading-tight text-[#1c1714] mb-6">
            Bestellung <span className="italic text-[#a8814a]">bestätigt.</span>
          </h1>
          <p className="text-[15px] text-[#6a5f55] font-light leading-relaxed mb-3">
            Vielen Dank für Ihr Vertrauen. Eine Bestätigung wurde an Ihre E-Mail gesendet.
          </p>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#8a7a6c] mb-12">
            Bestellnummer · <span className="text-[#1c1714]">{orderId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/account/orders"
              className="inline-flex items-center justify-center gap-3 bg-[#1c1714] text-[#f5f0e8] hover:bg-[#a8814a] transition-colors duration-500 px-9 py-4 uppercase text-[10px] tracking-[0.32em]"
              data-testid="bas-checkout-view-orders"
            >
              Bestellung ansehen
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 border border-[#1c1714] text-[#1c1714] hover:bg-[#1c1714] hover:text-[#f5f0e8] transition-colors duration-500 px-9 py-4 uppercase text-[10px] tracking-[0.32em]"
            >
              Weiter shoppen
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <SiteLayout>
        <section className="max-w-[640px] mx-auto px-6 py-24 lg:py-32 text-center" data-testid="bas-checkout-empty">
          <ShoppingBag size={32} strokeWidth={1} className="text-[#a8814a] mx-auto mb-8" />
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#1c1714] mb-5">
            Ihr Cabinet ist leer.
          </h1>
          <p className="text-[15px] text-[#6a5f55] font-light mb-10">
            Fügen Sie zunächst ein Parfum hinzu, um zur Kasse zu gehen.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-[#1c1714] text-[#f5f0e8] hover:bg-[#a8814a] transition-colors duration-500 px-9 py-4 uppercase text-[10px] tracking-[0.32em]"
          >
            Parfums entdecken
          </Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="max-w-[1180px] mx-auto px-6 lg:px-10 py-16 lg:py-24" data-testid="bas-checkout-page">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-[#6a5f55] hover:text-[#a8814a] transition-colors mb-12"
        >
          <ArrowLeft size={13} strokeWidth={1.4} /> Zurück
        </button>

        <div className="flex items-center gap-5 mb-4">
          <span className="h-px w-12 bg-[#a8814a]" />
          <span className="font-italiana text-[#a8814a] tracking-[0.5em] text-[11px]">— CHECKOUT —</span>
        </div>
        <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-light leading-[0.98] text-[#1c1714] mb-14">
          Zur <span className="italic text-[#a8814a]">Kasse.</span>
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14" data-testid="bas-checkout-form">
          {/* Form fields */}
          <div className="lg:col-span-7 space-y-12">
            {FIELDS.map((group) => (
              <fieldset key={group.section}>
                <legend className="text-[10px] tracking-[0.36em] uppercase text-[#a8814a] mb-7 font-italiana">
                  {group.section}
                </legend>
                <div className="space-y-5">
                  {group.rows.map((row, ri) => (
                    <div key={ri} className="flex flex-col sm:flex-row gap-5">
                      {row.map((field) => (
                        <label key={field.name} className={`flex flex-col ${field.w === "half" ? "sm:w-1/2" : "w-full"}`}>
                          <span className="text-[9px] tracking-[0.3em] uppercase text-[#6a5f55] mb-2">{field.label}</span>
                          <input
                            type={field.type || "text"}
                            required
                            value={form[field.name]}
                            onChange={update(field.name)}
                            placeholder={field.placeholder || ""}
                            className="bg-transparent border-b border-[#ddd2bf] focus:border-[#a8814a] outline-none py-3 text-[15px] text-[#1c1714] placeholder-[#b8ac9a] transition-colors duration-300"
                            data-testid={`bas-checkout-${field.name}`}
                          />
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          {/* Order summary */}
          <aside className="lg:col-span-5">
            <div className="border border-[#ddd2bf] bg-[#faf6ef] p-8 lg:sticky lg:top-[164px]" data-testid="bas-checkout-summary">
              <div className="text-[10px] tracking-[0.36em] uppercase text-[#a8814a] mb-7 font-italiana">
                Ihre Bestellung ({count})
              </div>

              <ul className="divide-y divide-[#ddd2bf] mb-7">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4 first:pt-0">
                    <div className="w-14 h-16 bg-[#ede5d5] overflow-hidden shrink-0">
                      <img src={resolveImage(item.image)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] tracking-[0.3em] uppercase text-[#a8814a] mb-1">{item.brand}</div>
                      <div className="font-display text-[16px] text-[#1c1714] font-light leading-tight truncate">{item.name}</div>
                      <div className="text-[10px] tracking-[0.22em] uppercase text-[#8a7a6c] mt-1">Menge: {item.qty}</div>
                    </div>
                    <div className="font-display text-[15px] text-[#1c1714] shrink-0">{formatEUR(item.price * item.qty)}</div>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 border-t border-[#ddd2bf] pt-6 text-[13px]">
                <div className="flex justify-between text-[#4a3f37]">
                  <span className="tracking-[0.12em] uppercase text-[11px] text-[#6a5f55]">Zwischensumme</span>
                  <span>{formatEUR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#4a3f37]">
                  <span className="tracking-[0.12em] uppercase text-[11px] text-[#6a5f55]">Versand</span>
                  <span>{shipping === 0 ? "Kostenlos" : formatEUR(shipping)}</span>
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-[#ddd2bf] mt-6 pt-6">
                <span className="text-[11px] tracking-[0.3em] uppercase text-[#6a5f55]">Gesamt</span>
                <span className="font-display text-3xl text-[#1c1714] font-light">{formatEUR(total)}</span>
              </div>

              <button
                type="submit"
                className="w-full mt-8 inline-flex items-center justify-center gap-3 bg-[#1c1714] text-[#f5f0e8] hover:bg-[#a8814a] transition-colors duration-700 py-[18px] uppercase text-[11px] tracking-[0.32em]"
                data-testid="bas-checkout-place-order"
              >
                <Lock size={13} strokeWidth={1.4} /> Bestellung aufgeben
              </button>
              <p className="text-[10px] tracking-[0.18em] text-[#8a7a6c] mt-4 text-center leading-relaxed">
                Sichere, verschlüsselte Zahlung. Drei kuratierte Proben zu jeder Bestellung.
              </p>
            </div>
          </aside>
        </form>
      </section>
    </SiteLayout>
  );
}
