import { Navigation, Phone, Star, MapPin, Download, ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { directionsUrl, mapEmbedUrl, mapsProfileUrl, reviewUrl, buildVCard } from "@/lib/gmb";
import { BUSINESS_HOURS, DAY_LABELS, formatDay, nowInCuritiba } from "@/lib/business-hours";
import { OpenStatus } from "@/components/OpenStatus";
import { trackCTA, trackPhone } from "@/lib/analytics";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function saveContact() {
  const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "abael-automacao.vcf";
  a.click();
  URL.revokeObjectURL(url);
  trackCTA("salvar_contato", "google_business");
}

/**
 * Bloco "Encontre-nos no Google" — NAP consistente com o Google Meu Negócio,
 * mapa, rota, horários em tempo real e chamada para avaliação.
 */
export function GoogleBusinessCard({ className }: { className?: string }) {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(nowInCuritiba().day), []);

  return (
    <div className={cn("overflow-hidden rounded-2xl border bg-card shadow-card", className)}>
      <div className="grid md:grid-cols-2">
        {/* Mapa */}
        <div className="relative min-h-[260px] bg-muted">
          <iframe
            title={`Localização da ${SITE_CONFIG.name} em Curitiba no Google Maps`}
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>

        {/* Informações */}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-xl font-bold">Encontre-nos no Google</h2>
            <OpenStatus />
          </div>

          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">{SITE_CONFIG.name}</strong>
                <br />
                {SITE_CONFIG.contact.address}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                onClick={() => trackPhone("google_business")}
                className="font-medium text-foreground hover:text-primary"
              >
                {SITE_CONFIG.contact.phone}
              </a>
            </li>
          </ul>

          {/* Horários — mesma informação da ficha do Google */}
          <details className="mt-4 rounded-lg border bg-background p-3 text-sm">
            <summary className="cursor-pointer font-medium text-foreground">
              Horário de funcionamento
            </summary>
            <ul className="mt-3 space-y-1.5">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                <li
                  key={d}
                  className={cn(
                    "flex justify-between gap-4",
                    today === d ? "font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span>{DAY_LABELS[d]}</span>
                  <span>{BUSINESS_HOURS[d] ? formatDay(d) : "Fechado"}</span>
                </li>
              ))}
            </ul>
          </details>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackCTA("como_chegar", "google_business")}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-spring hover:opacity-90"
            >
              <Navigation className="h-4 w-4" /> Como chegar
            </a>
            <a
              href={reviewUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackCTA("avaliar_google", "google_business")}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/30 bg-background px-4 py-2.5 text-sm font-semibold text-primary transition-spring hover:bg-primary/5"
            >
              <Star className="h-4 w-4" /> Avaliar no Google
            </a>
            <button
              type="button"
              onClick={saveContact}
              className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Download className="h-4 w-4" /> Salvar contato
            </button>
            <a
              href={mapsProfileUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackCTA("ver_no_maps", "google_business")}
              className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" /> Ver no Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
