import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { buildSeo } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blog";
import { listPublishedPosts } from "@/lib/blog.functions";
import type { BlogPostRecord } from "@/lib/blog-types";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const Route = createFileRoute("/blog/")({
  loader: async () => ({ dbPosts: await listPublishedPosts() }),
  head: () =>
    buildSeo({
      title: "Blog — Guias de Automação em Curitiba | Master Automação",
      description:
        "Guias práticos sobre automação residencial, predial e industrial em Curitiba: quanto custa, KNX vs Zigbee, condomínios inteligentes e mais.",
      path: "/blog",
    }),
  component: BlogIndex,
  errorComponent: () => (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold">Não foi possível carregar o blog</h1>
      <p className="mt-2 text-sm text-muted-foreground">Tente atualizar a página.</p>
    </section>
  ),
});

function BlogIndex() {
  const { dbPosts } = Route.useLoaderData() as { dbPosts: BlogPostRecord[] };
  const posts: BlogPostRecord[] = [...dbPosts, ...(BLOG_POSTS as BlogPostRecord[])].sort(
    (a, b) => b.datePublished.localeCompare(a.datePublished),
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Blog", url: "/blog" },
      ])} />

      <section className="border-b bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Blog
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-balance md:text-5xl">
            Guias práticos de automação em Curitiba
          </h1>
          <p className="mt-4 text-muted-foreground text-pretty">
            Conteúdo direto ao ponto sobre preços, tecnologias e casos reais.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-spring hover:-translate-y-1 hover:shadow-card-hover"
            >
              {p.coverImage ? (
                <img
                  src={p.coverImage}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 via-primary/10 to-energy/20" />
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                  {p.category}
                </div>
                <h2 className="mt-2 font-display text-lg font-bold leading-snug">
                  {p.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.datePublished).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {p.readingTime}
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center text-sm font-semibold text-primary">
                  Ler artigo <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}