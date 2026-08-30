/**
 * Configurações estáticas do site Abael Automação.
 * IDs de tracking dinâmicos vêm de site_settings (DB).
 */
export const SITE_CONFIG = {
  name: "Abael Automação",
  shortName: "Abael Automação",
  tagline: "Automação que transforma seu espaço",
  description:
    "Soluções completas em automação residencial, predial e industrial em Curitiba e região metropolitana. Mais de 500 projetos entregues.",
  url: "https://abaelautomação.com.br",
  locale: "pt-BR",
  region: "Curitiba, PR",

  contact: {
    phone: "(41) 99753-9084",
    phoneE164: "+5541997539084",
    whatsappNumber: "5541997539084",
    email: "contato@masterautomacao.com.br",
    address: "Curitiba e Região Metropolitana - PR",
    hours: "Seg a Sex: 8h às 18h | Sáb: 8h às 12h",
  },

  social: {
    instagram: "https://instagram.com/masterautomacao",
    facebook: "https://facebook.com/masterautomacao",
  },

  /**
   * Google Meu Negócio (Google Business Profile).
   * Preencha placeId/cid depois de criar/reivindicar o perfil — os links de
   * rota, mapa e avaliação passam a apontar direto para a ficha da empresa.
   * Como achar o Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
   */
  googleBusiness: {
    placeId: "" as string,
    /** Nome + cidade usados na busca do Maps enquanto não há Place ID. */
    mapQuery: "Abael Automação, Curitiba, PR",
    /** Perfil público no Maps (opcional). */
    profileUrl: "" as string,
  },

  bairros: [
    "Batel", "Ecoville", "Champagnat", "Bigorrilho", "Água Verde",
    "Cabral", "Juvevê", "Centro Cívico", "Mercês", "Alto da XV",
    "CIC", "Centro", "Boqueirão",
  ],

  services: [
    { slug: "automacao-residencial", title: "Automação Residencial" },
    { slug: "automacao-predial", title: "Automação Predial" },
    { slug: "automacao-industrial", title: "Automação Industrial" },
    { slug: "seguranca-eletronica", title: "Segurança Eletrônica" },
  ],
} as const;

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message || "Olá! Gostaria de solicitar um orçamento.",
  );
  return `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${text}`;
}
