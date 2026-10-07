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
