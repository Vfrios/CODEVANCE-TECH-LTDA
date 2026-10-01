
# Documentação de Segurança — CodeVance Tech

> **Versão:** 1.0
> **Data:** 2026-10-01
> **Status:** Planejamento
> **Objetivo:** Definir as práticas de segurança obrigatórias, recomendadas e futuras do CodeVance Tech, com foco na proteção dos dados dos clientes e na construção de confiança.

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [O que Hash de Senha Resolve e o que Não Resolve](#2-o-que-hash-de-senha-resolve-e-o-que-não-resolve)
3. [O Problema Real](#3-o-problema-real)
4. [Opções Reais de Proteção](#4-opções-reais-de-proteção)
5. [A Verdade sobre Acesso aos Dados](#5-a-verdade-sobre-acesso-aos-dados)
6. [O que Fazer no Projeto Atual](#6-o-que-fazer-no-projeto-atual)
7. [Como o Cliente Confia sem Tecnologia Mágica](#7-como-o-cliente-confia-sem-tecnologia-mágica)
8. [Resumo](#8-resumo)

---

## 1. Visão Geral

Segurança não é só tecnologia. É combinação de **práticas técnicas**, **transparência**, **contrato** e **postura**. Esta documentação define o que é obrigatório, recomendado e futuro para o CodeVance Tech.

**Princípios:**
- **Hash de senha é obrigatório**, mas não resolve tudo.
- **Transparência** constrói mais confiança que tecnologia mágica.
- **Auditoria** de acessos é essencial.
- **LGPD** é obrigatório.
- **Criptografia zero-knowledge** é inviável para o caso atual.

---

## 2. O que Hash de Senha Resolve e o que Não Resolve

**Hash de senha (bcrypt, argon2, scrypt):**

| Resolve | Não resolve |
|---|---|
| ✅ Protege a **senha** — você não vê a senha em texto puro | ❌ Não protege os dados do cliente de você |
| ✅ Se o banco vazar, ninguém descobre a senha | ❌ Não impede você de logar como o cliente |
| ✅ É obrigatório em qualquer sistema sério | ❌ Não impede você de ler orçamentos, projetos e conversas |

**Por quê?** Porque você é o dono do banco. Mesmo com hash, você pode:
- Resetar a senha do cliente e entrar na conta dele.
- Ler diretamente as tabelas do banco.
- Fazer backup e abrir em outra máquina.
- Logar como admin e ver tudo.

**Conclusão:** hash é obrigatório, mas não resolve o problema de confidencialidade dos dados.

---

## 3. O Problema Real

O objetivo é que o cliente confie o suficiente para usar o sistema, **sem que o dono da plataforma consiga ver o que ele cria**.

Isso se chama **isolamento de dados com confiança zero** (zero-knowledge).

**Verdade dura:**

> Se o dado está no seu servidor, em texto puro ou criptografado com chave que você tem, você consegue ver.

Para você **não** conseguir ver, o dado precisa estar criptografado com uma chave que só o cliente tem. E aí você não consegue nem dar suporte direito.

---

## 4. Opções Reais de Proteção

### Opção 1 — Você tem acesso total (atual)

- Cliente cria login e senha.
- Você vê tudo (orçamentos, clientes, projetos, conversas).
- Senha com hash (obrigatório).
- **Vantagem:** simples, suporte fácil.
- **Desvantagem:** cliente precisa confiar em você.

É o modelo da maioria dos SaaS. Funciona porque o cliente confia na empresa.

### Opção 2 — Criptografia em repouso com chave sua

- Dados criptografados no banco (AES-256).
- Chave fica com você.
- **Vantagem:** se o banco vazar, ninguém lê.
- **Desvantagem:** você ainda consegue descriptografar. Não resolve o problema.

### Opção 3 — Criptografia com chave do cliente (zero-knowledge)

- Dados criptografados com chave derivada da senha do cliente.
- Chave **nunca sai do navegador**.
- **Vantagem:** você não consegue ler os dados.
- **Desvantagem:**
  - Você não consegue dar suporte.
  - Se o cliente esquecer a senha, os dados são perdidos.
  - Busca e filtro ficam limitados.
  - Complexo de implementar.
  - **Inviável** para o caso atual.

### Opção 4 — Isolamento por tenant com contrato e auditoria

- Cada cliente tem seu próprio espaço (tenant).
- Você **tecnicamente** consegue acessar, mas:
  - Contrato diz que você não acessa.
  - Log de auditoria registra todo acesso.
  - Política de privacidade clara.
  - DPA (Data Processing Agreement).
- **Vantagem:** equilíbrio entre confiança e suporte.
- **Desvantagem:** depende de confiança e contrato, não de tecnologia.

É o modelo que a maioria dos SaaS sérios usa.

### Opção 5 — Banco separado por cliente

- Cada cliente tem seu próprio banco.
- **Vantagem:** isolamento maior.
- **Desvantagem:** você ainda é o dono do servidor.

---

## 5. A Verdade sobre Acesso aos Dados

Enquanto o dado estiver no seu servidor, você tem acesso — técnica ou legalmente.

Para você **não** ter acesso, o dado precisa estar:

1. **Criptografado com chave que só o cliente tem** (zero-knowledge), ou
2. **No servidor do cliente** (on-premise), ou
3. **Em um provedor onde você não é admin** (improvável).

E todas essas opções têm um custo enorme:
- Suporte fica impossível.
- Funcionalidades ficam limitadas.
- Cliente perde dados se esquecer a senha.
- Complexidade explode.

**Por isso 99% dos SaaS não fazem isso.** Eles confiam em:
- **Contrato** — você se compromete a não acessar.
- **Auditoria** — todo acesso fica registrado.
- **Política de privacidade** — clara e pública.
- **LGPD** — conformidade legal.
- **Reputação** — se você acessar, perde clientes.

---

## 6. O que Fazer no Projeto Atual

### 6.1 Obrigatório

- ✅ **Hash de senha** com `bcrypt` ou `argon2`.
  - Nunca armazene senha em texto puro.
  - Nunca use MD5, SHA1 ou SHA256 puro.
- ✅ **HTTPS** em tudo.
- ✅ **Token JWT** com expiração curta.
- ✅ **Refresh token** para renovar sessão.
- ✅ **Rate limiting** no login (evita brute force).
- ✅ **Validação de entrada** (evita SQL injection, XSS).
- ✅ **Log de auditoria** — registra quem acessou o quê.

### 6.2 Recomendado

- ✅ **Política de privacidade** clara.
- ✅ **Termos de uso** com cláusula de confidencialidade.
- ✅ **DPA** (Data Processing Agreement) — se o cliente pedir.
- ✅ **Log de auditoria visível** — o cliente pode ver quem acessou os dados dele.
- ✅ **2FA** (autenticação em dois fatores) — opcional, mas agrega confiança.
- ✅ **Notificação de acesso** — se um admin acessar a conta do cliente, o cliente recebe e-mail.

### 6.3 Diferencial

- ✅ **Modo "somente leitura" para admin** — você vê, mas não altera.
- ✅ **Acesso com consentimento** — se precisar acessar, o cliente aprova antes.
- ✅ **Auditoria pública** — o cliente vê o histórico de acessos.
- ✅ **Criptografia em repouso** — AES-256 no banco (não resolve, mas agrega).

### 6.4 O que NÃO faz sentido agora

- ❌ Criptografia zero-knowledge — inviável, quebra suporte.
- ❌ Banco separado por cliente — overengineering.
- ❌ Blockchain — não resolve nada aqui.
- ❌ On-premise — cliente não vai hospedar.

---

## 7. Como o Cliente Confia sem Tecnologia Mágica

A confiança não vem só de tecnologia. Vem de:

1. **Transparência** — política de privacidade clara.
2. **Contrato** — cláusula de confidencialidade.
3. **Auditoria** — log de acessos visível.
4. **Reputação** — cases, depoimentos, tempo de mercado.
5. **Conformidade** — LGPD, DPA, selo de segurança.
6. **Postura** — você nunca acessa sem consentimento.
7. **Comunicação** — se precisar acessar, avisa antes.

A maioria dos SaaS vive disso. Não de criptografia zero-knowledge.

---

## 8. Resumo

| Pergunta | Resposta |
|---|---|
| **Hash de senha protege os dados do cliente de mim?** | Não. Protege a senha, mas você continua vendo os dados. |
| **Como faço para não ter acesso ao login/senha do cliente?** | Hash resolve a senha. Para não ver os dados, só com criptografia zero-knowledge, que é inviável. |
| **O que dá pra fazer no projeto atual?** | Hash + HTTPS + JWT + auditoria + política de privacidade + DPA. |
| **Isso é suficiente?** | Para 99% dos clientes, sim. Confiança se constrói com transparência, não só com tecnologia. |
| **Preciso mudar a arquitetura?** | Não. Só adicionar as práticas de segurança obrigatórias. |

**Em uma frase:** hash de senha é obrigatório, mas não resolve o problema de confidencialidade. Para o cliente confiar em você, o caminho é transparência + contrato + auditoria, não tecnologia mágica. Criptografia zero-knowledge é inviável para o caso atual.

---

**Documento separado das implementações P2 e ideias futuras.**
**Referência cruzada:** Documentação de Implementação — Painel ADM CodeVance Tech (v3.0).
