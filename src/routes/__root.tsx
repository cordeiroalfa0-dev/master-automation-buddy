import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CookieConsent } from "@/components/CookieConsent";
import { TrackingScripts } from "@/components/tracking/TrackingScripts";
import { TrackingProvider } from "@/components/tracking/TrackingProvider";
import { ScrollDepthTracker } from "@/components/tracking/ScrollDepthTracker";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { SITE_CONFIG } from "@/lib/site-config";
import { ScrollToTop } from "@/components/ScrollToTop";
import { BackToTop } from "@/components/BackToTop";
import { Toaster } from "@/components/ui/sonner";
import { SocialProofToast } from "@/components/SocialProofToast";
import { themeInitScript } from "@/components/ThemeToggle";
import { UrgencyBar } from "@/components/UrgencyBar";
import { DesktopStickyCTA } from "@/components/DesktopStickyCTA";
import { ShareButton } from "@/components/ShareButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  if (typeof window !== "undefined") console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold text-foreground">Ops!</h1>
        <h2 className="mt-4 text-xl font-semibold">Algo deu errado</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tivemos um problema ao carregar esta página. Tente novamente em instantes.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1e3a8a" },
      { name: "author", content: SITE_CONFIG.name },
      { name: "robots", content: "index, follow" },
      // SEO local — Curitiba/PR (geo tags ajudam Google Maps & busca local)
      { name: "geo.region", content: "BR-PR" },
      { name: "geo.placename", content: "Curitiba" },
      { name: "geo.position", content: "-25.4284;-49.2733" },
      { name: "ICBM", content: "-25.4284, -49.2733" },
      { name: "language", content: "Portuguese" },
      { httpEquiv: "content-language", content: "pt-BR" },
      {
        name: "keywords",
        content:
          "automação residencial Curitiba, automatização de casas Curitiba, empresa de automação residencial Curitiba, home cinema Curitiba, som ambiente Curitiba, aspiração central Curitiba, automação predial Curitiba, automação corporativa Curitiba, cabeamento estruturado Curitiba, vídeo wall Curitiba, combate a incêndio Curitiba, automação industrial Curitiba, programação de CLP Curitiba, retrofit industrial Curitiba, montagem de painéis elétricos Curitiba, instrumentação e comissionamento Curitiba, adequação NR10 NR12 Curitiba, controle de acesso Curitiba, casa inteligente Curitiba, CFTV Curitiba, segurança eletrônica Curitiba, automação Batel, automação Ecoville, automação Champagnat, automação Bigorrilho, Água Verde, Cabral, Juvevê, automação São José dos Pinhais, automação Araucária, automação Colombo, automação Pinhais, eletricista automação Curitiba PR",
      },
      // Site-wide defaults — child routes override these
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@abaelautomacao" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: SITE_CONFIG.name },
      { title: `${SITE_CONFIG.name} — Automação Residencial, Predial e Industrial em Curitiba` },
      { property: "og:title", content: `${SITE_CONFIG.name} — Automação em Curitiba` },
      { name: "twitter:title", content: `${SITE_CONFIG.name} — Automação em Curitiba` },
      { name: "description", content: SITE_CONFIG.description },
      { property: "og:description", content: SITE_CONFIG.description },
      { name: "twitter:description", content: SITE_CONFIG.description },
      { property: "og:image", content: `${SITE_CONFIG.url}/assets/og-default.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: `${SITE_CONFIG.url}/assets/og-default.jpg` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "apple-touch-icon", href: "/favicon.ico" },
      { rel: "alternate", hrefLang: "pt-BR", href: SITE_CONFIG.url },
      { rel: "alternate", hrefLang: "x-default", href: SITE_CONFIG.url },
      // Performance: warm up critical third-party origins
      { rel: "dns-prefetch", href: "https://wa.me" },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
      { rel: "preconnect", href: "https://wa.me", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <noscript>
          <div style={{ padding: "12px 16px", textAlign: "center", background: "#1e3a8a", color: "#fff", fontFamily: "system-ui, sans-serif", fontSize: 14 }}>
            Para a melhor experiência, habilite o JavaScript. Você também pode ligar para {SITE_CONFIG.contact.phone}.
          </div>
        </noscript>
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
    <TrackingProvider>
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-elegant"
      >
        Pular para o conteúdo
      </a>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={websiteSchema} />
      <div className="flex min-h-screen flex-col">
        <UrgencyBar />
        <Header />
        <main id="main-content" className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
        <Footer />
      </div>
      <WhatsAppFloat />
      <MobileStickyCTA />
      <DesktopStickyCTA />
      <ShareButton />
      <BackToTop />
      <CookieConsent />
      <SocialProofToast />
      <TrackingScripts />
      <ScrollDepthTracker />
      <Toaster richColors position="top-right" />
    </TrackingProvider>
    </QueryClientProvider>
  );
}
