import { api } from "./api";

interface SignedUpload {
  timestamp: number;
  folder: string;
  signature: string;
  apiKey: string;
  cloudName: string;
}

type UploadFolder = "gallery" | "services" | "blog" | "site";

// Uploads a file straight from the browser to Cloudinary using a signature
// minted by our API (POST /api/uploads/sign) — the Cloudinary API secret
// never leaves the server, only the short-lived signature does. Cloudinary's
// signature only covers timestamp/folder (not resource_type or the file
// itself), so the same signed payload works for both endpoints below.
async function uploadMedia(
  file: File,
  folder: UploadFolder,
  resourceType: "image" | "video",
): Promise<string> {
  const signed = await api.post<SignedUpload>("/api/uploads/sign", { folder });

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signed.apiKey);
  form.append("timestamp", String(signed.timestamp));
  form.append("signature", signed.signature);
  form.append("folder", signed.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `${resourceType === "video" ? "Video" : "Image"} upload failed`);
  }

  const data = await res.json();
  return data.secure_url as string;
}

export function uploadImage(file: File, folder: UploadFolder): Promise<string> {
  return uploadMedia(file, folder, "image");
}

export function uploadVideo(file: File, folder: UploadFolder): Promise<string> {
  return uploadMedia(file, folder, "video");
}

// For fields that accept either (the hero background) — infers resource
// type from the file the browser gave us instead of needing a separate
// image/video field pair.
export function uploadAnyMedia(file: File, folder: UploadFolder): Promise<string> {
  return uploadMedia(file, folder, file.type.startsWith("video/") ? "video" : "image");
}
