// Cloudinary serves the exact file uploaded unless asked to transform it.
// Inserting f_auto,q_auto right after "/upload/" asks it to pick the best
// format for the visitor's browser (WebP/AVIF where supported) and an
// automatically-tuned quality/compression level — same image, meaningfully
// smaller download, no re-upload or extra tooling required. Non-Cloudinary
// URLs (or already-transformed ones) pass through untouched.
export function optimizeCloudinaryUrl(url: string, extra = "w_1200"): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (/\/upload\/[^/]*f_auto/.test(url)) return url; // already transformed
  return url.replace("/upload/", `/upload/f_auto,q_auto,${extra}/`);
}

// Cloudinary encodes the resource type in the URL path itself
// (".../video/upload/..." vs ".../image/upload/..."), so a single settings
// field that can hold either (like the hero background) can tell them
// apart without a separate stored flag.
export function isCloudinaryVideoUrl(url: string): boolean {
  return url.includes("/video/upload/");
}
