import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

const MESSAGES = [
  "Atendimento esta semana: apenas 3 vagas restantes",
  "Orçamento em até 2 horas úteis — sem compromisso",
  "+500 projetos entregues em Curitiba e região",
  "Garantia em todos os serviços — equipe certificada",
];

/** Barra rotativa de urgência/prova social no topo. */
export function UrgencyBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 4500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-full bg-gradient-energy text-energy-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-[11px] font-semibold md:text-xs">
        <Flame className="h-3.5 w-3.5 shrink-0" />
        <span key={i} className="animate-fade-up truncate">{MESSAGES[i]}</span>
      </div>
    </div>
  );
}