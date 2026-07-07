import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { buildSeo } from "@/lib/seo";
import { BLOG_POSTS, findPost } from "@/lib/blog";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = findPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Artigo não encontrado — Master Automação" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return buildSeo({
      title: `${loaderData.post.title} — Master Automação`,
      description: loaderData.post.excerpt,
      path: `/blog/${params.slug}`,
      type: "article",
    });
  },
  component: BlogPostPage,
  notFoundComponent: BlogPostNotFound,
});

function BlogPostNotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Artigo não encontrado</h1>
      <p className="mt-3 text-muted-foreground">Este post pode ter sido movido ou removido.</p>
      <Link to="/blog" className="mt-6 inline-block text-primary hover:underline">
        ← Voltar ao blog
      </Link>
    </section>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` },
      ])} />
      <JsonLd data={articleSchema({
        title: post.title,
        description: post.excerpt,
        slug: post.slug,
        datePublished: post.datePublished,
      })} />

      <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-20">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Blog
        </Link>

        <div className="mt-6 text-[11px] font-semibold uppercase tracking-widest text-primary">
          {post.category}
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-balance md:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.datePublished).toLocaleDateString("pt-BR", {
              day: "2-digit", month: "long", year: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readingTime} de leitura
          </span>
        </div>

        <div className="prose-content mt-10 space-y-5 text-[15px] leading-relaxed text-foreground/90">
          {post.content.map((block, i) => {
            if (block.type === "h2") {
              return <h2 key={i} className="mt-8 font-display text-2xl font-bold text-foreground">{block.text}</h2>;
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="list-disc space-y-1.5 pl-6 text-foreground/85">
                  {block.items.map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote key={i} className="border-l-4 border-primary bg-primary/5 py-3 pl-4 pr-2 italic text-foreground/90">
                  {block.text}
                </blockquote>
              );
            }
            return <p key={i}>{block.text}</p>;
          })}
        </div>

        <div className="mt-14 rounded-2xl border bg-gradient-to-br from-primary/5 to-energy/10 p-6 text-center md:p-8">
          <h3 className="font-display text-xl font-bold">Quer aplicar isso no seu projeto?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Visita técnica gratuita em Curitiba. Orçamento detalhado em 2 horas úteis.
          </p>
          <Link
            to="/orcamento"
            className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-gradient-energy px-5 py-2.5 text-sm font-semibold text-energy-foreground shadow-energy transition-spring hover:scale-[1.03]"
          >
            Solicitar orçamento <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-14 border-t pt-8">
            <h4 className="font-display text-lg font-bold">Leia também</h4>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="group rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                    {r.category}
                  </div>
                  <div className="mt-1 font-display font-semibold group-hover:text-primary">
                    {r.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}