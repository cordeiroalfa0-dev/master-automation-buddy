import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      type="button"
      aria-label="Voltar ao topo"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className="fixed bottom-24 right-6 z-40 hidden h-11 w-11 place-items-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-elegant backdrop-blur transition-spring hover:scale-110 hover:bg-primary hover:text-primary-foreground md:grid"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}