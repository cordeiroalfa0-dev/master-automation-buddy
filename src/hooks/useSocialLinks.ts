import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SITE_CONFIG } from "@/lib/site-config";

export const SOCIAL_KEYS = {
  instagram: "social_instagram",
  facebook: "social_facebook",
  tiktok: "social_tiktok",
  youtube: "social_youtube",
  linkedin: "social_linkedin",
  googleBusiness: "social_google_business",
} as const;

export type SocialNetwork = keyof typeof SOCIAL_KEYS;
export type SocialLinks = Record<SocialNetwork, string>;

/** Valores usados enquanto o admin ainda não salvou os links reais. */
export const SOCIAL_FALLBACK: SocialLinks = {
  instagram: SITE_CONFIG.social.instagram,
  facebook: SITE_CONFIG.social.facebook,
  tiktok: "",
  youtube: "",
  linkedin: "",
  googleBusiness: SITE_CONFIG.googleBusiness.profileUrl,
};

export async function fetchSocialLinks(): Promise<SocialLinks> {
  const { data } = await supabase
    .from("site_settings")
    .select("key,value")
    .in("key", Object.values(SOCIAL_KEYS));

  const links = { ...SOCIAL_FALLBACK };
  for (const row of data ?? []) {
    const entry = (Object.entries(SOCIAL_KEYS) as [SocialNetwork, string][]).find(
      ([, k]) => k === row.key,
    );
    if (entry && row.value && row.value.trim()) links[entry[0]] = row.value.trim();
  }
  return links;
}

/**
 * Links das redes sociais gerenciados pelo admin (Central de Divulgação).
 * Cai para os valores padrão do site enquanto nada estiver salvo.
 */
export function useSocialLinks() {
  const { data } = useQuery({
    queryKey: ["social-links"],
    queryFn: fetchSocialLinks,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return data ?? SOCIAL_FALLBACK;
}
