# CODEVANCE-TECH-LTDA

## Deploy (Hostinger + GitHub)

Cada push na branch `main` aciona o GitHub Actions, que instala as dependências, faz o build e publica somente o conteúdo de `dist/` na branch `deploy`. A Hostinger copia a branch `deploy` para `public_html` usando o recurso de Git genérico.

O arquivo `public/.htaccess` é incluído no build e garante o fallback das rotas do React Router para `index.html` no Apache.
