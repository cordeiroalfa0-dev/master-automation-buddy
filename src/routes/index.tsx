import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Zap, Home, Building2, Factory, Shield, ArrowRight,
  CheckCircle2, Star, Award, Users, Sparkles, Phone,
  ClipboardList, Pencil, Wrench, HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
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

const PROCESS = [
  { icon: ClipboardList, step: "01", title: "Diagnóstico", desc: "Visita técnica gratuita para entender suas necessidades e mapear o ambiente." },
  { icon: Pencil, step: "02", title: "Projeto", desc: "Elaboração do projeto técnico personalizado com escopo, prazo e orçamento detalhado." },
  { icon: Wrench, step: "03", title: "Execução", desc: "Instalação por equipe certificada, com materiais de marcas líderes e padrão NBR." },
  { icon: HeadphonesIcon, step: "04", title: "Suporte", desc: "Garantia em todos os serviços e suporte técnico contínuo pós-instalação." },
];

const BRANDS = ["Schneider", "Siemens", "ABB", "WEG", "Legrand", "Hikvision", "Intelbras", "Steck"];

const TESTIMONIALS = [
  { name: "Carlos H.", role: "Proprietário · Batel", text: "Transformaram minha cobertura com automação completa. Controlo iluminação, áudio e cortinas pelo celular. Serviço impecável!" },
  { name: "Ana Paula M.", role: "Síndica · Ecoville", text: "Automatizaram iluminação e controle de acesso do nosso condomínio. Reduzimos 40% no consumo de energia em 6 meses!" },
  { name: "Roberto A.", role: "Diretor Industrial · CIC", text: "Profissionais extremamente competentes. Implementaram a automação da nossa linha de produção com CLPs Siemens — superou expectativas." },
];

const FAQ = [
  { question: "Quanto custa um projeto de automação residencial?", answer: "O valor varia conforme o escopo (iluminação, cortinas, climatização, segurança) e o tamanho do imóvel. Projetos compactos começam em torno de R$ 5.000 e podem chegar a R$ 100.000+ em residências de alto padrão. Fazemos orçamento gratuito após visita técnica." },
  { question: "Quanto tempo leva para automatizar minha casa?", answer: "Projetos residenciais típicos são executados entre 5 e 20 dias úteis, dependendo da complexidade. Em obras novas, integramos a automação durante a fase elétrica para zero retrabalho." },
  { question: "Vocês atendem em toda Curitiba e região metropolitana?", answer: "Sim. Atendemos Curitiba inteira (Batel, Ecoville, Champagnat, Bigorrilho, Água Verde, Cabral, Juvevê e mais) e cidades vizinhas como São José dos Pinhais, Pinhais, Colombo e Araucária." },
  { question: "Posso integrar com Alexa, Google Home e Apple HomeKit?", answer: "Sim. Trabalhamos com plataformas abertas (KNX, Zigbee, Z-Wave, Matter) e proprietárias (Sonoff, Tuya, Lifx) compatíveis com os principais assistentes de voz do mercado." },
  { question: "Existe garantia nos serviços?", answer: "Sim. Garantia mínima de 12 meses sobre instalação e seguimos as garantias dos fabricantes para os equipamentos. Oferecemos também planos de manutenção preventiva." },
];

