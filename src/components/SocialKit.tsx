import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download, ImageDown, Loader2, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  CAPTIONS,
  GRAPHIC_SPECS,
  downloadBlob,
  renderGraphic,
  type GraphicFormat,
  type GraphicSource,
} from "@/lib/social-graphics";
import { trackEvent } from "@/lib/analytics";

interface SocialKitProps {
  source: GraphicSource;
  /** Compacto para listas (admin). */
  compact?: boolean;
}

/**
 * Kit de divulgação: gera as peças gráficas no navegador (canvas)
 * e oferece download, compartilhamento nativo e legendas prontas.
 */
export function SocialKit({ source, compact = false }: SocialKitProps) {
  const [previews, setPreviews] = useState<Partial<Record<GraphicFormat, string>>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(!compact);

  const key = source.slug;

  useEffect(() => {
    if (!open) return;
    let alive = true;
    const urls: string[] = [];
    (async () => {
      for (const spec of GRAPHIC_SPECS) {
        try {
          const blob = await renderGraphic(spec.id, source);
          if (!alive) return;
          const url = URL.createObjectURL(blob);
          urls.push(url);
          setPreviews((p) => ({ ...p, [spec.id]: url }));
        } catch {
          /* ignora peça que falhar */
        }
      }
    })();
    return () => {
      alive = false;
      urls.forEach((u) => URL.revokeObjectURL(u));
      setPreviews({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, open, source.coverImage]);

  const groups = useMemo(
    () => ({
      principal: GRAPHIC_SPECS.filter((s) => s.group === "principal"),
      carrossel: GRAPHIC_SPECS.filter((s) => s.group === "carrossel"),
    }),
    [],
  );

  async function download(format: GraphicFormat) {
    setBusy(format);
    try {
      const blob = await renderGraphic(format, source);
      downloadBlob(blob, `${source.slug}-${format}.png`);
      trackEvent("share_click", { method: `graphic_${format}`, slug: source.slug });
    } catch {
      toast.error("Não consegui gerar esta imagem.");
    } finally {
      setBusy(null);
    }
  }

  async function downloadGroup(ids: GraphicFormat[], label: string) {
    setBusy(label);
    try {
      for (const id of ids) {
        const blob = await renderGraphic(id, source);
        downloadBlob(blob, `${source.slug}-${id}.png`);
        await new Promise((r) => setTimeout(r, 350));
      }
      toast.success("Imagens baixadas.");
      trackEvent("share_click", { method: `graphic_pack_${label}`, slug: source.slug });
    } catch {
      toast.error("Falha ao gerar o pacote.");
    } finally {
      setBusy(null);
    }
  }

  async function shareImage(format: GraphicFormat) {
    setBusy(format);
    try {
      const blob = await renderGraphic(format, source);
      const file = new File([blob], `${source.slug}-${format}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: source.title, text: source.excerpt });
        trackEvent("share_click", { method: `graphic_share_${format}`, slug: source.slug });
      } else {
        downloadBlob(blob, `${source.slug}-${format}.png`);
      }
    } catch {
      /* cancelado */
    } finally {
      setBusy(null);
    }
  }

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      trackEvent("share_click", { method: `caption_${id}`, slug: source.slug });
      setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error("Não consegui copiar.");
    }
  }

  if (compact && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/15"
      >
        <ImageDown className="h-3.5 w-3.5" /> Material de divulgação
      </button>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-display text-base font-bold">Kit de divulgação</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Peças geradas automaticamente com a identidade do site. Baixe, compartilhe
            e use a legenda pronta.
          </p>
        </div>
        {compact && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Fechar
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => downloadGroup(GRAPHIC_SPECS.map((s) => s.id), "tudo")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {busy === "tudo" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          Baixar todas ({GRAPHIC_SPECS.length})
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => downloadGroup(groups.carrossel.map((s) => s.id), "carrossel")}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-energy px-3 py-2 text-xs font-bold text-energy-foreground shadow-energy hover:opacity-95 disabled:opacity-60"
        >
          {busy === "carrossel" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          Carrossel 4 slides
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {GRAPHIC_SPECS.map((spec) => (
          <div key={spec.id} className="overflow-hidden rounded-xl border bg-background">
            <div className="grid aspect-square place-items-center bg-muted/40">
              {previews[spec.id] ? (
                <img
                  src={previews[spec.id]}
                  alt={`Prévia ${spec.label}`}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="p-2.5">
              <div className="truncate text-[11px] font-bold">{spec.label}</div>
              <div className="truncate text-[10px] text-muted-foreground">{spec.hint}</div>
              <div className="mt-2 flex gap-1.5">
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => download(spec.id)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-border px-2 py-1.5 text-[11px] font-semibold hover:bg-accent disabled:opacity-60"
                >
                  {busy === spec.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                  Baixar
                </button>
                <button
                  type="button"
                  aria-label={`Compartilhar ${spec.label}`}
                  disabled={busy !== null}
                  onClick={() => shareImage(spec.id)}
                  className="rounded-md border border-primary/40 bg-primary/10 px-2 py-1.5 text-primary hover:bg-primary/15 disabled:opacity-60"
                >
                  <Share2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Legendas prontas
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {CAPTIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => copyText(c.id, c.build(source))}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-semibold hover:bg-accent"
            >
              {copied === c.id ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-primary" />
              )}
              {copied === c.id ? "Copiado!" : c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}