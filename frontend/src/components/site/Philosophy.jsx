import { ArrowRight } from "lucide-react";

const PILLARS = [
  { num: "01", title: "Klinische Wirkstoffe", text: "Höchste Konzentrationen, die in dermatologischen Studien geprüft wurden." },
  { num: "02", title: "Ritual statt Routine", text: "Pflege als bewusster Moment — texturen, die man fühlen will." },
  { num: "03", title: "Transparente Herkunft", text: "Von der Manufaktur bis zur Anwendung — vollständig nachvollziehbar." },
];

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="py-24 lg:py-36 bg-[#ece4d7] relative overflow-hidden"
      data-testid="lx-philosophy"
    >
      <div className="absolute inset-0 lx-grain" />
      <div className="relative max-w-[1480px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85"
              alt="Medical Beauty Philosophy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden lg:block absolute -bottom-10 -right-10 bg-[#f9f7f4] p-8 max-w-[280px] shadow-[0_30px_80px_-30px_rgba(26,26,26,0.3)]">
            <div className="font-serif-display text-5xl text-[#a8861e] leading-none mb-3">"</div>
            <p className="font-serif-display italic text-[#1a1a1a] text-[17px] leading-relaxed">
              Wahre Pflege beginnt dort, wo Wissenschaft auf Sinnlichkeit trifft.
            </p>
            <p className="overline mt-4 text-[#8a8275]">— Maison LUXÉLLE</p>
          </div>
        </div>

        <div className="lg:col-span-6">
          <p className="overline mb-6">— Medical Beauty Philosophie</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-[58px] text-[#1a1a1a] leading-[1.05] mb-8">
            Die Wissenschaft der<br />
            <span className="italic text-[#a8861e]">stillen Eleganz.</span>
          </h2>
          <p className="text-[#5a5a5a] leading-relaxed mb-10 max-w-lg font-light">
            LUXÉLLE verbindet jahrzehntelange Forschung aus Dermatologie und
            Parfumerie mit handverlesenen Ritualen. Jedes Produkt ist eine
            Komposition aus klinischer Präzision und kompromissloser Sensorik.
          </p>

          <div className="space-y-px">
            {PILLARS.map((p, i) => (
              <div
                key={i}
                className="border-t border-[#1a1a1a]/15 py-7 flex gap-8 items-start group"
                data-testid={`lx-philosophy-pillar-${i}`}
              >
                <span className="font-serif-display text-2xl text-[#a8861e] shrink-0">{p.num}</span>
                <div className="flex-1">
                  <h3 className="font-serif-display text-xl text-[#1a1a1a] mb-2">{p.title}</h3>
                  <p className="text-[#5a5a5a] text-sm leading-relaxed font-light">{p.text}</p>
                </div>
                <ArrowRight size={16} strokeWidth={1.25} className="text-[#1a1a1a]/40 mt-2 group-hover:text-[#a8861e] group-hover:translate-x-1 transition-all" />
              </div>
            ))}
            <div className="border-t border-[#1a1a1a]/15" />
          </div>
        </div>
      </div>
    </section>
  );
}
