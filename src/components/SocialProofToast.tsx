import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

/**
 * Prova social flutuante — mostra "Fulano de Bairro pediu orçamento há X min".
 * Rotativa, discreta, canto inferior esquerdo. Fecha e não reaparece na sessão.
 */

const EVENTS = [
  { name: "Carlos H.", area: "Batel", action: "solicitou um orçamento", mins: 12 },
  { name: "Ana Paula", area: "Ecoville", action: "agendou visita técnica", mins: 34 },
  { name: "Roberto A.", area: "CIC", action: "contratou automação industrial", mins: 58 },
  { name: "Marina T.", area: "Champagnat", action: "instalou CFTV", mins: 22 },
  { name: "Fernando M.", area: "Bigorrilho", action: "solicitou orçamento", mins: 8 },
  { name: "Juliana P.", area: "Água Verde", action: "agendou visita técnica", mins: 41 },
];

export function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("sp_dismissed")) {
      setDismissed(true);
      return;
    }
    // Reduzir motion respeitado
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const firstShow = setTimeout(() => setVisible(true), 8000);
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % EVENTS.length);
        setVisible(true);
      }, 500);
    }, 15000);
    return () => {
      clearTimeout(firstShow);
      clearInterval(cycle);
    };
  }, []);

  if (dismissed) return null;
  const ev = EVENTS[index];

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-24 left-4 z-30 hidden max-w-xs md:block transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-start gap-3 rounded-xl border bg-card p-3 pr-8 shadow-elegant">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="text-xs">
          <div className="font-semibold text-foreground">
            {ev.name} · {ev.area}
          </div>
          <div className="text-muted-foreground">
            {ev.action} há {ev.mins} min
          </div>
        </div>
        <button
          onClick={() => {
            setDismissed(true);
            sessionStorage.setItem("sp_dismissed", "1");
          }}
          className="absolute right-1.5 top-1.5 rounded-md p-1 text-muted-foreground hover:bg-accent"
          aria-label="Fechar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}