import { SITE_CONFIG } from "./site-config";
import { mapsProfileUrl } from "./gmb";
import { BUSINESS_HOURS } from "./business-hours";

const DAY_SCHEMA = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const pad = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ElectricalContractor",
  additionalType: [
    "https://schema.org/HomeAndConstructionBusiness",
    "https://schema.org/SecuritySystemInstallation",
  ],
  name: SITE_CONFIG.name,
  legalName: SITE_CONFIG.name,
  slogan: SITE_CONFIG.tagline,
  description: SITE_CONFIG.description,
  image: `${SITE_CONFIG.url}/og-image.jpg`,
  logo: `${SITE_CONFIG.url}/favicon.ico`,
  "@id": SITE_CONFIG.url,
  url: SITE_CONFIG.url,
  telephone: SITE_CONFIG.contact.phoneE164,
  email: SITE_CONFIG.contact.email,
  priceRange: "$$",
  currenciesAccepted: "BRL",
  paymentAccepted: "Dinheiro, PIX, Cartão de crédito, Cartão de débito, Transferência",
  hasMap: mapsProfileUrl,
  knowsAbout: [
    "Automação residencial",
    "Casa inteligente",
    "Automação predial",
    "Automação industrial",
    "CFTV e segurança eletrônica",
    "Iluminação inteligente",
    "Controle de acesso",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.contact.phoneE164,
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: ["Portuguese"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Curitiba",
    addressRegion: "PR",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -25.4284,
    longitude: -49.2733,
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços de Automação",
    itemListElement: SITE_CONFIG.services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        url: `${SITE_CONFIG.url}/servicos/${s.slug}`,
      },
    })),
  },
  areaServed: [
    { "@type": "City", name: "Curitiba" },
    ...SITE_CONFIG.bairros.map((b) => ({
      "@type": "Place",
      name: `${b}, Curitiba`,
    })),
  ],
  // Gerado a partir de BUSINESS_HOURS — mesma fonte do badge "Aberto agora".
  // Mantenha idêntico ao horário publicado no Google Meu Negócio.
  openingHoursSpecification: Object.entries(BUSINESS_HOURS)
    .filter(([, h]) => h)
    .map(([day, h]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_SCHEMA[Number(day)],
      opens: pad(h!.open),
      closes: pad(h!.close),
    })),
  sameAs: [
    SITE_CONFIG.social.instagram,
    SITE_CONFIG.social.facebook,
    mapsProfileUrl,
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  inLanguage: "pt-BR",
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_CONFIG.url}/servicos?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    provider: {
      "@type": "ElectricalContractor",
      name: SITE_CONFIG.name,
      telephone: SITE_CONFIG.contact.phoneE164,
    },
    areaServed: [
      { "@type": "City", name: "Curitiba" },
      ...SITE_CONFIG.bairros.map((b) => ({ "@type": "Place", name: `${b}, Curitiba` })),
    ],
    url: `${SITE_CONFIG.url}/servicos/${opts.slug}`,
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * Schema de avaliação individual (Review) — NÃO USAR para depoimentos no próprio site.
 * Desde 2019 o Google não exibe rich snippet de estrelas para reviews "self-serving"
 * (quando a entidade avaliada — LocalBusiness/Organization — controla os próprios
 * depoimentos, como testemunhos no seu site). Isso não gera penalização, mas também
 * não gera nenhum benefício — é markup morto e pode ser sinalizado como não-conforme.
 * Fonte: https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful
 * Só use esta função se as avaliações vierem de uma fonte de terceiros verificável
 * (ex.: import real do Google Meu Negócio) e estiverem visíveis na própria página.
 */
export function reviewSchema(items: Array<{ author: string; rating: number; text: string; date?: string }>) {
  return items.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "LocalBusiness",
      name: SITE_CONFIG.name,
    },
    author: { "@type": "Person", name: r.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.rating),
      bestRating: "5",
    },
    reviewBody: r.text,
    ...(r.date ? { datePublished: r.date } : {}),
  }));
}

/** HowTo schema — passos do processo para rich snippets no Google. */
export function howToSchema(opts: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** Article schema — usado em posts de blog. */
export function articleSchema(opts: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  author?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.datePublished,
    author: { "@type": "Organization", name: opts.author || SITE_CONFIG.name },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/favicon.ico` },
    },
    mainEntityOfPage: `${SITE_CONFIG.url}/blog/${opts.slug}`,
    ...(opts.image ? { image: opts.image } : {}),
  };
}
