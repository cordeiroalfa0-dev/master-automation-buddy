const BUCKET = "blog-images";
const TEN_YEARS = 60 * 60 * 24 * 3650;

export async function uploadCover(slug: string, bytes: Uint8Array): Promise<string | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const path = `${slug}.png`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: "image/png", upsert: true });
  if (error) return null;

  const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, TEN_YEARS);
  return data?.signedUrl ?? null;
}