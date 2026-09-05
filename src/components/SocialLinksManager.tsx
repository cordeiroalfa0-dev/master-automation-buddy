import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  MapPin,
  Music2,
  Save,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  SOCIAL_KEYS,
  fetchSocialLinks,
  type SocialLinks,
  type SocialNetwork,
} from "@/hooks/useSocialLinks";

const CAMPOS: {
  id: SocialNetwork;
  label: string;
  icon: typeof Instagram;
  placeholder: string;
  hint: string;
}[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/suaempresa",
    hint: "Abra seu perfil no app, toque nos 3 pontinhos e escolha “Copiar link do perfil”.",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    placeholder: "https://facebook.com/suaempresa",
    hint: "Abra a página da empresa no computador e copie o endereço da barra do navegador.",
  },
  {
    id: "tiktok",
    label: "TikTok (opcional)",
    icon: Music2,
    placeholder: "https://tiktok.com/@suaempresa",
    hint: "Deixe vazio se ainda não usa TikTok — o ícone não aparece no site.",
  },
  {
    id: "youtube",
    label: "YouTube (opcional)",
    icon: Youtube,
    placeholder: "https://youtube.com/@suaempresa",
    hint: "Ótimo para vídeos de instalação e depoimentos.",
  },
  {
    id: "linkedin",
    label: "LinkedIn (opcional)",
    icon: Linkedin,
    placeholder: "https://linkedin.com/company/suaempresa",
    hint: "Indicado para clientes de automação predial e industrial.",
  },
  {
    id: "googleBusiness",
    label: "Google Meu Negócio (opcional)",
    icon: MapPin,
    placeholder: "https://maps.app.goo.gl/...",
    hint: "Compartilhe sua ficha no Maps para receber avaliações.",
  },
];

const valido = (v: string) => !v.trim() || /^https?:\/\/.+\..+/.test(v.trim());

/** Editor dos links de redes sociais usados em todo o site. */
export function SocialLinksManager() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["social-links"],
    queryFn: fetchSocialLinks,
    retry: false,
  });

  const [form, setForm] = useState<SocialLinks | null>(null);

  useEffect(() => {
    if (data && !form) setForm(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const salvar = useMutation({
    mutationFn: async (values: SocialLinks) => {
      const rows = (Object.keys(SOCIAL_KEYS) as SocialNetwork[]).map((id) => ({
        key: SOCIAL_KEYS[id],
        value: values[id].trim(),
      }));
      const { error } = await supabase
        .from("site_settings")
        .upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social-links"] });
      toast.success("Links salvos! Já aparecem no site inteiro.");
    },
    onError: (e: unknown) =>
      toast.error(
        e instanceof Error ? `Não foi possível salvar: ${e.message}` : "Não foi possível salvar",
      ),
  });

  if (isLoading || !form) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-card">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando links...
      </div>
    );
  }

  const invalidos = CAMPOS.filter((c) => !valido(form[c.id]));

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex items-center gap-2">
        <Instagram className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-bold">Redes sociais do site</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Cole aqui o endereço de cada perfil. Eles passam a valer no topo do site, no rodapé, na
        página de links da bio e nos dados que o Google usa para reconhecer sua empresa. Se você
        ainda não criou um perfil, deixe o campo vazio.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {CAMPOS.map(({ id, label, icon: Icon, placeholder, hint }) => {
          const value = form[id];
          const erro = !valido(value);
          return (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={`social-${id}`} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" /> {label}
              </Label>
              <div className="flex gap-2">
                <Input
                  id={`social-${id}`}
                  value={value}
                  placeholder={placeholder}
                  inputMode="url"
                  onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                  className={erro ? "border-destructive" : undefined}
                />
                {value.trim() && !erro && (
                  <Button asChild size="icon" variant="outline" aria-label={`Abrir ${label}`}>
                    <a href={value.trim()} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              <p
                className={`flex items-start gap-1.5 text-xs ${
                  erro ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {erro ? (
                  <>
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Endereço inválido — deve
                    começar com https://
                  </>
                ) : (
                  hint
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          onClick={() => salvar.mutate(form)}
          disabled={salvar.isPending || invalidos.length > 0}
        >
          {salvar.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar links
        </Button>
        {salvar.isSuccess && !salvar.isPending && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Publicado no site
          </span>
        )}
      </div>
    </div>
  );
}
