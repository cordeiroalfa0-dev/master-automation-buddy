import { useState } from "react";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Linkedin,
  Copy,
  Check,
  Download,
  Share2,
  Send,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

interface BlogShareProps {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string | null;
}

function postUrl(slug: string, source: string, medium = "social") {
  const url = new URL(`${SITE_CONFIG.url}/blog/${slug}`);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", "blog_share");
  return url.toString();
}

/**
 * Compartilhamento de artigos do blog.
 * Facebook/LinkedIn/X/WhatsApp abrem o compartilhador oficial.
 * Instagram não permite postar por link — por isso oferecemos
 * "copiar legenda" + "baixar imagem de capa" (colar no app).
 */
export function BlogShare({ title, excerpt, slug, coverImage }: BlogShareProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const igCaption = `${title}\n\n${excerpt}\n\n📖 Leia o artigo completo no link da bio 👉 ${postUrl(slug, "instagram")}\n\n#automacaoresidencial #casainteligente #curitiba #smarthome #automacao #masterautomacao`;

  const links = [
    {
      key: "facebook",
      label: "Facebook",
      Icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl(slug, "facebook"))}`,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      Icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${postUrl(slug, "whatsapp")}`)}`,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      Icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl(slug, "linkedin"))}`,
    },
    {
      key: "telegram",
      label: "Telegram",
      Icon: Send,
      href: `https://t.me/share/url?url=${encodeURIComponent(postUrl(slug, "telegram"))}&text=${encodeURIComponent(title)}`,
    },
  ];

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      trackEvent("share_click", { method: `blog_copy_${key}`, slug });
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* ignore */
    }
  }

  async function downloadCover() {
    if (!coverImage) return;
    trackEvent("share_click", { method: "blog_cover_download", slug });
    try {
      const res = await fetch(coverImage);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(coverImage, "_blank");
    }
  }

  async function nativeShare() {
    trackEvent("share_click", { method: "blog_native", slug });
    try {
      if (navigator.share) {
        await navigator.share({ title, text: excerpt, url: postUrl(slug, "native_share") });
      }
    } catch {
      /* cancelado */
    }
  }

  return (
    <div className="mt-12 rounded-2xl border bg-card p-5 md:p-6">
      <div className="flex items-center gap-2">
        <Share2 className="h-4 w-4 text-primary" />
        <h3 className="font-display text-base font-bold">Compartilhe este artigo</h3>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Cada link já vem com rastreamento UTM para você saber de onde vêm as visitas.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {links.map(({ key, label, Icon, href }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("share_click", { method: `blog_${key}`, slug })}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold hover:bg-accent"
          >
            <Icon className="h-4 w-4 text-primary" /> {label}
          </a>
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => copy("link", postUrl(slug, "copy_link", "referral"))}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold hover:bg-accent"
        >
          {copied === "link" ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-primary" />}
          {copied === "link" ? "Link copiado" : "Copiar link"}
        </button>
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5 text-xs font-semibold text-primary hover:bg-primary/15 sm:hidden"
        >
          <Share2 className="h-4 w-4" /> Compartilhar no celular
        </button>
      </div>

      <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-2">
          <Instagram className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wide">Postar no Instagram</span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          O Instagram não aceita publicação por link. Baixe a capa, copie a legenda pronta
          (já com hashtags e link) e cole no app.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {coverImage && (
            <button
              type="button"
              onClick={downloadCover}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-energy px-3 py-2 text-xs font-bold text-energy-foreground shadow-energy hover:opacity-95"
            >
              <Download className="h-3.5 w-3.5" /> Baixar capa
            </button>
          )}
          <button
            type="button"
            onClick={() => copy("caption", igCaption)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
          >
            {copied === "caption" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied === "caption" ? "Legenda copiada" : "Copiar legenda"}
          </button>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent"
          >
            <Instagram className="h-3.5 w-3.5" /> Abrir Instagram
          </a>
        </div>
      </div>
    </div>
  );
}