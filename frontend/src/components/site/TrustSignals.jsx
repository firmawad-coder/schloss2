import { Truck, Sparkles, ShieldCheck, Gift } from "lucide-react";

const SIGNALS = [
  { icon: Truck, title: "Premium Versand", text: "Kostenfrei ab 80 €" },
  { icon: Sparkles, title: "Drei Proben", text: "Zu jeder Bestellung" },
  { icon: ShieldCheck, title: "100% Authentisch", text: "Direkt vom Hersteller" },
  { icon: Gift, title: "Persönliche Beratung", text: "Mo–Sa, Maison-Experten" },
];

export default function TrustSignals() {
  return (
    <section className="border-y border-[#e6dfd7] bg-[#f9f7f4]" data-testid="lx-trust">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#e6dfd7]">
        {SIGNALS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-5 py-8 px-4 lg:px-8"
              data-testid={`lx-trust-${i}`}
            >
              <Icon size={26} strokeWidth={1} className="text-[#a8861e] shrink-0" />
              <div>
                <div className="text-[11px] tracking-[0.22em] uppercase text-[#1a1a1a] font-medium">{s.title}</div>
                <div className="text-xs text-[#5a5a5a] mt-1 font-light">{s.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
