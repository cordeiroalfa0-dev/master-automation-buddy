import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
  Search,
  X,
  Share2,
  ChevronRight,
  SlidersHorizontal,
  ImageOff,
} from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildSeo } from "@/lib/seo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { whatsappLink } from "@/lib/site-config";
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
  { value: 500, suffix: "+", label: "Projetos entregues" },
  { value: 13, suffix: "+", label: "Anos de experiência" },
  { value: 98, suffix: "%", label: "Clientes satisfeitos" },
  { value: 24, suffix: "/7", label: "Suporte técnico" },
];

/** Counter animado com IntersectionObserver */
function AnimatedCounter({ value, suffix = "", duration = 1400 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function ProjectsPage() {
  const categories = useMemo(() => {
    const set = new Set<Category>(PROJECTS.map((p) => p.tag));
    return ["Todos", ...Array.from(set)] as const;
  }, []);
  const bairros = useMemo(() => {
    const set = new Set(PROJECTS.map((p) => p.local.split(",")[0].trim()));
    return ["all", ...Array.from(set).sort()];
  }, []);

  const [active, setActive] = useState<(typeof categories)[number]>("Todos");
  const [query, setQuery] = useState("");
  const [bairro, setBairro] = useState<string>("all");
  const [sort, setSort] = useState<"relevance" | "az" | "za">("relevance");
  const [selected, setSelected] = useState<(typeof PROJECTS)[number] | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PROJECTS.filter((p) => {
      if (active !== "Todos" && p.tag !== active) return false;
      if (bairro !== "all" && !p.local.toLowerCase().startsWith(bairro.toLowerCase())) return false;
      if (q && !(`${p.title} ${p.desc} ${p.local} ${p.tag}`.toLowerCase().includes(q))) return false;
      return true;
    });
    if (sort === "az") return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "za") return [...list].sort((a, b) => b.title.localeCompare(a.title));
    return list;
  }, [active, query, bairro, sort]);

  const hasFilters = active !== "Todos" || query !== "" || bairro !== "all" || sort !== "relevance";

  const clearFilters = () => {
    setActive("Todos");
    setQuery("");
    setBairro("all");
    setSort("relevance");
  };

  const handleShare = async (p: (typeof PROJECTS)[number]) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: `${p.title} — Master Automação`,
      text: `${p.title} em ${p.local}: ${p.desc}`,
      url,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${url}`);
        toast.success("Link copiado para a área de transferência");
      }
    } catch {
      /* user cancelled */
    }
  };

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
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-white/70">
            <Link to="/" className="transition-smooth hover:text-energy">Início</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-white">Projetos</span>
          </nav>

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
                <div className="font-display text-2xl font-bold text-energy md:text-3xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs text-white/70 md:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <section className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 md:px-6">
          {/* Search + selects */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por projeto, bairro ou tecnologia..."
                className="pl-9 pr-9"
                aria-label="Buscar projetos"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Limpar busca"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <Select value={bairro} onValueChange={setBairro}>
              <SelectTrigger className="md:w-56">
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bairros</SelectItem>
                {bairros.filter((b) => b !== "all").map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger className="md:w-44">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="az">Nome (A-Z)</SelectItem>
                <SelectItem value="za">Nome (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chips categoria */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isActive = active === cat;
              const count = cat === "Todos" ? PROJECTS.length : PROJECTS.filter((p) => p.tag === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-smooth ${
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
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive transition-smooth hover:bg-destructive/5"
              >
                <X className="h-3 w-3" /> Limpar filtros
              </button>
            )}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section ref={gridRef} className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <p className="text-sm text-muted-foreground">
            Exibindo <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "projeto" : "projetos"}
            {active !== "Todos" && <> em <span className="font-semibold text-foreground">{active}</span></>}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <ImageOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold">Nenhum projeto encontrado</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Tente ajustar a busca, escolher outro bairro ou limpar os filtros.
            </p>
            <Button onClick={clearFilters} variant="outline" className="mt-6">
              <X className="h-4 w-4" /> Limpar filtros
            </Button>
          </div>
        ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => {
            const meta = CATEGORY_META[p.tag];
            const Icon = meta.icon;
            return (
              <article
                key={p.title}
                style={{ animationDelay: `${Math.min(i, 8) * 70}ms`, animationFillMode: "both" }}
                className="group relative flex animate-fade-in cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card transition-smooth hover:-translate-y-2 hover:border-primary/40 hover:shadow-elegant"
                onClick={() => setSelected(p)}
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
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleShare(p); }}
                    aria-label="Compartilhar projeto"
                    className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-foreground opacity-0 shadow-sm transition-smooth hover:bg-white group-hover:opacity-100"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
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
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

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
                      Ver detalhes <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}
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

      {/* MODAL DETALHES */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {selected && (
            <>
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="h-full w-full object-cover"
                  width={1024}
                  height={576}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary">
                    {selected.tag}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                    <MapPin className="h-3 w-3" /> {selected.local}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">{selected.title}</DialogTitle>
                  <DialogDescription className="text-base leading-relaxed">{selected.desc}</DialogDescription>
                </DialogHeader>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {CATEGORY_META[selected.tag].highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappLink(`Olá! Tenho interesse em um projeto similar ao "${selected.title}".`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90"
                  >
                    Quero um projeto assim <ArrowRight className="h-4 w-4" />
                  </a>
                  <Button variant="outline" onClick={() => handleShare(selected)}>
                    <Share2 className="h-4 w-4" /> Compartilhar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
