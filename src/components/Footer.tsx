import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Zap, Instagram, Facebook, ShieldCheck, Award, MessageCircle } from "lucide-react";
import { SITE_CONFIG, whatsappLink } from "@/lib/site-config";
import { trackPhone, trackWhatsApp } from "@/lib/analytics";

const TRUST = [
  { icon: ShieldCheck, label: "Equipe certificada" },
  { icon: Award, label: "+10 anos de mercado" },
  { icon: Zap, label: "Garantia em todos os serviços" },
];

export function Footer() {
  return (
    <footer className="relative border-t bg-surface">
      {/* Faixa superior de credibilidade */}
      <div className="border-b bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 md:px-6">
          {TRUST.map((t) => (
            <div key={t.label} className="flex items-center justify-center gap-2.5 text-sm font-medium text-foreground sm:justify-start">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <t.icon className="h-4 w-4" />
              </span>
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 font-display font-bold">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
                <Zap className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-base">Master Automação</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Automatizada
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Automação residencial, predial e industrial em Curitiba. Mais de 500 projetos
              entregues com excelência técnica e suporte dedicado.
            </p>
            <div className="mt-5 flex gap-2.5">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                onClick={() => trackWhatsApp("footer_social")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#25D366] text-white transition-spring hover:scale-110"
              >
                <MessageCircle className="h-4 w-4" fill="currentColor" />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-spring hover:scale-110 hover:border-primary hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-spring hover:scale-110 hover:border-primary hover:text-primary"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-display text-sm font-semibold text-foreground">Serviços</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {SITE_CONFIG.services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/servicos/$slug"
                    params={{ slug: s.slug }}
                    className="transition-colors hover:text-primary"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-display text-sm font-semibold text-foreground">Empresa</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/sobre" className="transition-colors hover:text-primary">Sobre nós</Link></li>
              <li><Link to="/projetos" className="transition-colors hover:text-primary">Projetos</Link></li>
              <li><Link to="/blog" className="transition-colors hover:text-primary">Blog</Link></li>
              <li><Link to="/bairros" className="transition-colors hover:text-primary">Bairros atendidos</Link></li>
              <li><Link to="/contato" className="transition-colors hover:text-primary">Contato</Link></li>
              <li><Link to="/orcamento" className="transition-colors hover:text-primary">Orçamento</Link></li>
              <li><Link to="/politica-privacidade" className="transition-colors hover:text-primary">Privacidade</Link></li>
              <li><Link to="/termos" className="transition-colors hover:text-primary">Termos</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-display text-sm font-semibold text-foreground">Contato</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                  className="font-medium text-foreground transition-colors hover:text-primary"
                  onClick={() => trackPhone("footer")}
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${SITE_CONFIG.contact.email}`} className="break-all transition-colors hover:text-primary">
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{SITE_CONFIG.contact.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{SITE_CONFIG.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bairros atendidos — SEO local */}
        <div className="mt-12 border-t pt-8">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Atendemos em Curitiba
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {SITE_CONFIG.bairros.map((b) => (
              <Link
                key={b}
                to="/atendimento/$bairro"
                params={{ bairro: b.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-") }}
                className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {b}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            CNPJ ativo · Curitiba/PR
          </div>
        </div>
      </div>
    </footer>
  );
}
