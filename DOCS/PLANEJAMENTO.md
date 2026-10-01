# Documentação de Implementação — Painel ADM CodeVance Tech

> **Versão:** 3.0
> **Data:** 2026-10-01
> **Status:** Planejamento
> **Objetivo:** Definir a estrutura completa do Painel Administrativo do CodeVance Tech, com menu, telas, funcionalidades e ideias extras organizadas por prioridade.

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Menu Lateral](#2-menu-lateral)
3. [Dashboard](#3-dashboard)
4. [Orçamentos](#4-orçamentos)
5. [Templates](#5-templates)
6. [Cadastros](#6-cadastros)
7. [Catálogo](#7-catálogo)
8. [Chatbot](#8-chatbot)
9. [Ferramentas](#9-ferramentas)
10. [Configurações](#10-configurações)
11. [Estrutura de Pastas](#11-estrutura-de-pastas)
12. [Rotas do Painel ADM](#12-rotas-do-painel-adm)
13. [Resumo das Funcionalidades](#13-resumo-das-funcionalidades)
14. [Implementações P2 — Ideias Extras](#14-implementações-p2--ideias-extras)
15. [Ideias Futuras](#15-ideias-futuras)
16. [Considerações Finais](#16-considerações-finais)

---

## 1. Visão Geral

O Painel ADM é o centro de controle da CodeVance Tech. Por ele, a equipe gerencia:

- **Orçamentos** criados por clientes ou pela própria equipe.
- **Templates** reutilizáveis para acelerar novos orçamentos.
- **Cadastros** de clientes, empresas e usuários internos.
- **Catálogo** de serviços, produtos digitais, integrações, infraestrutura e pacotes.
- **Chatbot** — conversas, perguntas não respondidas, FAQ e feedback.
- **Ferramentas** de importação, exportação e commit em lote.
- **Configurações** de identidade, parâmetros de cálculo e permissões.

O painel é acessível apenas por usuários com perfil administrativo, autenticados via `AuthGate`.

---

## 2. Menu Lateral

```
📊 Dashboard

📋 Orçamentos
   ├── Novo Orçamento
   ├── Gerenciar Orçamentos
   └── Templates

👥 Cadastros
   ├── Credenciais ADM
   ├── Clientes / Empresas
   └── Usuários

📦 Catálogo
   ├── Serviços
   ├── Produtos Digitais
   ├── Integrações
   ├── Infraestrutura
   └── Pacotes

💬 Chatbot
   ├── Conversas
   ├── Perguntas não respondidas
   ├── FAQ
   └── Feedback

🛠️ Ferramentas
   ├── Importar
   ├── Exportar
   └── Salvar Tudo

⚙️ Configurações
   ├── Identidade do site
   ├── Parâmetros de cálculo
   └── Permissões
```

---

## 3. Dashboard

### 3.1 Objetivo
Visão geral do negócio em uma tela. O ADM abre o painel e entende em segundos o que está acontecendo.

### 3.2 Blocos

**Indicadores principais (cards no topo):**
- Orçamentos abertos (rascunho + enviados aguardando resposta).
- Taxa de conversão (aprovados / enviados no período).
- Ticket médio (valor médio dos orçamentos aprovados).
- Tempo médio de fechamento (dias entre envio e aprovação).

**Atividade recente:**
- Últimos cadastros de clientes.
- Últimas mensagens do chatbot (com indicação se escalou para humano).
- Últimos orçamentos criados/editados.

**Gráficos:**
- Orçamentos por categoria (site, software, automação, outro).
- Orçamentos por mês (linha do tempo).
- Distribuição por status (pizza: rascunho, enviado, aprovado, recusado).
- Ticket médio por categoria (barras).

**Alertas:**
- Tickets humanos pendentes no chatbot.
- Perguntas não respondidas acumuladas.
- Orçamentos parados há mais de X dias.

---

## 4. Orçamentos

### 4.1 Submenu

```
📋 Orçamentos
   ├── Novo Orçamento       -> abre o wizard de criação
   ├── Gerenciar Orçamentos -> lista com filtros e ações
   └── Templates            -> orçamentos-modelo reutilizáveis
```

### 4.2 Novo Orçamento

Abre o **wizard de orçamento** (mesmo usado pelo cliente, mas com poderes de ADM):
- Pode pular etapas.
- Pode editar valores manualmente.
- Pode criar itens fora do catálogo.
- Pode salvar como template.

### 4.3 Gerenciar Orçamentos

**Tabela com colunas:**
- Nº do orçamento
- Cliente / Empresa
- Categoria (site, software, automação)
- Valor estimado
- Status (rascunho, enviado, aprovado, recusado)
- Data de criação
- Última atualização
- Responsável (orçamentista)
- Ações (ver, editar, duplicar, excluir, enviar)

**Filtros:**
- Por status
- Por cliente
- Por categoria
- Por faixa de valor
- Por período
- Por responsável

**Ações em lote:**
- Exportar selecionados.
- Alterar status.
- Atribuir responsável.

### 4.4 Editar Orçamento

Ao clicar em um orçamento, abre a **visão hierárquica completa**:

```
Orçamento
 ├── Header (título editável, minimizar, remover)
 ├── Dados do Cliente / Empresa
 └── Módulos
      ├── Telas
      │    ├── Briefing
      │    ├── Estimativa IA
      │    ├── Serviços
      │    ├── Integrações
      │    ├── Infraestrutura
      │    └── Total da Tela
      ├── Serviços do Módulo
      └── Total do Módulo
 └── Total do Orçamento
```

---

## 5. Templates

**O que é:** orçamentos-modelo reutilizáveis que aceleram a criação de novos orçamentos.

**Como funciona:**
- Criados a partir de um orçamento existente ("Salvar como template").
- Aplicados a um novo cliente com um clique.
- Editados independentemente.
- Compartilhados entre a equipe.

**Casos de uso:**
- **Site institucional padrão** — 5 telas, integrações básicas, infraestrutura.
- **E-commerce padrão** — catálogo, carrinho, checkout, painel.
- **Sistema de gestão padrão** — dashboard, cadastros, relatórios.
- **Landing page** — 1 tela, integrações de analytics, infraestrutura.

**Campos:**
- Nome do template
- Categoria
- Descrição
- Módulos e telas inclusos
- Valor base
- Prazo base
- Status (ativo, inativo)

---

## 6. Cadastros

### 6.1 Credenciais ADM

**O que é:** usuários internos que acessam o painel.

**Campos:**
- Nome
- Email
- Senha (hash)
- Perfil (admin, comercial, suporte)
- Permissões granulares (ver, editar, excluir por módulo)
- Status (ativo, inativo)
- Último acesso
- Data de criação

**Ações:**
- Criar, editar, desativar.
- Resetar senha.
- Ver log de ações.

### 6.2 Clientes / Empresas

**O que é:** cadastro de clientes (pessoas físicas ou jurídicas) que usam a plataforma.

**Campos:**
- Tipo (PF / PJ)
- Nome / Razão social
- Nome fantasia
- CNPJ / CPF
- Email
- Telefone
- Endereço completo
- Cidade / Estado
- Usuário de acesso
- Token de acesso (para integrações)
- Tempo de uso (30, 90, 120, personalizado)
- Data de cadastro
- Status (ativo, inativo, suspenso)
- Observações

**Ações:**
- Criar, editar, desativar.
- Gerar novo token.
- Ver histórico de orçamentos.
- Ver histórico de conversas no chatbot.
- Enviar convite de acesso.

### 6.3 Usuários

**O que é:** usuários finais que acessam a área do cliente.

**Campos:**
- Nome
- Email
- Senha (hash)
- Empresa vinculada
- Perfil (cliente)
- Status (ativo, inativo)
- Último acesso
- Data de criação

**Ações:**
- Criar, editar, desativar.
- Resetar senha.
- Vincular/desvincular empresa.
- Ver histórico de orçamentos.

---

## 7. Catálogo

### 7.1 Serviços

**O que é:** serviços prestados pela CodeVance Tech, com preço base.

**Exemplos:**
- Reunião presencial de levantamento.
- Design de UI/UX.
- Desenvolvimento frontend.
- Desenvolvimento backend.
- Desenvolvimento mobile.
- Testes de segurança.
- Treinamento de equipe.
- Documentação técnica.
- Suporte mensal.
- Manutenção evolutiva.

**Campos:**
- Nome
- Categoria
- Descrição
- Unidade (hora, dia, projeto)
- Preço base
- Tempo estimado
- Complexidade
- Status (ativo, inativo)

### 7.2 Produtos Digitais

**O que é:** produtos prontos ou semi-prontos que podem ser licenciados.

**Exemplos:**
- Sistema de gestão (licença).
- Painel administrativo (licença).
- Módulo de e-commerce (licença).
- App mobile (licença).
- Template de site (licença).

**Campos:**
- Nome
- Categoria
- Descrição
- Tipo de licença (única, mensal, anual)
- Preço base
- Status

### 7.3 Integrações

**O que é:** integrações com ferramentas de terceiros que podem ser incluídas no orçamento.

**Exemplos:**
- Gateway de pagamento (Stripe, PagSeguro, Mercado Pago).
- CRM (HubSpot, RD Station, Pipedrive).
- ERP (TOTVS, SAP, Omie).
- Analytics (Google Analytics, Plausible, Umami).
- WhatsApp Business API.
- Email transacional (SendGrid, Mailgun).
- Nota fiscal eletrônica.
- Frete (Correios, Melhor Envio).

**Campos:**
- Nome
- Fornecedor
- Categoria
- Descrição
- Custo de setup
- Custo recorrente (mensal/anual)
- Complexidade de integração
- Status

### 7.4 Infraestrutura

**O que é:** itens de infraestrutura que podem ser provisionados ou recomendados.

**Exemplos:**
- Hospedagem compartilhada.
- Hospedagem VPS.
- Hospedagem cloud (AWS, GCP, Azure).
- Domínio (.com.br, .com).
- Certificado SSL.
- CDN.
- Backup automático.
- Monitoramento.

**Campos:**
- Nome
- Tipo
- Descrição
- Custo de setup
- Custo recorrente
- Fornecedor
- Status

### 7.5 Pacotes

**O que é:** combinações pré-definidas de serviços, produtos, integrações e infraestrutura, vendidas como um pacote.

**Exemplos:**
- **Pacote Essencial:** site institucional 5 telas + hospedagem + domínio + SSL.
- **Pacote Profissional:** e-commerce completo + integrações + infraestrutura + suporte 90 dias.
- **Pacote Sob Medida:** sistema de gestão completo + integrações avançadas + treinamento + suporte contínuo.

**Campos:**
- Nome
- Descrição
- Itens inclusos (referências ao catálogo)
- Preço do pacote
- Desconto em relação à soma dos itens
- Status

---

## 8. Chatbot

### 8.1 Conversas

**O que é:** histórico de todas as conversas do chatbot com clientes e visitantes.

**Campos:**
- ID da conversa
- Usuário (se logado) ou sessão anônima
- Data/hora de início
- Data/hora de fim
- Nº de mensagens
- Se escalou para humano
- Se gerou orçamento
- Feedback (👍/👎)
- Resumo gerado pela IA

**Ações:**
- Ver conversa completa.
- Assumir conversa (escala para humano).
- Exportar.
- Marcar como treinamento.

### 8.2 Perguntas não respondidas

**O que é:** perguntas que o chatbot não conseguiu responder com confiança suficiente.

**Campos:**
- Pergunta
- Data/hora
- Frequência (quantas vezes foi feita)
- Contexto (página onde foi feita)
- Sugestão de resposta (gerada pela IA)
- Status (pendente, respondida, ignorada)

**Ações:**
- Responder manualmente (vira FAQ).
- Vincular a uma FAQ existente.
- Ignorar.
- Treinar o modelo com a resposta.

### 8.3 FAQ

**O que é:** base de conhecimento que alimenta o chatbot via RAG.

**Campos:**
- Pergunta
- Resposta
- Categoria
- Tags
- Status (ativa, inativa)
- Data de criação
- Última atualização

**Ações:**
- Criar, editar, excluir.
- Importar em lote (CSV/JSON).
- Exportar.
- Testar resposta no chatbot.

### 8.4 Feedback

**O que é:** avaliações dos usuários sobre as respostas do chatbot.

**Campos:**
- Mensagem avaliada
- Resposta do chatbot
- Feedback (👍/👎)
- Comentário opcional
- Data/hora
- Usuário

**Ações:**
- Ver detalhes.
- Marcar como treinamento.
- Ajustar resposta.

---

## 9. Ferramentas

### 9.1 Importar

**O que é:** importação de dados em lote para o catálogo e cadastros.

**Formatos suportados:**
- CSV
- JSON
- XLSX (futuro)

**O que pode ser importado:**
- Serviços
- Produtos digitais
- Integrações
- Infraestrutura
- Pacotes
- Clientes / Empresas
- Usuários
- FAQ

**Fluxo:**
1. Upload do arquivo.
2. Pré-visualização dos dados.
3. Mapeamento de colunas.
4. Validação (duplicatas, campos obrigatórios).
5. Confirmação.
6. Log de importação.

### 9.2 Exportar

**O que é:** exportação de dados para backup ou análise externa.

**O que pode ser exportado:**
- Tudo (backup completo).
- Catálogo (serviços, produtos, integrações, infraestrutura, pacotes).
- Cadastros (clientes, usuários).
- Orçamentos (com filtros).
- Conversas do chatbot.
- FAQ.

**Formatos:**
- CSV
- JSON
- XLSX (futuro)

### 9.3 Salvar Tudo

**O que é:** commit em lote de todas as alterações pendentes no painel.

**Funcionamento:**
- O ADM edita vários itens.
- As alterações ficam em memória (estado "sujo").
- Ao clicar em "Salvar Tudo", todas são persistidas de uma vez.
- Log de auditoria registra quem alterou o quê.

---

## 10. Configurações

### 10.1 Identidade do site

**O que é:** dados institucionais que aparecem no site público.

**Campos:**
- Nome da empresa
- Logo
- Favicon
- WhatsApp
- Email
- Instagram
- Cidade
- Ano de fundação
- Planos e preços (referências)

### 10.2 Parâmetros de cálculo

**O que é:** configurações que alimentam o estimador IA.

**Campos:**
- Valor/hora base.
- Multiplicador por complexidade (baixa, média, alta).
- Multiplicador por responsividade (desktop, tablet, mobile).
- Multiplicador por acessibilidade (nenhuma, básica, AA, AAA).
- Fator de segurança (margem).
- Prazo padrão por tipo de projeto.
- Limiares de confiança da IA.

### 10.3 Permissões

**O que é:** controle granular de acesso por perfil.

**Perfis:**
- **admin** — acesso total.
- **comercial** — vê orçamentos, não edita catálogo.
- **suporte** — vê conversas do chatbot, não edita orçamentos.
- **cliente** — vê apenas seus próprios dados.

**Permissões granulares:**
- Ver, criar, editar, excluir por módulo.
- Exportar dados.
- Ver logs de auditoria.

---

## 11. Estrutura de Pastas

```
src/features/admin/
  AdminLayout                 (sidebar + topbar + breadcrumb)
  pages/
    Dashboard
    Orcamentos/
      NovoOrcamento
      GerenciarOrcamentos
      EditarOrcamento
      Templates
    Cadastros/
      Credenciais
      Clientes
      Usuarios
    Catalogo/
      Servicos
      ProdutosDigitais
      Integracoes
      Infraestrutura
      Pacotes
    Chatbot/
      Conversas
      PerguntasNaoRespondidas
      FAQ
      Feedback
    Ferramentas/
      Importar
      Exportar
      SalvarTudo
    Configuracoes/
      Identidade
      ParametrosCalculo
      Permissoes
  components/
    DataTable                 (tabela reutilizável)
    CrudForm                  (form genérico)
    StatusBadge
    FilterBar
    Pagination
    ConfirmDialog
    EmptyState
    LoadingState
  hooks/
    useCrud                   (React Query + mutations genéricas)
    useFilters
    usePagination
    usePermissions
  services/
    admin-api
```

---

## 12. Rotas do Painel ADM

```
/admin
/admin/dashboard

/admin/orcamentos
/admin/orcamentos/novo
/admin/orcamentos/:id
/admin/orcamentos/templates

/admin/cadastros/credenciais
/admin/cadastros/clientes
/admin/cadastros/usuarios

/admin/catalogo/servicos
/admin/catalogo/produtos
/admin/catalogo/integracoes
/admin/catalogo/infraestrutura
/admin/catalogo/pacotes

/admin/chatbot/conversas
/admin/chatbot/perguntas
/admin/chatbot/faq
/admin/chatbot/feedback

/admin/ferramentas/importar
/admin/ferramentas/exportar
/admin/ferramentas/salvar-tudo

/admin/configuracoes/identidade
/admin/configuracoes/parametros
/admin/configuracoes/permissoes
```

---

## 13. Resumo das Funcionalidades

| Módulo | Criar | Editar | Excluir | Importar | Exportar | Salvar Tudo |
|---|---|---|---|---|---|---|
| Dashboard | — | — | — | — | — | — |
| Orçamentos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Templates | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Credenciais ADM | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Clientes / Empresas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Usuários | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Serviços | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Produtos Digitais | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Integrações | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Infraestrutura | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pacotes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Chatbot — Conversas | — | ✅ | ✅ | — | ✅ | — |
| Chatbot — Perguntas | — | ✅ | ✅ | — | ✅ | — |
| Chatbot — FAQ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Chatbot — Feedback | — | ✅ | — | — | ✅ | — |
| Configurações | — | ✅ | — | — | — | ✅ |

---

# Documentação de Implementação — Internacionalização (i18n)

> **Versão:** 1.0
> **Data:** 2026-10-01
> **Status:** Planejamento
> **Objetivo:** Definir a estratégia completa de internacionalização do CodeVance Tech, com detecção automática de idioma, tradução do site institucional, painel ADM, área do cliente, chatbot e conteúdo dinâmico.

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Como Funciona a Detecção Automática](#2-como-funciona-a-detecção-automática)
3. [Idiomas Suportados](#3-idiomas-suportados)
4. [Arquitetura de Tradução](#4-arquitetura-de-tradução)
5. [Arquivos de Tradução](#5-arquivos-de-tradução)
6. [Bibliotecas e Ferramentas](#6-bibliotecas-e-ferramentas)
7. [Fluxo do Cliente](#7-fluxo-do-cliente)
8. [Seletor Manual de Idioma](#8-seletor-manual-de-idioma)
9. [O que Precisa Ser Traduzido](#9-o-que-precisa-ser-traduzido)
10. [Conteúdo Dinâmico](#10-conteúdo-dinâmico)
11. [Moeda, Datas e Números](#11-moeda-datas-e-números)
12. [SEO Internacional](#12-seo-internacional)
13. [Chatbot Multi-idioma](#13-chatbot-multi-idioma)
14. [E-mails Transacionais](#14-e-mails-transacionais)
15. [O que Muda na Arquitetura](#15-o-que-muda-na-arquitetura)
16. [Vantagens](#16-vantagens)
17. [Cuidados e Desafios](#17-cuidados-e-desafios)
18. [Recomendação de Implementação](#18-recomendação-de-implementação)
19. [Resumo](#19-resumo)
20. [Próximos Passos](#20-próximos-passos)

---

## 1. Visão Geral

O CodeVance Tech será internacionalizado para atender clientes de diferentes regiões. O site detecta automaticamente o idioma do navegador do visitante e carrega a versão correspondente, sem que ele precise escolher manualmente.

**Princípios:**
- **Detecção automática** — o cliente já cai no idioma certo.
- **Fallback inteligente** — se o idioma não for suportado, cai no inglês.
- **Preferência salva** — se o cliente trocar manualmente, o sistema lembra.
- **URLs separadas por idioma** — bom para SEO e para compartilhamento.
- **Conteúdo dinâmico traduzível** — catálogo, FAQ e serviços também em vários idiomas.

---

## 2. Como Funciona a Detecção Automática

O navegador do cliente **já envia** o idioma preferido dele em toda requisição, no header HTTP:

```
Accept-Language: pt-BR,pt;q=0.9,en;q=0.8,es;q=0.7
```

Isso significa: "prefiro português do Brasil, depois português, depois inglês, depois espanhol".

**A lógica é:**

1. O site carrega.
2. Lê o header `Accept-Language` (ou a API `navigator.language` no navegador).
3. Compara com os idiomas suportados.
4. Escolhe o melhor match.
5. Carrega o site nesse idioma.
6. Salva a escolha (cookie/localStorage) para não perguntar de novo.

**Exemplos práticos:**

| Cliente em | `Accept-Language` | Site carrega em |
|---|---|---|
| Brasil | `pt-BR,pt;q=0.9,en;q=0.8` | Português |
| EUA | `en-US,en;q=0.9` | Inglês |
| Espanha | `es-ES,es;q=0.9,en;q=0.8` | Espanhol |
| Alemanha | `de-DE,de;q=0.9,en;q=0.8` | Inglês (fallback) |
| Japão | `ja-JP,ja;q=0.9` | Inglês (fallback) |

---

## 3. Idiomas Suportados

**Idiomas iniciais:**

| Idioma | Código | Público-alvo |
|---|---|---|
| Português (Brasil) | `pt-BR` | Brasil |
| Inglês | `en` | Internacional, fallback global |
| Espanhol | `es` | América Latina, Espanha |

**Idiomas futuros (se houver demanda):**
- Francês (`fr`)
- Alemão (`de`)
- Italiano (`it`)

**Fallback:** inglês. Se o idioma do cliente não for suportado, o site carrega em inglês.

---

## 4. Arquitetura de Tradução

```
src/
  locales/
    pt-BR.json
    en.json
    es.json
  i18n/
    config.js              (configuração do i18next)
    detector.js            (detecção automática de idioma)
    formatters.js          (datas, números, moedas)
  hooks/
    useTranslation.js      (hook customizado)
    useLocale.js           (hook para idioma atual)
  components/
    LanguageSwitcher.jsx   (seletor manual de idioma)
```

**Fluxo:**

```
Cliente abre o site
      │
      ▼
Navegador envia Accept-Language
      │
      ▼
detector.js lê o header
      │
      ▼
Compara com idiomas suportados
      │
      ▼
Match encontrado: en
      │
      ▼
Carrega en.json
      │
      ▼
Renderiza o site em inglês
      │
      ▼
Salva "en" no localStorage
      │
      ▼
Próxima visita: já carrega direto em inglês
```

---

## 5. Arquivos de Tradução

Um arquivo por idioma, com as mesmas chaves:

**pt-BR.json:**
```json
{
  "hero": {
    "title": "Qual problema da sua empresa podemos resolver hoje?",
    "subtitle": "Criamos softwares e sites sob medida...",
    "cta": "Falar no WhatsApp"
  },
  "nav": {
    "home": "Início",
    "solutions": "Soluções",
    "howItWorks": "Como Funciona",
    "pricing": "Valores",
    "about": "Sobre",
    "contact": "Contato"
  }
}
```

**en.json:**
```json
{
  "hero": {
    "title": "What problem can we solve for your company today?",
    "subtitle": "We build custom software and websites...",
    "cta": "Chat on WhatsApp"
  },
  "nav": {
    "home": "Home",
    "solutions": "Solutions",
    "howItWorks": "How It Works",
    "pricing": "Pricing",
    "about": "About",
    "contact": "Contact"
  }
}
```

**es.json:**
```json
{
  "hero": {
    "title": "¿Qué problema de tu empresa podemos resolver hoy?",
    "subtitle": "Creamos software y sitios web a medida...",
    "cta": "Hablar por WhatsApp"
  },
  "nav": {
    "home": "Inicio",
    "solutions": "Soluciones",
    "howItWorks": "Cómo Funciona",
    "pricing": "Precios",
    "about": "Nosotros",
    "contact": "Contacto"
  }
}
```

**Estrutura de chaves:**
- Organizadas por seção (`hero`, `nav`, `pricing`, `contact`, `footer`).
- Aninhadas para facilitar manutenção.
- Nomes descritivos (não abreviados).

---

## 6. Bibliotecas e Ferramentas

| Biblioteca | Função |
|---|---|
| **`react-i18next`** | Tradução no React |
| **`i18next`** | Motor de tradução |
| **`i18next-browser-languagedetector`** | Detecção automática de idioma |
| **`i18next-http-backend`** | Carregamento de traduções via HTTP (opcional) |

**Detector de idioma — ordem de verificação:**

1. **Query string** — `?lng=en`
2. **Cookie** — preferência salva
3. **localStorage** — preferência salva
4. **navigator** — idioma do navegador
5. **htmlTag** — atributo `lang` do HTML
6. **path** — `/en/...` ou `/pt/...`
7. **subdomain** — `en.codevancetech.com`

Se não encontrar nada, usa o **fallback** (inglês).

---

## 7. Fluxo do Cliente

```
1. Cliente abre codevancetech.com
2. Navegador envia Accept-Language: en-US,en;q=0.9
3. Detector lê o header
4. Compara com idiomas suportados: pt-BR, en, es
5. Match encontrado: en
6. Carrega en.json
7. Renderiza o site em inglês
8. Salva "en" no localStorage
9. Próxima visita: já carrega direto em inglês
```

**Se o cliente trocar manualmente:**
- A escolha manual **sobrepõe** a detecção automática.
- Salva no localStorage.
- Não pergunta de novo.

---

## 8. Seletor Manual de Idioma

Além da detecção automática, é bom ter um **seletor de idioma** visível:

**Locais:**
- **No topo do site** — bandeirinha ou sigla (PT | EN | ES).
- **No rodapé** — lista de idiomas.
- **No painel do cliente** — nas configurações.
- **No chatbot** — responde no idioma do cliente.

**Comportamento:**
- Se o cliente trocar manualmente, essa escolha **sobrepõe** a detecção automática.
- Salva no localStorage.
- Não pergunta de novo.

---

## 9. O que Precisa Ser Traduzido

### 9.1 Site Institucional (Home)
- Hero (título, subtítulo, CTAs).
- Navbar (links).
- Estatísticas.
- Problemas atendidos.
- Soluções.
- Como funciona.
- Planos e preços.
- Sobre.
- Contato.
- Footer.

### 9.2 Painel ADM
- Menu lateral.
- Títulos de página.
- Labels de formulário.
- Mensagens de erro.
- Mensagens de sucesso.
- Tooltips.

### 9.3 Área do Cliente
- Mesma coisa que o painel ADM, mas para o cliente.

### 9.4 Chatbot
- Respostas automáticas.
- FAQ.
- Mensagens de sistema ("digitando...", "online", "offline").

### 9.5 E-mails Transacionais
- Boas-vindas.
- Confirmação de pagamento.
- Recuperação de senha.
- Follow-up.

### 9.6 Conteúdo Dinâmico
- Nomes de serviços, produtos, integrações.
- Descrições do catálogo.
- FAQ.

---

## 10. Conteúdo Dinâmico

Conteúdo criado pelo ADM (catálogo, FAQ, serviços) precisa ser **multi-idioma também**. Duas abordagens:

**Abordagem A — Tradução manual:**
- O ADM cadastra o serviço em cada idioma.
- Campo `nome_pt`, `nome_en`, `nome_es`.
- Controle total, mas trabalhoso.

**Abordagem B — Tradução automática com IA:**
- O ADM cadastra em português.
- O sistema traduz automaticamente para os outros idiomas.
- O ADM revisa e aprova.
- Usa o mesmo LLM local do chatbot.

**Recomendação:** comece com manual (A), depois adicione IA (B).

**Estrutura de dados multi-idioma:**

```
servico
  ├── nome_pt
  ├── nome_en
  ├── nome_es
  ├── descricao_pt
  ├── descricao_en
  ├── descricao_es
  └── ...
```

---

## 11. Moeda, Datas e Números

Além do idioma, precisa adaptar:

| Item | Brasil | EUA | Espanha |
|---|---|---|---|
| **Moeda** | R$ 3.000 | $ 3,000 | € 3.000 |
| **Data** | 01/10/2026 | 10/01/2026 | 01/10/2026 |
| **Número** | 3.000,50 | 3,000.50 | 3.000,50 |
| **Telefone** | +55 11 99999-9999 | +1 555 555 5555 | +34 600 000 000 |

**Bibliotecas:**
- `Intl.NumberFormat` — números e moedas.
- `Intl.DateTimeFormat` — datas.
- `Intl.RelativeTimeFormat` — "há 2 dias", "em 1 semana".

**Importante:** o **preço** pode ser diferente por região. Muitas empresas cobram em dólar para clientes internacionais e em real para brasileiros. Isso é uma **decisão de negócio**, não técnica.

---

## 12. SEO Internacional

Para o Google encontrar o site em cada idioma:

**URLs separadas:**
```
codevancetech.com/pt/
codevancetech.com/en/
codevancetech.com/es/
```

**Ou subdomínios:**
```
pt.codevancetech.com
en.codevancetech.com
es.codevancetech.com
```

**Tag `hreflang` no HTML** — avisa o Google qual versão mostrar para cada região.

**Sitemap separado** por idioma.

**Recomendação:** URLs separadas (`/pt/`, `/en/`, `/es/`) são mais simples e o Google entende bem.

---

## 13. Chatbot Multi-idioma

O chatbot deve:
- **Detectar o idioma** do cliente automaticamente.
- **Responder no idioma** do cliente.
- **Ter FAQ** em todos os idiomas.
- **Escalar para humano** que fale o idioma do cliente.

**Estrutura:**
- Base de conhecimento (RAG) com embeddings multi-idioma.
- LLM local com suporte a múltiplos idiomas (Llama 3.2, Phi-3).
- FAQ traduzida ou traduzida automaticamente.

---

## 14. E-mails Transacionais

Todos os e-mails precisam ser multi-idioma:
- Boas-vindas.
- Confirmação de pagamento.
- Recuperação de senha.
- Follow-up.
- Notificações de projeto.

**Estrutura:**
- Template por idioma.
- Variáveis dinâmicas (nome, valor, data).
- Formatação de data/moeda por região.

---

## 15. O que Muda na Arquitetura

| Item | Antes | Depois |
|---|---|---|
| **Textos** | Hardcoded em português | Arquivos JSON por idioma |
| **Rotas** | `/`, `/login`, `/admin` | `/pt/`, `/en/`, `/pt/login`, `/en/login` |
| **Datas** | `01/10/2026` | `Intl.DateTimeFormat` |
| **Números** | `3.000,50` | `Intl.NumberFormat` |
| **Moeda** | R$ | Múltiplas |
| **Conteúdo dinâmico** | 1 idioma | Multi-idioma (manual ou IA) |
| **E-mails** | 1 idioma | Multi-idioma |
| **Chatbot** | 1 idioma | Multi-idioma |
| **SEO** | 1 sitemap | Sitemap por idioma + hreflang |

---

## 16. Vantagens

1. **Mercado maior** — clientes de fora podem contratar.
2. **Ticket maior** — clientes internacionais pagam em dólar/euro.
3. **Menos dependência do Brasil** — se a economia local piorar, você tem outros mercados.
4. **Profissionalismo** — site multi-idioma passa credibilidade.
5. **SaaS escalável** — se virar SaaS, pode vender para software houses de outros países.

---

## 17. Cuidados e Desafios

1. **Tradução de qualidade** — Google Translate não basta. Invista em tradução humana ou IA revisada.
2. **Conteúdo dinâmico** — o maior desafio. Precisa de estratégia clara.
3. **Suporte em outros idiomas** — se o cliente fala inglês, você precisa responder em inglês.
4. **Fuso horário** — reuniões presenciais com clientes de fora exigem adaptação.
5. **Pagamento internacional** — Stripe é melhor que Asaas para isso.
6. **Moeda e impostos** — cliente internacional paga em dólar, mas você recebe em real. Câmbio e impostos complicam.
7. **SEO internacional** — precisa de estratégia separada por país.
8. **Cultura** — o que funciona no Brasil não funciona nos EUA. Cores, tom, exemplos.

---

## 18. Recomendação de Implementação

### Fase 1 — Site Institucional
- Traduzir Home, Navbar, Footer, Planos, Contato.
- Detecção automática de idioma.
- Seletor manual.
- URLs separadas (`/pt/`, `/en/`, `/es/`).

### Fase 2 — Painel ADM e Área do Cliente
- Traduzir menus, labels, mensagens.
- Conteúdo dinâmico em português (por enquanto).
- Tradução automática com IA (futuro).

### Fase 3 — Chatbot e E-mails
- Chatbot responde no idioma do cliente.
- E-mails transacionais multi-idioma.

### Fase 4 — Conteúdo Dinâmico
- Tradução automática com IA para catálogo, FAQ, serviços.
- Revisão humana.

---

## 19. Resumo

| Dúvida | Resposta |
|---|---|
| **Consigo detectar o idioma automaticamente?** | Sim. O navegador envia `Accept-Language`, e a biblioteca `i18next-browser-languagedetector` faz o resto. |
| **O cliente já cai no idioma certo?** | Sim, se o idioma dele estiver na lista de suportados. Senão, cai no fallback (inglês). |
| **Preciso reescrever o site?** | Não. Só extrair os textos para arquivos JSON e trocar por chaves de tradução. |
| **E o conteúdo dinâmico (catálogo, FAQ)?** | Precisa de estratégia. Manual (campos por idioma) ou IA (tradução automática). |
| **E a moeda?** | `Intl.NumberFormat` formata automaticamente. Mas o preço pode ser diferente por região (decisão de negócio). |
| **E o SEO?** | URLs separadas por idioma (`/pt/`, `/en/`) + tag `hreflang` + sitemap por idioma. |
| **Qual biblioteca usar?** | `react-i18next` + `i18next-browser-languagedetector`. |
| **Quanto tempo leva?** | Site institucional: 1-2 semanas. Painel ADM: 2-3 semanas. Conteúdo dinâmico: 3-4 semanas. |

---

## 20. Próximos Passos

1. **Definir idiomas iniciais:** português, inglês, espanhol.
2. **Criar arquivos de tradução** em `src/locales/`.
3. **Instalar `react-i18next`** e configurar.
4. **Extrair textos** do site institucional.
5. **Adicionar seletor de idioma** no topo do site.
6. **Configurar URLs** separadas por idioma.
7. **Traduzir painel ADM** e área do cliente.
8. **Traduzir chatbot** e e-mails.
9. **Implementar tradução automática** de conteúdo dinâmico com IA.
10. **Configurar SEO** internacional.

---

**Documento separado das implementações P2 e ideias futuras.**
**Referência cruzada:** Documentação de Implementação — Painel ADM CodeVance Tech (v3.0).

