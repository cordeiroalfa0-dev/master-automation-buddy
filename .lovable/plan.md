
O usuário quer que o site seja pensado para **gestão de tráfego** (tráfego pago/orgânico) — ou seja, otimizado para campanhas de marketing digital, SEO, conversão e rastreamento. Vou propor um plano focado em recriar o site da Master Elétrica Automatizada com infraestrutura completa de marketing.

Já tenho contexto suficiente do site original (Master Elétrica Automatizada, em Portugal, serviços elétricos e automação). Vou pular o questionário anterior e focar no que importa para tráfego.

## Plano: Site otimizado para gestão de tráfego

### 1. Estrutura de Rotas (SEO-friendly)
Cada serviço/seção como rota própria — essencial para indexação e Google Ads:
```
/                    → Home (landing principal)
/servicos            → Hub de serviços
/servicos/instalacoes-eletricas
/servicos/automacao-residencial
/servicos/quadros-eletricos
/servicos/manutencao
/sobre               → Sobre a empresa
/projetos            → Portfolio/Cases
/contato             → Formulário + WhatsApp
/orcamento           → Landing page de conversão (para Ads)
/obrigado            → Thank-you page (conversão rastreável)
/blog                → Blog SEO (artigos sobre eletricidade/automação)
/politica-privacidade
/termos
```

### 2. SEO On-Page (por rota)
- `<head>` único: title, description, og:image, og:title, og:description, twitter card
- **Schema.org JSON-LD**: LocalBusiness, Service, BreadcrumbList, FAQPage, Review
- **Sitemap.xml** dinâmico + **robots.txt**
- URLs limpas, hreflang (pt-PT)
- Canonical tags
- Open Graph para WhatsApp/Facebook/LinkedIn

### 3. Rastreamento de Tráfego (Tracking)
Componente central de tags com IDs configuráveis:
- **Google Tag Manager (GTM)** — container único que gerencia tudo
- **Google Analytics 4 (GA4)** — eventos de página e conversão
- **Meta Pixel (Facebook/Instagram Ads)**
- **TikTok Pixel** (opcional)
- **Google Ads Conversion Tag**
- **Microsoft Clarity** (heatmaps + session recording grátis)
- Captura de **UTM parameters** (utm_source, utm_medium, utm_campaign) salvos no formulário de contato

### 4. Eventos de Conversão Rastreados
- `form_submit` (orçamento enviado)
- `whatsapp_click`
- `phone_click`
- `scroll_depth` (25/50/75/100%)
- `cta_click` (botões principais)
- `page_view` (com UTMs)

### 5. Landing Pages para Ads
- `/orcamento` — página dedicada para campanhas pagas, formulário curto, prova social, urgência
- `/obrigado` — confirmação que dispara conversão no GA4/Meta/Google Ads

### 6. Performance (Core Web Vitals — fator de ranking)
- Imagens otimizadas (WebP, lazy loading, dimensões definidas)
- Fonts pré-carregadas
- CSS crítico inline
- SSR ativado (TanStack Start já faz)
- Lighthouse score alvo: 90+

### 7. Conversão (CRO)
- WhatsApp flutuante fixo
- Formulário multi-step (mais conversão que single-step)
- Prova social: depoimentos, logos de clientes, número de projetos
- CTAs claros em cada seção ("Pedir Orçamento Grátis")
- Selo de confiança (anos de experiência, certificações)
- Banner de cookies LGPD/GDPR (necessário para tracking legal na UE)

### 8. Backend (Lovable Cloud)
Tabelas:
- `leads` (nome, email, telefone, serviço, mensagem, utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid, created_at, página de origem)
- `blog_posts` (slug, título, conteúdo, meta_description, og_image, publicado_em)

Edge functions:
- `submit-lead` — salva lead + envia email para a empresa + envia evento server-side para Meta CAPI (Conversion API — bypass de adblockers)
- `sitemap` — gera sitemap.xml dinâmico

### 9. Painel Admin (mínimo)
- `/admin/leads` — ver leads recebidos com UTMs (autenticado)
- `/admin/blog` — criar/editar posts

### 10. Configuração via UI
Página `/admin/configuracoes` para o cliente colar os IDs sem precisar de dev:
- GTM ID
- GA4 Measurement ID
- Meta Pixel ID
- Google Ads ID
- WhatsApp number

---

### Detalhes Técnicos
- **Framework**: TanStack Start (já configurado) + SSR ativo para SEO
- **Backend**: Lovable Cloud (Postgres + Edge Functions + Auth)
- **Tracking**: GTM como hub único, scripts injetados via `<script>` no `__root.tsx` head
- **UTMs**: Hook `useUTMTracking` que lê `window.location.search`, salva em `sessionStorage` e anexa no submit do form
- **Schema markup**: Componente `<JsonLd>` reutilizável por rota
- **Cookie consent**: Componente que bloqueia GTM até consentimento (compliance UE)

### Entrega em fases
**Fase 1 (esta)**: Site público completo — todas as rotas, SEO, tracking GTM/GA4/Meta, formulário com UTMs salvos no banco, WhatsApp flutuante, sitemap, banner de cookies, página /orcamento + /obrigado.

**Fase 2 (depois)**: Painel admin de leads, blog com CMS, Meta CAPI server-side.

Confirma este plano? Se sim, aprovo e começo pela Fase 1.
