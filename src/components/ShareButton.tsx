import { useState } from "react";
import {
  Share2,
  Check,
  Copy,
  Facebook,
  MessageCircle,
  Instagram,
  Download,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import sharePromo from "@/assets/share-promo.jpg";
import shareStory from "@/assets/share-story.jpg";
import shareFacebook from "@/assets/share-facebook.jpg";
import carousel1 from "@/assets/carousel-1.jpg";
import carousel2 from "@/assets/carousel-2.jpg";
import carousel3 from "@/assets/carousel-3.jpg";
import carousel4 from "@/assets/carousel-4.jpg";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

const SHARE_TEXT = `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}. Automação residencial, predial e industrial em Curitiba.`;
const SHARE_URL = SITE_CONFIG.url;

type FormatKey = "instagram" | "carousel" | "story" | "facebook" | "whatsapp";

type FormatDef = {
  key: FormatKey;
  label: string;
  size: string;
  images: { src: string; filename: string }[];
};

const FORMATS: FormatDef[] = [
  {
    key: "instagram",
    label: "Instagram Feed",
    size: "1080 × 1080 · quadrado",
    images: [{ src: sharePromo, filename: "master-automacao-instagram.jpg" }],
  },
  {
    key: "carousel",
    label: "Carrossel (4 slides)",
    size: "1080 × 1350 · 4:5",
    images: [
      { src: carousel1, filename: "master-carrossel-1.jpg" },
      { src: carousel2, filename: "master-carrossel-2.jpg" },
      { src: carousel3, filename: "master-carrossel-3.jpg" },
      { src: carousel4, filename: "master-carrossel-4.jpg" },
    ],
  },
  {
    key: "story",
    label: "Story / Status",
    size: "1080 × 1920 · 9:16",
    images: [{ src: shareStory, filename: "master-story.jpg" }],
  },
  {
    key: "facebook",
    label: "Facebook",
    size: "1200 × 630 · 1.91:1",
    images: [{ src: shareFacebook, filename: "master-facebook.jpg" }],
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    size: "1080 × 1080 · quadrado",
    images: [{ src: sharePromo, filename: "master-whatsapp.jpg" }],
  },
];

/**
 * Botão flutuante de compartilhamento.
 * Usa Web Share API com arquivo (imagem promocional) quando disponível.
 * Fallback: modal com opções (WhatsApp, Facebook, X, copiar link).
 */
export function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<FormatKey>("instagram");
  const [slide, setSlide] = useState(0);

  const current = FORMATS.find((f) => f.key === format)!;
  const activeImage = current.images[Math.min(slide, current.images.length - 1)];

  function selectFormat(k: FormatKey) {
    setFormat(k);
    setSlide(0);
  }

  async function nativeShareCurrent() {
    trackEvent("share_click", { method: "native", format });
    try {
      const files: File[] = [];
      for (const img of current.images) {
        const res = await fetch(img.src);
        const blob = await res.blob();
        files.push(new File([blob], img.filename, { type: blob.type }));
      }
      const nav = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };
      if (nav.canShare?.({ files })) {
        await nav.share({
          files,
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

  async function onFabClick() {
    setOpen(true);
  }

  async function downloadImage(src: string, filename: string) {
    trackEvent("share_click", { method: "download", format, filename });
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, "_blank");
    }
  }

  async function downloadAll() {
    for (const img of current.images) {
      // eslint-disable-next-line no-await-in-loop
      await downloadImage(img.src, img.filename);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 250));
    }
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
        onClick={onFabClick}
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
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-elegant"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-3 backdrop-blur">
              <div>
                <h2 className="font-display text-base font-bold leading-tight">Compartilhar</h2>
                <p className="text-[11px] text-muted-foreground">Escolha o formato e baixe ou publique</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4 flex flex-wrap gap-1.5">
                {FORMATS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => selectFormat(f.key)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      format === f.key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative mb-2 overflow-hidden rounded-xl border border-border bg-muted/30">
                <img
                  src={activeImage.src}
                  alt={`Imagem ${current.label}`}
                  loading="lazy"
                  className="mx-auto max-h-[52vh] w-auto object-contain"
                />
                {current.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSlide((s) => (s - 1 + current.images.length) % current.images.length)}
                      aria-label="Slide anterior"
                      className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlide((s) => (s + 1) % current.images.length)}
                      aria-label="Próximo slide"
                      className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {current.images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSlide(i)}
                          aria-label={`Ir para slide ${i + 1}`}
                          className={`h-1.5 rounded-full transition-all ${
                            i === slide ? "w-5 bg-primary" : "w-1.5 bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <p className="mb-4 text-center text-[11px] text-muted-foreground">
                {current.size}
                {current.images.length > 1 && ` · slide ${slide + 1}/${current.images.length}`}
              </p>

              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => downloadImage(activeImage.src, activeImage.filename)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-energy px-4 py-3 text-sm font-bold text-energy-foreground shadow-energy hover:opacity-95"
                >
                  <Download className="h-4 w-4" /> Baixar imagem
                </button>
                {current.images.length > 1 && (
                  <button
                    type="button"
                    onClick={downloadAll}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-accent"
                  >
                    <Download className="h-4 w-4" /> Todas
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={nativeShareCurrent}
                className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/15"
              >
                <Share2 className="h-4 w-4" /> Compartilhar direto no celular
              </button>

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
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_click", { method: "instagram" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 text-xs font-semibold hover:bg-accent"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white">
                    <Instagram className="h-5 w-5" />
                  </span>
                  Instagram
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

              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Instagram não aceita upload direto pelo navegador — baixe a imagem e publique pelo app.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}