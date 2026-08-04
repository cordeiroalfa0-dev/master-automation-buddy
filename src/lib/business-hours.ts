/**
 * Horário de funcionamento — fonte única da verdade.
 * Usado pelo badge "Aberto agora", pelo schema LocalBusiness e pelo Google Meu Negócio.
 * Domingo = 0 ... Sábado = 6
 */
export type DayHours = { open: number; close: number } | null; // minutos desde 00:00

export const BUSINESS_HOURS: Record<number, DayHours> = {
  0: null,                          // Domingo — fechado
  1: { open: 8 * 60, close: 18 * 60 },
  2: { open: 8 * 60, close: 18 * 60 },
  3: { open: 8 * 60, close: 18 * 60 },
  4: { open: 8 * 60, close: 18 * 60 },
  5: { open: 8 * 60, close: 18 * 60 },
  6: { open: 8 * 60, close: 12 * 60 }, // Sábado
};

export const DAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

function fmt(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

export function formatDay(day: number) {
  const h = BUSINESS_HOURS[day];
  return h ? `${fmt(h.open)} às ${fmt(h.close)}` : "Fechado";
}

/** Hora atual em Curitiba (America/Sao_Paulo), independente do fuso do visitante. */
export function nowInCuritiba(date = new Date()) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const weekdayMap: Record<string, number> = {
    dom: 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sáb: 6, sab: 6,
  };
  const wd = get("weekday").toLowerCase().replace(".", "").slice(0, 3);
  return {
    day: weekdayMap[wd] ?? 0,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export type OpenState = {
  open: boolean;
  /** Ex.: "Fecha às 18h" ou "Abre segunda-feira às 8h" */
  label: string;
};

export function getOpenState(date = new Date()): OpenState {
  const { day, minutes } = nowInCuritiba(date);
  const today = BUSINESS_HOURS[day];

  if (today && minutes >= today.open && minutes < today.close) {
    return { open: true, label: `Fecha às ${fmt(today.close)}` };
  }

  if (today && minutes < today.open) {
    return { open: false, label: `Abre hoje às ${fmt(today.open)}` };
  }

  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7;
    const h = BUSINESS_HOURS[next];
    if (h) {
      const when = i === 1 ? "amanhã" : DAY_LABELS[next].toLowerCase();
      return { open: false, label: `Abre ${when} às ${fmt(h.open)}` };
    }
  }
  return { open: false, label: "Fechado" };
}
