import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { getUTMData } from "@/hooks/useUTMTracking";
import { trackLead, trackEvent } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Formulário multi-step otimizado para conversão (CRO).
 * Reduz fricção dividindo o pedido em 3 micro-decisões:
 *   1. Tipo de serviço (clique único)
 *   2. Detalhes do projeto (texto livre)
 *   3. Contato (nome + telefone)
 *
 * Multi-step costuma converter +30% vs. single-step em landing pages de Ads.
 */

const schema = z.object({
  servico: z.string().min(2).max(100),
  mensagem: z.string().trim().max(1000).optional(),
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z
    .string()
    .trim()
    .min(8, "Telefone inválido")
    .max(20)
    .regex(/^[0-9()+\-\s]+$/, "Use apenas números"),
  email: z.string().trim().email("Email inválido").max(255).optional().or(z.literal("")),
});

interface Props {
  source?: string;
}

export function MultiStepLeadForm({ source = "multistep" }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [data, setData] = useState({
    servico: "",
    mensagem: "",
    nome: "",
    telefone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function next() {
    if (step === 1 && !data.servico) {
      setErrors({ servico: "Escolha uma opção" });
      return;
    }
    trackEvent("form_step_advance", { source, from: step, to: step + 1 });
    setStep(step + 1);
  }

  async function submit() {
    setServerError(null);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      return;
    }

    setLoading(true);
    const utm = getUTMData();
    const { error } = await supabase.from("leads").insert({
      ...parsed.data,
      email: parsed.data.email || null,
      utm_source: utm.utm_source ?? null,
      utm_medium: utm.utm_medium ?? null,
      utm_campaign: utm.utm_campaign ?? null,
      utm_content: utm.utm_content ?? null,
      utm_term: utm.utm_term ?? null,
      gclid: utm.gclid ?? null,
      fbclid: utm.fbclid ?? null,
      ttclid: utm.ttclid ?? null,
      pagina_origem:
        typeof window !== "undefined" ? window.location.pathname : null,
      referrer: utm.referrer ?? (typeof document !== "undefined" ? document.referrer : null),
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
    setLoading(false);

    if (error) {
      setServerError("Não foi possível enviar agora. Tente pelo WhatsApp.");
      return;
    }
    trackLead(parsed.data.servico);
    navigate({ to: "/obrigado" });
  }

  return (
    <div data-form-source={source}>
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              s <= step ? "bg-primary" : "bg-muted",
            )}
          />
        ))}
      </div>
      <p className="mb-5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Etapa {step} de 3
      </p>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold">
            Qual serviço você precisa?
          </h3>
          <div className="grid gap-2.5">
            {SITE_CONFIG.services.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => update("servico", s.title)}
                className={cn(
                  "flex items-center justify-between rounded-xl border-2 p-4 text-left text-sm font-semibold transition-smooth",
                  data.servico === s.title
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50",
                )}
              >
                {s.title}
                {data.servico === s.title && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={() => update("servico", "Outro")}
              className={cn(
                "flex items-center justify-between rounded-xl border-2 p-4 text-left text-sm font-semibold transition-smooth",
                data.servico === "Outro"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50",
              )}
            >
              Outro / Não tenho certeza
              {data.servico === "Outro" && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </button>
          </div>
          {errors.servico && (
            <p className="text-xs text-destructive">{errors.servico}</p>
          )}
          <Button
            type="button"
            onClick={next}
            size="lg"
            className="w-full bg-gradient-energy font-semibold text-energy-foreground shadow-energy"
          >
            Continuar <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold">
            Conte um pouco sobre seu projeto
          </h3>
          <div>
            <Label htmlFor="ms-mensagem">Detalhes (opcional)</Label>
            <Textarea
              id="ms-mensagem"
              rows={5}
              maxLength={1000}
              className="mt-1.5"
              placeholder="Tipo de imóvel, área aproximada, prazo desejado, ambientes..."
              value={data.mensagem}
              onChange={(e) => update("mensagem", e.target.value)}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Quanto mais detalhes, mais preciso o orçamento.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              size="lg"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
            </Button>
            <Button
              type="button"
              onClick={next}
              size="lg"
              className="flex-1 bg-gradient-energy font-semibold text-energy-foreground shadow-energy"
            >
              Continuar <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold">
            Quase lá! Onde te encontramos?
          </h3>
          <div>
            <Label htmlFor="ms-nome">Nome *</Label>
            <Input
              id="ms-nome"
              required
              maxLength={100}
              className="mt-1.5"
              value={data.nome}
              onChange={(e) => update("nome", e.target.value)}
            />
            {errors.nome && (
              <p className="mt-1 text-xs text-destructive">{errors.nome}</p>
            )}
          </div>
          <div>
            <Label htmlFor="ms-telefone">WhatsApp / Telefone *</Label>
            <Input
              id="ms-telefone"
              required
              placeholder="(41) 9 9999-9999"
              maxLength={20}
              className="mt-1.5"
              value={data.telefone}
              onChange={(e) => update("telefone", e.target.value)}
            />
            {errors.telefone && (
              <p className="mt-1 text-xs text-destructive">{errors.telefone}</p>
            )}
          </div>
          <div>
            <Label htmlFor="ms-email">Email (opcional)</Label>
            <Input
              id="ms-email"
              type="email"
              maxLength={255}
              className="mt-1.5"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {serverError && (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              size="lg"
              disabled={loading}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
            </Button>
            <Button
              type="button"
              onClick={submit}
              size="lg"
              disabled={loading}
              className="flex-1 bg-gradient-energy font-semibold text-energy-foreground shadow-energy"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                </>
              ) : (
                "Enviar Orçamento"
              )}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            🔒 Seus dados estão seguros · Resposta em até 2h
          </p>
        </div>
      )}
    </div>
  );
}
