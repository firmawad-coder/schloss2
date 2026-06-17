import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
];

const TOP_BAR = [
  "Handcrafted in Europe — Authorised Retailer",
  "Versandkostenfrei ab €150 · DE & EU",
  "Drei kuratierte Proben zu jeder Bestellung",
  "Beratung: +49 30 1234 5678 · Mo – Sa",
];

export default function Navigation({ onCartOpen }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      // On a sub-page: go home, then scroll to the section once it mounts.
      navigate("/", { state: { scrollTo: id } });
    }
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" data-testid="bas-nav">
      {/* Top thin marquee — light, refined */}
      <div className="bg-[#ede5d5] border-b border-[#ddd2bf]/60 overflow-hidden">
        <div className="flex whitespace-nowrap py-2.5 text-[10px] tracking-[0.38em] uppercase text-[#6a5f55]">
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

      {/* Main nav — always light, no scroll state */}
      <nav className="bg-[#f5f0e8] border-b border-[#ddd2bf]/70">
        <div className="max-w-[1520px] mx-auto px-6 lg:px-16 h-[104px] grid grid-cols-3 items-center">
          {/* Left links */}
          <ul className="hidden lg:flex items-center gap-11">
            {PRIMARY_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => scrollTo(l.id)}
                  className={`bas-link text-[11px] tracking-[0.38em] uppercase transition-colors ${l.primary ? "text-[#1c1714] font-medium" : "text-[#4a3f37] font-normal"} hover:text-[#a8814a]`}
                  data-testid={`bas-nav-${l.id}`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile trigger */}
          <button
            className="lg:hidden text-[#1c1714] justify-self-start"
            onClick={() => setOpen(!open)}
            data-testid="bas-nav-mobile-toggle"
            aria-label="Menü"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo block (centered, refined typography) */}
          <Link to="/" className="justify-self-center flex flex-col items-center select-none group" data-testid="bas-logo">
            <span className="flex items-center gap-3 mb-2">
              <span className="h-px w-6 bg-[#a8814a]" />
              <span className="font-italiana text-[9px] tracking-[0.5em] text-[#a8814a]">PARFUMERIE · BERLIN</span>
              <span className="h-px w-6 bg-[#a8814a]" />
            </span>
            <span className="font-display text-[26px] sm:text-[30px] lg:text-[34px] tracking-[0.2em] text-[#1c1714] leading-none">
              BEAUTY <span className="font-display italic font-light text-[#a8814a] tracking-normal">am</span> SCHLOSS
            </span>
          </Link>

          {/* Right links */}
          <ul className="hidden lg:flex items-center gap-9 justify-self-end">
            {SECONDARY_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => scrollTo(l.id)}
                  className="bas-link text-[11px] tracking-[0.38em] uppercase text-[#4a3f37] hover:text-[#a8814a] transition-colors"
                  data-testid={`bas-nav-${l.id}`}
                >
                  {l.label}
                </button>
              </li>
            ))}
            <li className="flex items-center gap-5 pl-8 border-l border-[#ddd2bf]">
              <button data-testid="bas-nav-search" aria-label="Suche" className="text-[#1c1714] hover:text-[#a8814a] transition-colors">
                <Search size={15} strokeWidth={1.2} />
              </button>
              <Link to="/account" data-testid="bas-nav-account" aria-label="Konto" className="text-[#1c1714] hover:text-[#a8814a] transition-colors">
                <User size={15} strokeWidth={1.2} />
              </Link>
              <button
                onClick={onCartOpen}
                data-testid="bas-nav-cart"
                aria-label="Warenkorb"
                className="text-[#1c1714] hover:text-[#a8814a] transition-colors relative"
              >
                <ShoppingBag size={15} strokeWidth={1.2} />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 text-[9px] bg-[#a8814a] text-white w-4 h-4 flex items-center justify-center rounded-full font-medium">
                    {count}
                  </span>
                )}
              </button>
            </li>
          </ul>

          {/* Mobile cart */}
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
          <div className="lg:hidden border-t border-[#ddd2bf] bg-[#f5f0e8]">
            <ul className="flex flex-col px-6 py-9 gap-7">
              {[...PRIMARY_LINKS, ...SECONDARY_LINKS].map((l) => (
                <li key={l.id}>
                  <button onClick={() => scrollTo(l.id)} className="text-sm tracking-[0.32em] uppercase text-[#1c1714]" data-testid={`bas-nav-mobile-${l.id}`}>
                    {l.label}
                  </button>
                </li>
              ))}
              <li>
                <Link to="/account" onClick={() => setOpen(false)} className="flex items-center gap-3 text-sm tracking-[0.32em] uppercase text-[#1c1714]" data-testid="bas-nav-mobile-account">
                  <User size={15} strokeWidth={1.2} className="text-[#a8814a]" /> Konto
                </Link>
              </li>
              <li className="pt-5 border-t border-[#ddd2bf]/60 flex items-center gap-3 text-[#4a3f37] text-xs tracking-[0.24em] uppercase">
                <Phone size={14} strokeWidth={1.2} className="text-[#a8814a]" />
                +49 30 1234 5678
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
