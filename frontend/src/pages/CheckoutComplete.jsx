import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import { fetchOrder } from "@/lib/api";

const PAID = ["paid", "authorized"];
const PENDING = ["pending", "open"];
const FAILED = ["failed", "expired", "canceled", "payment_error"];

const MAX_POLLS = 8;
const POLL_MS = 2500;

export default function CheckoutComplete() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const [order, setOrder] = useState(null);
  const [done, setDone] = useState(false); // finished polling / resolved
  const [error, setError] = useState(false);
  const pollsRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setError(true);
      setDone(true);
      return;
    }
    let timer;
    let cancelled = false;

    const tick = async () => {
      try {
        const o = await fetchOrder(orderId);
        if (cancelled) return;
        setOrder(o);
        const resolved = PAID.includes(o.status) || FAILED.includes(o.status);
        if (resolved || pollsRef.current >= MAX_POLLS) {
          setDone(true);
          return;
        }
        pollsRef.current += 1;
        timer = setTimeout(tick, POLL_MS);
      } catch {
        if (cancelled) return;
        setError(true);
        setDone(true);
      }
    };

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId]);

  const status = order?.status;
  const isPaid = PAID.includes(status);
  const isFailed = FAILED.includes(status);
  const isPending = !done || PENDING.includes(status);

  let icon, eyebrow, title, message, tone;
  if (error) {
    icon = <XCircle size={42} strokeWidth={1} className="text-[#5a1d24] mx-auto mb-9" />;
    eyebrow = "— HINWEIS —";
    title = <>Bestellung <span className="italic text-[#a8814a]">nicht gefunden.</span></>;
    message = "Wir konnten diese Bestellung nicht laden. Bitte prüfen Sie Ihre Bestellhistorie.";
  } else if (isPaid) {
    icon = <CheckCircle2 size={42} strokeWidth={1} className="text-[#a8814a] mx-auto mb-9" />;
    eyebrow = "— MERCI —";
    title = <>Zahlung <span className="italic text-[#a8814a]">bestätigt.</span></>;
    message = "Vielen Dank für Ihr Vertrauen. Eine Bestätigung wurde an Ihre E-Mail gesendet.";
    tone = "paid";
  } else if (isFailed) {
    icon = <XCircle size={42} strokeWidth={1} className="text-[#5a1d24] mx-auto mb-9" />;
    eyebrow = "— ZAHLUNG —";
    title = <>Zahlung <span className="italic text-[#a8814a]">nicht abgeschlossen.</span></>;
    message = "Ihre Zahlung wurde nicht abgeschlossen. Es wurde nichts berechnet — bitte versuchen Sie es erneut.";
    tone = "failed";
  } else {
    // still pending
    icon = isPending && !done
      ? <Loader2 size={42} strokeWidth={1} className="text-[#a8814a] mx-auto mb-9 animate-spin" />
      : <Clock size={42} strokeWidth={1} className="text-[#a8814a] mx-auto mb-9" />;
    eyebrow = "— EINEN MOMENT —";
    title = <>Zahlung wird <span className="italic text-[#a8814a]">bestätigt.</span></>;
    message = "Wir bestätigen gerade Ihre Zahlung. Dies dauert in der Regel nur wenige Augenblicke.";
  }

  return (
    <SiteLayout>
      <section className="max-w-[640px] mx-auto px-6 py-24 lg:py-32 text-center" data-testid="bas-checkout-complete">
        {icon}
        <div className="font-italiana text-[#a8814a] tracking-[0.5em] text-[11px] mb-5">{eyebrow}</div>
        <h1 className="font-display text-[clamp(2.2rem,4.5vw,3.4rem)] font-light leading-tight text-[#1c1714] mb-6">
          {title}
        </h1>
        <p className="text-[15px] text-[#6a5f55] font-light leading-relaxed mb-3 max-w-md mx-auto">{message}</p>
        {order?.order_number && (
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#8a7a6c] mb-12" data-testid="bas-complete-status">
            Bestellnummer · <span className="text-[#1c1714]">{order.order_number}</span>
            {status && <> · {status}</>}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            to="/account/orders"
            className="inline-flex items-center justify-center gap-3 bg-[#1c1714] text-[#f5f0e8] hover:bg-[#a8814a] transition-colors duration-500 px-9 py-4 uppercase text-[10px] tracking-[0.32em]"
            data-testid="bas-complete-view-orders"
          >
            Meine Bestellungen
          </Link>
          {tone === "failed" ? (
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center gap-3 border border-[#1c1714] text-[#1c1714] hover:bg-[#1c1714] hover:text-[#f5f0e8] transition-colors duration-500 px-9 py-4 uppercase text-[10px] tracking-[0.32em]"
            >
              Erneut versuchen
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 border border-[#1c1714] text-[#1c1714] hover:bg-[#1c1714] hover:text-[#f5f0e8] transition-colors duration-500 px-9 py-4 uppercase text-[10px] tracking-[0.32em]"
            >
              Weiter shoppen
            </Link>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
