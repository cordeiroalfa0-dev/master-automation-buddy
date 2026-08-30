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
  Send,
  Linkedin,
  Mail,
  QrCode,
  Twitter,
  Sparkles,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useMemo } from "react";
import sharePromo from "@/assets/share-promo.jpg";
import shareStory from "@/assets/share-story.jpg";
import shareFacebook from "@/assets/share-facebook.jpg";
import carousel1 from "@/assets/carousel-1.jpg";
import carousel2 from "@/assets/carousel-2.jpg";
import carousel3 from "@/assets/carousel-3.jpg";
import carousel4 from "@/assets/carousel-4.jpg";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

const BASE_URL = SITE_CONFIG.url;

/** Anexa parâmetros UTM para rastrear origem de cada compartilhamento. */
function buildShareUrl(source: string, medium = "social", campaign = "share_button") {
  const url = new URL(BASE_URL);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

/** Textos prontos para divulgação em diferentes formatos. */
const COPY_TEMPLATES = [
  {
    key: "curto",
    label: "Curto (WhatsApp)",
    text: `⚡ ${SITE_CONFIG.name} — Automação residencial, predial e industrial em Curitiba. Orçamento em até 2h úteis: `,
  },
  {
    key: "medio",
    label: "Médio (Stories / Feed)",
    text: `Sua casa ou empresa mais inteligente, segura e eficiente. 🏠🔒\n\n${SITE_CONFIG.name} entrega automação residencial, predial e industrial em Curitiba e região — +500 projetos, equipe certificada e garantia em todos os serviços.\n\nOrçamento sem compromisso: `,
  },
  {
    key: "longo",
    label: "Longo (Legenda de post)",
    text: `🚀 Automação que transforma seu espaço.\n\nNa ${SITE_CONFIG.name} projetamos e instalamos:\n• Automação residencial (iluminação, cortinas, áudio, climatização)\n• Automação predial e comercial\n• Automação industrial\n• Segurança eletrônica e CFTV\n\n📍 Curitiba e região metropolitana\n✅ +500 projetos entregues\n✅ Equipe certificada\n✅ Garantia em todos os serviços\n\nPeça seu orçamento (resposta em até 2h úteis): `,
  },
] as const;

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
  const [tab, setTab] = useState<"imagens" | "texto" | "qr">("imagens");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const current = FORMATS.find((f) => f.key === format)!;
  const activeImage = current.images[Math.min(slide, current.images.length - 1)];

  const qrUrl = useMemo(() => buildShareUrl("qrcode", "offline", "qr_share"), []);

  useEffect(() => {
    if (tab !== "qr" || qrDataUrl) return;
    QRCode.toDataURL(qrUrl, {
      width: 512,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
      errorCorrectionLevel: "H",
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [tab, qrUrl, qrDataUrl]);

  function selectFormat(k: FormatKey) {
    setFormat(k);
    setSlide(0);
  }

  async function nativeShareCurrent() {
    trackEvent("share_click", { method: "native", format });
    const shareUrl = buildShareUrl("native_share");
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
          text: COPY_TEMPLATES[0].text,
          url: shareUrl,
        });
        return true;
      }
      if (navigator.share) {
        await navigator.share({ title: SITE_CONFIG.name, text: COPY_TEMPLATES[0].text, url: shareUrl });
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
      await navigator.clipboard.writeText(buildShareUrl("copy_link", "referral"));
      setCopied(true);
      trackEvent("share_click", { method: "copy" });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function copyTemplate(key: string, text: string, source: string) {
    try {
      const full = `${text}${buildShareUrl(source, "copy_text")}`;
      await navigator.clipboard.writeText(full);
      setCopiedKey(key);
      trackEvent("share_click", { method: "copy_template", template: key });
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      /* ignore */
    }
  }

  async function downloadQr() {
    if (!qrDataUrl) return;
    trackEvent("share_click", { method: "qr_download" });
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "master-automacao-qrcode.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const waText = encodeURIComponent(`${COPY_TEMPLATES[0].text}${buildShareUrl("whatsapp")}`);
  const tgText = encodeURIComponent(`${COPY_TEMPLATES[0].text}${buildShareUrl("telegram")}`);
  const xText = encodeURIComponent(`${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`);
  const fbUrl = encodeURIComponent(buildShareUrl("facebook"));
  const liUrl = encodeURIComponent(buildShareUrl("linkedin"));
  const twUrl = encodeURIComponent(buildShareUrl("twitter"));
  const tgUrl = encodeURIComponent(buildShareUrl("telegram"));
  const mailSubject = encodeURIComponent(`${SITE_CONFIG.name} — Automação em Curitiba`);
  const mailBody = encodeURIComponent(`${COPY_TEMPLATES[1].text}${buildShareUrl("email", "email")}`);
  const smsBody = encodeURIComponent(`${COPY_TEMPLATES[0].text}${buildShareUrl("sms", "sms")}`);

  return (
    <>
      <button
        type="button"
        onClick={onFabClick}
        aria-label="Compartilhar site"
        className="fixed right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant transition-spring hover:scale-110 bottom-40 md:bottom-24 md:right-6"
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
                <h2 className="font-display text-base font-bold leading-tight">Kit de Divulgação</h2>
                <p className="text-[11px] text-muted-foreground">Imagens, textos prontos e QR code — tudo rastreado por UTM</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 border-b border-border bg-muted/30 text-xs font-semibold">
              {([
                { k: "imagens", label: "Imagens" },
                { k: "texto", label: "Textos" },
                { k: "qr", label: "QR Code" },
              ] as const).map((t) => (
                <button
                  key={t.k}
                  type="button"
                  onClick={() => setTab(t.k)}
                  className={`py-2.5 transition-colors ${
                    tab === t.k
                      ? "border-b-2 border-primary bg-background text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-5">
            {tab === "imagens" && (
              <>
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
              </>
            )}

            {tab === "texto" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-muted-foreground">
                    Textos prontos para colar no WhatsApp, Instagram, Facebook ou grupos. O link
                    já vem com <strong>UTM</strong> para você medir de onde vieram os cliques.
                  </p>
                </div>
                {COPY_TEMPLATES.map((tpl) => (
                  <div key={tpl.key} className="rounded-xl border border-border bg-background p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                        {tpl.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyTemplate(tpl.key, tpl.text, `text_${tpl.key}`)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground hover:opacity-90"
                      >
                        {copiedKey === tpl.key ? (
                          <>
                            <Check className="h-3 w-3" /> Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copiar
                          </>
                        )}
                      </button>
                    </div>
                    <p className="whitespace-pre-line text-xs leading-relaxed text-foreground/90">
                      {tpl.text}
                      <span className="font-mono text-primary">{BASE_URL}</span>
                    </p>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`sms:?&body=${smsBody}`}
                    onClick={() => trackEvent("share_click", { method: "sms" })}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold hover:bg-accent"
                  >
                    <MessageCircle className="h-4 w-4" /> Enviar por SMS
                  </a>
                  <a
                    href={`mailto:?subject=${mailSubject}&body=${mailBody}`}
                    onClick={() => trackEvent("share_click", { method: "email" })}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold hover:bg-accent"
                  >
                    <Mail className="h-4 w-4" /> Enviar por e-mail
                  </a>
                </div>
              </div>
            )}

            {tab === "qr" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs">
                  <QrCode className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-muted-foreground">
                    Use este QR code em <strong>cartões de visita, adesivos, faixas, panfletos e uniformes</strong>.
                    O link já traz UTM offline para você saber que veio do QR.
                  </p>
                </div>
                <div className="mx-auto w-full max-w-xs rounded-xl border border-border bg-white p-4">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="QR code Abael Automação"
                      className="mx-auto h-auto w-full"
                    />
                  ) : (
                    <div className="grid aspect-square place-items-center text-xs text-muted-foreground">
                      Gerando QR…
                    </div>
                  )}
                </div>
                <p className="text-center text-[11px] text-muted-foreground break-all">{qrUrl}</p>
                <button
                  type="button"
                  onClick={downloadQr}
                  disabled={!qrDataUrl}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-energy px-4 py-3 text-sm font-bold text-energy-foreground shadow-energy hover:opacity-95 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" /> Baixar QR code (PNG)
                </button>
              </div>
            )}

              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Compartilhar em
                </p>
                <div className="grid grid-cols-4 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_click", { method: "whatsapp" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-2.5 text-[11px] font-semibold hover:bg-accent"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white">
                    <MessageCircle className="h-4 w-4" fill="currentColor" />
                  </span>
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${fbUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_click", { method: "facebook" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-2.5 text-[11px] font-semibold hover:bg-accent"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1877F2] text-white">
                    <Facebook className="h-4 w-4" fill="currentColor" />
                  </span>
                  Facebook
                </a>
                <a
                  href={`https://t.me/share/url?url=${tgUrl}&text=${tgText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_click", { method: "telegram" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-2.5 text-[11px] font-semibold hover:bg-accent"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#229ED9] text-white">
                    <Send className="h-4 w-4" fill="currentColor" />
                  </span>
                  Telegram
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${liUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_click", { method: "linkedin" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-2.5 text-[11px] font-semibold hover:bg-accent"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0A66C2] text-white">
                    <Linkedin className="h-4 w-4" fill="currentColor" />
                  </span>
                  LinkedIn
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${twUrl}&text=${xText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_click", { method: "twitter" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-2.5 text-[11px] font-semibold hover:bg-accent"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white">
                    <Twitter className="h-4 w-4" fill="currentColor" />
                  </span>
                  X / Twitter
                </a>
                <a
                  href={`mailto:?subject=${mailSubject}&body=${mailBody}`}
                  onClick={() => trackEvent("share_click", { method: "email" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-2.5 text-[11px] font-semibold hover:bg-accent"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-muted-foreground text-background">
                    <Mail className="h-4 w-4" />
                  </span>
                  E-mail
                </a>
                <a
                  href={`sms:?&body=${smsBody}`}
                  onClick={() => trackEvent("share_click", { method: "sms" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-2.5 text-[11px] font-semibold hover:bg-accent"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  SMS
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_click", { method: "instagram" })}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-2.5 text-[11px] font-semibold hover:bg-accent"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white">
                    <Instagram className="h-4 w-4" />
                  </span>
                  Instagram
                </a>
                </div>
              </div>

              <button
                type="button"
                onClick={copyLink}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-accent"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-success" /> Link copiado (com UTM)!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copiar link com UTM
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Todo link inclui UTM para rastrear a origem no Google Analytics.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}