import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Calculator, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { trackCTA } from "@/lib/analytics";

type Tipo = "residencial" | "predial" | "industrial";

const BASE = {
  residencial: { min: 80, max: 300 },   // R$ por m²
  predial: { min: 60, max: 220 },
  industrial: { min: 150, max: 500 },
} satisfies Record<Tipo, { min: number; max: number }>;

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

/**
 * Calculadora de investimento estimado — mini-form no Hero.
 * Não é orçamento real; serve como âncora emocional + captura de intent.
 */
export function InvestmentCalculator() {
  const [tipo, setTipo] = useState<Tipo>("residencial");
  const [m2, setM2] = useState<number>(120);
  const [nivel, setNivel] = useState<"basico" | "completo" | "premium">("completo");

  const range = useMemo(() => {
    const b = BASE[tipo];
    const mult = nivel === "basico" ? 0.5 : nivel === "premium" ? 1.4 : 1;
    const min = Math.round((b.min * m2 * mult) / 500) * 500;
    const max = Math.round((b.max * m2 * mult) / 500) * 500;
    return { min, max };
  }, [tipo, m2, nivel]);

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card md:p-6">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant">
          <Calculator className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold">Estime seu investimento</h3>
          <p className="text-[11px] text-muted-foreground">Faixa de referência · orçamento real requer visita técnica</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tipo</label>
          <Select value={tipo} onValueChange={(v) => setTipo(v as Tipo)}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residencial">Residencial</SelectItem>
              <SelectItem value="predial">Predial / Comercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Área (m²)</label>
          <Input
            type="number"
            min={20}
            max={5000}
            value={m2}
            onChange={(e) => setM2(Math.max(20, Number(e.target.value) || 0))}
            className="h-10"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Nível</label>
          <Select value={nivel} onValueChange={(v) => setNivel(v as typeof nivel)}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basico">Básico</SelectItem>
              <SelectItem value="completo">Completo</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-gradient-to-br from-primary/10 to-energy/10 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3 w-3" /> Estimativa
        </div>
        <div className="mt-1 font-display text-2xl font-bold text-foreground md:text-3xl">
          {fmt(range.min)} <span className="text-muted-foreground">–</span> {fmt(range.max)}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Valores de referência com base em 500+ projetos em Curitiba.
        </div>
      </div>

      <Button
        asChild
        className="mt-4 w-full bg-gradient-energy font-semibold text-energy-foreground shadow-energy transition-spring hover:scale-[1.01]"
      >
        <Link
          to="/orcamento"
          onClick={() => trackCTA("orcamento_calc", "calculator")}
        >
          Solicitar orçamento detalhado <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}