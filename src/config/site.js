// ============================================================
// CONFIGURAÇÃO CENTRAL DO SITE
// Edite os valores abaixo para atualizar o site inteiro.
// ============================================================

export const SITE = {
  // Nome da empresa exibido no logo, rodapé e título
  companyName: "CodeVance Tech",

  // URL da logo (imagem pública)
  logoUrl: "/logo.png",

  // Número do WhatsApp no formato internacional, só dígitos (ex.: 5511999999999)
  whatsappNumber: "5511999999999",
  whatsappMessage: "Olá! Gostaria de saber mais sobre os serviços.",

  // E-mail de contato
  email: "contato@seudominio.com.br",

  // Instagram (sem @) e endereço/cidade (placeholders)
  instagram: "nomedaempresa",
  city: "Sua Cidade — Brasil",

  // Ano do rodapé
  year: 2026,
};

// Link pronto do WhatsApp
export const whatsappLink = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
  SITE.whatsappMessage
)}`;

// ============================================================
// PLANOS / PREÇOS
// Para atualizar todos os preços e itens do site, edite abaixo.
// Use placeholders como "R$ 0.000" ou "A partir de R$ XXX".
// ============================================================
export const PLANOS = {
  sites: [
    {
      nome: "Essencial",
      preco: "A partir de R$ 1.500",
      destaque: false,
      itens: [
        "Site institucional de até 5 páginas",
        "Design responsivo (celular e desktop)",
        "Formulário de contato",
        "Entrega em até 15 dias",
        "1 encontro presencial de alinhamento",
      ],
    },
    {
      nome: "Profissional",
      preco: "A partir de R$ 3.500",
      destaque: true, // Mais escolhido
      itens: [
        "Site institucional ou landing page completa",
        "Design exclusivo sob medida",
        "Integração com WhatsApp e redes sociais",
        "Otimização para Google (SEO básico)",
        "2 encontros presenciais de alinhamento",
        "30 dias de suporte após a entrega",
      ],
    },
    {
      nome: "Sob Medida",
      preco: "R$ 0.000",
      destaque: false,
      itens: [
        "Loja virtual ou sistema web integrado",
        "Funcionalidades personalizadas",
        "Painel de gerenciamento",
        "Integrações com pagamentos e ferramentas",
        "Encontros presenciais ilimitados na fase de projeto",
        "Suporte e manutenção contínua",
      ],
    },
  ],
  software: [
    {
      nome: "Essencial",
      preco: "A partir de R$ 3.000",
      destaque: false,
      itens: [
        "Sistema simples de gestão ou automação",
        "Até 3 telas/funcionalidades",
        "Treinamento para a equipe",
        "Suporte por 30 dias",
        "1 encontro presencial de levantamento",
      ],
    },
    {
      nome: "Profissional",
      preco: "A partir de R$ 8.000",
      destaque: true, // Mais escolhido
      itens: [
        "Sistema de gestão ou automação completa",
        "Integrações com ferramentas que você já usa",
        "Painel e relatórios personalizados",
        "Treinamento e documentação",
        "2 encontros presenciais de levantamento",
        "90 dias de suporte após a entrega",
      ],
    },
    {
      nome: "Sob Medida",
      preco: "R$ 0.000",
      destaque: false,
      itens: [
        "Software de ponta a ponta para sua operação",
        "Arquitetura pensada para crescer com a empresa",
        "Integrações avançadas e migração de dados",
        "Equipe dedicada durante o projeto",
        "Encontros presenciais ilimitados",
        "Suporte e evolução contínua",
      ],
    },
  ],
};
