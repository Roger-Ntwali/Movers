import { useEffect, useState } from "react";
import { Reveal } from "../ui/Reveal";
import { CloseIcon } from "../ui/icons";
import { OptimizedImage } from "../ui/OptimizedImage";
import { useApiData } from "../../hooks/useApiData";
import type { GalleryImage } from "../../types";

export function Gallery() {
  const { data: images, loading } = useApiData<GalleryImage[]>("/api/gallery", []);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null ? images[openIndex] : null;

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="section section--light">
      <div className="container">
        <Reveal className="section-head center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>
            Gallery
          </span>
          <h2>See Movers Rwanda In Action</h2>
        </Reveal>

        {images.length === 0 ? (
          !loading && (
            <Reveal>
              <p className="review-empty">Photos from recent moves are coming soon.</p>
            </Reveal>
          )
        ) : (
          <div className="gallery-grid reveal-stagger">
            {images.map((img, i) => (
              <Reveal
                as="button"
                type="button"
                className="gallery-item"
                key={img.id}
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => setOpenIndex(i)}
              >
                <div className="ph">
                  <OptimizedImage src={img.imageUrl} width={400} alt={img.altText ?? img.caption ?? ""} />
                  {img.caption && <span className="cap">{img.caption}</span>}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <div className={`lightbox${open ? " is-open" : ""}`}>
        <button className="lightbox-close" aria-label="Close image" onClick={() => setOpenIndex(null)}>
          <CloseIcon />
        </button>
        {open && (
          <div className="lightbox-inner">
            <div className="ph">
              <OptimizedImage src={open.imageUrl} width={1000} loading="eager" alt={open.altText ?? open.caption ?? ""} />
              {open.caption && <span className="cap">{open.caption}</span>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
