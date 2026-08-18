# Publicação em GitHub Pages

O projeto possui um build separado para GitHub Pages. Esse build inclui os retratos e o cenário em `game-assets/`, remove a dependência do proxy de armazenamento do ambiente de desenvolvimento e usa o caminho-base do repositório.

```bash
pnpm build:github-pages
```

Por padrão, o pacote é criado em `/home/ubuntu/the-croe-trio-pages`. Para usar outro nome de repositório ou diretório, defina `GITHUB_PAGES_REPOSITORY` e `GITHUB_PAGES_OUTPUT` antes do build.

> A página utiliza somente conteúdo fictício do jogo. O Crescent Market também é uma simulação interna e não contém dados ou recomendações financeiras reais.
