# Estrutura: Afterglow: Date Sim

O jogo mantém React como moldura mínima e Babylon como o único espaço de interação. O canvas é inicializado por `GameCanvas.tsx`, enquanto toda a narrativa e a UI são controladas por módulos TypeScript independentes em `client/src/game/`.

| Módulo | Responsabilidade |
|---|---|
| `components/GameCanvas.tsx` | Ciclo de vida seguro do motor, canvas de ecrã inteiro e redimensionamento. |
| `game/scene.ts` | Cria a cena Babylon e devolve o contrato de limpeza. |
| `game/GameWorld.ts` | Mantém o estado da sessão, desenha a UI, processa escolhas, teclado, demo e reinício. |
| `game/story.ts` | Define personagens, falas, escolhas, afinidade e finais. |
| `game/assets.ts` | Centraliza as URLs de recursos gerados. |

## Fluxo de estado

`título` → `mesa / personagem` → `conversa` → `final` → `jogar de novo`.

Cada escolha de conversa atribui um tom — ternura, curiosidade ou coragem — e ajusta a afinidade. O jogo não penaliza respostas; o tom selecionado determina o pequeno epílogo da rota.

## Asset hints

O fundo do Café Lumen deve preencher o viewport. Mila e Leo são retratos verticais, ancorados à direita e renderizados por cima do cenário. A marca lunar aparece no cabeçalho e no título. A interface é desenhada por controlos GUI do Babylon, com superfícies azul-tinta translúcidas, tipografia marfim e detalhes Clementine Glow.

## Mecânicas Croe Trio

`game/story.ts` passa a manter dados por rota e capítulo, incluindo escolhas, efeitos relacionais e memórias. `GameWorld.ts` mantém um objeto de estado independente para as cinco rotas, apresenta um mapa de conversas, aplica consequências e controla a progressão entre capítulos. Os quatro atributos — vínculo, clareza, segurança e tensão — pertencem a cada rota, nunca ao elenco inteiro como uma única barra global.
