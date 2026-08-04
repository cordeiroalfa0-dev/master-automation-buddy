/**
 * Helpers do Google Meu Negócio (Google Business Profile).
 * Todos funcionam sem chave de API e sem Place ID — quando o Place ID
 * for preenchido em SITE_CONFIG.googleBusiness, os links ficam mais precisos.
 */
import { SITE_CONFIG } from "./site-config";

const GB = SITE_CONFIG.googleBusiness;
const QUERY = encodeURIComponent(GB.mapQuery);

/** Ficha/pesquisa da empresa no Google Maps. */
export const mapsProfileUrl = GB.profileUrl
  ? GB.profileUrl
  : GB.placeId
    ? `https://www.google.com/maps/place/?q=place_id:${GB.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${QUERY}`;

/** "Como chegar" — abre o app de mapas no celular. */
export const directionsUrl = GB.placeId
  ? `https://www.google.com/maps/dir/?api=1&destination=${QUERY}&destination_place_id=${GB.placeId}`
  : `https://www.google.com/maps/dir/?api=1&destination=${QUERY}`;

/** Formulário de avaliação do Google (5 estrelas). */
export const reviewUrl = GB.placeId
  ? `https://search.google.com/local/writereview?placeid=${GB.placeId}`
  : mapsProfileUrl;

/** Iframe de mapa sem API key. */
export const mapEmbedUrl = `https://www.google.com/maps?q=${QUERY}&hl=pt-BR&z=12&output=embed`;

/** vCard para o visitante salvar o contato no celular em 1 toque. */
export function buildVCard() {
  const c = SITE_CONFIG.contact;
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${SITE_CONFIG.name};;;`,
    `FN:${SITE_CONFIG.name}`,
    `ORG:${SITE_CONFIG.name}`,
    "TITLE:Automação residencial, predial e industrial",
    `TEL;TYPE=CELL,VOICE:${c.phoneE164}`,
    `EMAIL;TYPE=INTERNET:${c.email}`,
    `ADR;TYPE=WORK:;;${c.address};Curitiba;PR;;Brasil`,
    `URL:${SITE_CONFIG.url}`,
    `NOTE:${SITE_CONFIG.description}`,
    "END:VCARD",
  ].join("\r\n");
}
