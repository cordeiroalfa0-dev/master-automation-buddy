import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  MapPin,
  Home,
  Building2,
  Factory,
  ShieldCheck,
  Store,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildSeo } from "@/lib/seo";
import imgCobertura from "@/assets/projetos/cobertura-smart.jpg";
import imgEdificio from "@/assets/projetos/edificio-residencial.jpg";
import imgIndustria from "@/assets/projetos/industria-metalurgica.jpg";
import imgHomeTheater from "@/assets/projetos/home-theater.jpg";
import imgCftv from "@/assets/projetos/condominio-cftv.jpg";
import imgCorporativo from "@/assets/projetos/edificio-corporativo.jpg";
import imgCozinha from "@/assets/projetos/cozinha-inteligente.jpg";
import imgRestaurante from "@/assets/projetos/restaurante-boutique.jpg";
import imgResidencia from "@/assets/projetos/residencia-alto-padrao.jpg";
import imgShopping from "@/assets/projetos/shopping-comercial.jpg";
import imgGalpao from "@/assets/projetos/galpao-logistico.jpg";

export const Route = createFileRoute("/projetos")({
  head: () =>
    buildSeo({
      title: "Projetos de Automação em Curitiba — Portfólio Master Automação",
      description:
        "Veja nossos projetos entregues em Batel, Ecoville, Champagnat, CIC, Bigorrilho e outros bairros de Curitiba. Automação residencial, predial e industrial.",
      path: "/projetos",
      image: "/og-projetos.jpg",
    }),
  component: ProjectsPage,
});

const PROJECTS = [
  { tag: "Residencial", local: "Batel, Curitiba", title: "Cobertura Smart Home", desc: "Automação completa: iluminação cênica, áudio multi-room, climatização e cortinas motorizadas controladas por app e voz.", image: imgCobertura },
  { tag: "Predial", local: "Ecoville, Curitiba", title: "Edifício Residencial Premium", desc: "Iluminação inteligente da fachada, controle de acesso veicular automatizado e gestão de áreas comuns.", image: imgEdificio },
  { tag: "Industrial", local: "CIC, Curitiba", title: "Indústria Metalúrgica", desc: "Programação de CLPs Siemens, painéis de comando e supervisão SCADA da linha de produção.", image: imgIndustria },
  { tag: "Residencial", local: "Champagnat, Curitiba", title: "Home Theater Premium", desc: "Sala de cinema com automação total: cortinas blackout, projeção 4K, áudio 7.1 e iluminação cênica programável.", image: imgHomeTheater },
  { tag: "Segurança", local: "Água Verde, Curitiba", title: "Condomínio Vertical", desc: "CFTV com 64 câmeras IP, alarme perimetral, controle de acesso biométrico e portaria remota 24h.", image: imgCftv },
  { tag: "Predial", local: "Centro Cívico, Curitiba", title: "Edifício Corporativo", desc: "Catracas com biometria facial, iluminação automatizada e integração com sistema de gestão predial.", image: imgCorporativo },
  { tag: "Residencial", local: "Bigorrilho, Curitiba", title: "Cozinha Inteligente", desc: "Iluminação sob bancada, controle por voz, eletrodomésticos integrados e cenas personalizadas.", image: imgCozinha },
  { tag: "Comercial", local: "Juvevê, Curitiba", title: "Restaurante Boutique", desc: "Cenas de iluminação por horário, controle de climatização e som ambiente integrado.", image: imgRestaurante },
  { tag: "Residencial", local: "Cabral, Curitiba", title: "Residência de Alto Padrão", desc: "Domótica completa com sensores de presença, automação de portões e integração com assistente virtual.", image: imgResidencia },
  { tag: "Predial", local: "Centro, Curitiba", title: "Shopping Comercial", desc: "Sistema integrado de iluminação, ar-condicionado e segurança eletrônica para múltiplas lojas.", image: imgShopping },
  { tag: "Industrial", local: "Boqueirão, Curitiba", title: "Galpão Logístico", desc: "Painéis de força, automação de portões industriais e sistema de monitoramento energético.", image: imgGalpao },
] as const;

