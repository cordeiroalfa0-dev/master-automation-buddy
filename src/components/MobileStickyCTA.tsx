import { Phone, MessageCircle, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { whatsappLink, SITE_CONFIG } from "@/lib/site-config";
import { trackWhatsApp, trackPhone, trackCTA } from "@/lib/analytics";

/**
 * Barra fixa de ação rápida no rodapé — só mobile.
 * Aumenta drasticamente a conversão de tráfego pago (Meta/Google Ads),
 * com 3 caminhos de contato sempre visíveis: Ligar, WhatsApp e Orçamento.
 */
export function MobileStickyCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1 p-2">
        <a
          href={`tel:${SITE_CONFIG.contact.phoneE164}`}
          onClick={() => trackPhone("mobile_sticky")}
          className="flex flex-col items-center justify-center gap-0.5 rounded-md py-2 text-[11px] font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <Phone className="h-5 w-5 text-primary" />
          Ligar
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp("mobile_sticky")}
          className="flex flex-col items-center justify-center gap-0.5 rounded-md bg-[#25D366] py-2 text-[11px] font-semibold text-white shadow-elegant"
        >
          <MessageCircle className="h-5 w-5" fill="currentColor" />
          WhatsApp
        </a>
        <Link
          to="/orcamento"
          onClick={() => trackCTA("orcamento", "mobile_sticky")}
          className="flex flex-col items-center justify-center gap-0.5 rounded-md bg-gradient-energy py-2 text-[11px] font-bold text-energy-foreground shadow-energy"
        >
          <FileText className="h-5 w-5" />
          Orçamento
        </Link>
      </div>
    </div>
  );
}