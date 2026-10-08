# Documentação do projeto

## Objetivo

O CodeVance Tech é um site institucional responsivo para apresentar serviços de desenvolvimento de sites e softwares sob medida. A aplicação é uma SPA (Single Page Application) construída com React e Vite.

## Documentos

- [Arquitetura](ARQUITETURA.md): estrutura do sistema, inicialização, roteamento, providers e módulos.
- [Desenvolvimento local](DESENVOLVIMENTO.md): pré-requisitos, comandos, configuração e fluxo de trabalho.
- [Operação e deploy](OPERACAO-E-DEPLOY.md): build, GitHub Actions, branch `deploy`, Hostinger e diagnóstico de produção.
- [Planejamento de ideias](PLANEJAMENTO.md): Painel ADM, Internacionalização, Segurança e documentação técnica consolidada.
- [Futuro desenvolvimento](FUTURO.md): ideias de segunda prioridade (P2) e roadmap de longo prazo.

## Resumo técnico

| Item | Tecnologia ou configuração |
| --- | --- |
| Frontend | React 18 + JSX |
| Bundler e servidor de desenvolvimento | Vite 8 |
| Gerenciador de pacotes | pnpm 10 ou superior |
| Runtime recomendado | Node.js 22; engines aceitam Node.js `>=20.19.0` |
| Estilos | Tailwind CSS, CSS global e utilitários locais |
| Roteamento | React Router DOM 6 |
| Estado de servidor | TanStack React Query |
| Componentes de interface | Mantine 8, Tabler Icons e componentes locais |
| Backend planejado | NestJS + Fastify + TypeScript |
| Backend atual | Servidor Node.js HTTP sem dependências, placeholder |
| Banco planejado | PostgreSQL + Prisma |
| Hospedagem | Hostinger, branch `deploy` copiada para `public_html` |

## Estado atual e limites conhecidos

- A página principal é pública e está em `src/pages/Home.jsx`.
- O fluxo de autenticação está estruturado, mas `src/services/auth-mock.js` ainda rejeita login, cadastro, reset de senha e OAuth com erro de configuração. Ele não autentica usuários reais.
- `src/services/api.js` é um cliente HTTP genérico preparado para um backend futuro.
- `src/index.js` implementa somente `GET /api/health`; as demais rotas retornam 404.
- A migração futura para NestJS deverá organizar módulos de autenticação e Painel ADM.
- Os dados de planos, contato e identidade do site estão em `src/config/site.js`.
- O build de produção deve ser servido a partir da branch `deploy`, nunca diretamente da branch `main`.

## Fluxo principal

```mermaid
flowchart TD
    A[index.html] --> B[src/app/main.jsx]
    B --> C[src/app/App.jsx]
    C --> D[src/app/providers.jsx]
    D --> E[src/app/router.jsx]
    E --> F[src/pages/Home.jsx]
    F --> G[src/features/home]
    F --> H[src/features/layout]
    D --> I[AuthProvider]
    D --> J[QueryClientProvider]
