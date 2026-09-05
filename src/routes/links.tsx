import { createFileRoute } from "@tanstack/react-router";
import {
  MessageCircle,
  Phone,
  Instagram,
  Facebook,
  MapPin,
  Calculator,
  FileText,
  Wrench,
} from "lucide-react";
import { buildSeo } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackCTA, trackWhatsApp, trackPhone, trackSocialClick } from "@/lib/analytics";

export const Route = createFileRoute("/links")({
  head: () =>
    buildSeo({
      title: "Links | Master Automação — Curitiba",
      description:
        "Todos os canais da Master Automação em um só lugar: orçamento, WhatsApp, projetos, blog e redes sociais.",
      path: "/links",
    }),
  component: LinksPage,
});

const utm = (path: string, content: string) =>
  `${path}?utm_source=instagram&utm_medium=social&utm_campaign=link-na-bio&utm_content=${content}`;

const ITEMS = [
  { label: "Pedir orçamento em 2h", href: utm("/orcamento", "orcamento"), icon: FileText },
  { label: "Calcular investimento", href: utm("/orcamento", "calculadora"), icon: Calculator },
  { label: "Ver projetos entregues", href: utm("/projetos", "projetos"), icon: Wrench },
  { label: "Onde atendemos em Curitiba", href: utm("/bairros", "bairros"), icon: MapPin },
  { label: "Blog e dicas de automação", href: utm("/blog", "blog"), icon: FileText },
];

function LinksPage() {
  const wa = `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
    "Olá! Vim pelo link da bio e quero um orçamento. [ref: link-na-bio]",
  )}`;

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center px-4 py-12">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-black text-primary">
        MA
      </div>
      <h1 className="mt-4 text-center font-display text-2xl font-bold">{SITE_CONFIG.name}</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {SITE_CONFIG.tagline} · {SITE_CONFIG.region}
      </p>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsApp("link-na-bio")}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.02]"
      >
        <MessageCircle className="h-5 w-5" /> Falar no WhatsApp
      </a>

      <div className="mt-3 w-full space-y-3">
        {ITEMS.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            onClick={() => trackCTA(label, "link-na-bio")}
            className="flex w-full items-center gap-3 rounded-xl border bg-card px-5 py-4 font-medium shadow-card transition-colors hover:border-primary/60"
          >
            <Icon className="h-5 w-5 text-primary" />
            {label}
          </a>
        ))}

        <a
          href={`tel:${SITE_CONFIG.contact.phoneE164}`}
          onClick={() => trackPhone("link-na-bio")}
          className="flex w-full items-center gap-3 rounded-xl border bg-card px-5 py-4 font-medium shadow-card transition-colors hover:border-primary/60"
        >
          <Phone className="h-5 w-5 text-primary" /> {SITE_CONFIG.contact.phone}
        </a>
      </div>

      <div className="mt-6 flex gap-3">
        <a
          href={SITE_CONFIG.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          onClick={() => trackSocialClick("instagram", "link-na-bio")}
          className="rounded-full border bg-card p-3 transition-colors hover:border-primary/60"
        >
          <Instagram className="h-5 w-5 text-primary" />
        </a>
        <a
          href={SITE_CONFIG.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          onClick={() => trackSocialClick("facebook", "link-na-bio")}
          className="rounded-full border bg-card p-3 transition-colors hover:border-primary/60"
        >
          <Facebook className="h-5 w-5 text-primary" />
        </a>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        {SITE_CONFIG.contact.hours}
      </p>
    </main>
  );
}
