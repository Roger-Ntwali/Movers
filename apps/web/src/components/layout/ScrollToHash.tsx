import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Homepage sections are anchor links (#services, #faq, ...). When arriving
// from a different route (e.g. /blog -> /#faq), the browser can't scroll to
// an id that didn't exist yet at navigation time, so do it after render.
export function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      if (pathname === "/") window.scrollTo({ top: 0 });
      return;
    }
    const id = hash.slice(1);
    const target = document.getElementById(id);
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, [hash, pathname]);

  return null;
}
