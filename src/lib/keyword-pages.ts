/** Páginas de palavra-chave (as mesmas buscadas nos concorrentes de Curitiba). */
export interface KeywordPage {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  bullets: string[];
  faq: { q: string; a: string }[];
}

export const KEYWORD_PAGES: KeywordPage[] = [
  {
    slug: "automacao-residencial-curitiba",
    keyword: "automação residencial Curitiba",
    title: "Automação Residencial em Curitiba — Abael Automação",
    description: "Empresa de automação residencial em Curitiba: iluminação, cortinas, som, câmeras e Alexa. Instalação na sua casa, orçamento grátis.",
    h1: "Automação Residencial em Curitiba",
    intro: "Transformamos sua casa ou apartamento em Curitiba em uma casa inteligente, controlada pelo celular ou por voz, sem quebrar paredes.",
    bullets: ["Iluminação e cortinas automáticas", "Controle por Alexa e Google Assistente", "Instalação em apartamento já pronto", "Suporte técnico local"],
    faq: [
      { q: "Atendem todos os bairros de Curitiba?", a: "Sim, atendemos Curitiba e região metropolitana, sempre na casa do cliente." },
      { q: "Precisa quebrar parede?", a: "Na maioria dos casos não. Usamos equipamentos sem fio próprios para imóveis prontos." },
    ],
  },
  {
    slug: "empresa-de-automacao-residencial",
    keyword: "empresa de automação residencial",
    title: "Empresa de Automação Residencial em Curitiba | Abael",
    description: "Procurando uma empresa de automação residencial? A Abael Automação projeta e instala casa inteligente em Curitiba e região.",
    h1: "Empresa de Automação Residencial",
    intro: "Somos uma empresa de automação residencial de Curitiba que cuida de tudo: projeto, instalação, configuração e suporte.",
    bullets: ["Visita técnica e orçamento grátis", "Projeto sob medida", "Garantia na instalação", "Atendimento por WhatsApp"],
    faq: [{ q: "Como funciona o orçamento?", a: "Você chama no WhatsApp, fazemos uma visita e enviamos a proposta sem custo." }],
  },
  {
    slug: "casa-inteligente-curitiba",
    keyword: "casa inteligente Curitiba",
    title: "Casa Inteligente em Curitiba — Instalação | Abael Automação",
    description: "Deixe sua casa inteligente em Curitiba: luzes, tomadas, fechaduras, câmeras e rotinas automáticas pelo celular.",
    h1: "Casa Inteligente em Curitiba",
    intro: "Comece com poucos itens e amplie quando quiser. Montamos sua casa inteligente do jeito que cabe no seu bolso.",
    bullets: ["Rotinas automáticas (bom dia, sair de casa)", "Fechadura digital", "Tomadas e interruptores inteligentes", "Tudo em um único aplicativo"],
    faq: [{ q: "Dá para começar pequeno?", a: "Sim. Muitos clientes começam pela sala e expandem depois." }],
  },
  {
    slug: "alexa-automacao-residencial",
    keyword: "Alexa automação residencial",
    title: "Automação Residencial com Alexa em Curitiba | Abael",
    description: "Controle luzes, ar-condicionado, TV e cortinas com a Alexa. Instalação e configuração de automação com Alexa em Curitiba.",
    h1: "Automação Residencial com Alexa",
    intro: "Configure sua casa para obedecer comandos de voz da Alexa ou do Google Assistente, com instalação profissional.",
    bullets: ["Luzes e cortinas por voz", "Ar-condicionado e TV por voz", "Cenas como 'Alexa, modo cinema'", "Configuração completa no app"],
    faq: [{ q: "Funciona com Google também?", a: "Sim, trabalhamos com Alexa, Google Assistente e Apple Casa." }],
  },
  {
    slug: "automacao-residencial-preco",
    keyword: "automação residencial preço",
    title: "Automação Residencial: Preço em Curitiba | Abael Automação",
    description: "Quanto custa automação residencial em Curitiba? Veja o que influencia o preço e peça um orçamento grátis.",
    h1: "Automação Residencial: quanto custa?",
    intro: "O preço depende do tamanho do imóvel e do que você quer automatizar. Fazemos orçamento grátis e sem compromisso.",
    bullets: ["Projetos para todos os orçamentos", "Pode ser feito em etapas", "Preço fechado antes de começar", "Parcelamento"],
    faq: [{ q: "O orçamento é pago?", a: "Não, a visita e o orçamento são gratuitos em Curitiba." }],
  },
  {
    slug: "cftv-curitiba",
    keyword: "CFTV Curitiba",
    title: "CFTV e Câmeras de Segurança em Curitiba | Abael Automação",
    description: "Instalação de CFTV e câmeras de segurança em Curitiba para casas, condomínios e empresas, com acesso pelo celular.",
    h1: "CFTV e Câmeras de Segurança em Curitiba",
    intro: "Veja sua casa ou empresa pelo celular de qualquer lugar, com câmeras de alta definição e gravação.",
    bullets: ["Câmeras Full HD e visão noturna", "Acesso remoto pelo celular", "Gravação em nuvem ou local", "Alerta de movimento"],
    faq: [{ q: "Atendem condomínios?", a: "Sim, instalamos CFTV em casas, condomínios e empresas." }],
  },
  {
    slug: "home-theater-curitiba",
    keyword: "home theater Curitiba",
    title: "Home Theater em Curitiba — Projeto e Instalação | Abael",
    description: "Projeto e instalação de home theater e home cinema em Curitiba, com som, projetor e automação da sala.",
    h1: "Home Theater em Curitiba",
    intro: "Cinema em casa com som envolvente, imagem de qualidade e tudo controlado em um só botão.",
    bullets: ["Projeto acústico", "Som surround", "Projetor ou TV", "Cena 'cinema' automática"],
    faq: [{ q: "Precisa de sala grande?", a: "Não, adaptamos o projeto ao tamanho do ambiente." }],
  },
  {
    slug: "som-ambiente-curitiba",
    keyword: "som ambiente Curitiba",
    title: "Som Ambiente em Curitiba — Instalação | Abael Automação",
    description: "Instalação de som ambiente em Curitiba: caixas embutidas, música em cada cômodo e controle pelo celular.",
    h1: "Som Ambiente em Curitiba",
    intro: "Música em todos os cômodos, com caixas discretas embutidas no teto e controle pelo celular.",
    bullets: ["Caixas embutidas", "Música por cômodo", "Spotify e streaming", "Controle por voz"],
    faq: [{ q: "Funciona com Spotify?", a: "Sim, com Spotify e outros aplicativos de música." }],
  },
  {
    slug: "controle-de-acesso-curitiba",
    keyword: "controle de acesso Curitiba",
    title: "Controle de Acesso em Curitiba | Abael Automação",
    description: "Controle de acesso em Curitiba: fechaduras digitais, biometria, reconhecimento facial e interfone para casas e empresas.",
    h1: "Controle de Acesso em Curitiba",
    intro: "Mais segurança e praticidade na entrada da sua casa, condomínio ou empresa.",
    bullets: ["Biometria e reconhecimento facial", "Fechadura digital", "Interfone com vídeo", "Liberação pelo celular"],
    faq: [{ q: "Serve para empresas?", a: "Sim, atendemos residências, condomínios e empresas." }],
  },
  {
    slug: "automacao-industrial-curitiba",
    keyword: "automação industrial Curitiba",
    title: "Automação Industrial em Curitiba — CLP e Painéis | Abael",
    description: "Automação industrial em Curitiba: programação de CLP, painéis elétricos, retrofit e adequação NR10/NR12.",
    h1: "Automação Industrial em Curitiba",
    intro: "Soluções para indústrias de Curitiba e região: mais produtividade, segurança e menos paradas.",
    bullets: ["Programação de CLP", "Montagem de painéis", "Retrofit de máquinas", "Adequação NR10 e NR12"],
    faq: [{ q: "Atendem região metropolitana?", a: "Sim, incluindo CIC, Araucária, São José dos Pinhais e Pinhais." }],
  },
  {
    slug: "automacao-predial-curitiba",
    keyword: "automação predial Curitiba",
    title: "Automação Predial em Curitiba | Abael Automação",
    description: "Automação predial em Curitiba para prédios e condomínios: iluminação, acesso, câmeras e economia de energia.",
    h1: "Automação Predial em Curitiba",
    intro: "Prédios mais seguros e econômicos, com áreas comuns automatizadas e controle centralizado.",
    bullets: ["Iluminação das áreas comuns", "Controle de acesso", "CFTV integrado", "Economia de energia"],
    faq: [{ q: "Fazem em prédio já pronto?", a: "Sim, fazemos retrofit em prédios existentes." }],
  },
];
