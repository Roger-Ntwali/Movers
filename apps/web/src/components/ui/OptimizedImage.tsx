import { useState, type ImgHTMLAttributes } from "react";
import { optimizeCloudinaryUrl } from "../../lib/cloudinaryUrl";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  width?: number;
}

// Shimmer placeholder shown until the (Cloudinary-optimized) image actually
// loads, then a quick fade-in — avoids the page popping images in with a
// blank/broken flash while they download.
export function OptimizedImage({ src, width = 800, className = "", loading = "lazy", ...rest }: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={optimizeCloudinaryUrl(src, `w_${width}`)}
      loading={loading}
      className={`optimized-img${loaded ? " is-loaded" : ""}${className ? ` ${className}` : ""}`}
      onLoad={() => setLoaded(true)}
      {...rest}
    />
  );
}
