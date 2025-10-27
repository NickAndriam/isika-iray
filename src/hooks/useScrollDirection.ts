import { useEffect, useRef, useState } from "react";

export type ScrollDirection = "up" | "down";

export default function useScrollDirection(threshold = 10) {
  const [direction, setDirection] = useState<ScrollDirection>("up");
  const lastY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const ticking = useRef(false);

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) < threshold) {
        ticking.current = false;
        return;
      }
      setDirection(y > lastY.current ? "down" : "up");
      lastY.current = y > 0 ? y : 0;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(handle);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}
