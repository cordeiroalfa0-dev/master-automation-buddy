import { SITE_CONFIG } from "./site-config";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  datePublished: string;
  readingTime: string;
  category: string;
  /** Conteúdo em blocos simples — parágrafos, headings h2, listas. */
  content: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "quote"; text: string }
  >;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "quanto-custa-automatizar-uma-casa-em-curitiba",
    title: "Quanto custa automatizar uma casa em Curitiba em 2026",
    excerpt:
      "Faixas reais de preço por m² e por escopo (iluminação, cortinas, climatização, segurança) para projetos residenciais em Curitiba.",
    datePublished: "2026-05-14",
    readingTime: "6 min",
    category: "Automação Residencial",
    content: [
      { type: "p", text: "A pergunta que mais recebemos: quanto custa? Depende do escopo. Este guia traz faixas reais praticadas em Curitiba em 2026, com base em mais de 500 projetos entregues pela Abael Automação." },
      { type: "h2", text: "Faixas por escopo (apartamento de 100–150 m²)" },
      { type: "ul", items: [
        "Iluminação inteligente (10–15 pontos): R$ 5.000 a R$ 12.000",
        "Cortinas motorizadas (5–8 janelas): R$ 8.000 a R$ 20.000",
        "Climatização integrada (3–4 splits): R$ 4.000 a R$ 9.000",
        "Central multiroom de áudio: R$ 6.000 a R$ 18.000",
        "Segurança (CFTV + alarme + biometria): R$ 5.000 a R$ 15.000",
      ]},
      { type: "h2", text: "O que impacta o preço" },
      { type: "p", text: "Três variáveis explicam 80% da diferença entre projetos: marca dos dispositivos (Sonoff/Tuya vs KNX/Legrand), integração com um app único ou múltiplos apps, e se a obra já está pronta (retrabalho de infraestrutura) ou em fase de projeto elétrico." },
      { type: "quote", text: "Em obra nova, integrar automação junto à elétrica reduz o custo em até 40% e elimina retrabalho." },
      { type: "h2", text: "Como pedir um orçamento útil" },
      { type: "p", text: "Envie planta baixa, quantidade de ambientes e uma lista do que gostaria de controlar. Fazemos visita técnica gratuita em Curitiba e região e devolvemos orçamento detalhado em até 2 horas úteis." },
    ],
  },
  {
    slug: "knx-vs-zigbee-qual-escolher",
    title: "KNX vs Zigbee: qual protocolo escolher para sua casa inteligente",
    excerpt:
      "Comparativo prático entre KNX (padrão europeu com fio) e Zigbee (wireless) — vantagens, limitações e para quem cada um faz sentido.",
    datePublished: "2026-04-22",
    readingTime: "5 min",
    category: "Guia Técnico",
    content: [
      { type: "p", text: "KNX e Zigbee são os dois protocolos mais usados em automação residencial. Escolher errado significa dor de cabeça por anos. Veja o comparativo direto." },
      { type: "h2", text: "KNX — padrão europeu, cabeado" },
      { type: "ul", items: [
        "Confiabilidade máxima — comunicação por cabo dedicado (BUS)",
        "Vida útil de 15+ anos, agnóstico de fabricante",
        "Requer infraestrutura de cabo durante a obra",
        "Custo inicial mais alto, sem mensalidades",
      ]},
      { type: "h2", text: "Zigbee — mesh wireless" },
      { type: "ul", items: [
        "Instalação em imóvel pronto, sem quebrar parede",
        "Compatível com Alexa, Google Home e Matter",
        "Depende de gateway/hub central",
        "Ideal para retrofits e projetos escaláveis",
      ]},
      { type: "h2", text: "Nossa recomendação" },
      { type: "p", text: "Obra nova de alto padrão: KNX. Retrofit ou apartamento pronto: Zigbee com hub Home Assistant ou Aqara. Casas híbridas (áreas críticas em KNX, luzes de cortesia em Zigbee) também funcionam muito bem." },
    ],
  },
  {
    slug: "automacao-para-condominios-em-curitiba",
    title: "Automação para condomínios em Curitiba: por onde começar",
    excerpt:
      "Controle de acesso, CFTV IP, iluminação automatizada de áreas comuns e como reduzir 30–40% da conta de energia do condomínio.",
    datePublished: "2026-03-10",
    readingTime: "7 min",
    category: "Automação Predial",
    content: [
      { type: "p", text: "Condomínios em Curitiba (Ecoville, Batel, Champagnat, Água Verde) têm buscado automação para dois objetivos claros: reduzir custo operacional e aumentar segurança. Este guia mostra o caminho." },
      { type: "h2", text: "Prioridade 1: iluminação de áreas comuns" },
      { type: "p", text: "Sensor de presença + dimerização + programação horária reduz de 30% a 40% da conta de energia em garagens, halls e escadas. Payback típico: 12 a 18 meses." },
      { type: "h2", text: "Prioridade 2: controle de acesso" },
      { type: "ul", items: [
        "Biometria facial na portaria (elimina chaveiros perdidos)",
        "App para moradores autorizarem visitantes remotamente",
        "Integração com câmeras de LPR para portão",
      ]},
      { type: "h2", text: "Prioridade 3: CFTV IP com IA" },
      { type: "p", text: "Câmeras Hikvision ou Intelbras com analítica de vídeo detectam comportamento suspeito automaticamente e enviam alerta ao síndico. Substituem sistemas analógicos antigos com custo 30% menor e imagem em 4K." },
      { type: "quote", text: "Um condomínio de 80 unidades no Ecoville reduziu R$ 3.200/mês na conta de luz após retrofit de iluminação." },
    ],
  },
];

export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function blogUrl(slug: string): string {
  return `${SITE_CONFIG.url}/blog/${slug}`;
}