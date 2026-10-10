import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildSeo } from "@/lib/seo";
import { KEYWORD_PAGES } from "@/lib/keyword-pages";
import { SITE_CONFIG, whatsappLink } from "@/lib/site-config";

export const Route = createFileRoute("/solucoes/$slug")({
  loader: ({ params }) => {
    const page = KEYWORD_PAGES.find((p) => p.slug === params.slug);
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeo({ title: loaderData.title, description: loaderData.description, path: `/solucoes/${loaderData.slug}` })
      : {},
  component: KeywordPageView,
});

function KeywordPageView() {
  const p = Route.useLoaderData();
  const outras = KEYWORD_PAGES.filter((k) => k.slug !== p.slug);
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: p.h1, url: `/solucoes/${p.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: p.h1,
          serviceType: p.keyword,
          provider: { "@type": "LocalBusiness", name: SITE_CONFIG.name, telephone: SITE_CONFIG.contact.phoneE164, url: SITE_CONFIG.url },
          areaServed: { "@type": "City", name: "Curitiba" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{p.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{p.intro}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {p.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 rounded-lg border border-border bg-card p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {b}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappLink(`Olá! Vi a página de ${p.keyword} e quero um orçamento.`)} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            <MessageCircle className="h-5 w-5" /> Orçamento grátis no WhatsApp
          </a>
          <Link to="/orcamento" className="inline-flex items-center rounded-md border border-border px-5 py-3 font-semibold hover:bg-accent">
            Pedir orçamento pelo site
          </Link>
        </div>
        <h2 className="mt-14 font-display text-2xl font-bold">Perguntas frequentes sobre {p.keyword}</h2>
        <div className="mt-4 space-y-4">
          {p.faq.map((f) => (
            <div key={f.q} className="rounded-lg border border-border p-4">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-1 text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-14 font-display text-xl font-bold">Veja também</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {outras.map((o) => (
            <Link key={o.slug} to="/solucoes/$slug" params={{ slug: o.slug }} className="rounded-full border border-border px-3 py-1 text-sm hover:border-primary hover:text-primary">
              {o.h1}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
