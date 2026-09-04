import { useEffect, useRef, useState } from "react";

// Drives the glass header: `isScrolled` once past `threshold` (adds the
// solid-ish backdrop/shadow), `isHidden` while scrolling down past
// `hideAfter` (slides the header away), and un-hides on any upward scroll or
// once back near the top — so the header never blocks content on a long
// scroll down but is always one swipe away.
export function useHeaderScroll(threshold = 40, hideAfter = 160) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > threshold);
      if (y < hideAfter) {
        setIsHidden(false);
      } else if (y > lastY.current) {
        setIsHidden(true);
      } else if (y < lastY.current) {
        setIsHidden(false);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, hideAfter]);

  return { isScrolled, isHidden };
}
