# Documentação de Implementação — Painel do Cliente CodeVance Tech

> **Versão:** 1.0  
> **Data:** 2026-10-06  
> **Status:** Planejamento  
> **Objetivo:** Definir o escopo, os fluxos e as regras da área autenticada do cliente antes da implementação do backend e da autenticação real.

Este documento descreve o que o cliente poderá fazer depois de criar uma conta ou entrar com Google. O painel do cliente é separado do Painel ADM: o cliente acessa somente os próprios dados, orçamentos, mensagens e documentos.

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Objetivos](#2-objetivos)
3. [Acesso e autenticação](#3-acesso-e-autenticação)
4. [Menu e rotas](#4-menu-e-rotas)
5. [Dashboard do cliente](#5-dashboard-do-cliente)
6. [Perfil e dados da empresa](#6-perfil-e-dados-da-empresa)
7. [Orçamentos](#7-orçamentos)
8. [Detalhes do orçamento](#8-detalhes-do-orçamento)
9. [Aprovação e recusa](#9-aprovação-e-recusa)
10. [Projetos e acompanhamento](#10-projetos-e-acompanhamento)
11. [Documentos](#11-documentos)
12. [Mensagens e suporte](#12-mensagens-e-suporte)
13. [Notificações](#13-notificações)
14. [Configurações](#14-configurações)
15. [Permissões e segurança](#15-permissões-e-segurança)
16. [Modelo de dados](#16-modelo-de-dados)
17. [Estados e regras de negócio](#17-estados-e-regras-de-negócio)
18. [MVP e fases de implementação](#18-mvp-e-fases-de-implementação)
19. [Critérios de aceite](#19-critérios-de-aceite)
20. [Futuras extensões](#20-futuras-extensões)

---

## 1. Visão geral

O Painel do Cliente será o espaço privado onde cada cliente acompanha sua relação com a CodeVance Tech.

O cliente deverá conseguir:

- visualizar seus dados pessoais e empresariais;
- solicitar e acompanhar orçamentos;
- consultar propostas recebidas;
- aprovar ou recusar uma proposta;
- acompanhar projetos aprovados;
- acessar documentos e arquivos compartilhados;
- conversar com a equipe;
- consultar notificações e histórico de atividades;
- alterar preferências de conta e idioma;
- encerrar a sessão com segurança.

O painel não deve expor:

- clientes ou empresas de terceiros;
- dados internos de custo e margem;
- configurações do catálogo;
- permissões administrativas;
- conversas internas da equipe;
- logs técnicos ou dados de outros projetos.

## 2. Objetivos

### 2.1 Objetivos de negócio

1. Reduzir a troca de informações por canais dispersos.
2. Dar transparência ao cliente durante orçamento e desenvolvimento.
3. Acelerar a aprovação de propostas.
4. Criar um histórico único de decisões, arquivos e mensagens.
5. Preparar a plataforma para suporte, cobrança e acompanhamento de projetos.

### 2.2 Objetivos de experiência

- Interface simples e responsiva.
- Informações importantes visíveis logo na entrada.
- Status compreensíveis, sem termos técnicos desnecessários.
- Ações críticas sempre com confirmação.
- Histórico organizado por orçamento ou projeto.
- Feedback claro para carregamento, sucesso e erro.

## 3. Acesso e autenticação

### 3.1 Rotas públicas relacionadas

```text
/login
/register
/forgot-password
/reset-password
/oauth/callback
```

O login por email/senha e o login com Google devem criar ou recuperar uma sessão real. O usuário será redirecionado para o painel após a autenticação.

### 3.2 Rotas protegidas

Todas as rotas abaixo exigem sessão válida e perfil `cliente`.

```text
/cliente
/cliente/dashboard
/cliente/perfil
/cliente/orcamentos
/cliente/orcamentos/novo
/cliente/orcamentos/:id
/cliente/projetos
/cliente/projetos/:id
/cliente/documentos
/cliente/mensagens
/cliente/notificacoes
/cliente/configuracoes
```

### 3.3 Primeiro acesso

Depois do primeiro login, o cliente deverá:

1. Confirmar nome e email.
2. Informar telefone ou WhatsApp.
3. Escolher se está representando pessoa física ou empresa.
4. Aceitar os termos de uso e a política de privacidade.
5. Ser direcionado ao dashboard.

Se o cadastro estiver incompleto, o sistema deve mostrar um aviso persistente e direcionar para o perfil, sem bloquear a consulta de informações já disponíveis.

### 3.4 Sessão

- A sessão deve ser persistida pelo backend/provedor de autenticação.
- Tokens não devem ser colocados em texto visível na URL.
- O logout deve invalidar a sessão local e redirecionar para `/login`.
- Rotas protegidas devem validar a sessão no carregamento e nas chamadas à API.
- O retorno pós-login deve aceitar somente caminhos internos da aplicação.

## 4. Menu e rotas

```text
Painel do Cliente
├── Visão geral
├── Meus orçamentos
│   ├── Novo orçamento
│   └── Detalhes do orçamento
├── Meus projetos
│   └── Detalhes do projeto
├── Documentos
├── Mensagens
├── Notificações
├── Meu perfil
└── Configurações
```

O menu deverá apresentar o nome do cliente, avatar ou iniciais, indicador de notificações não lidas e ação de sair.

## 5. Dashboard do cliente

### 5.1 Objetivo

Mostrar rapidamente o estado atual da conta e as próximas ações importantes.

### 5.2 Blocos principais

- Saudação com nome do cliente.
- Aviso de perfil incompleto, quando aplicável.
- Orçamentos em andamento.
- Propostas aguardando aprovação.
- Projetos ativos.
- Documentos recentes.
- Mensagens não lidas.
- Linha do tempo de atividades recentes.

### 5.3 Ações rápidas

- Criar novo orçamento.
- Abrir proposta pendente.
- Enviar mensagem para a equipe.
- Ver documentos.
- Atualizar perfil.

### 5.4 Estado vazio

Quando o cliente ainda não tiver dados:

```text
Você ainda não possui orçamentos.
Conte-nos sobre o seu projeto para receber uma proposta.
[Criar novo orçamento]
```

## 6. Perfil e dados da empresa

### 6.1 Dados pessoais

- Nome completo.
- Email principal.
- Telefone.
- WhatsApp.
- Cargo ou função.
- Foto ou avatar.
- Idioma preferido.
- Fuso horário.

### 6.2 Dados da empresa

O cliente poderá cadastrar ou editar:

- Razão social.
- Nome fantasia.
- CPF ou CNPJ.
- Site.
- Segmento.
- Endereço.
- Cidade e estado.
- País.
- Dados do contato financeiro.

### 6.3 Regras

- Email usado na autenticação não deve ser alterado sem confirmação.
- CPF/CNPJ deve ser validado e não pode duplicar outro cadastro.
- Alterações sensíveis devem gerar registro de auditoria.
- O cliente só poderá editar os próprios dados.

## 7. Orçamentos

### 7.1 Lista de orçamentos

A tabela ou lista deverá mostrar:

- Número do orçamento.
- Título ou nome do projeto.
- Categoria.
- Valor estimado ou valor da proposta.
- Status.
- Data de criação.
- Última atualização.
- Data limite de aprovação, quando houver.
- Ação para abrir detalhes.

### 7.2 Filtros

- Status.
- Categoria.
- Período.
- Empresa relacionada.

### 7.3 Novo orçamento

O fluxo inicial poderá ser um wizard com:

1. Dados do projeto.
2. Objetivo e problema a resolver.
3. Tipo de solução.
4. Funcionalidades desejadas.
5. Integrações necessárias.
6. Prazo desejado.
7. Faixa de investimento, se o cliente quiser informar.
8. Anexos e observações.
9. Revisão e envio.

O cliente poderá salvar um rascunho e continuar depois.

### 7.4 Regras do envio

- Um rascunho não aparece como proposta para aprovação.
- Ao enviar, o orçamento recebe status `enviado`.
- O envio registra data, usuário e versão.
- O cliente pode editar um orçamento enquanto ele estiver em `rascunho`.
- Após o envio, alterações importantes devem gerar nova versão ou solicitar reabertura pela equipe.

## 8. Detalhes do orçamento

A página de detalhes deverá apresentar:

- Identificação do orçamento.
- Cliente ou empresa vinculada.
- Escopo resumido.
- Módulos e funcionalidades.
- Serviços incluídos.
- Integrações.
- Infraestrutura.
- Prazo estimado.
- Valor total da proposta.
- Condições e observações.
- Arquivos relacionados.
- Histórico de alterações.
- Mensagens relacionadas.

### 8.1 Informações que não devem ser exibidas

- Custo interno por hora.
- Margem de lucro.
- Multiplicadores internos.
- Anotações privadas da equipe.
- Dados de outros clientes.

### 8.2 Versionamento

Cada nova proposta deve guardar:

- número da versão;
- data de criação;
- autor da alteração;
- resumo do que mudou;
- valor anterior e atual;
- status da versão.

O cliente deve conseguir consultar a versão atualmente válida e o histórico permitido para sua conta.

## 9. Aprovação e recusa

### 9.1 Aprovar proposta

Ao clicar em **Aprovar proposta**, o sistema deverá:

1. Exibir um resumo do escopo e valor.
2. Solicitar confirmação explícita.
3. Registrar usuário, data, hora e versão aprovada.
4. Alterar o status para `aprovado`.
5. Criar ou preparar o projeto correspondente.
6. Notificar a equipe.
7. Exibir confirmação ao cliente.

### 9.2 Recusar proposta

A recusa deverá solicitar um motivo opcional ou uma mensagem. Depois da confirmação:

- registrar a versão recusada;
- alterar o status para `recusado`;
- notificar a equipe;
- manter o orçamento disponível no histórico;
- permitir uma nova negociação sem apagar a versão anterior.

### 9.3 Aprovação duplicada

Uma proposta já aprovada não deve ser aprovada novamente. A API deve rejeitar ações repetidas de forma idempotente e a interface deve atualizar o estado após a primeira confirmação.

## 10. Projetos e acompanhamento

### 10.1 Lista de projetos

Cada projeto deverá mostrar:

- Nome do projeto.
- Orçamento de origem.
- Status.
- Percentual de progresso, quando disponível.
- Próxima etapa.
- Responsável da CodeVance.
- Última atualização.

### 10.2 Status sugeridos

```text
planejamento
em_andamento
aguardando_cliente
em_revisao
concluido
pausado
cancelado
```

### 10.3 Linha do tempo

O cliente poderá visualizar eventos como:

- projeto iniciado;
- etapa concluída;
- solicitação de material;
- aprovação de tela ou funcionalidade;
- publicação de documento;
- mensagem da equipe;
- alteração de prazo.

Informações internas da equipe não entram na linha do tempo do cliente.

## 11. Documentos

### 11.1 Tipos de documentos

- Propostas.
- Contratos.
- Briefings.
- Relatórios.
- Manuais.
- Arquivos enviados pelo cliente.
- Materiais de aprovação.

### 11.2 Ações

- Visualizar.
- Baixar.
- Enviar arquivo.
- Excluir arquivo enviado pelo próprio cliente, quando permitido.

### 11.3 Segurança

- Downloads devem exigir sessão válida.
- Arquivos devem respeitar a conta, empresa e projeto relacionados.
- Extensões e tamanho máximo devem ser validados no backend.
- O nome original do arquivo não deve ser usado para construir caminhos no servidor.
- Exclusões devem exigir confirmação e registrar auditoria.

## 12. Mensagens e suporte

### 12.1 Conversas

O cliente poderá:

- abrir uma conversa com a equipe;
- enviar texto;
- anexar arquivos;
- responder em uma conversa existente;
- visualizar o histórico;
- marcar uma conversa como resolvida.

### 12.2 Relação com o chatbot

Uma conversa iniciada no chatbot poderá ser encaminhada para atendimento humano. Quando isso ocorrer:

- o cliente deve ser informado;
- o histórico permitido deve permanecer visível;
- a equipe deve receber o contexto da conversa;
- o cliente não deve visualizar instruções internas ou notas privadas.

### 12.3 Estados de mensagem

```text
enviada
entregue
lida
arquivada
```

## 13. Notificações

### 13.1 Eventos notificáveis

- Novo orçamento recebido pela equipe.
- Proposta pronta para análise.
- Proposta alterada.
- Proposta aprovada ou recusada.
- Nova mensagem.
- Novo documento.
- Solicitação de informação.
- Alteração de prazo.
- Projeto concluído.

### 13.2 Canais

- Notificação dentro do painel.
- Email transacional.
- WhatsApp ou outro canal, em fase futura.

### 13.3 Preferências

O cliente poderá escolher quais notificações receber por email. Notificações legais, de segurança e confirmação de ações importantes não devem ser desativadas.

## 14. Configurações

- Alterar idioma.
- Alterar fuso horário.
- Gerenciar preferências de email.
- Visualizar sessões ativas.
- Encerrar outras sessões.
- Solicitar exportação dos dados.
- Solicitar exclusão da conta.
- Consultar termos e política de privacidade.

Alterações de senha e segurança devem exigir confirmação da identidade conforme o provedor de autenticação.

## 15. Permissões e segurança

### 15.1 Regra principal

O cliente só pode ler ou alterar recursos relacionados ao próprio `user_id`, às empresas das quais participa e aos projetos explicitamente vinculados a ele.

Essa regra deve ser aplicada no backend, não somente na interface.

### 15.2 Perfis

```text
cliente
cliente_empresa_admin
admin
comercial
suporte
```

O painel do cliente usa os perfis `cliente` e `cliente_empresa_admin`. Os demais perfis pertencem ao Painel ADM e possuem rotas próprias.

### 15.3 Requisitos mínimos

- Controle de acesso no servidor.
- Validação de ownership em toda operação.
- Proteção contra IDOR ao acessar `/cliente/orcamentos/:id`.
- Sanitização e validação de entradas.
- Rate limit em login, cadastro, recuperação de senha e upload.
- Logs de autenticação e ações sensíveis.
- Consentimento e política de privacidade.
- Nenhum segredo em código frontend ou arquivo versionado.

## 16. Modelo de dados

### 16.1 Usuário

```text
User
├── id
├── auth_provider
├── email
├── name
├── phone
├── locale
├── timezone
├── role
├── created_at
└── updated_at
```

### 16.2 Empresa

```text
Company
├── id
├── legal_name
├── trade_name
├── document
├── website
├── segment
├── address
├── created_at
└── updated_at
```

### 16.3 Vínculo usuário-empresa

```text
CompanyMember
├── company_id
├── user_id
├── role
└── created_at
```

### 16.4 Orçamento

```text
Quote
├── id
├── number
├── owner_user_id
├── company_id
├── title
├── category
├── status
├── total_amount
├── currency
├── current_version
├── created_at
└── updated_at
```

### 16.5 Projeto

```text
Project
├── id
├── quote_id
├── company_id
├── name
├── status
├── progress
├── due_date
├── created_at
└── updated_at
```

### 16.6 Auditoria

Toda ação relevante deverá registrar:

```text
AuditEvent
├── id
├── actor_user_id
├── resource_type
├── resource_id
├── action
├── metadata
├── created_at
└── ip_or_session_reference
```

## 17. Estados e regras de negócio

### 17.1 Orçamento

```text
rascunho -> enviado -> em_analise -> proposta_enviada
proposta_enviada -> aprovado
proposta_enviada -> recusado
rascunho -> cancelado
```

Somente a equipe poderá mover `enviado` para `em_analise` e `proposta_enviada`. O cliente poderá aprovar ou recusar uma proposta válida.

### 17.2 Perfil

```text
incompleto -> em_revisao -> completo
```

### 17.3 Projetos

As transições devem ser controladas pela equipe. O cliente não poderá alterar diretamente o status do projeto, mas poderá responder solicitações e aprovar entregas quando solicitado.

## 18. MVP e fases de implementação

### Fase 0 — Fundação técnica

- Escolher o provedor real de autenticação.
- Criar sessão e callback OAuth.
- Criar modelo de usuário.
- Criar proteção de rotas.
- Definir API e autorização por ownership.
- Configurar variáveis de ambiente.

### Fase 1 — MVP do painel

- Dashboard.
- Perfil do cliente.
- Lista e detalhe de orçamentos.
- Novo orçamento com rascunho.
- Logout.
- Notificações básicas.

### Fase 2 — Colaboração

- Aprovar e recusar propostas.
- Mensagens com a equipe.
- Upload e download de documentos.
- Histórico de atividades.

### Fase 3 — Projetos

- Lista de projetos.
- Linha do tempo.
- Solicitações de aprovação.
- Indicador de progresso.

### Fase 4 — Escala

- Internacionalização completa.
- Notificações por múltiplos canais.
- Integração de pagamentos.
- Assinatura digital.
- Relatórios e métricas para o cliente.

## 19. Critérios de aceite

### Autenticação

- [ ] Usuário consegue entrar com email e senha.
- [ ] Usuário consegue entrar com Google após configuração do OAuth.
- [ ] Usuário não autenticado é enviado para `/login`.
- [ ] Usuário autenticado não perde a sessão ao atualizar a página.
- [ ] Logout remove a sessão e impede acesso às rotas protegidas.

### Dados

- [ ] Cliente visualiza somente seus próprios dados.
- [ ] Cliente não consegue acessar orçamento de outro cliente alterando o ID da URL.
- [ ] Alterações de perfil são persistidas e validadas.
- [ ] Dados sensíveis não aparecem no frontend.

### Orçamentos

- [ ] Cliente consegue criar e salvar um rascunho.
- [ ] Cliente consegue continuar um rascunho.
- [ ] Cliente consegue enviar um orçamento.
- [ ] Cliente consegue visualizar uma proposta recebida.
- [ ] Cliente consegue aprovar ou recusar uma proposta uma única vez.
- [ ] A equipe recebe o registro da ação.

### Experiência

- [ ] Todas as telas possuem estados de carregamento, vazio e erro.
- [ ] Ações críticas pedem confirmação.
- [ ] O painel funciona em desktop e mobile.
- [ ] Mensagens de erro não expõem detalhes internos.

## 20. Futuras extensões

- Área financeira com faturas, pagamentos e recibos.
- Assinatura eletrônica de contratos.
- Agenda para reuniões presenciais.
- Aprovação de layouts e protótipos.
- Central de chamados com SLA.
- Integração com WhatsApp.
- Tradução automática de mensagens e conteúdo dinâmico.
- Aplicativo mobile.
- Relatórios de retorno sobre investimento.

---

## 21. Configurador visual de sites

### 21.1 Objetivo

Quando o cliente escolher **Site institucional**, **Loja virtual** ou outro produto visual, o fluxo de orçamento deverá permitir que ele monte uma primeira versão visual do projeto. A experiência será inspirada em ferramentas como Elementor, porém guiada por opções pré-configuradas para evitar complexidade.

O cliente não precisa saber termos como grid, CSS, breakpoint ou componente. Ele escolhe opções visuais e vê uma prévia atualizada em tempo real.

### 21.2 Princípio de simplicidade

O configurador não será um editor livre no MVP. O cliente poderá:

- escolher um template base;
- ativar ou remover seções permitidas;
- escolher paleta de cores;
- escolher combinação de fontes;
- definir estilo visual;
- editar textos e imagens de cada seção;
- reorganizar seções dentro de posições permitidas;
- visualizar a versão desktop e mobile;
- salvar e voltar ao rascunho.

O cliente não poderá arrastar elementos para qualquer posição, alterar CSS ou criar estruturas incompatíveis com o template. Isso reduz erros e mantém o orçamento tecnicamente viável.

### 21.3 Fluxo específico para site

#### Etapa 1 — Escolher o tipo de site

- Institucional.
- Landing page.
- Portfólio.
- Loja virtual.
- Blog ou portal de conteúdo.
- Área de membros.
- Ainda não tenho certeza.

#### Etapa 2 — Escolher um template

Os templates devem ser exibidos como cards com:

- imagem ou mockup da página;
- nome;
- categoria;
- quantidade de seções;
- estilo predominante;
- recursos incluídos;
- botão **Visualizar**;
- botão **Usar este template**.

O cliente poderá trocar de template sem perder as informações básicas já preenchidas. Personalizações incompatíveis devem ser avisadas antes da troca.

#### Etapa 3 — Definir identidade visual

O cliente escolherá:

- paleta pronta;
- cor principal;
- cor de destaque;
- cor de fundo;
- estilo de borda;
- nível de arredondamento;
- intensidade de sombra;
- estilo geral: minimalista, moderno, corporativo, elegante ou criativo.

Também poderá informar uma cor por código ou enviar uma referência visual, mas essas opções devem ficar em uma seção avançada.

#### Etapa 4 — Escolher tipografia

Em vez de uma lista extensa de fontes, serão exibidas combinações prontas:

- Moderna e limpa.
- Elegante.
- Corporativa.
- Tecnológica.
- Editorial.

Cada opção deverá mostrar um exemplo de título, subtítulo e texto corrido.

#### Etapa 5 — Montar as seções

O cliente poderá ativar ou desativar blocos do template:

- Hero ou banner inicial.
- Sobre a empresa.
- Serviços.
- Produtos.
- Benefícios.
- Depoimentos.
- Portfólio.
- Equipe.
- Planos.
- FAQ.
- Blog.
- Formulário de contato.
- Mapa.
- Rodapé.

Cada seção terá uma descrição curta e uma prévia. O sistema deve sugerir uma ordem inicial e impedir combinações visualmente inválidas.

#### Etapa 6 — Personalizar conteúdo

Para cada seção habilitada, o cliente poderá preencher:

- título;
- subtítulo;
- descrição;
- textos de botões;
- imagens;
- links;
- itens repetíveis, como serviços, benefícios ou depoimentos.

O sistema deve oferecer exemplos e placeholders, mas nunca enviar exemplos como conteúdo final sem confirmação.

#### Etapa 7 — Recursos e integrações

O cliente poderá selecionar recursos de forma simples:

- WhatsApp;
- formulário de contato;
- Google Maps;
- Instagram;
- pagamentos;
- agendamento;
- newsletter;
- analytics;
- domínio;
- hospedagem;
- SEO básico;
- acessibilidade.

Cada recurso deve informar, em uma frase, o que ele acrescenta ao projeto e se possui custo recorrente.

#### Etapa 8 — Prévia e resumo

A tela final terá:

- prévia visual do site;
- alternância desktop/mobile;
- resumo das páginas e seções;
- identidade visual;
- recursos selecionados;
- estimativa de prazo;
- estimativa de investimento;
- campo de observações;
- opção de salvar rascunho;
- opção de enviar orçamento.

### 21.4 Estrutura da tela

No desktop, a tela poderá ter três áreas:

```text
┌────────────────────────────────────────────────────────────┐
│ Barra superior: progresso, salvar, sair                    │
├───────────────┬──────────────────────────┬─────────────────┤
│ Etapas         │ Prévia do site           │ Opções da etapa │
│ 1 Template     │ Desktop / Mobile         │ controles       │
│ 2 Cores        │ atualização em tempo real│ selecionados    │
│ 3 Tipografia   │                          │                 │
│ 4 Seções       │                          │                 │
│ 5 Conteúdo     │                          │                 │
│ 6 Recursos     │                          │                 │
└───────────────┴──────────────────────────┴─────────────────┘
```

No celular, as áreas devem virar uma sequência:

1. Configuração atual.
2. Prévia recolhível.
3. Botão para avançar.

### 21.5 Estimativa baseada na configuração

As escolhas devem alimentar o orçamento automaticamente. Exemplos:

- quantidade de páginas;
- quantidade de seções;
- loja e checkout;
- login e área de membros;
- integrações;
- animações avançadas;
- criação ou revisão de conteúdo;
- SEO;
- prazo solicitado.

O cliente deve ver uma faixa estimada, não necessariamente o preço final. A equipe poderá revisar a configuração antes de enviar a proposta definitiva.

### 21.6 Dados salvos no rascunho

```text
SiteConfigurator
├── quote_id
├── template_id
├── project_type
├── color_palette
├── custom_colors
├── typography_preset
├── visual_style
├── enabled_sections
├── section_order
├── section_content
├── selected_features
├── preview_settings
├── estimate_snapshot
└── updated_at
```

O snapshot da estimativa deve registrar quais escolhas produziram aquele valor. Se o catálogo mudar depois, o rascunho não deve mudar silenciosamente sem informar o cliente.

### 21.7 MVP do configurador

A primeira versão deve conter somente:

1. Três a cinco templates aprovados.
2. Quatro paletas prontas.
3. Quatro combinações tipográficas.
4. Seleção de seções.
5. Edição de textos principais.
6. Upload de imagens principais.
7. Prévia desktop/mobile.
8. Salvamento de rascunho.
9. Resumo para envio do orçamento.

Editor de arrastar e soltar, criação de componentes livres, código personalizado e edição avançada ficam fora do MVP.

### 21.8 Critérios de aceite do configurador

- [ ] O cliente consegue escolher um template e visualizar uma prévia.
- [ ] A troca de paleta atualiza a prévia sem recarregar a página.
- [ ] A troca de tipografia atualiza títulos e textos da prévia.
- [ ] O cliente consegue ativar e desativar seções permitidas.
- [ ] O cliente consegue editar conteúdo sem perder o template.
- [ ] O cliente consegue alternar entre desktop e mobile.
- [ ] O cliente consegue salvar e continuar depois.
- [ ] O orçamento enviado contém a configuração visual escolhida.
- [ ] A equipe consegue abrir a configuração recebida sem depender de screenshots.
- [ ] O cliente não consegue acessar configurações ou templates privados de outros clientes.

---

## 22. Fluxo de software com briefing assistido por IA local

### 22.1 Objetivo

Quando o cliente escolher **Sistema web**, **Aplicativo**, **Automação** ou **Integração**, não haverá um configurador visual igual ao de sites. O cliente será conduzido por um briefing conversacional e estruturado para explicar o problema, o processo atual e o resultado esperado.

A IA local ajudará o cliente a transformar uma ideia informal em uma solicitação organizada. Ela não deverá inventar requisitos, prometer prazo ou fechar preço sozinha.

### 22.2 Princípios da IA local

- Processar o máximo possível dentro do ambiente controlado da CodeVance.
- Não enviar dados do cliente para provedores externos sem consentimento explícito.
- Informar quando a IA estiver sendo usada.
- Mostrar a resposta gerada para revisão antes de salvar.
- Permitir editar ou excluir qualquer sugestão da IA.
- Separar claramente informação fornecida pelo cliente de inferências da IA.
- Não tratar uma sugestão como requisito confirmado.
- Permitir continuar o fluxo sem usar IA.

“Local” significa que o modelo e o processamento deverão ficar em infraestrutura controlada, como um serviço local ou servidor privado. O navegador não deve receber chaves secretas nem executar um modelo pesado sem uma decisão técnica específica.

### 22.3 Entrada do fluxo

O cliente começa respondendo:

```text
O que você precisa criar ou melhorar?
```

Pode escrever livremente ou escolher exemplos:

- Sistema para organizar minha empresa.
- Aplicativo para meus clientes.
- Automação de tarefas repetitivas.
- Integração entre ferramentas.
- Área restrita para usuários.
- Ainda não sei explicar.

O cliente também poderá anexar documentos, planilhas, imagens ou links, respeitando os limites de segurança e tamanho.

### 22.4 Entrevista guiada

A IA fará uma pergunta por vez, sempre com opção **Não sei responder**. O fluxo deve adaptar as próximas perguntas sem criar um questionário enorme.

#### Bloco 1 — Problema

- Qual problema deseja resolver?
- Como esse processo funciona hoje?
- O que mais toma tempo ou causa erros?
- Quem participa do processo?

#### Bloco 2 — Usuários

- Quem usará o sistema?
- Quantos usuários são esperados inicialmente?
- Existem perfis diferentes?
- O acesso será interno, externo ou ambos?

#### Bloco 3 — Funcionalidades

- O que o usuário precisa fazer?
- Quais dados serão cadastrados?
- É necessário pesquisar, filtrar ou gerar relatórios?
- Precisa de aprovação, notificações ou histórico?
- Precisa de pagamentos, agenda, arquivos ou mensagens?

#### Bloco 4 — Regras e integrações

- Existem regras obrigatórias do negócio?
- O sistema precisa conversar com quais ferramentas?
- Há necessidade de login, permissões ou auditoria?
- Existem dados que não podem ser acessados por todos?

#### Bloco 5 — Operação

- Em quais dispositivos será usado?
- Existe prazo ou evento importante?
- Existe sistema atual para migrar?
- Quem fornecerá textos, imagens e dados?
- Qual faixa de investimento deseja considerar, se souber?

### 22.5 Como a IA deve ajudar

Depois de cada resposta, a IA poderá:

- resumir o que entendeu;
- identificar termos ambíguos;
- sugerir exemplos de resposta;
- apontar informações que ainda faltam;
- separar requisito obrigatório de desejo futuro;
- sugerir perfis de usuário;
- agrupar funcionalidades parecidas;
- detectar possíveis integrações;
- explicar termos técnicos em linguagem simples.

Exemplo:

```text
Você disse que precisa controlar pedidos e avisar a equipe quando um
pedido mudar de status.

Entendi como:
1. Cadastro de pedidos.
2. Lista de pedidos por status.
3. Alteração de status.
4. Notificação para a equipe.

Está correto?
[Sim, continuar] [Editar entendimento]
```

A IA somente poderá transformar um item em requisito confirmado depois que o cliente aceitar.

### 22.6 Resultado do briefing

Ao final, a IA produzirá um documento editável com:

- resumo executivo;
- problema principal;
- objetivo do sistema;
- perfis de usuário;
- fluxo principal;
- funcionalidades essenciais;
- funcionalidades desejáveis;
- integrações;
- regras de negócio;
- requisitos de segurança;
- plataformas e dispositivos;
- dados e arquivos envolvidos;
- dúvidas pendentes;
- premissas;
- riscos identificados;
- estimativa preliminar de complexidade.

O cliente verá três estados para cada item:

```text
Confirmado pelo cliente
Sugerido pela IA
Pendente de esclarecimento
```

### 22.7 Escopo inicial e fases

Para evitar um orçamento confuso, a IA deverá organizar o resultado em:

```text
MVP / Essencial
├── Funcionalidades necessárias para o sistema funcionar

Fase 2 / Recomendado
├── Melhorias importantes, mas não bloqueiam o lançamento

Futuro / Opcional
└── Ideias que podem ser adicionadas depois
```

O cliente poderá mover um item entre os grupos, sempre recebendo aviso de que a mudança pode alterar prazo e valor.

### 22.8 Estimativa e orçamento

O sistema calculará uma faixa preliminar usando fatores como:

- quantidade de perfis;
- quantidade de módulos;
- regras de negócio;
- integrações;
- necessidade de painel administrativo;
- pagamentos;
- notificações;
- migração de dados;
- aplicativo mobile;
- segurança e auditoria;
- volume esperado de usuários;
- urgência do prazo.

A estimativa deve ser apresentada como referência. A proposta final poderá ser revisada pela equipe quando houver ambiguidades, sem apagar o briefing aprovado pelo cliente.

### 22.9 Estrutura da tela de software

```text
┌────────────────────────────────────────────────────────────┐
│ Progresso · Salvar · Sair                                  │
├──────────────────────────────┬─────────────────────────────┤
│ Conversa com a IA            │ Resumo vivo do projeto       │
│ Pergunta atual               │ Problema                     │
│ Resposta do cliente          │ Usuários                     │
│ Sugestões                    │ MVP                          │
│ [Não sei responder]          │ Fase 2                       │
│                              │ Pendências                   │
├──────────────────────────────┴─────────────────────────────┤
│ [Voltar]                         [Continuar]                │
└────────────────────────────────────────────────────────────┘
```

No celular, o resumo vivo ficará recolhido e poderá ser aberto por um botão **Ver resumo**.

### 22.10 Revisão antes do envio

Antes de criar o orçamento, o cliente deverá revisar:

- o resumo do problema;
- os usuários;
- o escopo do MVP;
- os itens sugeridos pela IA;
- as pendências;
- os anexos;
- a faixa estimada;
- a autorização para compartilhar o briefing com a equipe.

O envio exigirá confirmação:

```text
Confirmo que revisei as informações e autorizo a CodeVance Tech a
utilizar este briefing para preparar uma proposta.
```

### 22.11 Dados do briefing

```text
SoftwareBriefing
├── quote_id
├── project_type
├── original_answers
├── ai_questions
├── ai_suggestions
├── confirmed_requirements
├── pending_questions
├── user_profiles
├── workflows
├── integrations
├── business_rules
├── mvp_scope
├── future_scope
├── attachments
├── estimate_snapshot
├── ai_model_version
├── ai_processing_mode
├── client_reviewed_at
├── submitted_at
└── updated_at
```

O sistema deve guardar a versão do modelo, a data da geração e quais sugestões foram aceitas. Isso permite explicar de onde veio cada item do briefing.

### 22.12 Privacidade e segurança da IA

- Dados enviados ao briefing pertencem ao cliente e devem respeitar as mesmas regras de acesso do orçamento.
- Arquivos devem ser verificados antes do processamento.
- Segredos, senhas e tokens identificados devem ser mascarados e não enviados ao modelo.
- O prompt deve instruir a IA a tratar anexos como dados, não como instruções executáveis.
- A equipe deve conseguir remover um anexo ou solicitar exclusão dos dados.
- O cliente deve conseguir ver se uma resposta foi gerada por IA.
- Logs devem registrar a ação sem armazenar conteúdo sensível desnecessariamente.
- O sistema não deve usar dados de um cliente para responder outro cliente.
- Se o serviço local estiver indisponível, o cliente poderá preencher o briefing manualmente.

### 22.13 MVP do fluxo de software

1. Escolha do tipo de software.
2. Campo de descrição livre.
3. Perguntas adaptativas limitadas.
4. Resumo automático editável.
5. Separação entre MVP e futuras fases.
6. Confirmação dos requisitos.
7. Estimativa preliminar.
8. Salvamento de rascunho.
9. Envio do orçamento.

Ficam fora do MVP:

- geração automática de código;
- promessa automática de prazo final;
- contratação sem revisão de condições;
- chatbot aberto sem objetivo de briefing;
- uso obrigatório de provedor externo de IA;
- análise automática de arquivos sensíveis sem consentimento.

### 22.14 Critérios de aceite do fluxo de software

- [ ] O cliente consegue explicar o projeto em linguagem livre.
- [ ] A IA faz perguntas relevantes e não repete respostas já confirmadas.
- [ ] O cliente consegue responder “não sei”.
- [ ] O cliente consegue editar o resumo gerado.
- [ ] Sugestões da IA aparecem separadas dos requisitos confirmados.
- [ ] O cliente consegue organizar o escopo em MVP, fase 2 e futuro.
- [ ] O sistema registra pendências sem bloquear o envio, quando permitido.
- [ ] O orçamento enviado contém o briefing completo e sua versão.
- [ ] A equipe consegue entender o projeto sem uma reunião inicial obrigatória.
- [ ] O cliente pode continuar manualmente se a IA local estiver indisponível.
- [ ] Nenhum cliente acessa briefings, anexos ou sugestões de outra conta.

## 23. Fluxo unificado de orçamento

Depois de escolher o tipo de projeto, o painel deverá direcionar o cliente para um dos dois fluxos:

```text
Novo orçamento
├── Site / loja / landing page
│   └── Configurador visual guiado
└── Software / aplicativo / automação / integração
    └── Briefing adaptativo com IA local
```

Ambos os fluxos terminam em um mesmo resumo de orçamento, com:

- dados do cliente;
- escopo escolhido;
- estimativa preliminar;
- anexos;
- pendências;
- histórico de versões;
- confirmação do cliente;
- status do orçamento.

O cliente não deve ser obrigado a escolher entre tecnologia, framework, banco de dados ou arquitetura. Essas decisões pertencem à equipe e serão definidas a partir do problema, do escopo e das restrições confirmadas.

---

## Relação com outros documentos

- [Planejamento geral](./PLANEJAMENTO.md)
- [Arquitetura atual](./ARQUITETURA.md)
- [Segurança](./SEGURANCA.MD)

O backend real e a autenticação Google devem ser implementados somente depois da revisão deste escopo, pois as entidades de usuário, empresa, orçamento, projeto, configurador visual, briefing e permissões serão a base das próximas telas.
