import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildSeo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => buildSeo({
    title: "Entrar — Master Automação",
    description: "Acesse sua área de cliente Master Automação com sua conta Google.",
    path: "/auth",
    noindex: true,
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) setUserEmail(data.session.user.email);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleGoogle() {
    setLoading(true);
    try {
      // O OAuth gerenciado (/~oauth/*) só existe nos domínios lovable.app.
      // Em outros hosts (ex.: Vercel) usamos o OAuth do Supabase direto.
      const host = window.location.hostname;
      const isLovableHost = host.endsWith("lovable.app") || host === "localhost" || host === "127.0.0.1";
      if (!isLovableHost) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin + "/auth" },
        });
        if (error) {
          toast.error("Erro ao entrar com Google. Tente novamente.");
          setLoading(false);
        }
        return;
      }
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth",
      });
      if (result.error) {
        toast.error("Erro ao entrar com Google. Tente novamente.");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      toast.success("Login realizado!");
      navigate({ to: "/" });
    } catch {
      toast.error("Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Você saiu da conta.");
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setEmailLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setEmailLoading(false);
    if (error) {
      toast.error("E-mail ou senha inválidos.");
      return;
    }
    toast.success("Login realizado!");
    navigate({ to: "/admin" });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <div className="w-full rounded-2xl border bg-card p-8 shadow-elegant">
        <h1 className="font-display text-2xl font-bold text-center">Área do Cliente</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Entre com sua conta Google para acompanhar seus orçamentos e projetos.
        </p>

        {userEmail ? (
          <div className="mt-8 space-y-4 text-center">
            <p className="text-sm">
              Conectado como <strong>{userEmail}</strong>
            </p>
            <Button onClick={() => navigate({ to: "/admin" })} variant="secondary" className="w-full">
              Painel administrativo
            </Button>
            <Button onClick={() => navigate({ to: "/" })} className="w-full">
              Ir para o site
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sair
            </Button>
          </div>
        ) : (
          <>
          <form onSubmit={handleEmailLogin} className="mt-8 space-y-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              autoComplete="email"
              required
              className="h-11"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              autoComplete="current-password"
              required
              className="h-11"
            />
            <Button type="submit" disabled={emailLoading} className="h-11 w-full">
              {emailLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            onClick={handleGoogle}
            disabled={loading}
            variant="outline"
            className="w-full h-12 gap-3 border-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Conectando..." : "Entrar com Google"}
          </Button>
          </>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Ao continuar, você concorda com nossos{" "}
          <a href="/termos" className="underline hover:text-foreground">Termos</a> e{" "}
          <a href="/politica-privacidade" className="underline hover:text-foreground">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}