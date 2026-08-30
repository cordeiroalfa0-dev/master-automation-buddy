import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone, trackCTA } from "@/lib/analytics";
import { TopBar } from "@/components/TopBar";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/projetos", label: "Projetos" },
  { to: "/blog", label: "Blog" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-40 w-full">
      <TopBar />
      <header
        className={`w-full border-b transition-smooth ${
          scrolled
            ? "border-border/60 bg-background/90 shadow-card backdrop-blur-lg"
            : "border-border/40 bg-background/75 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link
            to="/"
            className="group flex items-center gap-2.5 font-display font-bold text-foreground"
            onClick={() => setOpen(false)}
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant transition-spring group-hover:scale-105">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
              <span className="absolute -inset-px rounded-xl bg-gradient-primary opacity-0 blur transition-opacity group-hover:opacity-60" />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-base font-bold tracking-tight">Abael Automação</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Curitiba · PR
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{
                  className:
                    "text-foreground after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gradient-energy",
                }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <a
              href={`tel:${SITE_CONFIG.contact.phoneE164}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
              onClick={() => trackPhone("header")}
            >
              <Phone className="h-4 w-4 text-primary" />
              <span className="hidden lg:inline">{SITE_CONFIG.contact.phone}</span>
            </a>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Entrar"
            >
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Entrar</span>
            </Link>
            <Button
              asChild
              size="sm"
              className="bg-gradient-energy font-semibold text-energy-foreground shadow-energy transition-spring hover:scale-[1.03] hover:opacity-95"
            >
              <Link
                to="/orcamento"
                onClick={() => trackCTA("orcamento", "header")}
              >
                Orçamento Grátis
              </Link>
            </Button>
          </div>

          <button
            className="rounded-md p-2 text-foreground transition-colors hover:bg-accent md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="border-t bg-background md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                className="mt-1 inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
                onClick={() => {
                  trackPhone("header_mobile");
                  setOpen(false);
                }}
              >
                <Phone className="h-4 w-4 text-primary" />
                {SITE_CONFIG.contact.phone}
              </a>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4" />
                Entrar (Admin)
              </Link>
              <Button
                asChild
                className="mt-2 bg-gradient-energy font-semibold text-energy-foreground shadow-energy"
              >
                <Link to="/orcamento" onClick={() => setOpen(false)}>
                  Orçamento Grátis
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
