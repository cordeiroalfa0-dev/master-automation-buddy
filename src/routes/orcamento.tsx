import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Star, Shield, Clock, Award, Phone } from "lucide-react";
import { MultiStepLeadForm } from "@/components/MultiStepLeadForm";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildSeo } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone } from "@/lib/analytics";

export const Route = createFileRoute("/orcamento")({
  head: () =>
    buildSeo({
      title: "Orçamento Grátis de Automação em Curitiba — Master Elétrica",
      description:
        "Solicite seu orçamento gratuito de automação residencial, predial ou industrial em Curitiba. Resposta em 2h. +500 projetos entregues.",
      path: "/orcamento",
      image: "/og-orcamento.jpg",
    }),
  component: QuotePage,
});

function QuotePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Orçamento", url: "/orcamento" },
      ])} />

      <section className="bg-gradient-hero py-12 text-white md:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-[1.1fr_1fr] md:px-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium">
              <Clock className="h-3.5 w-3.5 text-energy" /> Resposta em até 2h
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] text-balance md:text-5xl">
              Orçamento <span className="text-energy">100% grátis</span> e sem compromisso
            </h1>
            <p className="mt-4 text-white/80">
              Conte-nos sobre seu projeto e nossa equipe técnica retorna com proposta personalizada para automação residencial, predial ou industrial em Curitiba.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Visita técnica gratuita em Curitiba",
                "Projeto personalizado para seu espaço",
                "Equipe certificada e marcas top de mercado",
                "Garantia em todos os serviços",
                "+500 projetos entregues desde 2015",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-white/90">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-energy" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex text-energy">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" />
                ))}
              </div>
              <div className="text-sm">
                <strong>5.0</strong> · Avaliação dos clientes
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton source="orcamento_page">Prefere WhatsApp?</WhatsAppButton>
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                onClick={() => trackPhone("orcamento")}
                className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                <Phone className="h-4 w-4" /> {SITE_CONFIG.contact.phone}
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-6 text-foreground shadow-elegant md:p-8">
            <h2 className="font-display text-xl font-bold">Solicite seu orçamento</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Em 3 passos rápidos. Retornamos em até 2h.
            </p>
            <div className="mt-5">
              <MultiStepLeadForm source="orcamento_landing" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-surface py-12">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3 md:px-6">
          {[
            { icon: Award, t: "10+ anos", d: "de experiência em Curitiba" },
            { icon: Shield, t: "Garantia total", d: "em todos os serviços" },
            { icon: Clock, t: "Resposta em 2h", d: "em horário comercial" },
          ].map((c) => (
            <div key={c.t} className="flex gap-3 rounded-xl border bg-card p-5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display font-bold">{c.t}</div>
                <div className="text-xs text-muted-foreground">{c.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
