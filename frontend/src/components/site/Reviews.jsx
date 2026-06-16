import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchReviews } from "@/lib/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => { fetchReviews().then(setReviews).catch(() => {}); }, []);

  return (
    <section className="py-32 lg:py-48 bg-[#ede5d5] relative overflow-hidden" data-testid="bas-reviews">
      <div className="absolute inset-0 bas-grain opacity-25" />
      <div className="relative max-w-[1520px] mx-auto px-6 lg:px-16">
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-5 mb-9">
            <span className="h-px w-16 bg-[#a8814a]" />
            <span className="font-italiana text-[#a8814a] tracking-[0.5em] text-xs">STIMMEN UNSERER KUNDINNEN</span>
            <span className="h-px w-16 bg-[#a8814a]" />
          </div>
          <h2 className="font-display text-[clamp(2.4rem,5.5vw,5rem)] text-[#1c1714] leading-[0.98] font-light mb-9 tracking-[-0.012em]">
            Diskret. Persönlich.<br />
            <span className="italic text-[#a8814a]">Unvergesslich.</span>
          </h2>
          <div className="flex items-center justify-center gap-4 text-[#1c1714]">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-[#a8814a] text-[#a8814a]" strokeWidth={0} />
              ))}
            </div>
            <span className="text-sm tracking-wider font-medium">4,9 / 5</span>
            <span className="text-[10px] text-[#6a5f55] tracking-[0.3em] uppercase font-italiana">· über 1.840 verifizierte Kundinnen</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="bg-[#f5f0e8] p-10 lg:p-12 relative border border-[#ddd2bf]"
              data-testid={`bas-review-${i}`}
            >
              <div className="font-display text-[110px] text-[#a8814a]/25 leading-none absolute top-4 right-8 select-none">"</div>
              <div className="flex gap-1 mb-7 relative">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={j} size={12} className="fill-[#a8814a] text-[#a8814a]" strokeWidth={0} />
                ))}
              </div>
              <h4 className="font-display text-[22px] text-[#1c1714] mb-5 font-medium leading-snug relative">{r.title}</h4>
              <blockquote className="text-[#4a3f37] text-[14.5px] leading-[1.95] font-light mb-9 italic relative">
                "{r.text}"
              </blockquote>
              <figcaption className="border-t border-[#ddd2bf] pt-6 relative">
                <div className="text-[#1c1714] text-[14px] font-medium">{r.author}</div>
                <div className="text-[10px] tracking-[0.4em] uppercase text-[#a8814a] mt-2 font-italiana">
                  {r.city} · {r.product}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
