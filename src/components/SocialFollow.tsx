import { Instagram, Facebook, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackSocialClick } from "@/lib/analytics";
import carousel1 from "@/assets/carousel-1.jpg";
import carousel2 from "@/assets/carousel-2.jpg";
import carousel3 from "@/assets/carousel-3.jpg";
import carousel4 from "@/assets/carousel-4.jpg";

const PREVIEW_IMAGES = [carousel1, carousel2, carousel3, carousel4];

/**
 * Bloco "Siga a gente" — usado na home para converter visitantes em seguidores
 * no Instagram e curtidas no Facebook. Sem dependência de API/token externo
 * (usa fotos já existentes no projeto como preview), então funciona 100% offline
 * no build e não expõe nenhuma credencial.
 */
export function SocialFollow() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Instagram */}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="grid grid-cols-4">
            {PREVIEW_IMAGES.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Projeto de automação Abael Automação"
                loading="lazy"
                width={270}
                height={270}
                className="aspect-square w-full object-cover"
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <div className="flex items-center gap-2 font-display font-bold">
                <Instagram className="h-5 w-5 text-primary" />
                Instagram
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Bastidores de instalações, dicas de automação e novos projetos em Curitiba.
              </p>
            </div>
            <a
              href={SITE_CONFIG.social.instagram}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackSocialClick("instagram", "home_follow_section")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-spring hover:scale-[1.03]"
            >
              Seguir <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Facebook */}
        <div className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-card">
          <div>
            <div className="flex items-center gap-2 font-display font-bold">
              <Facebook className="h-5 w-5 text-primary" />
              Facebook
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhe avaliações de clientes, novidades e promoções da Abael Automação direto no Facebook.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-muted/40 p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant">
              <Facebook className="h-6 w-6" />
            </span>
            <div className="text-sm">
              <div className="font-semibold text-foreground">{SITE_CONFIG.name}</div>
              <div className="text-muted-foreground">Página oficial no Facebook</div>
            </div>
          </div>
          <a
            href={SITE_CONFIG.social.facebook}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackSocialClick("facebook", "home_follow_section")}
            className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-spring hover:scale-[1.03]"
          >
            Curtir a página <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
