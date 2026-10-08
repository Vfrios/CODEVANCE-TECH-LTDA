# CODEVANCE-TECH-LTDA

## Inicialização local

Pré-requisitos: Node.js `20.19` ou superior e pnpm `10` ou superior.

Na raiz do projeto, instale as dependências e inicie o frontend e o backend:

```bash
pnpm install
pnpm dev
```

O frontend ficará disponível em `http://localhost:5173`. O comando `pnpm dev` inicia também o servidor backend em modo de desenvolvimento.

## Deploy (Hostinger + GitHub)

Cada push na branch `main` aciona o GitHub Actions, que instala as dependências, faz o build e publica somente o conteúdo de `dist/` na branch `deploy`. A Hostinger copia a branch `deploy` para `public_html` usando o recurso de Git genérico.

O arquivo `public/.htaccess` é incluído no build e garante o fallback das rotas do React Router para `index.html` no Apache.



# CodeVance Tech — site institucional

Site institucional da CodeVance Tech (software sob medida + criação de sites).

**Stack:** React 18 · Vite · Tailwind CSS · shadcn/ui · react-router-dom · TanStack Query · motion (`motion/react`)

## Como rodar localmente

Requer Node 20+ e [pnpm](https://pnpm.io) 10+ (`corepack enable` ativa o pnpm automaticamente).

```bash
pnpm install
pnpm dev           # sobe front (http://localhost:5173) e back (http://localhost:3001) juntos
pnpm dev:front     # só o front (Vite)
pnpm dev:back      # só o back (server/index.js, com --watch)
pnpm build         # build de produção em ./dist
pnpm preview       # serve o build localmente
pnpm lint          # ESLint
```

O Vite encaminha `/api/*` para o back-end local, então o front chama `/api/...` sem se preocupar com portas.
O back em `server/index.js` é só um **placeholder** (expõe `GET /api/health`); substitua pelo seu backend real.

Variáveis de ambiente opcionais (arquivo `.env.local`, nunca versionado):

| Variável | Uso |
| --- | --- |
| `VITE_API_URL` | URL base do backend usada por `src/services/api.js` (vazio = mesma origem, via proxy do Vite) |
| `API_PORT` | porta do back-end local (padrão `3001`) |
| `VITE_APP_ID` | id do app, lido por `src/lib/app-params.js` (só usado pela página `OAuthConsent`) |

## Estrutura de pastas

```
src/
├── app/            Bootstrap: main.jsx, App.jsx, providers.jsx (Auth, QueryClient, Toaster) e router.jsx (todas as rotas)
├── features/       Uma pasta por feature/seção. Cada uma tem um index.js que reexporta tudo
│   ├── home/         Seções da Home: Hero, Stats, Problems, Solutions, HowItWorks, Pricing, About, Contact, ScrollProgress, SectionDivider
│   ├── layout/       O que aparece em toda página: Navbar, Footer, Logo, WhatsAppFloat
│   └── auth/         Login, Register, ForgotPassword, ResetPassword, OAuthConsent, AuthContext, ProtectedRoute etc.
├── components/     Só componentes reutilizáveis e genéricos
│   ├── ui/           shadcn/ui (não editar — gerado pela CLI do shadcn)
│   ├── animations/   TiltCard
│   └── common/       ScrollToTop, PageNotFound
├── pages/          Páginas = só composição de features (Home.jsx)
├── hooks/          use-mobile, use-size, useScrollAnimations
├── lib/            Utilitários puros: utils.js (cn), query-client.js, app-params.js
├── config/         site.js — configuração central da empresa e dos planos
├── services/       api.js (cliente fetch) e auth-mock.js (mock de autenticação)
├── styles/         index.css (Tailwind + variáveis de tema + animações)
└── utils/          index.ts (createPageUrl)
```

`server/` (na raiz do projeto) contém o back-end local de desenvolvimento.

Alias: `@/` aponta para `src/` (configurado em `vite.config.js` e `jsconfig.json`).
Dentro de uma feature use imports relativos (`./Logo`); entre features use o barrel (`@/features/layout`).

## Onde editar cada coisa

| O que | Onde |
| --- | --- |
| Nome da empresa, logo, WhatsApp, e-mail, Instagram, cidade, ano | `src/config/site.js` → `SITE` |
| Planos e preços (sites e software) | `src/config/site.js` → `PLANOS` |
| Textos de cada seção | `src/features/home/<Secao>.jsx` |
| Menu e rodapé | `src/features/layout/Navbar.jsx` e `Footer.jsx` |
| Cores e tema (claro/escuro) | variáveis CSS em `src/styles/index.css` e `tailwind.config.js` |
| Animações de rolagem | `src/hooks/useScrollAnimations.js` (objeto `CONFIG`) |
| Rotas | `src/app/router.jsx` |
| Título, descrição e metatags | `index.html` |

## Rotas

| Rota | Componente |
| --- | --- |
| `/` | `pages/Home` |
| `/login`, `/register`, `/forgot-password`, `/reset-password`, `/oauth/consent` | `features/auth/*` |
| qualquer outra | `components/common/PageNotFound` |

As rotas de auth ficam fora do `AuthGate` no `router.jsx` para evitar loop de redirecionamento ao login.
Para criar páginas que exigem login, agrupe-as com `<Route element={<ProtectedRoute unauthenticatedElement={<Login />} />}>`.

## Como substituir o mock de autenticação por um backend real

Toda a autenticação passa por **um único arquivo**: `src/services/auth-mock.js`. Ele implementa a mesma interface que o app já consome (`authMock.me`, `loginViaEmailPassword`, `loginWithProvider`, `register`, `verifyOtp`, `resendOtp`, `resetPasswordRequest`, `resetPassword`, `setToken`, `logout`, `redirectToLogin` e `appMock.getPublicSettings`), mas **hoje nenhum login funciona**: os métodos rejeitam com "Autenticação ainda não configurada".

1. Escolha o provedor (Supabase, Clerk, Firebase ou API própria).
2. Reimplemente cada método de `auth-mock.js` com o SDK/API do provedor, mantendo nomes e formato de retorno (`me()` devolve o usuário ou lança erro com `status` 401).
3. Ajuste `src/lib/app-params.js` se o token não ficar no `localStorage`.
4. Use `src/services/api.js` (`api.get/post/put/patch/delete`) para as chamadas ao seu backend.
5. `src/features/auth/OAuthConsent.jsx` foi feita para o servidor MCP do Base44 (chama `/api/apps/<id>/mcp/...`). Se você não usa MCP, apague essa página e a rota `/oauth/consent`.

## O que foi feito na reorganização

- Seções da Home movidas de `components/site/` para `features/home/`; Navbar, Footer, Logo e WhatsAppFloat para `features/layout/`.
- Telas e lógica de auth (Login, Register, ForgotPassword, ResetPassword, OAuthConsent, AuthLayout, GoogleIcon, AuthContext, ProtectedRoute, UserNotRegisteredError, authReturnTo) isoladas em `features/auth/`.
- `TiltCard` foi para `components/animations/`; `ScrollToTop` e `PageNotFound` para `components/common/`.
- `App.jsx`, `main.jsx` e o novo `router.jsx` e `providers.jsx` foram para `app/`; `index.css` foi para `styles/`.
- Cada feature ganhou um `index.js`; `pages/Home.jsx` importa de `@/features/home` e `@/features/layout`.
- SDK do Base44 removido: `src/api/base44Client.js` apagado, `@base44/sdk` e `@base44/vite-plugin` saíram do `package.json`, a pasta `base44/`, `AGENTS.md` e `CLAUDE.md` foram removidos, e o alias `@` agora está declarado no `vite.config.js`.
- Gerenciador migrado de npm para pnpm (`packageManager`, scripts `dev`/`dev:front`/`dev:back` com `concurrently`, proxy `/api` no Vite e back placeholder em `server/`).
- `framer-motion` substituído por `motion` (imports `motion/react`).
- `components/ui/*` (shadcn) intocado.
- Lógica, textos, cores, preços e CSS preservados.
