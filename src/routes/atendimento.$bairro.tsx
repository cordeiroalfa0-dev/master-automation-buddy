import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { buildSeo } from "@/lib/seo";
import { SITE_CONFIG, whatsappLink } from "@/lib/site-config";
import { trackPhone } from "@/lib/analytics";
import { BAIRROS, findBairro } from "@/lib/bairros";

export const Route = createFileRoute("/atendimento/$bairro")({
  loader: ({ params }) => {
    const bairro = findBairro(params.bairro);
    if (!bairro) throw notFound();
    return { bairro };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.bairro.name ?? "Curitiba";
    return buildSeo({
      title: `Automação Residencial e Predial em ${name}, Curitiba — Abael Automação`,
      description: `Automação residencial, predial e segurança eletrônica em ${name}, Curitiba. Equipe local, orçamento grátis em 2h e atendimento em até 24h. +500 projetos entregues no Paraná.`,
      path: `/atendimento/${loaderData?.bairro.slug ?? ""}`,
    });
  },
  component: BairroPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Bairro não encontrado</h1>
      <p className="mt-2 text-muted-foreground">Atendemos toda Curitiba — veja a lista completa.</p>
      <Link to="/atendimento" className="mt-6 inline-flex text-primary underline">Ver áreas atendidas</Link>
    </div>
  ),
});

function BairroPage() {
  const { bairro } = Route.useLoaderData();
  const faq = [
    {
      question: `Vocês atendem automação em ${bairro.name}?`,
      answer: `Sim. ${SITE_CONFIG.name} atende ${bairro.name} e toda Curitiba com equipe técnica própria, orçamento gratuito e visita em até 24h.`,
    },
    {
      question: `Quanto custa automatizar um imóvel em ${bairro.name}?`,
      answer: `Projetos residenciais em ${bairro.name} partem de R$ 8.000 para apartamentos compactos e podem chegar a R$ 100.000+ em residências de alto padrão. Solicite um orçamento gratuito personalizado.`,
    },
    {
      question: `Qual o prazo de execução em ${bairro.name}?`,
      answer: `Projetos compactos: 5–10 dias. Projetos completos: 15–30 dias. Atendimento emergencial em até 24h em ${bairro.name}.`,
    },
  ];

  const outrosBairros = BAIRROS.filter((b) => b.slug !== bairro.slug).slice(0, 8);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Áreas Atendidas", url: "/atendimento" },
          { name: bairro.name, url: `/atendimento/${bairro.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(faq)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Automação em ${bairro.name}, Curitiba`,
          provider: {
            "@type": "ElectricalContractor",
            name: SITE_CONFIG.name,
            telephone: SITE_CONFIG.contact.phoneE164,
          },
          areaServed: {
            "@type": "Place",
            name: `${bairro.name}, Curitiba, PR`,
          },
          url: `${SITE_CONFIG.url}/atendimento/${bairro.slug}`,
        }}
      />

      <section className="bg-gradient-hero text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-energy" /> {bairro.name} · Curitiba — PR
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
            Automação Residencial e Predial em {bairro.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Especialistas em automação para casas, apartamentos e condomínios de {bairro.name}.
            Iluminação, cortinas, climatização, CFTV e controle de acesso — orçamento gratuito em até 2h.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-energy font-semibold text-energy-foreground">
              <Link to="/orcamento">Solicitar Orçamento em {bairro.name} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <WhatsAppButton message={`Olá! Quero um orçamento de automação em ${bairro.name}.`} />
            <a
              href={`tel:${SITE_CONFIG.contact.phoneE164}`}
              onClick={() => trackPhone("bairro_hero")}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-white/30 px-5 text-sm font-semibold backdrop-blur hover:bg-white/10"
            >
              <Phone className="h-4 w-4" /> {SITE_CONFIG.contact.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-bold">
              Serviços de automação em {bairro.name}
            </h2>
            <p className="mt-4 text-muted-foreground">
              Atuamos em residências, coberturas e edifícios de {bairro.name} com soluções
              completas de automação. Conheça nossos principais serviços:
            </p>
            <ul className="mt-6 space-y-3">
              {[
                `Automação residencial em ${bairro.name} (iluminação, áudio, cortinas)`,
                `Climatização inteligente em ${bairro.name}`,
                `CFTV IP e segurança eletrônica em ${bairro.name}`,
                `Controle de acesso para condomínios de ${bairro.name}`,
                `Quadros elétricos e infraestrutura técnica`,
                `Integração com Alexa, Google Home e Apple HomeKit`,
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-2xl font-bold">
              Perguntas frequentes — {bairro.name}
            </h2>
            <div className="mt-4 space-y-4">
              {faq.map((f) => (
                <div key={f.question} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold">{f.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 font-display text-2xl font-bold">Outros bairros que atendemos</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {outrosBairros.map((b) => (
                <Link
                  key={b.slug}
                  to="/atendimento/$bairro"
                  params={{ bairro: b.slug }}
                  className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary"
                >
                  Automação em {b.name}
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <LeadForm
              defaultServico={`Automação em ${bairro.name}`}
              source={`bairro_${bairro.slug}`}
            />
          </aside>
        </div>
      </section>
    </>
  );
}