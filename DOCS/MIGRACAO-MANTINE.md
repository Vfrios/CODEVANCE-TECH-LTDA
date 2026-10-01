# Migracao para Mantine

## Escopo

A camada de componentes base em `src/components/ui/` foi removida. Os consumidores reais passaram a usar Mantine diretamente, sem alterar roteamento, providers de negocio, autenticacao, paginas, hooks ou servicos.

## Dependencias

Adicionadas:

- `@mantine/core`
- `@mantine/hooks`
- `@mantine/dates`
- `@mantine/notifications`
- `@mantine/form`
- `@mantine/modals`
- `@mantine/spotlight`
- `@mantine/carousel`
- `@mantine/charts`
- `@tabler/icons-react`

A linha Mantine 8 foi fixada por compatibilidade com React 18. Dependencias Radix, shadcn e auxiliares exclusivos da camada antiga foram removidas.

## Tema

O tema esta em `src/theme.js`:

- `bio`: escala Mantine de dez tons baseada em `#22C55E`, `#14803C` e `#0B3D2E`
- preto principal: `#0A0A0A`
- superficie carbon: `#141414`
- fonte: `Inter, sans-serif`
- raio padrao: `md`
- esquema inicial: dark

Os estilos globais do Mantine sao carregados em `src/app/main.jsx` junto dos estilos existentes do projeto.

## Providers

`src/app/providers.jsx` agora usa esta ordem:

`MantineProvider -> ModalsProvider -> Notifications -> AuthProvider -> QueryClientProvider -> children`

Nao foi adicionado `SpotlightProvider`: nao havia command palette ativo fora da camada shadcn. O pacote continua disponivel para uma futura tela que realmente use Spotlight.

## Mapeamentos aplicados

- Button -> `@mantine/core/Button`
- Input -> `TextInput`
- Label -> elemento `label` estilizado, preservando o HTML e acessibilidade existentes
- Input OTP -> `PinInput`
- Image -> `Image`, com `fit="fill"`
- Toast -> `notifications.show`
- Icones Lucide -> equivalentes de `@tabler/icons-react`

Os formularios de autenticacao mantiveram estado, eventos, chamadas de servico, redirecionamentos e validacoes originais.

## Diferencas conhecidas

- `resizable` nao possui equivalente direto no Mantine e nao era consumido por features ativas; nenhum wrapper foi criado.
- `command` foi substituido conceitualmente por Spotlight, mas nao havia consumidor ativo que justificasse adicionar uma nova funcionalidade.
- `Handshake` e `Layers` nao possuem o mesmo nome no Tabler; foram usados `IconUserShare` e `IconStack2`, respectivamente.

## Validacao

O build de producao foi executado com sucesso usando `pnpm build`. O Vite emite apenas o aviso existente de chunk maior que 500 kB.
