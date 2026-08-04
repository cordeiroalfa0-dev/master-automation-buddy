import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getOpenState, type OpenState } from "@/lib/business-hours";
import { cn } from "@/lib/utils";

/**
 * Badge "Aberto agora / Fechado" com base no fuso de Curitiba.
 * Calculado só no cliente para evitar divergência de hidratação.
 */
export function OpenStatus({ className, showIcon = true }: { className?: string; showIcon?: boolean }) {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(getOpenState());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!state) return <span className={cn("inline-block h-5 w-28", className)} aria-hidden />;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        state.open
          ? "border-success/30 bg-success/10 text-success"
          : "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {showIcon ? (
        <span className="relative flex h-2 w-2">
          {state.open && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          )}
          <span className={cn("relative inline-flex h-2 w-2 rounded-full", state.open ? "bg-success" : "bg-muted-foreground")} />
        </span>
      ) : (
        <Clock className="h-3.5 w-3.5" />
      )}
      <span>{state.open ? "Aberto agora" : "Fechado"}</span>
      <span className="hidden text-[11px] opacity-80 sm:inline">· {state.label}</span>
    </span>
  );
}
