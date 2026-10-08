import chatbotContext from "./chatbot-context.md?raw";

const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseContext = (markdown) => {
  const headings = [...markdown.matchAll(/^##\s+(.+)$/gm)];
  return headings.map((heading, index) => {
    const start = heading.index + heading[0].length;
    const end = headings[index + 1]?.index ?? markdown.length;
    const content = markdown.slice(start, end).trim();
    const keywordLine = content.match(/^Palavras-chave:\s*(.+)$/m)?.[1] ?? "";

    return {
      title: heading[1].trim(),
      keywords: normalize(`${heading[1]} ${keywordLine}`).split(" "),
      content: content.replace(/^Palavras-chave:\s*.+\r?\n?/m, "").trim(),
    };
  });
};

const contextSections = parseContext(chatbotContext);
const contains = (text, pattern) => pattern.test(text);

const getProjectType = (text) => {
  if (/\b(loja|ecommerce|e commerce|vender|vendas|produtos)\b/.test(text)) return "loja virtual";
  if (/\b(sistema|software|automacao|automatizar|painel|integracao|integrar)\b/.test(text)) return "sistema ou automação";
  if (/\b(site|pagina|landing|institucional|presenca online)\b/.test(text)) return "site institucional";
  return "";
};

const formatPlans = (plans, includeItems = false) =>
  plans
    .map((plan) => {
      const items = includeItems ? `\n  Inclui: ${plan.itens.join("; ")}` : "";
      return `• ${plan.nome}: ${plan.preco}${items}`;
    })
    .join("\n");

const suggestionsFor = (projectType = "") => {
  if (projectType === "site institucional") {
    return ["Quais são os planos de sites?", "Como funciona o orçamento?", "Qual é o prazo?"];
  }
  if (projectType === "loja virtual") {
    return ["Como funciona o orçamento?", "O que preciso preparar?", "Falar com a equipe"];
  }
  if (projectType === "sistema ou automação") {
    return ["Quais são os planos de sistemas?", "Como funciona o orçamento?", "Falar com a equipe"];
  }
  return ["Quais serviços vocês fazem?", "Qual plano combina com minha ideia?", "Quero falar com a equipe"];
};

const askForBriefingStep = (briefing) => {
  if (!briefing.projectType) {
    return {
      reply: "Para eu entender sua ideia e orientar o próximo passo, o que você está pensando em criar?",
      suggestions: ["Site institucional", "Loja virtual", "Sistema ou automação"],
    };
  }
  if (!briefing.business) {
    return {
      reply: `Entendi: você está considerando ${briefing.projectType}. Qual é o ramo do seu negócio e quem você quer atender?`,
      suggestions: ["Tenho uma empresa", "Estou começando agora", "Quero explicar minha ideia"],
    };
  }
  if (!briefing.goal) {
    return {
      reply: `Obrigado! O que você gostaria de melhorar ou alcançar com ${briefing.projectType}: apresentar sua empresa, vender, organizar um processo ou outra coisa?`,
      suggestions: ["Apresentar meus serviços", "Vender pela internet", "Organizar processos"],
    };
  }
  if (!briefing.features) {
    return {
      reply: "Quais funções ou recursos são indispensáveis para esse projeto? Se ainda não souber, podemos definir isso junto com a equipe.",
      suggestions: ["Ainda estou definindo", "Preciso de integrações", "Quero conversar com a equipe"],
    };
  }
  if (!briefing.timeline) {
    return {
      reply: "Você tem uma data ou prazo desejado? O cronograma final é estimado depois que a equipe avalia o escopo.",
      suggestions: ["Tenho uma data em mente", "Sem prazo definido", "Quero falar com a equipe"],
    };
  }

  return null;
};

const continueBriefing = (question, briefing) => {
  const updated = { ...briefing };
  const answer = question.trim();

  if (updated.step === "projectType") {
    updated.projectType = getProjectType(normalize(answer));
    if (!updated.projectType) {
      return {
        briefing: updated,
        reply: "Ainda não identifiquei o tipo de solução. Você procura um site institucional, uma loja virtual ou um sistema/automação?",
        suggestions: ["Site institucional", "Loja virtual", "Sistema ou automação"],
      };
    }
    updated.step = "business";
  } else if (updated.step === "business") {
    updated.business = answer;
    updated.step = "goal";
  } else if (updated.step === "goal") {
    updated.goal = answer;
    updated.step = "features";
  } else if (updated.step === "features") {
    updated.features = answer;
    updated.step = "timeline";
  } else if (updated.step === "timeline") {
    updated.timeline = answer;
    updated.step = "complete";
  }

  if (updated.step === "complete") {
    return {
      briefing: { ...updated, active: false },
      reply: `Obrigado por compartilhar os detalhes. Aqui está o resumo para a equipe:\n\n• Solução: ${updated.projectType}\n• Negócio/público: ${updated.business}\n• Objetivo: ${updated.goal}\n• Recursos desejados: ${updated.features}\n• Prazo desejado: ${updated.timeline}\n\nO investimento e o cronograma dependem da avaliação do escopo pela equipe. Use “Falar com a equipe” para encaminhar esse resumo e continuar a conversa.`,
      suggestions: ["Quais são os planos e valores?", "Como funciona o processo?", "Falar com a equipe"],
    };
  }

  const next = askForBriefingStep(updated);
  return { briefing: updated, ...next };
};

const startBriefing = (question) => {
  const projectType = getProjectType(normalize(question));
  const briefing = {
    active: true,
    step: projectType ? "business" : "projectType",
    projectType,
    business: "",
    goal: "",
    features: "",
    timeline: "",
  };
  return { briefing, ...askForBriefingStep(briefing) };
};

const getRelevantContext = (question) => {
  const words = new Set(normalize(question).split(" ").filter((word) => word.length > 2));
  const ranked = contextSections
    .map((section) => ({
      section,
      score: section.keywords.reduce((score, keyword) => score + (words.has(keyword) ? 1 : 0), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);
  return ranked[0]?.section;
};

const answer = (reply, suggestions, briefing) => ({ reply, suggestions, briefing });

export function createLocalReply(question, { SITE, PLANOS, briefing }) {
  const text = normalize(question);
  const type = getProjectType(text) || briefing?.projectType || "";
  const isStartingBriefing = contains(text, /\b(quero|preciso|gostaria de|vamos)\b.*\b(or[cç]amento|proposta|briefing)\b|\b(montar|fazer|iniciar|comecar)\s+(?:meu|minha|um|uma)?\s*(?:briefing|projeto)\b|\bquero fazer um site\b/);
  const hasQuestionIntent = question.includes("?") ||
    contains(text, /^(quanto|qual|quais|como funciona|o que fazem|o que vcs fazem|me diga|quero saber|pode explicar)\b/);
  const isQuestionAboutExistingFacts = hasQuestionIntent &&
    contains(text, /\b(quanto|pre[cç]o|valor|custa|planos?|pacotes?|inclui|incluso|suporte|manuten[cç][aã]o|prazo|demora|processo|como funciona|o que fazem|quais servi[cç]os)\b/);
  const isContactRequest = contains(text, /\b(falar com a equipe|falar com algu[eé]m|atendente|humano|contato)\b/);

  if (briefing?.active && !isQuestionAboutExistingFacts && !isContactRequest) {
    return continueBriefing(question, briefing);
  }

  if (contains(text, /\b(whatsapp|atendente|humano|pessoa|falar com a equipe|falar com algu[eé]m|conversar com algu[eé]m|contato)\b/)) {
    return answer(
      `Estou abrindo o WhatsApp para você continuar com a equipe. O resumo do projeto que você compartilhou será incluído na mensagem.`,
      ["Quais serviços vocês fazem?", "Como funciona o orçamento?", "Quero montar meu briefing"],
      briefing
    );
  }

  if (contains(text, /\b(o que fazem|o que vcs fazem|o que voces fazem|quais servi[cç]os|servi[cç]os oferecem|como funcionam|como voc[eê]s trabalham|como fazem)\b/) &&
      contains(text, /\b(or[cç]amento|pre[cç]o|valor|quanto|custa)\b/)) {
    return answer(
      `${SITE.companyName} cria sites institucionais, lojas virtuais, sistemas sob medida, automações, integrações e painéis de gestão. O trabalho começa entendendo seus objetivos, depois a equipe define o escopo e o orçamento, desenvolve a solução e acompanha o projeto.\n\nValores iniciais:\n\nCriação de sites:\n${formatPlans(PLANOS.sites)}\n\nSistemas e software:\n${formatPlans(PLANOS.software)}\n\nLojas virtuais e projetos com funcionalidades específicas são avaliados sob medida. Qual é a principal necessidade do seu negócio?`,
      ["Quero montar meu briefing", "Quais são os planos de sites?", "Quais são os planos de sistemas?"],
      briefing
    );
  }

  if (contains(text, /\b(suporte|manuten[cç][aã]o|depois da entrega|p[oó]s entrega)\b/)) {
    return answer(
      getRelevantContext("suporte manutenção")?.content ??
        "Oferecemos suporte após a entrega conforme o plano e o escopo do projeto.",
      ["Quais são os planos de sites?", "Quais são os planos de sistemas?", "Falar com a equipe"],
      briefing
    );
  }

  if (contains(text, /\b(prazo|demora|tempo de entrega|quando fica pronto)\b/)) {
    return answer(
      "O prazo é estimado depois que a equipe entende as funcionalidades, o escopo e os materiais disponíveis. Assim, o cronograma é definido para o projeto real, sem prometer um prazo antes dessa avaliação.",
      ["O que preciso preparar?", "Quero montar meu briefing", "Falar com a equipe"],
      briefing
    );
  }

  if (contains(text, /\b(pagamento|parcelamento|parcelar|pix|cart[aã]o)\b/)) {
    return answer(
      "As condições de pagamento são apresentadas pela equipe junto com a proposta, depois de entender o escopo. Não há uma condição única informada para todos os projetos.",
      ["Como funciona o orçamento?", "Quero montar meu briefing", "Falar com a equipe"],
      briefing
    );
  }

  if (contains(text, /\b(como funciona|processo|etapas|como voc[eê]s trabalham)\b/)) {
    return answer(
      getRelevantContext("processo de trabalho etapas")?.content ??
        "Primeiro entendemos seus objetivos, depois definimos o escopo e o orçamento, desenvolvemos a solução e acompanhamos o projeto.",
      ["Quais serviços vocês fazem?", "Quero montar meu briefing", "Qual é o prazo?"],
      briefing
    );
  }

  if (contains(text, /\b(qual plano|plano combina|recomenda[cç][aã]o|qual solu[cç][aã]o|site ou sistema)\b/)) {
    const details = briefing?.business || briefing?.goal;
    if (details) {
      return answer(
        `Pelo que você contou, ${type === "loja virtual"
          ? "uma loja virtual ou solução Sob Medida deve ser avaliada, pois envolve venda de produtos e definição de catálogo, pagamentos e operação."
          : type === "sistema ou automação"
            ? "um sistema sob medida pode ser o caminho quando é preciso organizar processos ou integrar ferramentas; o escopo define se o plano Essencial, Profissional ou Sob Medida se encaixa."
            : "um site institucional pode atender à apresentação do negócio; o Essencial cobre um site de até 5 páginas, enquanto o Profissional inclui design exclusivo, integrações com WhatsApp/redes sociais, SEO básico e 30 dias de suporte."
        } Para recomendar com segurança, precisamos confirmar as funcionalidades e o escopo.`,
        ["Quero montar meu briefing", "Quais itens estão incluídos?", "Falar com a equipe"],
        briefing
      );
    }
    return briefing?.active ? continueBriefing(question, briefing) : startBriefing(question);
  }

  if (contains(text, /\b(planos?|pacotes?)\b/)) {
    if (type === "loja virtual") {
      return answer(
        "Lojas virtuais são avaliadas como projetos Sob Medida. O orçamento considera o catálogo, os meios de pagamento, as integrações e os recursos de gestão desejados.",
        ["Como funciona o orçamento?", "O que preciso preparar?", "Quero montar meu briefing"],
        briefing
      );
    }
    const plans = type === "sistema ou automação" ? PLANOS.software : PLANOS.sites;
    const label = type === "sistema ou automação" ? "sistemas e software" : "sites";
    const planDetails = type
      ? `Estes são os planos de ${label}:\n\n${formatPlans(plans, true)}`
      : `Planos de sites:\n${formatPlans(PLANOS.sites, true)}\n\nPlanos de sistemas e software:\n${formatPlans(PLANOS.software, true)}`;
    return answer(
      `${planDetails}\n\nO plano ideal depende do escopo e dos recursos que você precisa.`,
      ["Qual plano combina com minha ideia?", "Como funciona o orçamento?", "Quero montar meu briefing"],
      briefing
    );
  }

  if (contains(text, /\b(quais servi[cç]os|o que fazem|o que voc[eê]s fazem|servi[cç]os oferecem)\b/)) {
    return answer(
      getRelevantContext("visão geral serviços")?.content ??
        `${SITE.companyName} cria sites, lojas virtuais, sistemas sob medida, automações e integrações.`,
      ["Qual plano combina com minha ideia?", "Quais são os planos de sites?", "Quero montar meu briefing"],
      briefing
    );
  }

  if (contains(text, /\b(inclui|incluso|itens|benef[ií]cios|detalhes dos planos)\b/)) {
    const plans = type === "sistema ou automação" ? PLANOS.software : PLANOS.sites;
    const label = type === "sistema ou automação" ? "sistemas e software" : "sites";
    return answer(
      `Veja o que cada plano de ${label} oferece:\n\n${formatPlans(plans, true)}\n\nO escopo final é confirmado pela equipe antes da proposta.`,
      suggestionsFor(type),
      briefing
    );
  }

  if (isStartingBriefing) return startBriefing(question);

  if (contains(text, /\b(pre[cç]o|valores?|custa|quanto|or[cç]amento)\b/)) {
    if (type === "site institucional") {
      return answer(`Os valores iniciais para sites são:\n\n${formatPlans(PLANOS.sites)}\n\nO valor final depende do conteúdo e das funcionalidades.`, suggestionsFor(type), briefing);
    }
    if (type === "sistema ou automação") {
      return answer(`Os valores iniciais para sistemas e software são:\n\n${formatPlans(PLANOS.software)}\n\nO valor final depende dos processos, telas e integrações necessários.`, suggestionsFor(type), briefing);
    }
    if (type === "loja virtual") {
      return answer("Lojas virtuais são avaliadas sob medida. O orçamento depende do catálogo, dos meios de pagamento, das integrações e dos recursos de gestão desejados.", suggestionsFor(type), briefing);
    }
    return answer(
      `Os valores iniciais variam conforme o tipo de projeto:\n\nCriação de sites:\n${formatPlans(PLANOS.sites)}\n\nSistemas e software:\n${formatPlans(PLANOS.software)}\n\nLojas virtuais e projetos sob medida são orçados após a definição do escopo.`,
      ["Quais itens estão incluídos?", "Qual plano combina com minha ideia?", "Quero montar meu briefing"],
      briefing
    );
  }

  if (briefing?.active) return continueBriefing(question, briefing);

  const section = getRelevantContext(question);
  if (section) {
    return answer(
      `${section.content}\n\nSe você me contar um pouco mais sobre seu objetivo, posso ajudar a identificar os próximos passos.`,
      suggestionsFor(type),
      briefing
    );
  }

  if (type) {
    const nextBriefing = startBriefing(question);
    return {
      ...nextBriefing,
      reply: `Posso ajudar com ${type}. Para recomendar um caminho adequado e preparar o orçamento, ${nextBriefing.reply[0].toLowerCase()}${nextBriefing.reply.slice(1)}`,
    };
  }

  return answer(
    "Quero te orientar com informações confiáveis, mas ainda não entendi qual é sua necessidade. Você procura apresentar sua empresa, vender pela internet ou organizar/automatizar um processo?",
    ["Apresentar minha empresa", "Vender pela internet", "Organizar um processo"],
    briefing
  );
}
