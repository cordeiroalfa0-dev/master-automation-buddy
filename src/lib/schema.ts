import { SITE_CONFIG } from "./site-config";

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ElectricalContractor",
  name: SITE_CONFIG.name,
  image: `${SITE_CONFIG.url}/og-image.jpg`,
  "@id": SITE_CONFIG.url,
  url: SITE_CONFIG.url,
  telephone: SITE_CONFIG.contact.phoneE164,
  email: SITE_CONFIG.contact.email,
  priceRange: "$$",
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
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "12:00",
    },
  ],
  sameAs: [SITE_CONFIG.social.instagram, SITE_CONFIG.social.facebook],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "127",
  },
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
 * Schema de avaliação individual (Review) — usado em depoimentos.
 * Combinado com aggregateRating no LocalBusiness, melhora rich snippets.
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
