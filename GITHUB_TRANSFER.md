# Transferência para o repositório privado

O código-fonte de The Croe Trio é enviado para `victorinno/the-core-trio` como um projeto independente. A versão transferida inclui o cliente React, os módulos de narrativa, relações e economia, o documento de game design, os diagramas e as artes usadas pelo jogo.

## Executar localmente

```bash
pnpm install
VITE_LOCAL_ART=true pnpm dev
```

## Verificar o projeto

```bash
pnpm check
pnpm tsx tools/economy-smoke.mjs
pnpm build
```

## Gerar pacote estático opcional

```bash
GITHUB_PAGES_REPOSITORY=the-core-trio pnpm build:github-pages
```

O script de build procura as artes em `art/` quando elas estão presentes no repositório clonado. No ambiente Manus, ele mantém a compatibilidade com a pasta externa de recursos estáticos.
