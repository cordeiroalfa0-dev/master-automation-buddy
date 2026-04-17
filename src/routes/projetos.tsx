import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/projetos")({
  head: () =>
    buildSeo({
      title: "Projetos de Automação em Curitiba — Portfólio Master Elétrica",
      description:
        "Veja nossos projetos entregues em Batel, Ecoville, Champagnat, CIC, Bigorrilho e outros bairros de Curitiba. Automação residencial, predial e industrial.",
      path: "/projetos",
      image: "/og-projetos.jpg",
    }),
  component: ProjectsPage,
});

const PROJECTS = [
  { tag: "Residencial", local: "Batel, Curitiba", title: "Cobertura Smart Home", desc: "Automação completa: iluminação cênica, áudio multi-room, climatização e cortinas motorizadas controladas por app e voz." },
  { tag: "Predial", local: "Ecoville, Curitiba", title: "Edifício Residencial Premium", desc: "Iluminação inteligente da fachada, controle de acesso veicular automatizado e gestão de áreas comuns." },
  { tag: "Industrial", local: "CIC, Curitiba", title: "Indústria Metalúrgica", desc: "Programação de CLPs Siemens, painéis de comando e supervisão SCADA da linha de produção." },
  { tag: "Residencial", local: "Champagnat, Curitiba", title: "Home Theater Premium", desc: "Sala de cinema com automação total: cortinas blackout, projeção 4K, áudio 7.1 e iluminação cênica programável." },
  { tag: "Segurança", local: "Água Verde, Curitiba", title: "Condomínio Vertical", desc: "CFTV com 64 câmeras IP, alarme perimetral, controle de acesso biométrico e portaria remota 24h." },
  { tag: "Predial", local: "Centro Cívico, Curitiba", title: "Edifício Corporativo", desc: "Catracas com biometria facial, iluminação automatizada e integração com sistema de gestão predial." },
  { tag: "Residencial", local: "Bigorrilho, Curitiba", title: "Cozinha Inteligente", desc: "Iluminação sob bancada, controle por voz, eletrodomésticos integrados e cenas personalizadas." },
  { tag: "Comercial", local: "Juvevê, Curitiba", title: "Restaurante Boutique", desc: "Cenas de iluminação por horário, controle de climatização e som ambiente integrado." },
  { tag: "Residencial", local: "Cabral, Curitiba", title: "Residência de Alto Padrão", desc: "Domótica completa com sensores de presença, automação de portões e integração com assistente virtual." },
  { tag: "Predial", local: "Centro, Curitiba", title: "Shopping Comercial", desc: "Sistema integrado de iluminação, ar-condicionado e segurança eletrônica para múltiplas lojas." },
  { tag: "Industrial", local: "Boqueirão, Curitiba", title: "Galpão Logístico", desc: "Painéis de força, automação de portões industriais e sistema de monitoramento energético." },
];

function ProjectsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Projetos", url: "/projetos" },
      ])} />

      <section className="bg-gradient-hero py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-energy">Portfólio</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-balance md:text-6xl">
            Obras Entregues em Curitiba
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Projetos executados com excelência nos principais bairros de Curitiba e região metropolitana.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <article key={p.title} className="group overflow-hidden rounded-2xl border bg-card transition-smooth hover:-translate-y-1 hover:shadow-elegant">
              <div className="aspect-[4/3] overflow-hidden bg-gradient-primary">
                <div className="flex h-full items-center justify-center text-primary-foreground/40 font-display text-6xl font-bold">
                  {p.title.charAt(0)}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{p.tag}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {p.local}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <WhatsAppButton message="Olá! Gostaria de ver mais projetos da Master Elétrica." source="projetos">
            Solicitar projeto personalizado
          </WhatsAppButton>
        </div>
      </section>
    </>
  );
}
