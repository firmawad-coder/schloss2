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
      toast.success(res.message || "Willkommen bei LUXÉLLE.");
      if (res.status === "subscribed") setEmail("");
    } catch (err) {
      const msg = err?.response?.data?.detail?.[0]?.msg || "Bitte gültige E-Mail eingeben.";
      toast.error(typeof msg === "string" ? msg : "Etwas ist schief gelaufen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="bg-[#1a1a1a] text-[#f9f7f4] py-24 lg:py-36 relative overflow-hidden" data-testid="lx-newsletter">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-[#d4af37]" />
      <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <p className="overline text-[#d4af37] mb-8">— Le Cercle LUXÉLLE</p>
        <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-8">
          Eintreten in den<br />
          <span className="italic text-[#d4af37]">inneren Kreis.</span>
        </h2>
        <p className="text-[#f9f7f4]/65 max-w-xl mx-auto leading-relaxed font-light mb-12">
          Exklusive Neuheiten, private Editionen und Einladungen zu Maison-Events —
          direkt in Ihr Postfach. Diskret. Selten. Persönlich.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 sm:gap-0 max-w-xl mx-auto"
          data-testid="lx-newsletter-form"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ihre E-Mail-Adresse"
            className="flex-1 bg-transparent border-b border-[#f9f7f4]/30 focus:border-[#d4af37] outline-none py-4 px-2 placeholder-[#f9f7f4]/40 text-[#f9f7f4] text-sm tracking-wider transition-colors"
            data-testid="lx-newsletter-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 bg-[#d4af37] text-[#1a1a1a] hover:bg-[#f9f7f4] transition-colors duration-500 px-10 py-4 uppercase text-[11px] tracking-[0.28em] disabled:opacity-60"
            data-testid="lx-newsletter-submit"
          >
            {loading ? "Sende..." : "Beitreten"}
            <ArrowRight size={14} strokeWidth={1.5} />
          </button>
        </form>

        <p className="overline text-[#f9f7f4]/40 mt-8">
          Mit der Anmeldung akzeptieren Sie unsere Datenschutzbestimmungen.
        </p>
      </div>
    </section>
  );
}
