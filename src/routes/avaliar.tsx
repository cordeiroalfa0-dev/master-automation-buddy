import { createFileRoute } from "@tanstack/react-router";
import { Star, MessageCircle } from "lucide-react";
import { buildSeo } from "@/lib/seo";
import { SITE_CONFIG, whatsappLink } from "@/lib/site-config";
import { reviewUrl } from "@/lib/gmb";
import { qrCodeUrl } from "@/lib/campaign";
import { trackCTA } from "@/lib/analytics";

export const Route = createFileRoute("/avaliar")({
  head: () =>
    buildSeo({
      title: "Avalie a Abael Automação no Google",
      description:
        "Gostou do serviço? Deixe sua avaliação no Google e ajude outras famílias de Curitiba a encontrar a Abael Automação.",
      path: "/avaliar",
      noindex: true,
    }),
  component: AvaliarPage,
});

function AvaliarPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center px-4 py-12 text-center">
      <div className="flex gap-1 text-energy">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-8 w-8" fill="currentColor" />
        ))}
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold">Obrigado por escolher a {SITE_CONFIG.name}!</h1>
      <p className="mt-2 text-muted-foreground">
        Sua avaliação leva menos de 1 minuto e ajuda muito outros clientes de Curitiba a nos encontrar.
      </p>
      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCTA("avaliar_google", "pagina_avaliar")}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.02]"
      >
        <Star className="h-5 w-5" /> Avaliar no Google
      </a>
      <p className="mt-3 text-xs text-muted-foreground">
        Dica: conte qual serviço fizemos e o bairro — isso ajuda outros clientes.
      </p>
      <a
        href={whatsappLink("Olá! Tive um problema com o serviço e queria conversar.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <MessageCircle className="h-4 w-4" /> Algo não saiu como esperado? Fale com a gente
      </a>
      <div className="mt-10 rounded-2xl border bg-card p-4 shadow-card">
        <img src={qrCodeUrl(reviewUrl, 320)} alt="QR Code para avaliar no Google" width={220} height={220} />
        <p className="mt-2 text-xs text-muted-foreground">Mostre este QR Code ao cliente no fim da instalação</p>
      </div>
    </main>
  );
}
