import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone, trackCTA } from "@/lib/analytics";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/projetos", label: "Projetos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold text-foreground"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant">
            <Zap className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="hidden sm:inline">Master Elétrica</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={`tel:${SITE_CONFIG.contact.phoneE164}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary"
            onClick={() => trackPhone("header")}
          >
            <Phone className="h-4 w-4" />
            {SITE_CONFIG.contact.phone}
          </a>
          <Button
            asChild
            size="sm"
            className="bg-gradient-energy text-energy-foreground shadow-energy hover:opacity-95"
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
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
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
            <Button
              asChild
              className="mt-2 bg-gradient-energy text-energy-foreground"
            >
              <Link to="/orcamento" onClick={() => setOpen(false)}>
                Orçamento Grátis
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
