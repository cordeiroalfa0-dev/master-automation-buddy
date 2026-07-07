import { useRef, useState } from "react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

/**
 * Slider comparativo antes/depois. Arraste ou clique para revelar.
 * Acessível: input range escondido controla a posição via teclado.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Antes",
  afterAlt = "Depois",
  className = "",
}: Props) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl select-none ${className}`}>
      <div
        ref={ref}
        className="relative aspect-[16/10] w-full cursor-ew-resize"
        onMouseDown={(e) => {
          dragging.current = true;
          move(e.clientX);
        }}
        onMouseMove={(e) => dragging.current && move(e.clientX)}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchStart={(e) => move(e.touches[0].clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
      >
        <img src={afterSrc} alt={afterAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          <img
            src={beforeSrc}
            alt={beforeAlt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ width: `${100 * (100 / Math.max(pos, 0.01))}%`, maxWidth: "none" }}
          />
        </div>
        {/* Barrinha */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow-glow"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white text-primary shadow-elegant ring-2 ring-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" />
            </svg>
          </div>
        </div>
        {/* Labels */}
        <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
          Antes
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
          Depois
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparar antes e depois"
        className="sr-only"
      />
    </div>
  );
}