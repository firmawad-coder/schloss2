import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Lock } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/account";
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
        toast.success("Willkommen im Cercle Beauty Am Schloss.");
      } else {
        await login(form.email, form.password);
        toast.success("Willkommen zurück.");
      }
      navigate(redirect, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Etwas ist schiefgelaufen. Bitte erneut versuchen.";
      toast.error(typeof msg === "string" ? msg : "Bitte überprüfen Sie Ihre Eingaben.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="max-w-[480px] mx-auto px-6 py-16 lg:py-24" data-testid="bas-auth-page">
        <div className="flex items-center justify-center gap-5 mb-5">
          <span className="h-px w-12 bg-[#a8814a]" />
          <span className="font-italiana text-[#a8814a] tracking-[0.5em] text-[11px]">— LE CERCLE PRIVÉ —</span>
          <span className="h-px w-12 bg-[#a8814a]" />
        </div>
        <h1 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-light leading-[1] text-[#1c1714] text-center mb-3">
          {isRegister ? (
            <>Konto <span className="italic text-[#a8814a]">erstellen.</span></>
          ) : (
            <>Will<span className="italic text-[#a8814a]">kommen.</span></>
          )}
        </h1>
        <p className="text-[14px] text-[#6a5f55] font-light text-center mb-12">
          {isRegister ? "Treten Sie dem inneren Kreis bei." : "Melden Sie sich bei Ihrem Konto an."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="bas-auth-form">
          {isRegister && (
            <label className="flex flex-col">
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#6a5f55] mb-2">Name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={update("name")}
                className="bg-transparent border-b border-[#ddd2bf] focus:border-[#a8814a] outline-none py-3 text-[15px] text-[#1c1714] transition-colors duration-300"
                data-testid="bas-auth-name"
              />
            </label>
          )}
          <label className="flex flex-col">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#6a5f55] mb-2">E-Mail</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              className="bg-transparent border-b border-[#ddd2bf] focus:border-[#a8814a] outline-none py-3 text-[15px] text-[#1c1714] transition-colors duration-300"
              data-testid="bas-auth-email"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#6a5f55] mb-2">Passwort</span>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={update("password")}
              placeholder={isRegister ? "Mindestens 6 Zeichen" : ""}
              className="bg-transparent border-b border-[#ddd2bf] focus:border-[#a8814a] outline-none py-3 text-[15px] text-[#1c1714] placeholder-[#b8ac9a] transition-colors duration-300"
              data-testid="bas-auth-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 bg-[#1c1714] text-[#f5f0e8] hover:bg-[#a8814a] transition-colors duration-700 py-[18px] uppercase text-[11px] tracking-[0.32em] disabled:opacity-60"
            data-testid="bas-auth-submit"
          >
            <Lock size={13} strokeWidth={1.4} />
            {loading ? "Bitte warten…" : isRegister ? "Konto erstellen" : "Anmelden"}
            {!loading && <ArrowRight size={14} strokeWidth={1.4} />}
          </button>
        </form>

        <div className="mt-10 text-center text-[12px] tracking-[0.04em] text-[#6a5f55]">
          {isRegister ? "Bereits Mitglied?" : "Noch kein Konto?"}{" "}
          <button
            type="button"
            onClick={() => setMode(isRegister ? "login" : "register")}
            className="uppercase tracking-[0.2em] text-[10px] text-[#1c1714] hover:text-[#a8814a] bas-link transition-colors ml-1"
            data-testid="bas-auth-toggle"
          >
            {isRegister ? "Anmelden" : "Konto erstellen"}
          </button>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-[10px] tracking-[0.3em] uppercase text-[#8a7a6c] hover:text-[#a8814a] transition-colors">
            ← Zur Startseite
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
