/**
 * Kit de campanha: geração de links rastreáveis (UTM), links de WhatsApp
 * por campanha, QR Code e legendas prontas para tráfego pago e mídias sociais.
 */
import { SITE_CONFIG } from "@/lib/site-config";

export interface UtmInput {
  path: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}

export interface CampaignPreset {
  id: string;
  label: string;
  hint: string;
  source: string;
  medium: string;
  content?: string;
}

/** Presets dos canais que mais usamos em divulgação e tráfego pago. */
export const CAMPAIGN_PRESETS: CampaignPreset[] = [
  { id: "meta-ads", label: "Meta Ads (Face/Insta)", hint: "Anúncios pagos no Facebook e Instagram", source: "meta", medium: "cpc", content: "criativo-01" },
  { id: "google-ads", label: "Google Ads", hint: "Rede de pesquisa e display", source: "google", medium: "cpc", content: "anuncio-01" },
  { id: "instagram-bio", label: "Instagram · link da bio", hint: "Link fixo no perfil", source: "instagram", medium: "social", content: "bio" },
  { id: "instagram-story", label: "Instagram · story", hint: "Sticker de link nos stories", source: "instagram", medium: "social", content: "story" },
  { id: "facebook-organico", label: "Facebook · post orgânico", hint: "Publicações da página", source: "facebook", medium: "social", content: "post" },
  { id: "whatsapp-status", label: "WhatsApp · status/lista", hint: "Status e disparos para clientes", source: "whatsapp", medium: "social", content: "status" },
  { id: "tiktok", label: "TikTok", hint: "Orgânico ou TikTok Ads", source: "tiktok", medium: "social", content: "video" },
  { id: "gmn", label: "Google Meu Negócio", hint: "Ficha da empresa no Maps/Busca", source: "google", medium: "organic-gmb", content: "ficha" },
  { id: "email", label: "E-mail / newsletter", hint: "Disparos e assinatura de e-mail", source: "email", medium: "email", content: "assinatura" },
  { id: "offline", label: "Offline (QR / cartão)", hint: "Cartão de visita, adesivo, folder", source: "offline", medium: "qrcode", content: "cartao" },
];

const slug = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Monta a URL final com todos os parâmetros UTM já normalizados. */
export function buildUtmUrl(input: UtmInput, baseUrl = SITE_CONFIG.url): string {
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const url = new URL(`${baseUrl.replace(/\/$/, "")}${path}`);
  url.searchParams.set("utm_source", slug(input.source));
  url.searchParams.set("utm_medium", slug(input.medium));
  url.searchParams.set("utm_campaign", slug(input.campaign));
  if (input.content) url.searchParams.set("utm_content", slug(input.content));
  if (input.term) url.searchParams.set("utm_term", slug(input.term));
  return url.toString();
}

/** Sugere um nome de campanha padronizado: canal-objetivo-mesano. */
export function suggestCampaignName(objetivo: string, canal = "geral"): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return slug(`${canal}-${objetivo}-${mes}${String(d.getFullYear()).slice(2)}`);
}

/** Link de WhatsApp com mensagem pré-pronta e marcação da campanha. */
export function campaignWhatsAppLink(campaign: string, message?: string): string {
  const text = message ?? "Olá! Vim pelo site e quero um orçamento de automação.";
  const marked = `${text} [ref: ${slug(campaign)}]`;
  return `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(marked)}`;
}

