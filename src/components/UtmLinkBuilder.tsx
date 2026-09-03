import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, QrCode, Link2, MessageCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CAMPAIGN_PRESETS,
  buildUtmUrl,
  campaignWhatsAppLink,
  qrCodeUrl,
  suggestCampaignName,
} from "@/lib/campaign";
import { SITE_CONFIG } from "@/lib/site-config";

const DESTINOS = [
  { path: "/", label: "Home" },
  { path: "/orcamento", label: "Orçamento (melhor p/ tráfego pago)" },
  { path: "/servicos/automacao-residencial", label: "Automação Residencial" },
  { path: "/servicos/automacao-predial", label: "Automação Predial" },
  { path: "/servicos/automacao-industrial", label: "Automação Industrial" },
  { path: "/servicos/seguranca-eletronica", label: "Segurança Eletrônica" },
  { path: "/projetos", label: "Projetos" },
  { path: "/blog", label: "Blog" },
  { path: "/links", label: "Link na bio" },
  { path: "/contato", label: "Contato" },
];

/** Gerador de links rastreáveis para campanhas pagas e orgânicas. */
export function UtmLinkBuilder() {
  const [presetId, setPresetId] = useState(CAMPAIGN_PRESETS[0].id);
  const [path, setPath] = useState("/orcamento");
  const [campaign, setCampaign] = useState(suggestCampaignName("orcamento", "meta"));
  const [content, setContent] = useState(CAMPAIGN_PRESETS[0].content ?? "");
  const [term, setTerm] = useState("");
  const [showQr, setShowQr] = useState(false);

  const preset = CAMPAIGN_PRESETS.find((p) => p.id === presetId)!;

  const url = useMemo(
    () =>
      buildUtmUrl({
        path,
        source: preset.source,
        medium: preset.medium,
        campaign: campaign || "campanha",
        content: content || undefined,
        term: term || undefined,
      }),
    [path, preset, campaign, content, term],
  );

  const wpp = useMemo(() => campaignWhatsAppLink(campaign || "campanha"), [campaign]);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copiado!`);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-bold">Gerador de links rastreáveis (UTM)</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Use sempre estes links nos anúncios e nas redes. Assim cada lead chega com a origem
        registrada e você sabe qual campanha realmente vende.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="utm-canal">Canal</Label>
          <select
            id="utm-canal"
            value={presetId}
            onChange={(e) => {
              const p = CAMPAIGN_PRESETS.find((x) => x.id === e.target.value)!;
              setPresetId(p.id);
              setContent(p.content ?? "");
              setCampaign(suggestCampaignName("orcamento", p.source));
            }}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {CAMPAIGN_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">{preset.hint}</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="utm-destino">Página de destino</Label>
          <select
            id="utm-destino"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {DESTINOS.map((d) => (
              <option key={d.path} value={d.path}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="utm-campanha">Nome da campanha</Label>
          <Input id="utm-campanha" value={campaign} onChange={(e) => setCampaign(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="utm-content">Criativo / variação</Label>
          <Input
            id="utm-content"
            value={content}
            placeholder="criativo-01"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="utm-term">Palavra-chave (opcional, Google Ads)</Label>
          <Input
            id="utm-term"
            value={term}
            placeholder="automacao residencial curitiba"
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl border bg-muted/40 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Link do anúncio
        </div>
        <code className="mt-2 block break-all text-sm text-foreground">{url}</code>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => copy(url, "Link")}>
            <Copy className="mr-2 h-4 w-4" /> Copiar link
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowQr((v) => !v)}>
            <QrCode className="mr-2 h-4 w-4" /> {showQr ? "Ocultar" : "Gerar"} QR Code
          </Button>
          <Button size="sm" variant="outline" onClick={() => copy(wpp, "Link de WhatsApp")}>
            <MessageCircle className="mr-2 h-4 w-4" /> Link WhatsApp da campanha
          </Button>
        </div>

        {showQr && (
          <div className="mt-4 flex flex-col items-start gap-3">
            <img
              src={qrCodeUrl(url)}
              alt={`QR Code da campanha ${campaign}`}
              width={200}
              height={200}
              className="rounded-lg border bg-white p-2"
            />
            <Button asChild size="sm" variant="outline">
              <a href={qrCodeUrl(url, 1024)} download={`qr-${campaign}.png`} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" /> Baixar QR em alta (1024px)
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">
              Use no cartão de visita, adesivo de veículo e folder — o acesso é contabilizado como{" "}
              <strong>offline/qrcode</strong> no {SITE_CONFIG.shortName}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
