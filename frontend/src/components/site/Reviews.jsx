import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchReviews } from "@/lib/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => { fetchReviews().then(setReviews).catch(() => {}); }, []);

  return (
    <section className="py-28 lg:py-40 bg-[#ede5d5] relative overflow-hidden" data-testid="bas-reviews">
      <div className="absolute inset-0 bas-grain opacity-20" />
      <div className="relative max-w-[1520px] mx-auto px-6 lg:px-14">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-7">
            <span className="h-px w-12 bg-[#a8814a]" />
            <span className="font-italiana text-[#a8814a] tracking-[0.4em] text-xs">CONCIERGE STIMMEN</span>
            <span className="h-px w-12 bg-[#a8814a]" />
          </div>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] text-[#1c1714] leading-[1.02] font-light mb-7">
            Worte unserer<br />
            <span className="italic text-[#a8814a]">Kundinnen.</span>
          </h2>
          <div className="flex items-center justify-center gap-3 text-[#1c1714]">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-[#a8814a] text-[#a8814a]" strokeWidth={0} />
              ))}
            </div>
            <span className="text-sm tracking-wider font-medium">4,9 / 5</span>
            <span className="text-xs text-[#6a5f55] tracking-[0.2em] uppercase">· über 1.840 verifizierte Kundinnen</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="bg-[#f5f0e8] p-9 lg:p-11 relative border border-[#ddd2bf]"
              data-testid={`bas-review-${i}`}
            >
              <div className="font-display text-7xl text-[#a8814a] leading-none mb-5 absolute top-6 right-7 opacity-30">"</div>
              <div className="flex gap-1 mb-6">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={j} size={12} className="fill-[#a8814a] text-[#a8814a]" strokeWidth={0} />
                ))}
              </div>
              <h4 className="font-display text-xl text-[#1c1714] mb-4 font-medium leading-snug">{r.title}</h4>
              <blockquote className="text-[#4a3f37] text-[14px] leading-[1.85] font-light mb-7 italic">
                "{r.text}"
              </blockquote>
              <figcaption className="border-t border-[#ddd2bf] pt-5">
                <div className="text-[#1c1714] text-sm font-medium">{r.author}</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#a8814a] mt-1">
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
