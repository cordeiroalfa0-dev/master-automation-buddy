/**
 * Helpers para enviar eventos para todas as plataformas de tracking ao mesmo tempo.
 * GTM dataLayer é a fonte unificada — você configura tags GA4/Meta/Ads dentro do GTM.
 * Também envia diretamente para gtag/fbq quando carregados (fallback / GTM-less).
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  }
}

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const enrichedParams = { ...getAttributionContext(), ...params };

  // GTM dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...enrichedParams });

  // GA4 direto
  window.gtag?.("event", event, enrichedParams);

  // Meta Pixel (mapeia eventos comuns)
  if (window.fbq) {
    if (event === "lead_submitted" || event === "form_submit") {
      window.fbq("track", "Lead", enrichedParams);
    } else if (event === "whatsapp_click" || event === "phone_click") {
      window.fbq("track", "Contact", enrichedParams);
    } else if (event === "cta_click") {
      window.fbq("trackCustom", "CTAClick", enrichedParams);
    } else if (event === "social_click") {
      window.fbq("trackCustom", "SocialClick", enrichedParams);
    }
  }

  // TikTok
  if (window.ttq) {
    if (event === "lead_submitted") window.ttq.track("SubmitForm", enrichedParams);
    else if (event === "whatsapp_click" || event === "phone_click")
      window.ttq.track("Contact", enrichedParams);
  }
}

function getAttributionContext(): Record<string, unknown> {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem("me_utm_attribution");
    const attribution = raw ? JSON.parse(raw) : {};
    return {
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
      utm_term: attribution.utm_term,
      gclid: attribution.gclid,
      fbclid: attribution.fbclid,
      ttclid: attribution.ttclid,
      landing_page: attribution.pagina_origem,
      referrer: attribution.referrer || document.referrer || undefined,
    };
  } catch {
    return { referrer: document.referrer || undefined };
  }
}

export function trackPageView(path: string) {
  trackEvent("page_view", {
    page_path: path,
    page_title: typeof document !== "undefined" ? document.title : undefined,
    ...getAttributionContext(),
  });
}

export function trackWhatsApp(source: string) {
  trackEvent("whatsapp_click", { source });
}

export function trackPhone(source: string) {
  trackEvent("phone_click", { source });
}

export function trackCTA(label: string, location: string) {
  trackEvent("cta_click", { label, location });
}

/** Clique em ícone/botão de Instagram ou Facebook — mede quanto tráfego migra pro social. */
export function trackSocialClick(network: "instagram" | "facebook", source: string) {
  trackEvent("social_click", { network, source });
}

export function trackLead(servico?: string, source = "form") {
  trackEvent("lead_submitted", {
    servico,
    source,
    value: 1,
    currency: "BRL",
    ...getAttributionContext(),
  });
}
