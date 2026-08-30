import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight } from "lucide-react";
import { buildSeo } from "@/lib/seo";
import { BAIRROS } from "@/lib/bairros";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const Route = createFileRoute("/bairros")({
  head: () =>
    buildSeo({
      title: "Automação em Curitiba por bairro — Abael Automação",
      description:
        "Atendemos mais de 30 bairros de Curitiba: Batel, Ecoville, Champagnat, Bigorrilho, Água Verde, Cabral, Juvevê, CIC e outros. Encontre seu bairro.",
      path: "/bairros",
    }),
  component: BairrosPage,
});

function BairrosPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Bairros atendidos", url: "/bairros" },
      ])} />

      <section className="bg-gradient-hero py-16 text-white md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur">
            <MapPin className="h-3 w-3" /> Cobertura
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-balance md:text-5xl">
            Automação em cada bairro de Curitiba
          </h1>
          <p className="mt-4 text-white/80 text-pretty">
            Equipe técnica local com visita gratuita em toda capital paranaense e região metropolitana.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BAIRROS.map((b) => (
            <Link
              key={b.slug}
              to="/atendimento/$bairro"
              params={{ bairro: b.slug }}
              className="group flex items-center justify-between rounded-2xl border bg-card p-5 shadow-card transition-spring hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <MapPin className="h-3 w-3" /> Curitiba · PR
                </div>
                <div className="mt-1 font-display text-lg font-bold">Automação em {b.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Visita técnica gratuita · Orçamento em 2h
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}