type Category = (typeof PROJECTS)[number]["tag"];

const CATEGORY_META: Record<Category, { icon: typeof Home; gradient: string; highlights: string[] }> = {
  Residencial: {
    icon: Home,
    gradient: "from-primary via-primary to-energy",
    highlights: ["Controle por app", "Cenas inteligentes", "Integração por voz"],
  },
  Predial: {
    icon: Building2,
    gradient: "from-primary via-secondary to-primary",
    highlights: ["Gestão centralizada", "Controle de acesso", "Eficiência energética"],
  },
  Industrial: {
    icon: Factory,
    gradient: "from-secondary via-primary to-energy",
    highlights: ["CLPs e SCADA", "Painéis sob medida", "Monitoramento 24/7"],
  },
  Segurança: {
    icon: ShieldCheck,
    gradient: "from-destructive via-primary to-secondary",
    highlights: ["CFTV IP", "Alarme perimetral", "Biometria"],
  },
  Comercial: {
    icon: Store,
    gradient: "from-energy via-primary to-secondary",
    highlights: ["Cenas por horário", "Som ambiente", "Climatização"],
  },
};

const STATS = [
  { value: "500+", label: "Projetos entregues" },
  { value: "13+", label: "Anos de experiência" },
  { value: "98%", label: "Clientes satisfeitos" },
  { value: "24/7", label: "Suporte técnico" },
];

function ProjectsPage() {
  const categories = useMemo(() => {
    const set = new Set<Category>(PROJECTS.map((p) => p.tag));
    return ["Todos", ...Array.from(set)] as const;
  }, []);
  const [active, setActive] = useState<(typeof categories)[number]>("Todos");

  const filtered = active === "Todos" ? PROJECTS : PROJECTS.filter((p) => p.tag === active);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Projetos", url: "/projetos" },
      ])} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-energy/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-energy backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Portfólio
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold text-balance md:text-6xl">
            Obras entregues em <span className="text-energy">Curitiba</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
            Mais de uma década transformando residências, empresas e indústrias com automação de alto padrão nos principais bairros da capital e região metropolitana.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur md:p-5">
                <div className="font-display text-2xl font-bold text-energy md:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-white/70 md:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <section className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-4 md:px-6">
          {categories.map((cat) => {
            const isActive = active === cat;
            const count = cat === "Todos" ? PROJECTS.length : PROJECTS.filter((p) => p.tag === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-smooth ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-elegant"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
                <span className={`rounded-full px-1.5 text-xs ${isActive ? "bg-white/20" : "bg-muted"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <p className="text-sm text-muted-foreground">
            Exibindo <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "projeto" : "projetos"}
            {active !== "Todos" && <> em <span className="font-semibold text-foreground">{active}</span></>}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const meta = CATEGORY_META[p.tag];
            const Icon = meta.icon;
            return (
              <article
                key={p.title}
                className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-smooth hover:-translate-y-2 hover:border-primary/40 hover:shadow-elegant"
              >
                {/* Visual */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={`${p.title} — ${p.local}`}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover transition-smooth duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-5 top-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
                      <Icon className="h-3 w-3" /> {p.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                      <MapPin className="h-3 w-3" /> {p.local}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-lg font-semibold leading-snug transition-smooth group-hover:text-primary">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

                  <ul className="mt-4 space-y-1.5">
                    {meta.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <span className="text-xs font-medium text-muted-foreground">Projeto entregue</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-smooth group-hover:opacity-100">
                      Saiba mais <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold text-balance md:text-4xl">
            Seu projeto pode ser o próximo
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Conte com a experiência de quem já entregou mais de 500 projetos em Curitiba. Orçamento gratuito e visita técnica sem compromisso.
          </p>
          <div className="mt-8 flex justify-center">
            <WhatsAppButton message="Olá! Gostaria de solicitar um projeto personalizado da Master Automação." source="projetos">
              Solicitar projeto personalizado
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
