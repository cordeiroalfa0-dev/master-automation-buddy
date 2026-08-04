import { Phone, Clock, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone } from "@/lib/analytics";
import { OpenStatus } from "@/components/OpenStatus";

/**
 * Barra superior informativa — reforça credibilidade local e canal direto.
 * Esconde em telas pequenas para não competir com o header principal.
 */
export function TopBar() {
  return (
    <div className="hidden border-b border-white/10 bg-[oklch(0.14_0.04_252)] text-white/85 lg:block">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-energy" />
            {SITE_CONFIG.contact.address}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-energy" />
            {SITE_CONFIG.contact.hours}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <OpenStatus className="border-white/20 bg-white/10 text-white" />
          <a
            href={`tel:${SITE_CONFIG.contact.phoneE164}`}
            onClick={() => trackPhone("topbar")}
            className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-energy"
          >
            <Phone className="h-3.5 w-3.5" />
            {SITE_CONFIG.contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
