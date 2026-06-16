import { useEffect, useState } from "react";
import { Search, User, Menu, X, ShoppingBag, Phone } from "lucide-react";
import { useCart } from "@/lib/cart";

const PRIMARY_LINKS = [
  { label: "Parfum", id: "fragrances", primary: true },
  { label: "Häuser", id: "haeuser" },
  { label: "Neuheiten", id: "newest" },
];
const SECONDARY_LINKS = [
  { label: "Skincare", id: "skincare" },
  { label: "Philosophie", id: "philosophy" },
  { label: "Concierge", id: "newsletter" },
];

const TOP_BAR = [
  "Handcrafted in Europe — Authorised Retailer",
  "Versandkostenfrei ab €150 · DE & EU",
  "Drei kuratierte Proben zu jeder Bestellung",
  "Concierge: +49 30 1234 5678 · Mo – Sa",
];

export default function Navigation({ onCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" data-testid="bas-nav">
      {/* Marquee */}
      <div className="bg-[#1c1714] text-[#ddd2bf] overflow-hidden">
        <div className="flex whitespace-nowrap py-2.5 text-[10px] tracking-[0.36em] uppercase">
          <div className="flex shrink-0 bas-marquee-track gap-20 pl-20">
            {[...TOP_BAR, ...TOP_BAR, ...TOP_BAR].map((m, i) => (
              <span key={i} className="flex items-center gap-20">
                <span>{m}</span>
                <span className="text-[#a8814a]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <nav className={`transition-all duration-700 ${scrolled ? "backdrop-blur-xl bg-[#f5f0e8]/90 border-b border-[#ddd2bf]/70 shadow-[0_1px_30px_-15px_rgba(28,23,20,0.15)]" : "bg-transparent"}`}>
        <div className="max-w-[1520px] mx-auto px-6 lg:px-14 h-[88px] grid grid-cols-3 items-center">
          {/* Left */}
          <ul className="hidden lg:flex items-center gap-9">
            {PRIMARY_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => scrollTo(l.id)}
                  className={`bas-link text-[11px] tracking-[0.3em] uppercase transition-colors ${l.primary ? "text-[#1c1714] font-medium" : "text-[#4a3f37]"} hover:text-[#a8814a]`}
                  data-testid={`bas-nav-${l.id}`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile menu trigger */}
          <button
            className="lg:hidden text-[#1c1714] justify-self-start"
            onClick={() => setOpen(!open)}
            data-testid="bas-nav-mobile-toggle"
            aria-label="Menü"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <a href="/" className="justify-self-center flex flex-col items-center select-none" data-testid="bas-logo">
            <span className="font-italiana text-[10px] tracking-[0.5em] text-[#a8814a] mb-1">— PARFUMERIE —</span>
            <span className="font-display text-[24px] sm:text-[26px] lg:text-[28px] tracking-[0.12em] text-[#1c1714] leading-none">
              BEAUTY <span className="font-display italic text-[#a8814a]">am</span> SCHLOSS
            </span>
          </a>

          {/* Right */}
          <ul className="hidden lg:flex items-center gap-8 justify-self-end">
            {SECONDARY_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => scrollTo(l.id)}
                  className="bas-link text-[11px] tracking-[0.3em] uppercase text-[#4a3f37] hover:text-[#a8814a] transition-colors"
                  data-testid={`bas-nav-${l.id}`}
                >
                  {l.label}
                </button>
              </li>
            ))}
            <li className="flex items-center gap-5 pl-7 border-l border-[#ddd2bf]">
              <button data-testid="bas-nav-search" aria-label="Suche" className="text-[#1c1714] hover:text-[#a8814a] transition-colors">
                <Search size={16} strokeWidth={1.2} />
              </button>
              <button data-testid="bas-nav-account" aria-label="Konto" className="text-[#1c1714] hover:text-[#a8814a] transition-colors">
                <User size={16} strokeWidth={1.2} />
              </button>
              <button
                onClick={onCartOpen}
                data-testid="bas-nav-cart"
                aria-label="Warenkorb"
                className="text-[#1c1714] hover:text-[#a8814a] transition-colors relative"
              >
                <ShoppingBag size={16} strokeWidth={1.2} />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 text-[9px] bg-[#a8814a] text-white w-4 h-4 flex items-center justify-center rounded-full font-medium">
                    {count}
                  </span>
                )}
              </button>
            </li>
          </ul>

          {/* Mobile right cart */}
          <div className="lg:hidden justify-self-end flex items-center gap-4">
            <button onClick={onCartOpen} data-testid="bas-nav-cart-mobile" aria-label="Warenkorb" className="relative">
              <ShoppingBag size={18} strokeWidth={1.2} className="text-[#1c1714]" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 text-[9px] bg-[#a8814a] text-white w-4 h-4 flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-[#ddd2bf] bg-[#f5f0e8]/97 backdrop-blur-xl">
            <ul className="flex flex-col px-6 py-8 gap-6">
              {[...PRIMARY_LINKS, ...SECONDARY_LINKS].map((l) => (
                <li key={l.id}>
                  <button onClick={() => scrollTo(l.id)} className="text-sm tracking-[0.3em] uppercase text-[#1c1714]" data-testid={`bas-nav-mobile-${l.id}`}>
                    {l.label}
                  </button>
                </li>
              ))}
              <li className="pt-4 border-t border-[#ddd2bf]/60 flex items-center gap-3 text-[#4a3f37] text-xs tracking-[0.2em] uppercase">
                <Phone size={14} strokeWidth={1.2} />
                +49 30 1234 5678
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