/** QR Code gerado sob demanda (sem dependência instalada). */
export function qrCodeUrl(target: string, size = 512): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=12&data=${encodeURIComponent(target)}`;
}

export interface AdCopy {
  id: string;
  canal: "Meta Ads" | "Google Ads" | "Instagram" | "WhatsApp";
  objetivo: string;
  titulo: string;
  texto: string;
  cta: string;
}

/** Biblioteca de textos de anúncio validados para o nicho de automação em Curitiba. */
export const AD_COPY_LIBRARY: AdCopy[] = [
  {
    id: "meta-residencial",
    canal: "Meta Ads",
    objetivo: "Leads · Automação residencial",
    titulo: "Sua casa em Curitiba controlada pelo celular",
    texto:
      "Iluminação, cortinas, climatização e câmeras integradas em um só app. Projeto sob medida, instalação limpa e suporte local em Curitiba. Orçamento sem compromisso em até 2h úteis.",
    cta: "Solicitar orçamento",
  },
  {
    id: "meta-seguranca",
    canal: "Meta Ads",
    objetivo: "Leads · Segurança eletrônica",
    titulo: "Veja sua casa de onde estiver",
    texto:
      "Câmeras com visão noturna, alarme inteligente e alerta no celular. Instalação profissional em Curitiba e região. Fale com um especialista hoje mesmo.",
    cta: "Falar no WhatsApp",
  },
  {
    id: "meta-condominio",
    canal: "Meta Ads",
    objetivo: "Leads · Predial / condomínios",
    titulo: "Reduza custos do condomínio com automação",
    texto:
      "Controle de acesso, iluminação inteligente em áreas comuns e monitoramento centralizado. Projetos entregues em condomínios de Curitiba. Peça um diagnóstico gratuito.",
    cta: "Quero um diagnóstico",
  },
  {
    id: "google-search",
    canal: "Google Ads",
    objetivo: "Pesquisa · Alta intenção",
    titulo: "Automação Residencial em Curitiba | Orçamento em 2h",
    texto:
      "Projeto, instalação e suporte local. +500 projetos entregues. Atendemos Batel, Ecoville, Champagnat e toda Curitiba. Peça seu orçamento.",
    cta: "Peça o orçamento",
  },
  {
    id: "google-cameras",
    canal: "Google Ads",
    objetivo: "Pesquisa · Câmeras",
    titulo: "Instalação de Câmeras em Curitiba | Técnico Local",
    texto:
      "Câmeras HD, alarme e monitoramento pelo celular. Visita técnica rápida, garantia e atendimento em toda a região metropolitana.",
    cta: "Agendar visita",
  },
  {
    id: "insta-carrossel",
    canal: "Instagram",
    objetivo: "Orgânico · Carrossel",
    titulo: "3 automações que valorizam seu imóvel",
    texto:
      "1) Iluminação cênica por ambiente\n2) Cortinas motorizadas com rotina de horário\n3) Câmeras integradas ao mesmo app\n\nQual você colocaria primeiro na sua casa? Comenta aqui 👇",
    cta: "Link na bio para orçamento",
  },
  {
    id: "insta-story",
    canal: "Instagram",
    objetivo: "Story · Prova social",
    titulo: "Antes e depois em Curitiba",
    texto:
      "Instalação concluída essa semana no {bairro}. Toda a iluminação e as cortinas agora funcionam por voz e por rotinas automáticas. Arrasta pra cima e peça o seu projeto.",
    cta: "Arrasta pra cima",
  },
  {
    id: "wpp-reativacao",
    canal: "WhatsApp",
    objetivo: "Reativação de lead frio",
    titulo: "Retomada de orçamento",
    texto:
      "Oi {nome}! Aqui é da {empresa}. Você pediu um orçamento de automação e queremos retomar. Nesta semana conseguimos encaixar visita técnica sem custo em Curitiba. Posso reservar um horário?",
    cta: "Enviar mensagem",
  },
];

/** Checklist operacional de campanha — evita subir anúncio sem rastreio. */
export const CAMPAIGN_CHECKLIST: string[] = [
  "Link do anúncio gerado com UTM (nunca a URL crua)",
  "Pixel da Meta e GA4 ativos e testados na página de destino",
  "Evento de conversão marcado em /obrigado e nos cliques de WhatsApp",
  "Página de destino específica do serviço (não só a home)",
  "Criativo nos 3 formatos: feed 1:1, story 9:16 e link 1200×630",
  "Legenda com CTA claro e localidade (Curitiba/bairro)",
  "Público de remarketing (visitantes 30 dias) criado",
  "Público semelhante a partir dos leads convertidos",
  "Orçamento diário e limite de custo por lead definidos",
  "Resposta de WhatsApp em até 5 minutos no horário comercial",
];
