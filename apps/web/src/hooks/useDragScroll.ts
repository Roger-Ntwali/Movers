import { useEffect, useRef } from "react";

// Click-and-drag horizontal scroll for the reviews track, ported from the
// original mousedown/mousemove listeners in js/script.js.
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const track = ref.current;
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      track.style.cursor = "grabbing";
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const stop = () => {
      isDown = false;
      track.style.cursor = "grab";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.4;
    };

    track.addEventListener("mousedown", onMouseDown);
    track.addEventListener("mouseleave", stop);
    track.addEventListener("mouseup", stop);
    track.addEventListener("mousemove", onMouseMove);
    return () => {
      track.removeEventListener("mousedown", onMouseDown);
      track.removeEventListener("mouseleave", stop);
      track.removeEventListener("mouseup", stop);
      track.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return ref;
}
