import { Instagram, Facebook, Mail, MapPin } from "lucide-react";

const COLS = [
  { title: "Maison", links: ["Über uns", "Philosophie", "Concierge-Service", "Pressestimmen", "Karriere"] },
  { title: "Parfum", links: ["Boadicea the Victorious", "Fragrance Du Bois", "Roja Parfums", "Xerjoff", "Alle Maisons"] },
  { title: "Service", links: ["Versand & Lieferung", "Rückgaben", "Geschenkverpackung", "FAQ", "Kontakt"] },
];

export default function Footer() {
  return (
    <footer className="bg-[#1c1714] text-[#f5f0e8] relative overflow-hidden" data-testid="bas-footer">
      <div className="absolute inset-0 bas-grain opacity-20" />
      <div className="relative max-w-[1520px] mx-auto px-6 lg:px-14 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          <div className="lg:col-span-4">
            <div className="flex flex-col mb-7">
              <span className="font-italiana text-[10px] tracking-[0.5em] text-[#a8814a] mb-1">— MAISON —</span>
              <span className="font-display text-[28px] tracking-[0.12em] leading-none">
                BEAUTY <span className="italic text-[#a8814a]">am</span> SCHLOSS
              </span>
            </div>
            <p className="text-[#ddd2bf]/65 text-[14px] leading-[1.85] max-w-sm font-light">
              Privatkundenhaus für Haute Parfumerie und Medical Skincare.
              Authorised Maison Retailer. Handverlesen in Berlin, versandt in ganz Europa.
            </p>
            <div className="flex items-start gap-3 mt-8 text-[#ddd2bf]/70">
              <MapPin size={14} strokeWidth={1.2} className="mt-1 text-[#a8814a]" />
              <div className="text-[13px] font-light leading-relaxed">
                Schlossstraße 18<br />
                10623 Berlin · Charlottenburg
              </div>
            </div>
            <div className="flex gap-5 mt-8">
              {[
                { Icon: Instagram, label: "Instagram", href: "#" },
                { Icon: Facebook, label: "Facebook", href: "#" },
                { Icon: Mail, label: "E-Mail", href: "mailto:concierge@beauty-am-schloss.de" },
              ].map(({ Icon, label, href }, i) => (
                <a key={i} href={href} aria-label={label} className="w-10 h-10 border border-[#a8814a]/40 flex items-center justify-center text-[#f5f0e8] hover:bg-[#a8814a] hover:border-[#a8814a] transition-all duration-500" data-testid={`bas-footer-social-${i}`}>
                  <Icon size={15} strokeWidth={1.2} />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col, i) => (
            <div key={i} className="lg:col-span-2">
              <div className="text-[10px] tracking-[0.4em] uppercase text-[#a8814a] mb-7 font-italiana">{col.title}</div>
              <ul className="space-y-4">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[#ddd2bf]/85 text-[13px] font-light hover:text-[#a8814a] transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <div className="text-[10px] tracking-[0.4em] uppercase text-[#a8814a] mb-7 font-italiana">Concierge</div>
            <p className="text-[#ddd2bf]/85 text-[13px] font-light leading-relaxed mb-3">
              Mo – Sa<br />10:00 – 19:00 Uhr
            </p>
            <a href="tel:+493012345678" className="font-display text-[20px] text-[#f5f0e8] hover:text-[#a8814a] transition-colors block mb-2">+49 30 1234 5678</a>
            <a href="mailto:concierge@beauty-am-schloss.de" className="text-[12px] text-[#a8814a] tracking-wider hover:text-[#f5f0e8] transition-colors">concierge@beauty-am-schloss.de</a>
          </div>
        </div>

        <div className="border-t border-[#a8814a]/20 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <p className="text-[11px] tracking-[0.2em] text-[#ddd2bf]/55 font-light">
            © {new Date().getFullYear()} BEAUTY AM SCHLOSS Maison · Handcrafted in Europe · Alle Rechte vorbehalten.
          </p>
          <ul className="flex flex-wrap gap-7 text-[11px] tracking-[0.2em] uppercase text-[#ddd2bf]/55 font-light">
            {["Impressum", "Datenschutz", "AGB", "Cookies"].map((l) => (
              <li key={l}><a href="#" className="hover:text-[#a8814a] transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
