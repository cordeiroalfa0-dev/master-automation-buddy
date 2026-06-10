import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildSeo } from "@/lib/seo";
import { BAIRROS } from "@/lib/bairros";
import { SITE_CONFIG } from "@/lib/site-config";

export const Route = createFileRoute("/atendimento/")({
  head: () => ({
    ...buildSeo({
      title: "Áreas Atendidas em Curitiba — Master Automação",
      description:
        "Atendemos automação residencial, predial e industrial em todos os bairros de Curitiba: Batel, Ecoville, Champagnat, Bigorrilho, Água Verde, Cabral e mais.",
      path: "/atendimento",
    }),
  }),
  component: AtendimentoIndex,
});

function AtendimentoIndex() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Áreas Atendidas", url: "/atendimento" },
        ])}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <MapPin className="h-3.5 w-3.5" /> Curitiba e Região Metropolitana
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Automação em todos os bairros de Curitiba
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Equipe técnica própria atendendo {SITE_CONFIG.bairros.length}+ bairros da capital paranaense.
            Orçamento gratuito e visita técnica em até 24h.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BAIRROS.map((b) => (
            <Link
              key={b.slug}
              to="/atendimento/$bairro"
              params={{ bairro: b.slug }}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
            >
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold">Automação em {b.name}</h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Curitiba — PR</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}