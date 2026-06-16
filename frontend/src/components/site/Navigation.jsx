import { useEffect, useState } from "react";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Pflege", id: "newest" },
  { label: "Parfum", id: "bestsellers" },
  { label: "Maisons", id: "maisons" },
  { label: "Philosophie", id: "philosophy" },
  { label: "Journal", id: "newsletter" },
];

const TOP_BAR_MESSAGES = [
  "Kostenloser Versand ab 80€",
  "Persönliche Beratung +49 (0) 30 1234 5678",
  "Drei Proben zu jeder Bestellung",
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" data-testid="lx-navigation">
      {/* Top announcement bar */}
      <div className="bg-[#1a1a1a] text-[#f9f7f4] overflow-hidden">
        <div className="flex whitespace-nowrap py-2.5 text-[10px] tracking-[0.32em] uppercase">
          <div className="flex shrink-0 lx-marquee-track gap-16 pl-16">
            {[...TOP_BAR_MESSAGES, ...TOP_BAR_MESSAGES, ...TOP_BAR_MESSAGES, ...TOP_BAR_MESSAGES].map((m, i) => (
              <span key={i} className="flex items-center gap-16">
                <span>{m}</span>
                <span className="text-[#d4af37]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <nav
        className={`transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-[#f9f7f4]/85 border-b border-[#e6dfd7]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1480px] mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          {/* Mobile menu */}
          <button
            className="lg:hidden text-[#1a1a1a]"
            onClick={() => setOpen(!open)}
            data-testid="lx-nav-mobile-toggle"
            aria-label="Menü"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Left nav */}
          <ul className="hidden lg:flex items-center gap-10 flex-1">
            {NAV_LINKS.slice(0, 3).map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => scrollTo(l.id)}
                  className="lx-link text-[12px] tracking-[0.24em] uppercase text-[#1a1a1a] hover:text-[#a8861e] transition-colors"
                  data-testid={`lx-nav-link-${l.id}`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Logo */}
          <a
            href="/"
            className="font-serif-display text-[26px] sm:text-[30px] tracking-[0.18em] text-[#1a1a1a] select-none"
            data-testid="lx-logo"
          >
            LUXÉLLE
          </a>

          {/* Right nav */}
          <ul className="hidden lg:flex items-center gap-10 flex-1 justify-end">
            {NAV_LINKS.slice(3).map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => scrollTo(l.id)}
                  className="lx-link text-[12px] tracking-[0.24em] uppercase text-[#1a1a1a] hover:text-[#a8861e] transition-colors"
                  data-testid={`lx-nav-link-${l.id}`}
                >
                  {l.label}
                </button>
              </li>
            ))}
            <li className="flex items-center gap-5 pl-6 border-l border-[#e6dfd7]">
              <button data-testid="lx-nav-search" aria-label="Suche"><Search size={17} className="text-[#1a1a1a] hover:text-[#a8861e] transition-colors" strokeWidth={1.25} /></button>
              <button data-testid="lx-nav-account" aria-label="Konto"><User size={17} className="text-[#1a1a1a] hover:text-[#a8861e] transition-colors" strokeWidth={1.25} /></button>
              <button data-testid="lx-nav-bag" aria-label="Warenkorb" className="relative">
                <ShoppingBag size={17} className="text-[#1a1a1a] hover:text-[#a8861e] transition-colors" strokeWidth={1.25} />
                <span className="absolute -top-2 -right-3 text-[9px] tracking-normal font-medium text-[#d4af37]">0</span>
              </button>
            </li>
          </ul>

          {/* Mobile right icons */}
          <div className="lg:hidden flex items-center gap-5">
            <button data-testid="lx-nav-bag-mobile" aria-label="Warenkorb">
              <ShoppingBag size={18} className="text-[#1a1a1a]" strokeWidth={1.25} />
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="lg:hidden border-t border-[#e6dfd7] bg-[#f9f7f4]/95 backdrop-blur-xl">
            <ul className="flex flex-col px-6 py-6 gap-5">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    className="text-sm tracking-[0.24em] uppercase text-[#1a1a1a]"
                    data-testid={`lx-nav-link-mobile-${l.id}`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
