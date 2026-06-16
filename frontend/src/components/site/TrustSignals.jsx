import { Crown, Sparkles, ShieldCheck, Feather } from "lucide-react";

const SIGNALS = [
  { icon: Crown, title: "Authorised Maison Retailer", text: "Direkt von den Häusern. Niemals graue Ware." },
  { icon: Feather, title: "Handcrafted in Europe", text: "Jeder Flakon kuratiert in Berlin." },
  { icon: Sparkles, title: "Drei Proben inklusive", text: "Persönlich für Sie ausgewählt." },
  { icon: ShieldCheck, title: "Concierge Beratung", text: "Mo – Sa, von echten Parfumeurs-Kennerinnen." },
];

export default function TrustSignals() {
  return (
    <section className="bg-[#1c1714] text-[#f5f0e8] border-y border-[#a8814a]/30" data-testid="bas-trust">
      <div className="max-w-[1520px] mx-auto px-6 lg:px-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#a8814a]/20">
        {SIGNALS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="flex items-start gap-5 py-9 lg:py-11 px-2 lg:px-9" data-testid={`bas-trust-${i}`}>
              <Icon size={22} strokeWidth={1} className="text-[#a8814a] shrink-0 mt-1" />
              <div>
                <div className="text-[11px] tracking-[0.3em] uppercase text-[#f5f0e8] font-medium leading-snug">{s.title}</div>
                <div className="text-[12px] text-[#ddd2bf]/70 mt-2 font-light leading-relaxed">{s.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
