import { Instagram, Facebook, Mail } from "lucide-react";

const COLS = [
  {
    title: "Maison",
    links: ["Über LUXÉLLE", "Philosophie", "Beratung", "Pressestimmen", "Karriere"],
  },
  {
    title: "Service",
    links: ["Versand & Lieferung", "Rückgaben", "Geschenkverpackung", "FAQ", "Kontakt"],
  },
  {
    title: "Maisons",
    links: ["Doctor Babor", "Mesoestetic", "Boadicea the Victorious", "Fragrance Du Bois"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#f9f7f4] border-t border-[#e6dfd7]" data-testid="lx-footer">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
          <div className="lg:col-span-4">
            <div className="font-serif-display text-3xl tracking-[0.18em] text-[#1a1a1a] mb-6">LUXÉLLE</div>
            <p className="text-[#5a5a5a] text-sm leading-relaxed max-w-xs font-light">
              Eine Maison kuratierter Beauty- und Parfumerie-Häuser.
              Mit Sitz in Berlin & Paris.
            </p>
            <div className="flex gap-5 mt-8">
              <a href="#" data-testid="lx-footer-instagram" aria-label="Instagram" className="text-[#1a1a1a] hover:text-[#a8861e] transition-colors">
                <Instagram size={18} strokeWidth={1.25} />
              </a>
              <a href="#" data-testid="lx-footer-facebook" aria-label="Facebook" className="text-[#1a1a1a] hover:text-[#a8861e] transition-colors">
                <Facebook size={18} strokeWidth={1.25} />
              </a>
              <a href="mailto:concierge@luxelle.com" data-testid="lx-footer-mail" aria-label="E-Mail" className="text-[#1a1a1a] hover:text-[#a8861e] transition-colors">
                <Mail size={18} strokeWidth={1.25} />
              </a>
            </div>
          </div>

          {COLS.map((col, i) => (
            <div key={i} className="lg:col-span-2 lg:col-start-auto">
              <div className="overline mb-6">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[#1a1a1a] text-sm font-light hover:text-[#a8861e] transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <div className="overline mb-6">Concierge</div>
            <p className="text-[#1a1a1a] text-sm font-light leading-relaxed">
              Mo – Sa<br />
              10:00 – 19:00
            </p>
            <a href="tel:+493012345678" className="font-serif-display text-lg text-[#1a1a1a] hover:text-[#a8861e] transition-colors block mt-3">
              +49 30 1234 5678
            </a>
          </div>
        </div>

        <div className="border-t border-[#e6dfd7] pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-[#8a8275] font-light">© {new Date().getFullYear()} LUXÉLLE Maison. Alle Rechte vorbehalten.</p>
          <ul className="flex flex-wrap gap-6 text-xs text-[#8a8275] font-light">
            <li><a href="#" className="hover:text-[#1a1a1a]">Impressum</a></li>
            <li><a href="#" className="hover:text-[#1a1a1a]">Datenschutz</a></li>
            <li><a href="#" className="hover:text-[#1a1a1a]">AGB</a></li>
            <li><a href="#" className="hover:text-[#1a1a1a]">Cookies</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
