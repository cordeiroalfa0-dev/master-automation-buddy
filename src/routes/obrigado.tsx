import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { trackEvent, trackPhone } from "@/lib/analytics";
import { buildSeo } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    ...buildSeo({
      title: "Obrigado! Recebemos seu pedido — Master Automação",
      description: "Recebemos sua solicitação. Nossa equipe entrará em contato em breve.",
      path: "/obrigado",
      noindex: true,
    }),
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  useEffect(() => {
    // Dispara evento de conversão server-trackable via GTM
    trackEvent("conversion", {
      send_to: "lead_form_complete",
      value: 1,
      currency: "BRL",
    });
  }, []);

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center md:py-32">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success animate-pulse-glow">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-balance md:text-5xl">
        Recebemos sua mensagem!
      </h1>
      <p className="mt-4 max-w-lg text-muted-foreground text-pretty">
        Nossa equipe técnica vai analisar seu pedido e retornar em até <strong>2 horas</strong> em
        horário comercial. Enquanto isso, se preferir agilizar, fale conosco direto:
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <WhatsAppButton source="obrigado">
          <MessageCircle className="h-4 w-4" fill="currentColor" /> WhatsApp
        </WhatsAppButton>
        <Button asChild variant="outline" size="lg">
          <a href={`tel:${SITE_CONFIG.contact.phoneE164}`} onClick={() => trackPhone("obrigado")}>
            <Phone className="mr-2 h-4 w-4" /> {SITE_CONFIG.contact.phone}
          </a>
        </Button>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { t: "+500", d: "projetos entregues" },
          { t: "10+", d: "anos de experiência" },
          { t: "5.0", d: "avaliação clientes" },
        ].map((s) => (
          <div key={s.d} className="rounded-xl border bg-card p-4">
            <div className="font-display text-2xl font-bold text-primary">{s.t}</div>
            <div className="text-xs text-muted-foreground">{s.d}</div>
          </div>
        ))}
      </div>

      <Link to="/" className="mt-10 text-sm text-muted-foreground hover:text-primary">
        ← Voltar ao início
      </Link>
    </section>
  );
}
