import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { BlogBlock, BlogPostRecord } from "./blog-types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

type Row = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  keyword: string | null;
  category: string;
  cover_image_url: string | null;
  content: unknown;
  reading_time: string;
  published: boolean;
  created_at: string;
  author?: string | null;
};

function toRecord(r: Row): BlogPostRecord {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    keyword: r.keyword,
    category: r.category,
    author: r.author ?? "Emerson Cordeiro",
    coverImage: r.cover_image_url,
    readingTime: r.reading_time,
    published: r.published,
    datePublished: r.created_at.slice(0, 10),
    content: (Array.isArray(r.content) ? r.content : []) as BlogBlock[],
  };
}

const SELECT =
  "id, slug, title, excerpt, keyword, category, cover_image_url, content, reading_time, published, created_at, author";

/** Lista pública de artigos publicados (SSR-safe, sem sessão). */
export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("blog_posts")
    .select(SELECT)
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) return [] as BlogPostRecord[];
  return (data as Row[]).map(toRecord);
});

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("blog_posts")
      .select(SELECT)
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !row) return null;
    return toRecord(row as Row);
  });

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Acesso restrito a administradores.");
}

export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data) };
  });

export const listAllPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as any);
    const { data, error } = await context.supabase
      .from("blog_posts")
      .select(SELECT)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data as Row[]).map(toRecord);
  });

export const setPostPublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; published: boolean }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { error } = await context.supabase
      .from("blog_posts")
      .update({ published: data.published })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const generatePostFromKeyword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { keyword: string; category?: string }) => {
    const keyword = (d.keyword ?? "").trim();
    if (keyword.length < 3 || keyword.length > 120) throw new Error("Palavra-chave inválida (3 a 120 caracteres).");
    return { keyword, category: (d.category ?? "").trim().slice(0, 60) };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { generateArticle, generateCover } = await import("./ai-blog.server");
    const { uploadCover } = await import("./blog-storage.server");

    const article = await generateArticle(data.keyword, data.category);

    let coverUrl: string | null = null;
    try {
      const bytes = await generateCover(article.title, data.keyword);
      coverUrl = await uploadCover(article.slug, bytes);
    } catch {
      coverUrl = null;
    }

    const { data: inserted, error } = await context.supabase
      .from("blog_posts")
      .insert({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        keyword: data.keyword,
        category: article.category,
        reading_time: article.readingTime,
        cover_image_url: coverUrl,
        content: article.content,
        published: true,
      })
      .select(SELECT)
      .single();

    if (error) throw new Error(error.message);
    return toRecord(inserted as Row);
  });