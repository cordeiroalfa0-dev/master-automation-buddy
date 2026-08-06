/**
 * Gerador de material gráfico de divulgação (client-side, via <canvas>).
 * Cria peças prontas para Instagram feed/story, carrossel, Facebook,
 * LinkedIn/OG e WhatsApp a partir de um artigo do blog.
 */
import { SITE_CONFIG } from "@/lib/site-config";
import type { BlogBlock } from "@/lib/blog-types";

const BRAND = {
  bg: "#0a1020",
  bg2: "#0f1d3d",
  primary: "#1f5bd7",
  glow: "#3d86ff",
  energy: "#f5c451",
  energy2: "#eda336",
  text: "#ffffff",
  muted: "#c3ccdd",
};

export type GraphicFormat =
  | "feed"
  | "story"
  | "og"
  | "carousel1"
  | "carousel2"
  | "carousel3"
  | "carousel4"
  | "quote";

export interface GraphicSpec {
  id: GraphicFormat;
  label: string;
  hint: string;
  width: number;
  height: number;
  group: "principal" | "carrossel";
}

export const GRAPHIC_SPECS: GraphicSpec[] = [
  { id: "feed", label: "Feed 1:1", hint: "Instagram / Facebook · 1080×1080", width: 1080, height: 1080, group: "principal" },
  { id: "story", label: "Story 9:16", hint: "Stories / Status / Reels capa · 1080×1920", width: 1080, height: 1920, group: "principal" },
  { id: "og", label: "Link 1.91:1", hint: "Facebook / LinkedIn / X · 1200×630", width: 1200, height: 630, group: "principal" },
  { id: "quote", label: "Card citação", hint: "Frase de destaque · 1080×1080", width: 1080, height: 1080, group: "principal" },
  { id: "carousel1", label: "Slide 1 · Capa", hint: "Carrossel 4:5 · 1080×1350", width: 1080, height: 1350, group: "carrossel" },
  { id: "carousel2", label: "Slide 2 · Pontos", hint: "Carrossel 4:5 · 1080×1350", width: 1080, height: 1350, group: "carrossel" },
  { id: "carousel3", label: "Slide 3 · Dica", hint: "Carrossel 4:5 · 1080×1350", width: 1080, height: 1350, group: "carrossel" },
  { id: "carousel4", label: "Slide 4 · CTA", hint: "Carrossel 4:5 · 1080×1350", width: 1080, height: 1350, group: "carrossel" },
];

export interface GraphicSource {
  title: string;
  excerpt: string;
  category?: string;
  slug: string;
  coverImage?: string | null;
  content?: BlogBlock[];
}

/* ------------------------------- helpers -------------------------------- */

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 99,
) {
  const lines = wrap(ctx, text, maxWidth).slice(0, maxLines);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

function bgGradient(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, BRAND.bg);
  g.addColorStop(0.55, BRAND.bg2);
  g.addColorStop(1, BRAND.primary);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // brilho diagonal
  const glow = ctx.createRadialGradient(w * 0.85, h * 0.1, 0, w * 0.85, h * 0.1, w * 0.9);
  glow.addColorStop(0, "rgba(61,134,255,0.45)");
  glow.addColorStop(1, "rgba(61,134,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // grade sutil
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 2;
  for (let i = 0; i < w; i += 90) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, h);
    ctx.stroke();
  }
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function coverDraw(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const r = Math.max(w / img.width, h / img.height);
  const nw = img.width * r;
  const nh = img.height * r;
  ctx.drawImage(img, x + (w - nw) / 2, y + (h - nh) / 2, nw, nh);
}

function badge(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.font = "700 26px Inter, system-ui, sans-serif";
  const padX = 26;
  const w = ctx.measureText(text.toUpperCase()).width + padX * 2;
  const h = 56;
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, BRAND.energy);
  g.addColorStop(1, BRAND.energy2);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 28);
  ctx.fill();
  ctx.fillStyle = "#12203c";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), x + padX, y + h / 2 + 1);
  ctx.textBaseline = "alphabetic";
  return y + h;
}

