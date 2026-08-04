import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Na Vercel (process.env.VERCEL === "1") o build é fixado no preset "vercel",
// que gera a saída em .vercel/output (Build Output API).
// Dentro do Lovable a configuração padrão continua valendo.
export default defineConfig(
  process.env.VERCEL ? { nitro: { preset: "vercel" } } : {},
);
