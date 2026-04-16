import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { getUTMData } from "@/hooks/useUTMTracking";
import { trackLead } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/site-config";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("Email inválido").max(255).optional().or(z.literal("")),
  telefone: z
    .string()
    .trim()
    .min(8, "Informe um telefone válido")
    .max(20)
    .regex(/^[0-9()+\-\s]+$/, "Telefone inválido"),
  servico: z.string().max(100).optional(),
  mensagem: z.string().trim().max(1000).optional(),
});

interface Props {
  /** Pré-seleciona um serviço (usado em landing pages de serviço) */
  defaultServico?: string;
  /** Identificador da localização do form para analytics */
  source?: string;
  /** Após sucesso, redireciona para /obrigado */
  redirectOnSuccess?: boolean;
}

export function LeadForm({
  defaultServico,
  source = "form",
  redirectOnSuccess = true,
}: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const fd = new FormData(e.currentTarget);
    const raw = {
      nome: String(fd.get("nome") || ""),
      email: String(fd.get("email") || ""),
      telefone: String(fd.get("telefone") || ""),
      servico: String(fd.get("servico") || defaultServico || ""),
      mensagem: String(fd.get("mensagem") || ""),
    };

    const parsed = schema.safeParse(raw);
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
    const payload = {
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
    };

    const { error } = await supabase.from("leads").insert(payload);
    setLoading(false);

    if (error) {
      setServerError("Não foi possível enviar agora. Tente pelo WhatsApp.");
      return;
    }

    trackLead(parsed.data.servico);
    setSuccess(true);
    if (redirectOnSuccess) {
      navigate({ to: "/obrigado" });
    }
  }

  if (success && !redirectOnSuccess) {
    return (
      <div className="rounded-xl border bg-success/10 p-6 text-center">
        <p className="font-semibold text-foreground">Recebido!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Entraremos em contato em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-form-source={source}>
      <div>
        <Label htmlFor="nome">Nome *</Label>
        <Input id="nome" name="nome" required maxLength={100} className="mt-1.5" />
        {errors.nome && <p className="mt-1 text-xs text-destructive">{errors.nome}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="telefone">WhatsApp / Telefone *</Label>
          <Input
            id="telefone"
            name="telefone"
            required
            placeholder="(41) 9 9999-9999"
            maxLength={20}
            className="mt-1.5"
          />
          {errors.telefone && (
            <p className="mt-1 text-xs text-destructive">{errors.telefone}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" maxLength={255} className="mt-1.5" />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="servico">Tipo de serviço</Label>
        <Select name="servico" defaultValue={defaultServico}>
          <SelectTrigger id="servico" className="mt-1.5">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {SITE_CONFIG.services.map((s) => (
              <SelectItem key={s.slug} value={s.title}>
                {s.title}
              </SelectItem>
            ))}
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="mensagem">Conte-nos sobre seu projeto</Label>
        <Textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          maxLength={1000}
          className="mt-1.5"
          placeholder="Tipo de imóvel, área aproximada, prazo desejado..."
        />
      </div>

      {serverError && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="w-full bg-gradient-energy text-energy-foreground shadow-energy hover:opacity-95"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Solicitar Orçamento Grátis"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Resposta em até 2h em horário comercial.
      </p>
    </form>
  );
}
