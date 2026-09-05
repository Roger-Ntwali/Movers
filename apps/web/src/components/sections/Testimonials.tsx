import { Reveal } from "../ui/Reveal";
import { useApiData } from "../../hooks/useApiData";
import { useDragScroll } from "../../hooks/useDragScroll";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import type { Testimonial } from "../../types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const { data: testimonials, loading } = useApiData<Testimonial[]>("/api/testimonials", []);
  const settings = useSiteSettings();
  const trackRef = useDragScroll<HTMLDivElement>();

  return (
    <section className="section">
      <div className="container">
        <Reveal className="reviews-head">
          <div>
            <span className="eyebrow">Testimonials</span>
            <h2 style={{ marginTop: 14, fontSize: "clamp(1.9rem,3.6vw,2.8rem)" }}>
              What Our Customers Say
            </h2>
            <p style={{ color: "var(--muted)", marginTop: 14 }}>
              Real experiences from people we&rsquo;ve helped move.
            </p>
          </div>
          <a
            href={`mailto:${settings.email}?subject=${encodeURIComponent("Movers Rwanda Review")}`}
            className="btn btn-outline on-light"
          >
            Leave A Review
          </a>
        </Reveal>
      </div>

      <div className="container">
        {testimonials.length === 0 ? (
          !loading && (
            <Reveal>
              <p className="review-empty">
                We&rsquo;re just getting started collecting reviews &mdash; check back soon, or be
                the first to share your experience above.
              </p>
            </Reveal>
          )
        ) : (
          <div className="reviews-track-wrap">
            <div className="reviews-track reveal-stagger" ref={trackRef}>
              {testimonials.map((t, i) => (
                <Reveal className="review-card" key={t.id} style={{ "--i": i } as React.CSSProperties}>
                  {t.rating && <div className="stars">{"★".repeat(t.rating)}</div>}
                  <p className="quote-text font-accent">{t.quote}</p>
                  <div className="review-meta">
                    <div className="review-avatar">{initials(t.authorName)}</div>
                    <div>
                      <strong>{t.authorName}</strong>
                      {t.authorRoleOrLocation && <span>{t.authorRoleOrLocation}</span>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
