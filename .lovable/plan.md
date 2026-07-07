Site já está bem polido. Selecionei 20 melhorias práticas de alto impacto, agrupadas por área. Se aprovar, implemento em lote.

## Conversão / UX (7)
1. **Barra de urgência no topo** — "Atendimento hoje: X vagas restantes" (rotativa com prova social).
2. **Prova social flutuante** — pop-up discreto "Fulano de Batel pediu orçamento há 12min" a cada ~40s.
3. **Calculadora de investimento estimado** — mini-form no Hero: tipo de imóvel + m² → faixa de preço + CTA.
4. **Comparativo visual "Antes / Depois"** — slider de imagens em Projetos.
5. **Vídeo depoimento em destaque** — placeholder de player com poster (troca por vídeo real depois).
6. **CTA sticky contextual desktop** — botão flutuante lateral "Fale conosco" após 30% de scroll.
7. **Confirmação pós-form melhorada** — /obrigado com próximos passos, prazo de resposta, WhatsApp e link do Google Maps.

## SEO / Conteúdo local (5)
8. **Schema `Service` por serviço** — Automation Residencial/Predial/Industrial/Segurança com `areaServed` = bairros.
9. **Schema `HowTo`** na seção "Como trabalhamos" (Diagnóstico → Projeto → Execução → Suporte).
10. **Página `/bairros` (hub)** — grid com todos os bairros linkando para `atendimento/$bairro`.
11. **Blog inicial** — 3 posts pilar: "Quanto custa automatizar uma casa em Curitiba", "KNX vs Zigbee", "Automação para condomínios".
12. **FAQ expandida com âncoras** — `#pergunta-slug` para snippets em destaque.

## Performance / Técnico (4)
13. **`fetchPriority` no LCP e `loading=eager`** — garantir hero image LCP < 2.5s.
14. **Fontes self-hosted (woff2)** — remover request ao Google Fonts, eliminar render-blocking.
15. **Imagens em `<picture>` com AVIF/WebP** — reduzir peso do hero e cards de serviço.
16. **Prefetch de rota `/orcamento`** ao hover em qualquer CTA.

## Acessibilidade / Polimento (4)
17. **Foco visível reforçado** — anel de foco consistente em botões, links e inputs.
18. **`prefers-reduced-motion`** — desligar marquee, fade-up e hover-scale para quem preferir.
19. **Contraste WCAG AA no rodapé e no topbar** — auditar tokens muted/foreground.
20. **Modo escuro** — toggle no header + tokens já refinados para dark.

Confirma que posso tocar em tudo? Se quiser tirar/priorizar algo, me diz agora.