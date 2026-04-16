import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Zap, Home, Building2, Factory, Shield, ArrowRight,
  CheckCircle2, Star, Award, Users, Sparkles, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackCTA, trackPhone } from "@/lib/analytics";
import heroImg from "@/assets/hero-automation.jpg";
import resImg from "@/assets/service-residential.jpg";
import comImg from "@/assets/service-commercial.jpg";
import indImg from "@/assets/service-industrial.jpg";
import secImg from "@/assets/service-security.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Master Elétrica Automatizada — Automação Residencial, Predial e Industrial em Curitiba" },
      { name: "description", content: "Especialistas em automação residencial, predial e industrial em Curitiba. +500 projetos entregues. Orçamento grátis em 2h. Atendimento Batel, Ecoville, Champagnat e toda região." },
      { name: "keywords", content: "automação residencial Curitiba, automação predial, casa inteligente, smart home, CFTV, automação industrial, eletricista Curitiba" },
      { property: "og:title", content: "Master Elétrica Automatizada — Curitiba" },
      { property: "og:description", content: "Automação residencial, predial e industrial. +500 projetos entregues em Curitiba e região." },
      { property: "og:image", content: `${SITE_CONFIG.url}/og-home.jpg` },
      { property: "og:url", content: SITE_CONFIG.url },
      { name: "twitter:title", content: "Master Elétrica Automatizada — Curitiba" },
      { name: "twitter:description", content: "Automação inteligente em Curitiba. +500 projetos." },
      { name: "twitter:image", content: `${SITE_CONFIG.url}/og-home.jpg` },
    ],
    links: [{ rel: "canonical", href: SITE_CONFIG.url }],
  }),
  component: HomePage,
});

const SERVICES = [
  { slug: "automacao-residencial", icon: Home, title: "Automação Residencial", desc: "Iluminação, climatização, cortinas, áudio e segurança integrados via app e voz.", img: resImg },
  { slug: "automacao-predial", icon: Building2, title: "Automação Predial", desc: "Gestão inteligente de edifícios: acessos, CFTV, iluminação automatizada e eficiência energética.", img: comImg },
  { slug: "automacao-industrial", icon: Factory, title: "Automação Industrial", desc: "CLPs, painéis elétricos, SCADA, inversores de frequência e controle de processos.", img: indImg },
  { slug: "seguranca-eletronica", icon: Shield, title: "Segurança Eletrônica", desc: "Alarmes, CFTV IP e controle de acesso biométrico para residências e empresas.", img: secImg },
];

const STATS = [
  { value: "500+", label: "Projetos Entregues" },
  { value: "10+", label: "Anos de Experiência" },
  { value: "30+", label: "Bairros em Curitiba" },
  { value: "98%", label: "Clientes Satisfeitos" },
];

const TESTIMONIALS = [
  { name: "Carlos H.", role: "Proprietário · Batel", text: "Transformaram minha cobertura com automação completa. Controlo iluminação, áudio e cortinas pelo celular. Serviço impecável!" },
  { name: "Ana Paula M.", role: "Síndica · Ecoville", text: "Automatizaram iluminação e controle de acesso do nosso condomínio. Reduzimos 40% no consumo de energia em 6 meses!" },
  { name: "Roberto A.", role: "Diretor Industrial · CIC", text: "Profissionais extremamente competentes. Implementaram a automação da nossa linha de produção com CLPs Siemens — superou expectativas." },
];

function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Início", url: "/" }])} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-6 md:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-energy" />
              Curitiba e Região Metropolitana
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-balance md:text-6xl lg:text-7xl">
              Automação que transforma{" "}
              <span className="bg-gradient-to-r from-energy to-yellow-300 bg-clip-text text-transparent">
                seu espaço
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg text-pretty">
              Soluções completas em automação <strong>residencial, predial e industrial</strong>.
              Atendendo Batel, Ecoville, Champagnat, Bigorrilho e toda Curitiba.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-energy text-energy-foreground shadow-energy">
                <Link to="/orcamento" onClick={() => trackCTA("orcamento_hero", "hero")}>
                  Solicitar Orçamento <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link to="/projetos" onClick={() => trackCTA("ver_projetos", "hero")}>
                  Ver Projetos
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1 text-energy">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" />
                ))}
              </div>
              <div>
                <div className="font-semibold">+500 projetos entregues</div>
                <div className="text-xs text-white/60">Avaliação 5.0 dos clientes</div>
              </div>
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="absolute -inset-4 bg-gradient-primary opacity-30 blur-3xl" />
            <img
              src={heroImg}
              alt="Sala de estar com automação inteligente em Curitiba"
              width={1920}
              height={1080}
              className="relative rounded-2xl shadow-glow"
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 md:px-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-primary md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Serviços</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-balance md:text-5xl">
            Soluções completas em automação
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Projetos personalizados para cada necessidade, com tecnologia de ponta e suporte técnico especializado.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              to="/servicos/$slug"
              params={{ slug: s.slug }}
              className="group overflow-hidden rounded-2xl border bg-card transition-smooth hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                  Saiba mais <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Por que escolher</span>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Tecnologia, eficiência e conforto em um só lugar
            </h2>
            <p className="mt-4 text-muted-foreground">
              Mais de 10 anos transformando residências, edifícios e indústrias em Curitiba com automação inteligente.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Equipe técnica certificada",
                "Orçamento sem compromisso",
                "Garantia em todos os serviços",
                "Suporte técnico pós-instalação",
                "Atendimento em toda Curitiba e região",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/sobre">Conheça nossa história</Link>
              </Button>
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                onClick={() => trackPhone("home_why")}
                className="inline-flex h-10 items-center gap-2 rounded-md border bg-background px-6 text-sm font-medium hover:bg-accent"
              >
                <Phone className="h-4 w-4" /> {SITE_CONFIG.contact.phone}
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Award, title: "10+ anos", desc: "de experiência no mercado" },
              { icon: Users, title: "500+ clientes", desc: "satisfeitos em Curitiba" },
              { icon: Zap, title: "Marcas top", desc: "Schneider, Siemens, ABB, WEG" },
              { icon: Shield, title: "Garantia", desc: "em todos os serviços" },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border bg-card p-5 shadow-card">
                <c.icon className="h-6 w-6 text-primary" />
                <div className="mt-3 font-display font-semibold">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Clientes</span>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">O que dizem sobre nós</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex gap-0.5 text-energy">
                {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4" fill="currentColor" />)}
              </div>
              <blockquote className="mt-3 text-sm text-foreground">"{t.text}"</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA + FORM */}
      <section className="bg-gradient-hero py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 md:grid-cols-2 md:px-6">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-5xl text-balance">
              Pronto para automatizar seu espaço?
            </h2>
            <p className="mt-4 text-white/80">
              Solicite um orçamento sem compromisso. Resposta em até 2h em horário comercial.
            </p>
            <div className="mt-6 space-y-3">
              <WhatsAppButton source="home_cta">Falar com especialista</WhatsAppButton>
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                onClick={() => trackPhone("home_cta")}
                className="block text-sm text-white/80 hover:text-white"
              >
                ou ligue: <strong>{SITE_CONFIG.contact.phone}</strong>
              </a>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-6 text-foreground shadow-elegant md:p-8">
            <h3 className="font-display text-xl font-bold">Solicite seu orçamento</h3>
            <p className="mt-1 text-sm text-muted-foreground">Preencha e retornamos rapidamente.</p>
            <div className="mt-5">
              <LeadForm source="home_form" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
