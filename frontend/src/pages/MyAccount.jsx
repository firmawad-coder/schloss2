import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Package, ShoppingBag, LogOut, ChevronRight, User, Pencil, Check, X } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { useCart, formatEUR } from "@/lib/cart";
import { fetchOrders } from "@/lib/api";
import { formatOrderDate } from "@/pages/OrderHistory";

export default function MyAccount() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { count } = useCart();

  const [orders, setOrders] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  if (!user) return null;

  const memberSince = (() => {
    try {
      return new Date(user.created_at).getFullYear();
    } catch {
      return "";
    }
  })();
  const lastOrder = orders && orders.length > 0 ? orders[0] : null;

  const startEdit = () => {
    setDraft({ name: user.name || "", phone: user.phone || "", address: user.address || "" });
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await updateProfile(draft);
      toast.success("Profil aktualisiert.");
      setEditing(false);
    } catch {
      toast.error("Profil konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Sie wurden abgemeldet. Bis bald.");
    navigate("/");
  };

  const QUICK = [
    {
      to: "/account/orders",
      icon: Package,
      label: "Bestellhistorie",
      hint: orders === null ? "Wird geladen…" : `${orders.length} ${orders.length === 1 ? "Bestellung" : "Bestellungen"}`,
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

  const field = (label, value, key, placeholder) => (
    <div className="border-t border-[#ddd2bf] pt-5">
      <dt className="text-[9px] tracking-[0.34em] uppercase text-[#a8814a] mb-2">{label}</dt>
      {editing && key ? (
        <input
          value={draft[key]}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full bg-transparent border-b border-[#ddd2bf] focus:border-[#a8814a] outline-none py-1.5 text-[14px] text-[#1c1714] placeholder-[#b8ac9a] transition-colors"
          data-testid={`bas-account-edit-${key}`}
        />
      ) : (
        <dd className="text-[14px] text-[#1c1714] font-light leading-relaxed">{value || <span className="text-[#b8ac9a]">—</span>}</dd>
      )}
    </div>
  );

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
          Willkommen zurück, {(user.name || "").split(" ")[0] || "Gast"}.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Profile card */}
          <div className="lg:col-span-5 border border-[#ddd2bf] bg-[#faf6ef] p-8 lg:p-10" data-testid="bas-account-profile">
            <div className="flex items-start justify-between gap-4 mb-9">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-full border border-[#a8814a]/50 flex items-center justify-center text-[#a8814a] shrink-0">
                  <User size={22} strokeWidth={1.2} />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[24px] text-[#1c1714] font-light leading-tight truncate">{user.name}</div>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-[#8a7a6c] mt-1">
                    Mitglied seit {memberSince}
                  </div>
                </div>
              </div>
              {!editing ? (
                <button
                  onClick={startEdit}
                  className="text-[#6a5f55] hover:text-[#a8814a] transition-colors shrink-0"
                  aria-label="Profil bearbeiten"
                  data-testid="bas-account-edit"
                >
                  <Pencil size={16} strokeWidth={1.3} />
                </button>
              ) : (
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={saveEdit} disabled={saving} className="text-[#3f6b4a] hover:opacity-70 transition-opacity disabled:opacity-40" aria-label="Speichern" data-testid="bas-account-save">
                    <Check size={18} strokeWidth={1.5} />
                  </button>
                  <button onClick={() => setEditing(false)} className="text-[#8a7a6c] hover:text-[#5a1d24] transition-colors" aria-label="Abbrechen" data-testid="bas-account-cancel">
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>
              )}
            </div>

            <dl className="space-y-6">
              {field("Name", user.name, "name", "Ihr Name")}
              {field("E-Mail", user.email, null)}
              {field("Telefon", user.phone, "phone", "+49 …")}
              {field("Adresse", user.address, "address", "Straße, PLZ, Stadt")}
            </dl>

            {!editing && (
              <button
                onClick={handleLogout}
                className="mt-10 inline-flex items-center gap-3 border border-[#1c1714] text-[#1c1714] px-7 py-3.5 uppercase text-[10px] tracking-[0.32em] hover:bg-[#1c1714] hover:text-[#f5f0e8] transition-colors duration-500"
                data-testid="bas-account-logout"
              >
                <LogOut size={13} strokeWidth={1.4} /> Abmelden
              </button>
            )}
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
                  <div className="text-[10px] tracking-[0.36em] uppercase text-[#a8814a] mb-5 font-italiana">Letzte Bestellung</div>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="font-display text-[26px] font-light leading-none">{lastOrder.order_number}</div>
                      <div className="text-[10px] tracking-[0.26em] uppercase text-[#ddd2bf]/60 mt-3">
                        {formatOrderDate(lastOrder.created_at)} · {lastOrder.status}
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
