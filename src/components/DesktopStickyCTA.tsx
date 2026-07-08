import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, FileText, X } from "lucide-react";
import { whatsappLink } from "@/lib/site-config";
import { trackWhatsApp, trackCTA } from "@/lib/analytics";

/** CTA lateral flutuante (desktop) — aparece após 30% de scroll. */
export function DesktopStickyCTA() {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setShow(h > 0 && window.scrollY / h > 0.3);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (closed || !show) return null;

  return (
    <aside className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex">
      <button
        onClick={() => setClosed(true)}
        aria-label="Fechar"
        className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground"
      >
        <X className="h-3 w-3" />
      </button>
      <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/95 p-2 shadow-elegant backdrop-blur">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp("desktop_sticky")}
          aria-label="Fale conosco no WhatsApp"
          className="grid h-11 w-11 place-items-center rounded-xl bg-[#25D366] text-white shadow-sm transition-spring hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" fill="currentColor" />
        </a>
        <Link
          to="/orcamento"
          preload="intent"
          onClick={() => trackCTA("orcamento", "desktop_sticky")}
          aria-label="Solicitar orçamento"
          className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-energy text-energy-foreground shadow-energy transition-spring hover:scale-105"
        >
          <FileText className="h-5 w-5" />
        </Link>
      </div>
    </aside>
  );
}