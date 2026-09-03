import { useState } from "react";
import { toast } from "sonner";
import { Copy, Megaphone, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AD_COPY_LIBRARY, CAMPAIGN_CHECKLIST } from "@/lib/campaign";
import { SITE_CONFIG } from "@/lib/site-config";

const CANAIS = ["Todos", "Meta Ads", "Google Ads", "Instagram", "WhatsApp"] as const;

/** Biblioteca de textos de anúncio + checklist de campanha. */
export function AdCopyLibrary() {
  const [canal, setCanal] = useState<(typeof CANAIS)[number]>("Todos");
  const [feitos, setFeitos] = useState<string[]>([]);

  const lista = AD_COPY_LIBRARY.filter((c) => canal === "Todos" || c.canal === canal);

  const copy = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto.replace("{empresa}", SITE_CONFIG.name));
      toast.success("Texto copiado!");
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold">Biblioteca de anúncios</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Textos prontos para colar no Gerenciador de Anúncios, no Google Ads e nas redes.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {CANAIS.map((c) => (
            <button
              key={c}
              onClick={() => setCanal(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                canal === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {lista.map((c) => (
            <article key={c.id} className="rounded-xl border bg-muted/30 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                  {c.canal}
                </span>
                <span className="text-muted-foreground">{c.objetivo}</span>
              </div>
              <h3 className="mt-2 font-display font-bold text-foreground">{c.titulo}</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{c.texto}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-foreground">CTA: {c.cta}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto"
                  onClick={() => copy(`${c.titulo}\n\n${c.texto}\n\n${c.cta}`)}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copiar
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold">Checklist da campanha</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Marque antes de subir o anúncio. {feitos.length}/{CAMPAIGN_CHECKLIST.length} concluídos.
        </p>
        <ul className="mt-4 space-y-2">
          {CAMPAIGN_CHECKLIST.map((item) => {
            const ativo = feitos.includes(item);
            return (
              <li key={item}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3 text-sm transition-colors hover:border-primary/50">
                  <input
                    type="checkbox"
                    checked={ativo}
                    onChange={() =>
                      setFeitos((prev) =>
                        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
                      )
                    }
                    className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]"
                  />
                  <span className={ativo ? "text-muted-foreground line-through" : "text-foreground"}>
                    {item}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
