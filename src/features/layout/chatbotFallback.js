const formatPlans = (plans) =>
  Object.entries(plans)
    .map(([category, tiers]) => {
      const title = category === "sites" ? "Criação de sites" : "Sistemas e software";
      return `${title}:\n${tiers
        .map((tier) => `• ${tier.nome}: ${tier.preco}`)
        .join("\n")}`;
    })
    .join("\n\n");

export function getFallbackReply(question, { SITE, PLANOS }) {
  const normalized = question
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/quero (pedir|fazer|solicitar)|pedir (um )?orcamento|solicitar (um )?orcamento|comecar meu projeto/.test(normalized)) {
    return {
      reply: "Vamos conversar sobre seu projeto. Para preparar um orçamento, ajuda saber se você precisa de um site ou sistema e quais objetivos ou funcionalidades são mais importantes. Se preferir, toque em “Falar com a equipe” para explicar sua ideia diretamente.",
      suggestions: [
        "Preciso de um site",
        "Preciso de um sistema",
        "Quais informações devo preparar?",
      ],
    };
  }

  if (/inclui|incluso|beneficio|detalhes dos planos|quais sao os planos/.test(normalized)) {
    return {
      reply: `Os planos variam conforme o tipo e o escopo do projeto. Nos sites, as opções começam com site de até 5 páginas, design responsivo e formulário de contato. Projetos profissionais incluem design exclusivo, SEO básico e suporte após a entrega. Em sistemas, há opções de gestão, automações, integrações, painéis e relatórios. Você pode conferir os valores iniciais:\n\n${formatPlans(PLANOS)}`,
      suggestions: [
        "Qual plano combina com minha ideia?",
        "Como funciona o suporte?",
        "Quero conversar sobre um orçamento",
      ],
    };
  }

  if (/pre[cç]o|valor|custa|or[cç]amento|invest|quanto/.test(normalized)) {
    return {
      reply: `Os valores iniciais dependem do tipo de projeto:\n\n${formatPlans(PLANOS)}\n\nO orçamento final é personalizado conforme suas necessidades.`,
      suggestions: [
        "O que está incluído nos planos?",
        "Site ou sistema: qual escolher?",
        "Quero pedir um orçamento",
      ],
    };
  }

  if (/prazo|demora|tempo|entrega|quando fica/.test(normalized)) {
    return {
      reply: "O prazo depende do escopo, das funcionalidades e dos materiais disponíveis. Depois de entender sua ideia, nossa equipe estima um cronograma realista antes de começar.",
      suggestions: [
        "Como funciona o processo?",
        "O que preciso preparar?",
        "Quero conversar sobre meu projeto",
      ],
    };
  }

  if (/servi[cç]o|fazem|oferecem|site|sistema|software|loja|autom[aç][ãa]o/.test(normalized)) {
    return {
      reply: `${SITE.companyName} cria sites institucionais e lojas virtuais, além de sistemas sob medida, automações, integrações e painéis de gestão. Também oferecemos suporte após a entrega.`,
      suggestions: [
        "Quais são os planos de sites?",
        "Vocês fazem sistemas personalizados?",
        "Como funciona o orçamento?",
      ],
    };
  }

  if (/whatsapp|humano|pessoa|equipe|atendente|falar com|contato/.test(normalized)) {
    return {
      reply: 'Claro! Toque em "Falar com a equipe" logo abaixo para conversar com nosso time pelo WhatsApp.',
      suggestions: [
        "Quais serviços vocês fazem?",
        "Quanto custa um projeto?",
        "Qual é o prazo?",
      ],
    };
  }

  if (/pagamento|parcela|parcelamento|pix|cart[aã]o/.test(normalized)) {
    return {
      reply: "As condições de pagamento são definidas de acordo com o escopo e o orçamento do projeto. Nossa equipe pode apresentar as opções quando entender melhor o que você precisa.",
      suggestions: [
        "Como funciona o orçamento?",
        "O que está incluído no projeto?",
        "Quero falar com a equipe",
      ],
    };
  }

  return {
    reply: 'Posso ajudar com informações sobre criação de sites, sistemas sob medida, automações, valores e prazos. Conte um pouco mais sobre o que você está planejando ou toque em "Falar com a equipe" abaixo para conversar com nosso time.',
    suggestions: [
      "Quais serviços vocês fazem?",
      "Quanto custa um projeto?",
      "Como funciona o processo?",
    ],
  };
}
