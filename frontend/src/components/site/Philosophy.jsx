import { ArrowRight } from "lucide-react";

const PILLARS = [
  { num: "01", title: "Olfaktorische Kuratierung", text: "Jedes Parfum wird von unseren Parfumeurs persönlich getestet — wir empfehlen nur, was uns bewegt." },
  { num: "02", title: "Handcrafted in Europe", text: "Vom Flakon bis zur Geschenkbox — alles gefertigt und veredelt in europäischen Ateliers." },
  { num: "03", title: "Diskretion & Beratung", text: "Persönliche Empfehlungen, signierte Beipackkarten, anonyme Lieferung auf Wunsch." },
];

export default function Philosophy() {
  return (
    <section id="philosophy" className="py-32 lg:py-52 bg-[#f5f0e8] relative overflow-hidden" data-testid="bas-philosophy">
      <div className="relative max-w-[1520px] mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-28 items-center">
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/5] overflow-hidden bg-[#1c1714] bas-img-hover">
            <img src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?crop=entropy&cs=srgb&fm=jpg&w=1400&q=92" alt="Beauty Am Schloss Atelier" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-12 lg:-bottom-16 -right-4 lg:-right-16 bg-[#1c1714] text-[#f5f0e8] p-10 lg:p-12 max-w-[340px] shadow-[0_50px_120px_-40px_rgba(28,23,20,0.7)]">
            <div className="font-display text-7xl text-[#a8814a] leading-none mb-5">"</div>
            <p className="font-display italic text-[#f5f0e8] text-[18px] leading-[1.55] mb-7 font-light">
              Parfum ist das unsichtbarste, doch unvergesslichste Kleidungsstück einer Frau.
            </p>
            <div className="text-[10px] tracking-[0.42em] uppercase text-[#a8814a] font-italiana">— Hubert de Givenchy</div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="flex items-center gap-5 mb-9">
            <span className="h-px w-16 bg-[#a8814a]" />
            <span className="font-italiana text-[#a8814a] tracking-[0.5em] text-xs">N°V · DIE PHILOSOPHIE</span>
          </div>
          <h2 className="font-display text-[clamp(2.5rem,5.75vw,5.5rem)] text-[#1c1714] leading-[0.96] mb-10 font-light tracking-[-0.012em]">
            Im Dienst<br />
            <span className="italic text-[#a8814a]">der olfaktorischen</span> Kunst.
          </h2>
          <p className="text-[#4a3f37] leading-[1.95] mb-14 max-w-lg font-light text-[15.5px]">
            Beauty Am Schloss wurde aus der Überzeugung gegründet, dass wahre Parfumerie
            nicht massenproduziert werden kann. Wir kuratieren Häuser, deren Parfumeurs
            noch in Atelier-Tradition komponieren — Tropfen für Tropfen, Generation für Generation.
          </p>

          <div className="space-y-0">
            {PILLARS.map((p, i) => (
              <div key={i} className="border-t border-[#1c1714]/12 py-9 flex gap-10 items-start group" data-testid={`bas-pillar-${i}`}>
                <span className="font-italiana text-[26px] text-[#a8814a] shrink-0 mt-1 tracking-[0.2em]">{p.num}</span>
                <div className="flex-1">
                  <h3 className="font-display text-[24px] text-[#1c1714] mb-3 font-medium tracking-[-0.005em]">{p.title}</h3>
                  <p className="text-[#4a3f37] text-[14.5px] leading-[1.95] font-light">{p.text}</p>
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
