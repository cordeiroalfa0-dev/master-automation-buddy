import { SITE_CONFIG } from "./site-config";

/** Remove acentos e gera slug URL-friendly. */
export function slugifyBairro(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface Bairro {
  name: string;
  slug: string;
  /** Bairros vizinhos para internal linking */
  vizinhos?: string[];
  /** Descrição curta para SEO local */
  destaque?: string;
}

export const BAIRROS: Bairro[] = SITE_CONFIG.bairros.map((name) => ({
  name,
  slug: slugifyBairro(name),
}));

export function findBairro(slug: string): Bairro | undefined {
  return BAIRROS.find((b) => b.slug === slug);
}