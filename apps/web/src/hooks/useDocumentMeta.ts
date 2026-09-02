import { useEffect } from "react";

const DEFAULT_TITLE = "Movers Rwanda | Professional Moving & Relocation Services";

// Lightweight per-route <title>/description — no react-helmet-async, which
// doesn't yet support React 19's peer range. Restores the default on unmount
// so navigating away (e.g. back to the homepage) doesn't leave a stale title.
export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? null;
    if (description && meta) meta.setAttribute("content", description);

    return () => {
      document.title = previousTitle || DEFAULT_TITLE;
      if (previousDescription !== null && meta) meta.setAttribute("content", previousDescription);
    };
  }, [title, description]);
}
