import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Package, ShoppingBag, MapPin, LogOut, ChevronRight, User } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import { useCart, formatEUR } from "@/lib/cart";
import { DEMO_ORDERS } from "@/pages/OrderHistory";

const PROFILE = {
  name: "Charlotte von Reuenthal",
  email: "charlotte@beauty-am-schloss.de",
  memberSince: "2023",
  phone: "+49 30 1234 5678",
  address: "Schlossstraße 18 · 10623 Berlin",
};

export default function MyAccount() {
  const navigate = useNavigate();
  const { count } = useCart();
  const lastOrder = DEMO_ORDERS[0];

  const handleLogout = () => {
    toast.success("Sie wurden abgemeldet. Bis bald.");
    navigate("/");
  };

  const QUICK = [
    {
      to: "/account/orders",
      icon: Package,
      label: "Bestellhistorie",
      hint: `${DEMO_ORDERS.length} Bestellungen`,
      testId: "bas-account-orders-link",
    },
    {
      to: "/checkout",
      icon: ShoppingBag,
      label: "Zur Kasse",
      hint: count > 0 ? `${count} ${count === 1 ? "Stück" : "Stücke"} im Cabinet` : "Cabinet ist leer",
      testId: "bas-account-checkout-link",
    },
  ];

  return (
    <SiteLayout>
      <section className="max-w-[1100px] mx-auto px-6 lg:px-10 py-16 lg:py-24" data-testid="bas-account-page">
        <div className="flex items-center gap-5 mb-4">
          <span className="h-px w-12 bg-[#a8814a]" />
          <span className="font-italiana text-[#a8814a] tracking-[0.5em] text-[11px]">— LE CERCLE PRIVÉ —</span>
        </div>
        <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-light leading-[0.98] text-[#1c1714] mb-3">
          Mein <span className="italic text-[#a8814a]">Konto.</span>
        </h1>
        <p className="text-[15px] text-[#6a5f55] font-light mb-14">
          Willkommen zurück, {PROFILE.name.split(" ")[0]}.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Profile card */}
          <div className="lg:col-span-5 border border-[#ddd2bf] bg-[#faf6ef] p-8 lg:p-10" data-testid="bas-account-profile">
            <div className="flex items-center gap-4 mb-9">
              <div className="w-14 h-14 rounded-full border border-[#a8814a]/50 flex items-center justify-center text-[#a8814a] shrink-0">
                <User size={22} strokeWidth={1.2} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-[24px] text-[#1c1714] font-light leading-tight truncate">{PROFILE.name}</div>
                <div className="text-[10px] tracking-[0.28em] uppercase text-[#8a7a6c] mt-1">
                  Mitglied seit {PROFILE.memberSince}
                </div>
              </div>
            </div>

            <dl className="space-y-6">
              {[
                { label: "E-Mail", value: PROFILE.email },
                { label: "Telefon", value: PROFILE.phone },
                { label: "Adresse", value: PROFILE.address, icon: MapPin },
              ].map((row) => (
                <div key={row.label} className="border-t border-[#ddd2bf] pt-5">
                  <dt className="text-[9px] tracking-[0.34em] uppercase text-[#a8814a] mb-2">{row.label}</dt>
                  <dd className="text-[14px] text-[#1c1714] font-light leading-relaxed">{row.value}</dd>
                </div>
              ))}
            </dl>

            <button
              onClick={handleLogout}
              className="mt-10 inline-flex items-center gap-3 border border-[#1c1714] text-[#1c1714] px-7 py-3.5 uppercase text-[10px] tracking-[0.32em] hover:bg-[#1c1714] hover:text-[#f5f0e8] transition-colors duration-500"
              data-testid="bas-account-logout"
            >
              <LogOut size={13} strokeWidth={1.4} /> Abmelden
            </button>
          </div>

          {/* Right column: quick actions + last order */}
          <div className="lg:col-span-7 space-y-7">
            <div className="grid sm:grid-cols-2 gap-7">
              {QUICK.map((q) => (
                <Link
                  key={q.to}
                  to={q.to}
                  className="group border border-[#ddd2bf] bg-[#faf6ef] p-8 hover:border-[#a8814a]/50 transition-colors duration-500 flex flex-col"
                  data-testid={q.testId}
                >
                  <q.icon size={22} strokeWidth={1.1} className="text-[#a8814a] mb-7" />
                  <div className="font-display text-[22px] text-[#1c1714] font-light leading-tight">{q.label}</div>
                  <div className="text-[10px] tracking-[0.26em] uppercase text-[#8a7a6c] mt-2">{q.hint}</div>
                  <span className="mt-7 inline-flex items-center gap-1 text-[10px] tracking-[0.3em] uppercase text-[#1c1714] group-hover:text-[#a8814a] transition-colors">
                    Öffnen <ChevronRight size={13} strokeWidth={1.4} />
                  </span>
                </Link>
              ))}
            </div>

            {lastOrder && (
              <div className="border border-[#ddd2bf] bg-[#1c1714] text-[#f5f0e8] p-8 lg:p-10 relative overflow-hidden">
                <div className="absolute inset-0 bas-grain opacity-20" />
                <div className="relative">
                  <div className="text-[10px] tracking-[0.36em] uppercase text-[#a8814a] mb-5 font-italiana">
                    Letzte Bestellung
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="font-display text-[26px] font-light leading-none">{lastOrder.id}</div>
                      <div className="text-[10px] tracking-[0.26em] uppercase text-[#ddd2bf]/60 mt-3">
                        {lastOrder.date} · {lastOrder.status}
                      </div>
                    </div>
                    <div className="font-display text-3xl font-light text-[#a8814a]">{formatEUR(lastOrder.total)}</div>
                  </div>
                  <Link
                    to="/account/orders"
                    className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-[#f5f0e8] hover:text-[#a8814a] transition-colors"
                    data-testid="bas-account-last-order-link"
                  >
                    Alle Bestellungen ansehen <ChevronRight size={13} strokeWidth={1.4} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
