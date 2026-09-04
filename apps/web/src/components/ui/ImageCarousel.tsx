import { useEffect, useState } from "react";
import { optimizeCloudinaryUrl } from "../../lib/cloudinaryUrl";

interface ImageCarouselProps {
  images: string[];
  intervalMs?: number;
  className?: string;
}

// Auto-advancing crossfade carousel used behind the service cards. With one
// image (or none) it just renders a static background — no timers, no
// pointless re-renders.
export function ImageCarousel({ images, intervalMs = 4000, className = "" }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className={`image-carousel ${className}`.trim()}>
      {images.map((src, i) => (
        <img
          key={src}
          src={optimizeCloudinaryUrl(src, "w_600")}
          alt=""
          className={`image-carousel-slide${i === index ? " is-active" : ""}`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
    </div>
  );
}
