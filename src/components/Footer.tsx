import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Zap, Instagram, Facebook } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone } from "@/lib/analytics";

export function Footer() {
  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
                <Zap className="h-5 w-5" strokeWidth={2.5} />
              </span>
              Master Elétrica
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Automação inteligente em Curitiba. Mais de 500 projetos entregues
              com excelência técnica.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-md border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-md border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold">Serviços</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {SITE_CONFIG.services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/servicos/$slug"
                    params={{ slug: s.slug }}
                    className="hover:text-foreground"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold">Empresa</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/sobre" className="hover:text-foreground">Sobre nós</Link></li>
              <li><Link to="/projetos" className="hover:text-foreground">Projetos</Link></li>
              <li><Link to="/contato" className="hover:text-foreground">Contato</Link></li>
              <li><Link to="/orcamento" className="hover:text-foreground">Pedir Orçamento</Link></li>
              <li><Link to="/politica-privacidade" className="hover:text-foreground">Privacidade</Link></li>
              <li><Link to="/termos" className="hover:text-foreground">Termos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold">Contato</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <a
                  href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                  className="hover:text-foreground"
                  onClick={() => trackPhone("footer")}
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <a href={`mailto:${SITE_CONFIG.contact.email}`} className="hover:text-foreground break-all">
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                {SITE_CONFIG.contact.address}
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-primary" />
                {SITE_CONFIG.contact.hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
