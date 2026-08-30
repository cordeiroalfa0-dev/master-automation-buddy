import type { BlogBlock } from "./blog-types";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

function headers() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("LOVABLE_API_KEY ausente.");
  return { "Content-Type": "application/json", "Lovable-API-Key": key };
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export interface GeneratedArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  content: BlogBlock[];
}

export async function generateArticle(keyword: string, category?: string): Promise<GeneratedArticle> {
  const prompt = `Escreva um artigo de blog em português do Brasil, otimizado para SEO local, para a empresa "Abael Automação", especialista em automação residencial, predial e industrial em Curitiba e região metropolitana.

PALAVRA-CHAVE PRINCIPAL: "${keyword}"
${category ? `CATEGORIA SUGERIDA: ${category}` : ""}

Regras:
- Use a palavra-chave no título, no primeiro parágrafo e naturalmente ao longo do texto (densidade natural, sem repetição forçada).
- Cite Curitiba e bairros reais (Batel, Ecoville, Água Verde, Champagnat, Santa Felicidade) quando fizer sentido.
- Tom profissional, direto, útil e comercial (sem enrolação).
- Entre 700 e 1000 palavras no total, com 4 a 6 seções (h2), listas e um bloco de citação.

Responda SOMENTE com JSON válido no formato:
{
  "title": "título com até 65 caracteres",
  "excerpt": "resumo de até 155 caracteres",
  "category": "categoria curta",
  "readingTime": "6 min",
  "content": [
    {"type":"p","text":"..."},
    {"type":"h2","text":"..."},
    {"type":"ul","items":["...","..."]},
    {"type":"quote","text":"..."}
  ]
}`;

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "Você é um redator SEO sênior especializado em automação e casas inteligentes. Responde sempre em JSON válido." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (res.status === 429) throw new Error("Limite de uso da IA atingido. Tente novamente em instantes.");
  if (res.status === 402) throw new Error("Créditos de IA esgotados. Adicione créditos no workspace.");
  if (!res.ok) throw new Error(`Falha na IA (${res.status}): ${await res.text()}`);

  const json = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  const raw = json.choices?.[0]?.message?.content ?? "{}";
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned) as Partial<GeneratedArticle>;

  const title = (parsed.title ?? keyword).toString().slice(0, 120);
  const content = (Array.isArray(parsed.content) ? parsed.content : []).filter(
    (b) => b && typeof b === "object" && "type" in b,
  ) as BlogBlock[];
  if (content.length === 0) throw new Error("A IA não retornou conteúdo utilizável. Tente outra palavra-chave.");

  return {
    slug: `${slugify(title)}-${Date.now().toString(36).slice(-4)}`,
    title,
    excerpt: (parsed.excerpt ?? title).toString().slice(0, 200),
    category: (parsed.category ?? category ?? "Automação").toString().slice(0, 60),
    readingTime: (parsed.readingTime ?? "6 min").toString().slice(0, 20),
    content,
  };
}

export async function generateCover(title: string, keyword: string): Promise<Uint8Array> {
  const prompt = `Imagem de capa horizontal (16:9) para artigo de blog sobre "${keyword}". Título: "${title}".
Estilo: fotografia editorial premium de interior moderno brasileiro com automação residencial, iluminação em azul elétrico e detalhes em amarelo energia, alto contraste, ambiente sofisticado, painel de controle inteligente sutil, sem texto e sem letras na imagem, sem marca d'água.`;

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!res.ok) throw new Error(`Falha ao gerar imagem (${res.status})`);
  const json = (await res.json()) as {
    choices: Array<{ message: { images?: Array<{ image_url: { url: string } }> } }>;
  };
  const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url) throw new Error("Sem imagem na resposta.");
  const b64 = url.includes(";base64,") ? url.split(";base64,")[1] : url;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}