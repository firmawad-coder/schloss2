import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/lib/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await subscribeNewsletter(email);
      toast.success(res.message || "Bienvenue.");
      if (res.status === "subscribed") setEmail("");
    } catch (err) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="bg-[#1c1714] text-[#f5f0e8] py-28 lg:py-44 relative overflow-hidden" data-testid="bas-newsletter">
      <div className="absolute inset-0 bas-grain opacity-25" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-[#a8814a] to-transparent" />
      <div className="relative max-w-3xl mx-auto px-6 lg:px-14 text-center">
        <div className="flex items-center justify-center gap-4 mb-9">
          <span className="h-px w-12 bg-[#a8814a]" />
          <span className="font-italiana text-[#a8814a] tracking-[0.5em] text-xs">LE CERCLE PRIVÉ</span>
          <span className="h-px w-12 bg-[#a8814a]" />
        </div>
        <h2 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] leading-[1] mb-9 font-light">
          Eintreten in den<br />
          <span className="italic bas-gold-text">inneren Kreis.</span>
        </h2>
        <p className="text-[#ddd2bf]/75 max-w-xl mx-auto leading-[1.85] font-light text-[15px] mb-14">
          Private Drops, limitierte Editionen, Einladungen zu Trunkshows
          und persönliche Olfaktorische-Beratung — direkt in Ihr Postfach.
          Diskret. Selten. Persönlich.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-0 max-w-xl mx-auto" data-testid="bas-newsletter-form">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ihre E-Mail-Adresse"
            className="flex-1 bg-transparent border-b border-[#f5f0e8]/25 focus:border-[#a8814a] outline-none py-5 px-2 placeholder-[#f5f0e8]/40 text-[#f5f0e8] text-sm tracking-wider transition-colors duration-500"
            data-testid="bas-newsletter-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 bg-[#a8814a] text-[#1c1714] hover:bg-[#f5f0e8] transition-colors duration-700 px-11 py-5 uppercase text-[11px] tracking-[0.32em] disabled:opacity-60 font-medium"
            data-testid="bas-newsletter-submit"
          >
            {loading ? "Sende..." : "Beitreten"}
            <ArrowRight size={13} strokeWidth={1.4} />
          </button>
        </form>

        <p className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/35 mt-9">
          Mit der Anmeldung akzeptieren Sie unsere Datenschutzbestimmungen.
        </p>
      </div>
    </section>
  );
}
