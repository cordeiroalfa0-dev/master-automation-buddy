import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Scrolls to top on every route navigation.
 * Respects in-page hash anchors (#section) and prefers-reduced-motion.
 */
export function ScrollToTop() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    if (hash) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
  }, [pathname, hash]);

  return null;
}