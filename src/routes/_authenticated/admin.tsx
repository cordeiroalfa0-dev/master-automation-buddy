import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, Trash2, Eye, EyeOff, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { buildSeo } from "@/lib/seo";
import {
  checkAdmin,
  deletePost,
  generatePostFromKeyword,
  listAllPosts,
  setPostPublished,
} from "@/lib/blog.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () =>
    buildSeo({
      title: "Painel Admin — Master Automação",
      description: "Área restrita de administração do blog.",
      path: "/admin",
      noindex: true,
    }),
  component: AdminPage,
});

const SUGESTOES = [
  "automação residencial Curitiba",
  "cortinas motorizadas preço",
  "câmeras de segurança inteligentes",
  "casa inteligente Alexa",
  "automação de condomínio",
];

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const fnCheckAdmin = useServerFn(checkAdmin);
  const fnList = useServerFn(listAllPosts);
  const fnGenerate = useServerFn(generatePostFromKeyword);
  const fnDelete = useServerFn(deletePost);
  const fnPublish = useServerFn(setPostPublished);

  const adminQ = useQuery({ queryKey: ["is-admin"], queryFn: () => fnCheckAdmin({}) });
  const postsQ = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => fnList({}),
    enabled: adminQ.data?.isAdmin === true,
  });

  const generate = useMutation({
    mutationFn: (vars: { keyword: string; category?: string }) => fnGenerate({ data: vars }),
    onSuccess: (post) => {
      toast.success(`Artigo criado: ${post.title}`);
      setKeyword("");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
    onError: (e: Error) => toast.error(e.message || "Erro ao gerar o artigo."),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (adminQ.isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!adminQ.data?.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Acesso restrito</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta conta não tem permissão de administrador.
        </p>
        <Button onClick={signOut} variant="outline" className="mt-6">
          Sair
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            Painel administrativo
          </span>
          <h1 className="mt-1 font-display text-3xl font-bold">Gerador de conteúdo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Digite a palavra-chave e a IA escreve o artigo e cria a imagem de capa.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>

      <form
        className="mt-8 rounded-2xl border bg-card p-5 shadow-card md:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (generate.isPending) return;
          generate.mutate({ keyword, category: category || undefined });
        }}
      >
        <label className="text-sm font-semibold" htmlFor="kw">
          Palavra-chave principal
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input
            id="kw"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ex: automação residencial em Curitiba"
            maxLength={120}
            required
            className="h-11"
          />
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Categoria (opcional)"
            maxLength={60}
            className="h-11 sm:max-w-[220px]"
          />
          <Button type="submit" disabled={generate.isPending || keyword.trim().length < 3} className="h-11 gap-2">
            {generate.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Gerando…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Gerar artigo
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {SUGESTOES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setKeyword(s)}
              className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>

        {generate.isPending && (
          <p className="mt-4 text-xs text-muted-foreground">
            Escrevendo o texto e gerando a imagem de capa — pode levar até 1 minuto.
          </p>
        )}
      </form>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold">
          Artigos ({postsQ.data?.length ?? 0})
        </h2>

        {postsQ.isLoading && (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </div>
        )}

        <div className="mt-4 space-y-3">
          {postsQ.data?.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center"
            >
              {p.coverImage ? (
                <img
                  src={p.coverImage}
                  alt={p.title}
                  loading="lazy"
                  className="h-16 w-28 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="h-16 w-28 shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-energy/20" />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                  {p.category} {p.keyword ? `· ${p.keyword}` : ""}
                </div>
                <div className="truncate font-display font-semibold">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  {p.datePublished} · {p.readingTime}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="rounded-md p-2 text-muted-foreground hover:text-primary"
                  aria-label="Ver artigo"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  aria-label={p.published ? "Despublicar" : "Publicar"}
                  className="rounded-md p-2 text-muted-foreground hover:text-primary"
                  onClick={async () => {
                    await fnPublish({ data: { id: p.id!, published: !p.published } });
                    queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
                  }}
                >
                  {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  aria-label="Excluir"
                  className="rounded-md p-2 text-muted-foreground hover:text-destructive"
                  onClick={async () => {
                    if (!confirm("Excluir este artigo?")) return;
                    await fnDelete({ data: { id: p.id! } });
                    toast.success("Artigo excluído.");
                    queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {postsQ.data?.length === 0 && (
            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhum artigo gerado ainda. Digite uma palavra-chave acima.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}