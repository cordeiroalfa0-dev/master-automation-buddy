import { useState } from "react";
import { Share2, Check, Copy, Facebook, MessageCircle, X as XIcon } from "lucide-react";
import shareImage from "@/assets/share-promo.jpg";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

const SHARE_TEXT = `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}. Automação residencial, predial e industrial em Curitiba.`;
const SHARE_URL = SITE_CONFIG.url;

/**
 * Botão flutuante de compartilhamento.
 * Usa Web Share API com arquivo (imagem promocional) quando disponível.
 * Fallback: modal com opções (WhatsApp, Facebook, X, copiar link).
 */
export function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function nativeShare() {
    trackEvent("share_click", { method: "native" });
    try {
      const res = await fetch(shareImage);
      const blob = await res.blob();
      const file = new File([blob], "master-automacao.jpg", { type: blob.type });
      const nav = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({
          files: [file],
          title: SITE_CONFIG.name,
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
        return true;
      }
      if (navigator.share) {
        await navigator.share({ title: SITE_CONFIG.name, text: SHARE_TEXT, url: SHARE_URL });
        return true;
      }
    } catch {
      /* usuário cancelou ou navegador não suporta — cai no modal */
    }
    return false;
  }

  async function onClick() {
    const ok = await nativeShare();
    if (!ok) setOpen(true);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      trackEvent("share_click", { method: "copy" });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  const encodedText = encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`);
  const encodedUrl = encodeURIComponent(SHARE_URL);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label="Compartilhar site"
        className="fixed bottom-24 right-6 z-40 hidden h-12 w-12 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant transition-spring hover:scale-110 md:grid"
      >
        <Share2 className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Compartilhar"
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm md:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-elegant"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 className="font-display text-base font-bold">Compartilhar</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <img
                src={shareImage}
                alt="Imagem promocional Master Automação"
                loading="lazy"
                width={1080}
                height={1080}
                className="mb-4 aspect-square w-full rounded-xl border border-border object-cover"
              />

              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodedText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_click", { method: "whatsapp" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 text-xs font-semibold hover:bg-accent"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white">
                    <MessageCircle className="h-5 w-5" fill="currentColor" />
                  </span>
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_click", { method: "facebook" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 text-xs font-semibold hover:bg-accent"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1877F2] text-white">
                    <Facebook className="h-5 w-5" fill="currentColor" />
                  </span>
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodedText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_click", { method: "x" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 text-xs font-semibold hover:bg-accent"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background">
                    <XIcon className="h-5 w-5" />
                  </span>
                  X
                </a>
              </div>

              <button
                type="button"
                onClick={copyLink}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-accent"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-success" /> Link copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copiar link
                  </>
                )}
              </button>

              <a
                href={shareImage}
                download="master-automacao.jpg"
                onClick={() => trackEvent("share_click", { method: "download" })}
                className="mt-2 block text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Baixar imagem de divulgação
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}