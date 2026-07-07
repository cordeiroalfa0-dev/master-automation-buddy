import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, MessageCircle, Phone, Clock, MapPin, Instagram, ArrowRight } from "lucide-react";
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
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center md:py-24">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success animate-pulse-glow">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-balance md:text-5xl">
        Recebemos sua mensagem!
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground text-pretty">
        Nossa equipe técnica vai analisar seu pedido e retornar em até <strong className="text-foreground">2 horas úteis</strong>.
        Se preferir agilizar, fale conosco agora:
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

      {/* Próximos passos */}
      <div className="mt-14 w-full rounded-2xl border bg-card p-6 text-left shadow-card md:p-8">
        <h2 className="font-display text-lg font-bold text-foreground">O que acontece agora</h2>
        <ol className="mt-5 space-y-4">
          {[
            { n: 1, t: "Análise do pedido", d: "Um especialista revisa suas informações em minutos." },
            { n: 2, t: "Retorno em 2h úteis", d: "Ligamos ou mandamos mensagem no WhatsApp para alinhar detalhes." },
            { n: 3, t: "Visita técnica gratuita", d: "Agendamos visita no seu imóvel para levantamento e orçamento detalhado." },
            { n: 4, t: "Proposta em até 48h", d: "Envio da proposta comercial com escopo, prazo e valores." },
          ].map((s) => (
            <li key={s.n} className="flex gap-4">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                {s.n}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{s.t}</div>
                <div className="text-xs text-muted-foreground">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Cartão de contato + Maps */}
      <div className="mt-6 grid w-full gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 text-left">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-foreground">Horário de atendimento</div>
            <div className="text-muted-foreground">{SITE_CONFIG.contact.hours}</div>
          </div>
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Curitiba+PR"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/40"
        >
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-energy/15 text-energy-foreground">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-foreground">Ver no Google Maps</div>
            <div className="text-muted-foreground">Curitiba · PR — atendimento local</div>
          </div>
        </a>
      </div>

      <a
        href={SITE_CONFIG.social.instagram}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <Instagram className="h-4 w-4" /> Siga @masterautomacao no Instagram
      </a>

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

      <Link to="/" className="mt-10 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        ← Voltar ao início <ArrowRight className="h-3 w-3 opacity-0" />
      </Link>
    </section>
  );
}