function footer(ctx: CanvasRenderingContext2D, w: number, h: number, pad: number) {
  ctx.fillStyle = BRAND.energy;
  ctx.font = "800 30px Inter, system-ui, sans-serif";
  ctx.fillText(SITE_CONFIG.name.toUpperCase(), pad, h - pad - 34);
  ctx.fillStyle = BRAND.muted;
  ctx.font = "500 26px Inter, system-ui, sans-serif";
  ctx.fillText(`${SITE_CONFIG.contact.phone} · Curitiba e região`, pad, h - pad + 4);

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "500 24px Inter, system-ui, sans-serif";
  const site = SITE_CONFIG.url.replace(/^https?:\/\//, "");
  ctx.fillText(site, w - pad - ctx.measureText(site).width, h - pad + 4);
}

function keyPoints(source: GraphicSource): string[] {
  const pts: string[] = [];
  for (const b of source.content ?? []) {
    if (b.type === "ul") pts.push(...b.items);
    else if (b.type === "h2") pts.push(b.text);
    if (pts.length >= 8) break;
  }
  if (!pts.length) pts.push(source.excerpt);
  return pts.map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
}

function quoteText(source: GraphicSource): string {
  const q = (source.content ?? []).find((b) => b.type === "quote");
  if (q && q.type === "quote") return q.text;
  return source.excerpt;
}

/* -------------------------------- render -------------------------------- */

export async function renderGraphic(
  format: GraphicFormat,
  source: GraphicSource,
): Promise<Blob> {
  const spec = GRAPHIC_SPECS.find((s) => s.id === format)!;
  const { width: w, height: h } = spec;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const pad = Math.round(w * 0.075);
  const img = source.coverImage ? await loadImage(source.coverImage) : null;

  bgGradient(ctx, w, h);
  ctx.textBaseline = "alphabetic";

  const isCarousel = format.startsWith("carousel");
  const slide = isCarousel ? Number(format.replace("carousel", "")) : 0;

  // Imagem de topo (capa) para peças que usam foto
  const usePhoto = img && (format === "feed" || format === "story" || format === "og" || slide === 1);
  if (usePhoto && img) {
    const imgH = format === "og" ? h : format === "story" ? Math.round(h * 0.52) : Math.round(h * 0.46);
    coverDraw(ctx, img, 0, 0, w, imgH);
    const shade = ctx.createLinearGradient(0, 0, 0, imgH);
    shade.addColorStop(0, "rgba(6,12,26,0.35)");
    shade.addColorStop(1, format === "og" ? "rgba(6,12,26,0.9)" : BRAND.bg);
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, w, imgH);
  }

  if (format === "og") {
    ctx.fillStyle = "rgba(8,14,30,0.55)";
    ctx.fillRect(0, 0, w, h);
    let y = pad + 10;
    y = badge(ctx, source.category || "Blog", pad, y) + 44;
    ctx.fillStyle = BRAND.text;
    ctx.font = "800 60px 'Space Grotesk', Inter, system-ui, sans-serif";
    y = drawLines(ctx, source.title, pad, y + 30, w - pad * 2, 70, 3);
    ctx.fillStyle = BRAND.muted;
    ctx.font = "400 30px Inter, system-ui, sans-serif";
    drawLines(ctx, source.excerpt, pad, y + 30, w - pad * 2, 40, 2);
    footer(ctx, w, h, pad);
    return toBlob(canvas);
  }

  if (format === "quote") {
    ctx.fillStyle = BRAND.energy;
    ctx.font = "800 200px Georgia, serif";
    ctx.fillText("“", pad, pad + 150);
    ctx.fillStyle = BRAND.text;
    ctx.font = "700 56px 'Space Grotesk', Inter, system-ui, sans-serif";
    drawLines(ctx, quoteText(source), pad, pad + 260, w - pad * 2, 78, 7);
    footer(ctx, w, h, pad);
    return toBlob(canvas);
  }

  if (!isCarousel) {
    // feed / story
    const top = usePhoto ? Math.round(h * (format === "story" ? 0.5 : 0.44)) : pad + 60;
    let y = top;
    y = badge(ctx, source.category || "Automação", pad, y) + 50;
    ctx.fillStyle = BRAND.text;
    ctx.font = `800 ${format === "story" ? 74 : 66}px 'Space Grotesk', Inter, system-ui, sans-serif`;
    y = drawLines(ctx, source.title, pad, y + 20, w - pad * 2, format === "story" ? 88 : 80, format === "story" ? 5 : 4);
    ctx.fillStyle = BRAND.muted;
    ctx.font = "400 34px Inter, system-ui, sans-serif";
    y = drawLines(ctx, source.excerpt, pad, y + 42, w - pad * 2, 46, format === "story" ? 5 : 3);

    ctx.fillStyle = BRAND.energy;
    ctx.font = "700 32px Inter, system-ui, sans-serif";
    ctx.fillText(
      format === "story" ? "Arraste para cima e leia o artigo →" : "Leia o artigo completo no site →",
      pad,
      Math.min(y + 70, h - pad - 130),
    );
    footer(ctx, w, h, pad);
    return toBlob(canvas);
  }

  // ------------------------------ carrossel ------------------------------
  const pts = keyPoints(source);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "700 26px Inter, system-ui, sans-serif";
  ctx.fillText(`${slide}/4`, w - pad - 50, pad + 20);

  if (slide === 1) {
    let y = usePhoto ? Math.round(h * 0.5) : pad + 120;
    y = badge(ctx, source.category || "Automação", pad, y) + 56;
    ctx.fillStyle = BRAND.text;
    ctx.font = "800 78px 'Space Grotesk', Inter, system-ui, sans-serif";
    y = drawLines(ctx, source.title, pad, y + 24, w - pad * 2, 92, 5);
    ctx.fillStyle = BRAND.energy;
    ctx.font = "700 32px Inter, system-ui, sans-serif";
    ctx.fillText("Arraste para o lado →", pad, Math.min(y + 64, h - pad - 130));
  } else if (slide === 2 || slide === 3) {
    const chunk = slide === 2 ? pts.slice(0, 3) : pts.slice(3, 6);
    const list = chunk.length ? chunk : [source.excerpt];
    ctx.fillStyle = BRAND.energy;
    ctx.font = "700 30px Inter, system-ui, sans-serif";
    ctx.fillText(slide === 2 ? "O QUE VOCÊ PRECISA SABER" : "NA PRÁTICA", pad, pad + 90);
    let y = pad + 190;
    list.forEach((p, i) => {
      ctx.fillStyle = BRAND.glow;
      ctx.beginPath();
      ctx.arc(pad + 22, y - 16, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = BRAND.text;
      ctx.font = "800 26px Inter, system-ui, sans-serif";
      ctx.fillText(String((slide === 2 ? 0 : 3) + i + 1), pad + 14, y - 8);
      ctx.font = "600 44px 'Space Grotesk', Inter, system-ui, sans-serif";
      y = drawLines(ctx, p, pad + 70, y, w - pad * 2 - 70, 58, 5) + 70;
    });
  } else {
    ctx.fillStyle = BRAND.text;
    ctx.font = "800 84px 'Space Grotesk', Inter, system-ui, sans-serif";
    let y = drawLines(ctx, "Quer isso na sua casa ou empresa?", pad, pad + 260, w - pad * 2, 100, 4);
    ctx.fillStyle = BRAND.muted;
    ctx.font = "400 38px Inter, system-ui, sans-serif";
    y = drawLines(
      ctx,
      "Projeto, instalação e suporte em Curitiba e região metropolitana. Orçamento sem compromisso.",
      pad,
      y + 50,
      w - pad * 2,
      52,
      4,
    );
    const bw = w - pad * 2;
    const g = ctx.createLinearGradient(pad, y + 60, pad + bw, y + 160);
    g.addColorStop(0, BRAND.energy);
    g.addColorStop(1, BRAND.energy2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(pad, y + 60, bw, 110, 55);
    ctx.fill();
    ctx.fillStyle = "#12203c";
    ctx.font = "800 40px Inter, system-ui, sans-serif";
    const cta = `WhatsApp ${SITE_CONFIG.contact.phone}`;
    ctx.fillText(cta, pad + (bw - ctx.measureText(cta).width) / 2, y + 60 + 70);
  }

  footer(ctx, w, h, pad);
  return toBlob(canvas);
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas"))), "image/png", 0.95),
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* ------------------------------- legendas -------------------------------- */

export function postUrlWithUtm(slug: string, source: string, medium = "social") {
  const url = new URL(`${SITE_CONFIG.url}/blog/${slug}`);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", "blog_share");
  return url.toString();
}

const HASHTAGS =
  "#automacaoresidencial #casainteligente #curitiba #smarthome #automacao #masterautomacao #automacaopredial #segurancaeletronica";

export interface CaptionOption {
  id: string;
  label: string;
  build: (s: GraphicSource) => string;
}

export const CAPTIONS: CaptionOption[] = [
  {
    id: "instagram",
    label: "Legenda Instagram",
    build: (s) =>
      `${s.title}\n\n${s.excerpt}\n\n📲 Artigo completo no link da bio.\n📍 Curitiba e região · ${SITE_CONFIG.contact.phone}\n\n${HASHTAGS}`,
  },
  {
    id: "carrossel",
    label: "Legenda do carrossel",
    build: (s) =>
      `${s.title} 👇 arraste para o lado\n\n${keyPoints(s)
        .slice(0, 4)
        .map((p) => `✅ ${p}`)
        .join("\n")}\n\nQuer um projeto assim? Chama no WhatsApp ${SITE_CONFIG.contact.phone}.\n\n${HASHTAGS}`,
  },
  {
    id: "facebook",
    label: "Texto Facebook",
    build: (s) =>
      `${s.title}\n\n${s.excerpt}\n\nLeia o artigo completo: ${postUrlWithUtm(s.slug, "facebook")}\n\n${SITE_CONFIG.name} — automação em Curitiba e região. ${SITE_CONFIG.contact.phone}`,
  },
  {
    id: "linkedin",
    label: "Texto LinkedIn",
    build: (s) =>
      `${s.title}\n\n${s.excerpt}\n\n${keyPoints(s)
        .slice(0, 3)
        .map((p) => `• ${p}`)
        .join("\n")}\n\nArtigo completo: ${postUrlWithUtm(s.slug, "linkedin")}`,
  },
  {
    id: "whatsapp",
    label: "Mensagem WhatsApp",
    build: (s) =>
      `*${s.title}*\n\n${s.excerpt}\n\nLeia aqui: ${postUrlWithUtm(s.slug, "whatsapp", "whatsapp")}`,
  },
  {
    id: "story",
    label: "Texto para Story",
    build: (s) => `${s.title}\n\nArrasta pra cima 👆\n${postUrlWithUtm(s.slug, "instagram_story")}`,
  },
];