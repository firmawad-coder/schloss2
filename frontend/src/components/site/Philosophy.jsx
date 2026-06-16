import { ArrowRight } from "lucide-react";

const PILLARS = [
  { num: "01", title: "Olfaktorische Kuratierung", text: "Jedes Parfum wird von unseren Parfumeurs persönlich getestet — wir empfehlen nur, was uns bewegt." },
  { num: "02", title: "Handcrafted in Europe", text: "Vom Flakon bis zur Geschenkbox: alles gefertigt und veredelt in europäischen Ateliers." },
  { num: "03", title: "Diskretion & Concierge", text: "Persönliche Beratung, signierte Beipackkarten, anonyme Lieferung auf Wunsch." },
];

export default function Philosophy() {
  return (
    <section id="philosophy" className="py-28 lg:py-44 bg-[#f5f0e8] relative overflow-hidden" data-testid="bas-philosophy">
      <div className="relative max-w-[1520px] mx-auto px-6 lg:px-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/5] overflow-hidden bg-[#1c1714] bas-img-hover">
            <img src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?crop=entropy&cs=srgb&fm=jpg&w=1400&q=92" alt="Beauty Am Schloss Atelier" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-10 lg:-bottom-14 -right-4 lg:-right-14 bg-[#1c1714] text-[#f5f0e8] p-9 lg:p-11 max-w-[320px] shadow-[0_40px_100px_-40px_rgba(28,23,20,0.6)]">
            <div className="font-display text-6xl text-[#a8814a] leading-none mb-4">"</div>
            <p className="font-display italic text-[#f5f0e8] text-[17px] leading-relaxed mb-5">
              Parfum ist das unsichtbarste, doch unvergesslichste Kleidungsstück einer Frau.
            </p>
            <div className="text-[10px] tracking-[0.35em] uppercase text-[#a8814a]">— Hubert de Givenchy</div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="flex items-center gap-4 mb-7">
            <span className="h-px w-12 bg-[#a8814a]" />
            <span className="font-italiana text-[#a8814a] tracking-[0.4em] text-xs">N°V · DIE PHILOSOPHIE</span>
          </div>
          <h2 className="font-display text-[clamp(2.4rem,5.5vw,5rem)] text-[#1c1714] leading-[1] mb-8 font-light">
            Im Dienst<br />
            <span className="italic text-[#a8814a]">der olfaktorischen</span> Kunst.
          </h2>
          <p className="text-[#4a3f37] leading-[1.85] mb-12 max-w-lg font-light text-[15px]">
            Beauty Am Schloss wurde aus der Überzeugung gegründet, dass wahre Parfumerie
            nicht massenproduziert werden kann. Wir kuratieren Häuser, deren Parfumeurs
            noch in Atelier-Tradition komponieren — Tropfen für Tropfen, Generation für Generation.
          </p>

          <div className="space-y-0">
            {PILLARS.map((p, i) => (
              <div key={i} className="border-t border-[#1c1714]/12 py-8 flex gap-9 items-start group" data-testid={`bas-pillar-${i}`}>
                <span className="font-italiana text-2xl text-[#a8814a] shrink-0 mt-1 tracking-[0.2em]">{p.num}</span>
                <div className="flex-1">
                  <h3 className="font-display text-[22px] text-[#1c1714] mb-3 font-medium">{p.title}</h3>
                  <p className="text-[#4a3f37] text-sm leading-[1.85] font-light">{p.text}</p>
                </div>
                <ArrowRight size={16} strokeWidth={1.2} className="text-[#1c1714]/30 mt-2 group-hover:text-[#a8814a] group-hover:translate-x-1 transition-all duration-500" />
              </div>
            ))}
            <div className="border-t border-[#1c1714]/12" />
          </div>
        </div>
      </div>
    </section>
  );
}
