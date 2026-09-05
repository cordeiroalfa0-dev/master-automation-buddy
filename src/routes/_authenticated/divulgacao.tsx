import { createFileRoute, Link } from "@tanstack/react-router";
import { Megaphone, ArrowLeft } from "lucide-react";
import { buildSeo } from "@/lib/seo";
import { UtmLinkBuilder } from "@/components/UtmLinkBuilder";
import { AdCopyLibrary } from "@/components/AdCopyLibrary";

export const Route = createFileRoute("/_authenticated/divulgacao")({
  head: () =>
    buildSeo({
      title: "Central de Divulgação — Master Automação",
      description: "Ferramentas internas de campanha, links rastreáveis e textos de anúncio.",
      path: "/divulgacao",
      noindex: true,
    }),
  component: DivulgacaoPage,
});

function DivulgacaoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao painel
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span className="rounded-xl bg-primary/10 p-2 text-primary">
          <Megaphone className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Central de Divulgação</h1>
          <p className="text-sm text-muted-foreground">
            Gere links rastreáveis, QR Codes e copie textos prontos para cada canal.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <UtmLinkBuilder />
        <AdCopyLibrary />
      </div>
    </main>
  );
}
