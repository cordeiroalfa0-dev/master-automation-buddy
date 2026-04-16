import { MessageCircle } from "lucide-react";
import { whatsappLink, SITE_CONFIG } from "@/lib/site-config";
import { trackWhatsApp } from "@/lib/analytics";

interface Props {
  message?: string;
  source?: string;
}

export function WhatsAppFloat({ source = "floating" }: Props) {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(source)}
      aria-label={`Falar no WhatsApp ${SITE_CONFIG.contact.phone}`}
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-elegant transition-transform hover:scale-110 animate-pulse-glow md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}

export function WhatsAppButton({
  message,
  source = "page",
  className,
  children,
}: Props & { className?: string; children?: React.ReactNode }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(source)}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-elegant transition-opacity hover:opacity-90"
      }
    >
      <MessageCircle className="h-4 w-4" fill="currentColor" />
      {children ?? "Falar no WhatsApp"}
    </a>
  );
}