function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Início", url: "/" }])} />
      <JsonLd data={faqSchema(FAQ)} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-6 md:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-energy" />
              Curitiba e Região Metropolitana
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-balance md:text-6xl lg:text-7xl">
              Automação que transforma{" "}
              <span className="bg-gradient-energy bg-clip-text text-transparent">
                seu espaço
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg text-pretty">
              Soluções completas em automação <strong className="text-white">residencial, predial e industrial</strong>.
              Atendendo Batel, Ecoville, Champagnat, Bigorrilho e toda Curitiba.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-energy font-semibold text-energy-foreground shadow-energy transition-spring hover:scale-[1.03]">
                <Link to="/orcamento" onClick={() => trackCTA("orcamento_hero", "hero")}>
                  Solicitar Orçamento <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:text-white">
                <Link to="/projetos" onClick={() => trackCTA("ver_projetos", "hero")}>
                  Ver Projetos
                </Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-energy">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-4 w-4" fill="currentColor" />
                  ))}
                </div>
                <span className="font-semibold">5.0</span>
                <span className="text-white/60">· 127 avaliações</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-white/80">Orçamento em até <strong className="text-white">2 horas</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-energy" />
                <span className="text-white/80">Garantia em todos os serviços</span>
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
              className="relative rounded-2xl shadow-glow ring-1 ring-white/10"
            />
            {/* Floating credibility card */}
            <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-white/10 bg-white/95 p-3 shadow-elegant backdrop-blur md:flex md:items-center md:gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-success/15 text-success">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-left text-foreground">
                <div className="text-sm font-bold">+500 projetos</div>
                <div className="text-xs text-muted-foreground">entregues em Curitiba</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS MARQUEE */}
      <section className="border-y bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trabalhamos com as principais marcas do mercado
          </p>
          <div className="mt-6 overflow-hidden">
            <div className="flex w-max animate-marquee gap-12">
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                <div
                  key={`${brand}-${i}`}
                  className="font-display text-2xl font-bold uppercase tracking-tight text-muted-foreground/60 transition-colors hover:text-primary"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4 md:px-6 md:py-14">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`text-center ${i > 0 ? "md:border-l md:border-border/60" : ""}`}
            >
              <div className="font-display text-4xl font-bold text-primary md:text-5xl">{s.value}</div>
              <div className="mt-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <Zap className="h-3 w-3" /> Serviços
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-balance md:text-5xl">
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
              className="group relative overflow-hidden rounded-2xl border bg-card transition-spring hover:-translate-y-2 hover:shadow-card-hover"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
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

      {/* PROCESS */}
      <section className="relative overflow-hidden bg-surface py-16 md:py-24">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              Como trabalhamos
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-balance md:text-5xl">
              Um processo claro do início ao fim
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Metodologia testada em mais de 500 projetos, com previsibilidade de prazo, custo e resultado.
            </p>
          </div>

          <div className="relative mt-14 grid gap-6 md:grid-cols-4">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />
            {PROCESS.map((p) => (
              <div key={p.step} className="relative">
                <div className="flex justify-center">
                  <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant ring-8 ring-surface">
                    <p.icon className="h-6 w-6" />
                    <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-energy text-[10px] font-bold text-energy-foreground shadow-energy">
                      {p.step}
                    </span>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              Por que escolher
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
              Tecnologia, eficiência e conforto em um só lugar
            </h2>
            <p className="mt-4 text-muted-foreground">
              Mais de 10 anos transformando residências, edifícios e indústrias em Curitiba com automação inteligente.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Equipe técnica certificada e em constante atualização",
                "Orçamento detalhado e sem compromisso em até 2h",
                "Garantia em todos os serviços executados",
                "Suporte técnico pós-instalação dedicado",
                "Atendimento em toda Curitiba e região metropolitana",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
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
                className="inline-flex h-10 items-center gap-2 rounded-md border bg-background px-6 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Phone className="h-4 w-4 text-primary" /> {SITE_CONFIG.contact.phone}
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Award, title: "10+ anos", desc: "de experiência no mercado" },
              { icon: Users, title: "500+ clientes", desc: "satisfeitos em Curitiba" },
              { icon: Zap, title: "Marcas top", desc: "Schneider, Siemens, ABB, WEG" },
              { icon: Shield, title: "Garantia", desc: "em todos os serviços" },
            ].map((c, i) => (
              <div
                key={c.title}
                className={`group rounded-2xl border bg-card p-6 shadow-card transition-spring hover:-translate-y-1 hover:shadow-card-hover ${
                  i % 2 === 1 ? "sm:translate-y-6" : ""
                }`}
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-display text-base font-bold">{c.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              Clientes
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">O que dizem sobre nós</h2>
            <p className="mt-4 text-muted-foreground">
              Depoimentos reais de quem confiou na Master Elétrica para transformar seus espaços.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="relative rounded-2xl border bg-card p-6 shadow-card transition-spring hover:-translate-y-1 hover:shadow-card-hover">
                <div className="absolute -top-3 left-6 inline-flex items-center gap-0.5 rounded-full bg-energy px-2.5 py-1 text-energy-foreground shadow-energy">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-3 w-3" fill="currentColor" />)}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground">"{t.text}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-primary font-display text-base font-bold text-primary-foreground shadow-elegant">
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
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Dúvidas frequentes
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Perguntas comuns
          </h2>
          <p className="mt-4 text-muted-foreground">
            Não encontrou sua resposta? <Link to="/contato" className="font-semibold text-primary hover:underline">Fale com nosso time</Link>.
          </p>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b">
              <AccordionTrigger className="py-5 text-left font-display text-base font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA + FORM */}
      <section className="relative overflow-hidden bg-gradient-hero py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-4 md:grid-cols-2 md:px-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur">
              <Sparkles className="h-3 w-3 text-energy" /> Vamos começar
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl text-balance">
              Pronto para automatizar seu espaço?
            </h2>
            <p className="mt-4 max-w-md text-white/80">
              Solicite um orçamento sem compromisso. Resposta em até <strong className="text-white">2h em horário comercial</strong>.
            </p>
            <div className="mt-8 space-y-3">
              <WhatsAppButton source="home_cta">Falar com especialista</WhatsAppButton>
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                onClick={() => trackPhone("home_cta")}
                className="block text-sm text-white/80 hover:text-white"
              >
                ou ligue: <strong>{SITE_CONFIG.contact.phone}</strong>
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                { v: "2h", l: "Resposta" },
                { v: "100%", l: "Garantia" },
                { v: "5.0★", l: "Avaliação" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-bold text-energy">{s.v}</div>
                  <div className="text-xs text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6 text-foreground shadow-elegant md:p-8">
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
