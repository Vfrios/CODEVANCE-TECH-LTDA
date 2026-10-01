# Documentação Técnica — CodeVance Tech

> **Versão:** 1.0
> **Data:** 2026-10-01
> **Status:** Planejamento
> **Objetivo:** Consolidar as seis documentações técnicas essenciais do projeto CodeVance Tech: Backend e API, Banco de Dados, LGPD e Privacidade, Fluxos do Usuário, Design System e Glossário.

---

## Sumário

1. [Backend e API](#1-backend-e-api)
2. [Banco de Dados](#2-banco-de-dados)
3. [LGPD e Privacidade](#3-lgpd-e-privacidade)
4. [Fluxos do Usuário](#4-fluxos-do-usuário)
5. [Design System](#5-design-system)
6. [Glossário](#6-glossário)

---

# 1. Backend e API

## 1.1 Visão Geral

O backend é a camada que sustenta autenticação, orçamentos, chatbot, catálogo e billing. Hoje o projeto tem apenas `server/index.js` com `GET /api/health`. Este documento define a arquitetura do backend real.

## 1.2 Stack

| Item | Tecnologia |
|---|---|
| Runtime | Node.js 22 |
| Framework | NestJS com adaptador Fastify |
| Linguagem | TypeScript |
| Banco | PostgreSQL |
| ORM | Prisma |
| Validação | DTOs do NestJS + Zod quando necessário |
| Autenticação | JWT + refresh token |
| Hash de senha | bcrypt ou argon2 |
| Testes | Vitest + Supertest |

## 1.3 Estrutura de Pastas

```
server/
  index.js                 (bootstrap temporario atual)
  config/
  http/
    routes/
    controllers/
    middlewares/
    schemas/
  modules/
    health/
    auth/
    admin/
      orcamentos/
      cadastros/
      catalogo/
      chatbot/
      configuracoes/
  services/
  repositories/
  integrations/
  database/
    migrations/
    seeds/
  jobs/
  tests/
```

## 1.4 Padrão de Rotas

- **REST** com versionamento: `/api/v1/...`
- **Recursos no plural:** `/api/v1/orcamentos`
- **Ações específicas:** `/api/v1/orcamentos/:id/enviar`
- **Sub-recursos:** `/api/v1/orcamentos/:id/modulos`

## 1.5 Padrão de Resposta

**Sucesso:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 42 }
}
```

**Erro:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Campo obrigatório",
    "details": [ ... ]
  }
}
```

## 1.6 Autenticação

- **Login:** retorna `access_token` (15 min) + `refresh_token` (7 dias).
- **Refresh:** renova o access token.
- **Logout:** invalida o refresh token.
- **Middleware:** valida JWT em rotas protegidas.
- **Roles:** `admin`, `comercial`, `suporte`, `cliente`.

## 1.7 Validação de Entrada

- Toda rota valida o body com Zod.
- Erros de validação retornam 400 com detalhes.
- Nunca confie no cliente.

## 1.8 Tratamento de Erros

- Middleware global captura erros.
- Erros conhecidos retornam status e código.
- Erros desconhecidos retornam 500 e são logados.
- Nunca exponha stack trace em produção.

## 1.9 Variáveis de Ambiente

| Variável | Uso |
|---|---|
| `DATABASE_URL` | Conexão com o banco |
| `JWT_SECRET` | Assinatura do JWT |
| `JWT_REFRESH_SECRET` | Assinatura do refresh token |
| `API_PORT` | Porta do servidor |
| `NODE_ENV` | Ambiente (dev, prod, test) |
| `CORS_ORIGIN` | Origem permitida |

## 1.10 Migrations e Seed

- Prisma gerencia migrations.
- Seed popula dados iniciais (constantes, admin padrão).
- Migrations rodam no deploy.

## 1.11 Testes

- Unitários: funções puras, cálculos.
- Integração: rotas + banco.
- E2E: fluxos completos.
- CI roda testes antes do deploy.

---

# 2. Banco de Dados

## 2.1 Visão Geral

O banco armazena todas as entidades do sistema: usuários, clientes, orçamentos, módulos, telas, briefings, serviços, integrações, infraestrutura, pacotes, conversas do chatbot, FAQ e logs.

## 2.2 Diagrama Entidade-Relacionamento (resumido)

```
Usuario ──< Orcamento
Empresa ──< Usuario
Empresa ──< Orcamento
Orcamento ──< Modulo
Modulo ──< Tela
Tela ──< Briefing
Tela ──< Servico
Tela ──< Integracao
Tela ──< Infraestrutura
Orcamento ──< Template
Conversa ──< Mensagem
FAQ ──< Categoria
LogAuditoria ──< Usuario
```

## 2.3 Tabelas Principais

### usuarios
- id, nome, email, senha_hash, role, empresa_id, status, ultimo_acesso, criado_em

### empresas
- id, tipo, nome, razao_social, cnpj_cpf, email, telefone, endereco, cidade, estado, status, criado_em

### orcamentos
- id, empresa_id, usuario_id, titulo, categoria, status, valor_estimado, prazo_estimado, criado_em, atualizado_em

### modulos
- id, orcamento_id, titulo, ordem, valor_total

### telas
- id, modulo_id, titulo, ordem, valor_total

### briefings
- id, tela_id, tipo, complexidade, autenticacao, api_externa, num_campos, num_regras, responsividade, acessibilidade, horas_estimadas, valor_estimado

### servicos
- id, nome, categoria, descricao, unidade, preco_base, tempo_estimado, complexidade, status

### integracoes
- id, nome, fornecedor, categoria, descricao, custo_setup, custo_recorrente, complexidade, status

### infraestrutura
- id, nome, tipo, descricao, custo_setup, custo_recorrente, fornecedor, status

### pacotes
- id, nome, descricao, preco, desconto, status

### conversas
- id, usuario_id, sessao, inicio, fim, num_mensagens, escalou_humano, gerou_orcamento, feedback, resumo

### mensagens
- id, conversa_id, papel (user, assistant), conteudo, criado_em

### faq
- id, pergunta, resposta, categoria, tags, status, criado_em, atualizado_em

### logs_auditoria
- id, usuario_id, acao, entidade, entidade_id, dados_antes, dados_depois, ip, criado_em

## 2.4 Relacionamentos

- **1:N** — Empresa → Usuários, Empresa → Orçamentos, Orçamento → Módulos.
- **N:N** — Orçamento ↔ Serviços, Tela ↔ Integrações (via tabelas de junção).
- **1:1** — Tela → Briefing.

## 2.5 Índices

- `usuarios.email` (único)
- `empresas.cnpj_cpf` (único)
- `orcamentos.empresa_id`
- `orcamentos.status`
- `conversas.usuario_id`
- `logs_auditoria.usuario_id`
- `logs_auditoria.criado_em`

## 2.6 Convenções

- Nomes de tabela no plural, snake_case.
- Chaves primárias: `id` (UUID ou auto-increment).
- Chaves estrangeiras: `<tabela>_id`.
- Timestamps: `criado_em`, `atualizado_em`.
- Soft delete: `deletado_em` (nullable).

## 2.7 Migrations

- Prisma gerencia.
- Cada migration é versionada.
- Rollback documentado.
- Nunca alterar migration já aplicada.

## 2.8 Backup

- Diário automático.
- Semanal completo.
- Armazenado fora do servidor.
- Teste de restauração mensal.

---

# 3. LGPD e Privacidade

## 3.1 Visão Geral

O CodeVance Tech coleta dados de clientes, empresas e visitantes. Este documento define como esses dados são tratados, armazenados, usados e protegidos, em conformidade com a LGPD.

## 3.2 Dados Coletados

| Categoria | Dados |
|---|---|
| Identificação | Nome, email, telefone, CPF/CNPJ |
| Acesso | Usuário, senha (hash), token |
| Negócio | Orçamentos, projetos, catálogo, conversas |
| Navegação | IP, user-agent, páginas visitadas |
| Pagamento | Dados de fatura (via gateway) |

## 3.3 Finalidade

- Prestação do serviço contratado.
- Comunicação com o cliente.
- Melhoria do produto.
- Conformidade legal.
- Marketing (com consentimento).

## 3.4 Base Legal

- **Execução de contrato** — dados necessários para o serviço.
- **Consentimento** — marketing, cookies não essenciais.
- **Obrigação legal** — dados fiscais, contábeis.
- **Interesse legítimo** — segurança, prevenção a fraude.

## 3.5 Retenção

| Dado | Tempo |
|---|---|
| Dados de conta | Enquanto ativo + 5 anos |
| Orçamentos | 5 anos |
| Conversas do chatbot | 2 anos |
| Logs de auditoria | 5 anos |
| Cookies | Conforme política |
| Dados fiscais | 5 anos (obrigação legal) |

## 3.6 Direitos do Titular

- Acesso aos dados.
- Correção.
- Exclusão.
- Portabilidade.
- Revogação de consentimento.
- Informação sobre compartilhamento.

## 3.7 Como Atender

- **Acesso:** painel do cliente mostra tudo.
- **Correção:** painel permite editar.
- **Exclusão:** botão "excluir conta" + confirmação.
- **Portabilidade:** exportação em JSON/CSV.
- **Revogação:** painel de preferências.

## 3.8 Compartilhamento

- **Gateway de pagamento** — necessário para cobrança.
- **Provedor de email** — necessário para comunicação.
- **Provedor de nuvem** — hospedagem.
- **Nunca** vender dados a terceiros.

## 3.9 Segurança

- Hash de senha.
- HTTPS.
- Criptografia em repouso.
- Log de auditoria.
- Controle de acesso.
- Backup criptografado.

## 3.10 Incidentes

- Detecção.
- Contenção.
- Notificação à ANPD e aos titulares.
- Registro.
- Post-mortem.

## 3.11 DPO

- Encarregado de dados.
- Contato público.
- Responsável por conformidade.

## 3.12 Documentos

- Política de Privacidade.
- Termos de Uso.
- Política de Cookies.
- DPA (Data Processing Agreement).
- Registro de operações.

---

# 4. Fluxos do Usuário

## 4.1 Cadastro do Cliente

1. Cliente acessa `/register`.
2. Preenche dados (nome, email, senha, empresa).
3. Sistema valida e cria conta.
4. Envia e-mail de confirmação.
5. Cliente confirma e acessa `/conta`.

## 4.2 Criação de Orçamento (Wizard)

1. Cliente acessa `/orcamento`.
2. Passo 1: escolhe tipo (site, software, automação).
3. Passo 2: chat com IA para diagnóstico.
4. Passo 3: catálogo sugerido pela IA.
5. Passo 4: prazos e urgência.
6. Passo 5: resumo com faixa de valor.
7. Cliente salva como rascunho ou envia.
8. Sistema notifica ADM.

## 4.3 Aprovação de Proposta

1. ADM revisa orçamento.
2. Gera proposta em PDF.
3. Envia ao cliente (e-mail ou WhatsApp).
4. Cliente acessa link público.
5. Cliente aprova com um clique.
6. Sistema gera contrato.
7. Cliente assina digitalmente.
8. Projeto é criado.

## 4.4 Onboarding

1. Orçamento aprovado.
2. Sistema envia checklist de onboarding.
3. Cliente preenche briefing.
4. Cliente agenda reunião presencial.
5. ADM recebe notificação.
6. Reunião acontece.
7. Projeto entra em desenvolvimento.

## 4.5 Suporte via Chatbot

1. Cliente abre chat.
2. Chatbot detecta idioma.
3. Cliente faz pergunta.
4. Chatbot busca na base (RAG).
5. Responde com confiança.
6. Se confiança baixa, escala para humano.
7. Humano responde no painel.
8. Conversa fica registrada.

## 4.6 Pagamento (se SaaS)

1. Cliente escolhe plano.
2. Sistema cria assinatura no gateway.
3. Cliente paga (cartão, Pix, boleto).
4. Gateway envia webhook.
5. Sistema libera acesso.
6. Renovação automática mensal.
7. Se falhar, sistema suspende.
8. Se cancelar, sistema bloqueia no fim do período.

## 4.7 Cancelamento

1. Cliente acessa painel.
2. Clica em "cancelar assinatura".
3. Sistema pergunta motivo.
4. Cliente confirma.
5. Sistema cancela no gateway.
6. Acesso mantido até fim do período pago.
7. Após, acesso bloqueado.
8. Dados mantidos por 5 anos (obrigação legal).

## 4.8 Exclusão de Conta (LGPD)

1. Cliente acessa painel.
2. Clica em "excluir conta".
3. Sistema avisa sobre consequências.
4. Cliente confirma com senha.
5. Sistema anonimiza dados pessoais.
6. Mantém dados fiscais (obrigação legal).
7. Envia confirmação por e-mail.

---

# 5. Design System

## 5.1 Visão Geral

O Design System padroniza cores, tipografia, espaçamentos e componentes para manter consistência visual e facilitar manutenção.

## 5.2 Cores

| Nome | Uso | Valor |
|---|---|---|
| obsidian | Fundo principal | `#0A0A0A` |
| carbon | Fundo secundário | `#141414` |
| bio | Destaque principal | `#22C55E` |
| forest | Destaque escuro | `#14803C` |
| forest-soft | Bordas sutis | `#0B3D2E` |
| muted-soft | Texto secundário | cinza claro |
| white | Texto principal | `#FFFFFF` |

## 5.3 Tipografia

- **font-heading** — títulos, negrito.
- **font-body** — corpo de texto.
- **Tamanhos:** xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl.
- **Pesos:** normal, medium, semibold, bold.

## 5.4 Espaçamentos

- Base: 4px.
- Escala: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64.

## 5.5 Componentes Base

- **Botão** — primary, secondary, ghost, danger.
- **Input** — text, email, password, number, select, textarea.
- **Card** — com header, body, footer.
- **Modal** — overlay, conteúdo, ações.
- **Tabela** — header, body, footer, paginação.
- **Badge** — status, categoria.
- **Tooltip** — hover.
- **Toast** — notificação.
- **Dropdown** — menu.
- **Accordion** — seção colapsável.
- **Tabs** — abas.

## 5.6 Estados

- **Default** — estado normal.
- **Hover** — mouse em cima.
- **Focus** — foco por teclado.
- **Active** — clicado.
- **Disabled** — desabilitado.
- **Loading** — carregando.
- **Error** — erro.
- **Success** — sucesso.

## 5.7 Acessibilidade

- Contraste mínimo WCAG AA.
- Foco visível.
- ARIA labels.
- Navegação por teclado.
- Leitores de tela.

## 5.8 Responsividade

- **sm** — 640px.
- **md** — 768px.
- **lg** — 1024px.
- **xl** — 1280px.
- **2xl** — 1536px.

## 5.9 Animações

- Duração: 150ms (rápida), 300ms (média), 500ms (lenta).
- Easing: ease-in-out.
- Respeitar `prefers-reduced-motion`.

## 5.10 Ícones

- Lucide React.
- Tamanhos: 16, 18, 20, 24, 26.
- Cor herdada do contexto.

---

# 6. Glossário

## 6.1 Termos de Negócio

| Termo | Definição |
|---|---|
| **Orçamento** | Contêiner maior que agrupa módulos e telas |
| **Módulo** | Entregável dentro do orçamento (ex: site institucional) |
| **Tela** | Feature específica dentro do módulo (ex: Home, Login) |
| **Briefing** | Dados técnicos que definem a complexidade da tela |
| **Estimador IA** | Módulo que calcula prazo e valor |
| **Template** | Orçamento-modelo reutilizável |
| **Pacote** | Combinação pré-definida de serviços, produtos e infraestrutura |
| **Tenant** | Empresa cliente do SaaS |
| **Plano** | Nível de assinatura (Starter, Pro, Business) |
| **Trial** | Período grátis de teste |
| **MRR** | Monthly Recurring Revenue (receita recorrente mensal) |
| **Churn** | Taxa de cancelamento |
| **LTV** | Lifetime Value (valor do cliente ao longo do tempo) |
| **CAC** | Customer Acquisition Cost (custo de aquisição) |

## 6.2 Termos Técnicos

| Termo | Definição |
|---|---|
| **SPA** | Single Page Application |
| **JWT** | JSON Web Token |
| **API** | Application Programming Interface |
| **REST** | Representational State Transfer |
| **CRUD** | Create, Read, Update, Delete |
| **ORM** | Object-Relational Mapping |
| **RAG** | Retrieval-Augmented Generation |
| **LLM** | Large Language Model |
| **Embeddings** | Representação vetorial de texto |
| **kNN** | k-Nearest Neighbors |
| **LoRA** | Low-Rank Adaptation |
| **Webhook** | Notificação HTTP enviada por um serviço |
| **Idempotência** | Propriedade de uma operação poder ser repetida sem efeito colateral |
| **Rate limiting** | Limite de requisições por período |
| **CORS** | Cross-Origin Resource Sharing |
| **HTTPS** | HTTP seguro com TLS |
| **Hash** | Função que transforma dado em string irreversível |
| **bcrypt** | Algoritmo de hash de senha |
| **JWT** | Token de autenticação |
| **Refresh token** | Token para renovar o access token |
| **Multi-tenant** | Múltiplas empresas no mesmo sistema |
| **Zero-knowledge** | Modelo onde o provedor não vê os dados |
| **DPA** | Data Processing Agreement |
| **DPO** | Data Protection Officer |
| **LGPD** | Lei Geral de Proteção de Dados |
| **ANPD** | Autoridade Nacional de Proteção de Dados |
| **WCAG** | Web Content Accessibility Guidelines |
| **PWA** | Progressive Web App |
| **CDN** | Content Delivery Network |
| **TTI** | Time to Interactive |
| **CI/CD** | Continuous Integration / Continuous Delivery |

## 6.3 Siglas

| Sigla | Significado |
|---|---|
| **ADM** | Administrador |
| **API** | Application Programming Interface |
| **CNPJ** | Cadastro Nacional da Pessoa Jurídica |
| **CPF** | Cadastro de Pessoas Físicas |
| **CRM** | Customer Relationship Management |
| **DPA** | Data Processing Agreement |
| **DPO** | Data Protection Officer |
| **ERP** | Enterprise Resource Planning |
| **FAQ** | Frequently Asked Questions |
| **IA** | Inteligência Artificial |
| **JWT** | JSON Web Token |
| **LGPD** | Lei Geral de Proteção de Dados |
| **LLM** | Large Language Model |
| **ML** | Machine Learning |
| **MRR** | Monthly Recurring Revenue |
| **NPS** | Net Promoter Score |
| **PWA** | Progressive Web App |
| **RAG** | Retrieval-Augmented Generation |
| **REST** | Representational State Transfer |
| **SaaS** | Software as a Service |
| **SEO** | Search Engine Optimization |
| **SLA** | Service Level Agreement |
| **SPA** | Single Page Application |
| **SSL** | Secure Sockets Layer |
| **UI** | User Interface |
| **UX** | User Experience |
| **WCAG** | Web Content Accessibility Guidelines |

---

**Documento consolidado.**
**Referência cruzada:** Painel ADM (v3.0), Internacionalização (v1.0), Segurança (v1.0).
