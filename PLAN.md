# Game Plan: Afterglow: Date Sim

## Risk Tasks

### 1. Interface narrativa integralmente no canvas
- **Why isolated:** A experiência precisa preservar a composição cinematográfica e permitir escolhas clicáveis, diálogo progressivo e retratos em camadas, tudo dentro de um canvas Babylon responsivo.
- **Approach:** Usar uma camada GUI 2D do Babylon para painel de diálogo, botões e indicadores; manter a lógica de estado de narrativa independente em TypeScript. A cada transição, reconstruir apenas os controlos mutáveis e preservar o fundo e as luzes procedurais.
- **Verify:** Ao escolher uma opção, o texto, a personagem, o estado de afinidade e as cartas seguintes atualizam uma única vez, sem duplicação de botões, texto sobreposto ou eventos de clique duplicados; o layout continua legível entre 360 px e 1280 px de largura.

### 2. Composição responsiva de retrato e cenário
- **Why isolated:** O retrato vertical e o cenário panorâmico têm proporções opostas e podem cortar de forma pouco elegante em ecrãs estreitos.
- **Approach:** Usar imagens em camadas numa interface GUI com alinhamento adaptativo; manter o retrato junto à margem direita em desktop e reduzir/deslocar para o topo direito em mobile, libertando a zona inferior para escolhas.
- **Verify:** O retrato não tapa nenhuma opção, o painel de diálogo mantém contraste sobre o cenário e o ícone de lua, título e indicador de afinidade permanecem visíveis em desktop e mobile.

## Main Build

Construir um romance interativo de uma noite no Café Lumen. O jogador escolhe como iniciar e aprofundar a conversa com Mila ou Leo; cada resposta tende para curiosidade, coragem ou ternura e modifica discretamente a afinidade. Três finais curtos dão fecho à noite: uma nova constelação, uma promessa de regresso ou uma despedida honesta. Um ecrã de título permite iniciar e um reinício devolve o jogador à primeira escolha.

- **Assets needed:** Fundo panorâmico do Café Lumen; retratos verticais de Mila e Leo; marca em forma de lua; textura/referência visual para a paleta e composição.
- **Verify:**
  - Um clique em cada carta apresenta imediatamente o próximo momento da conversa.
  - O indicador de afinidade muda de forma coerente e o nome da personagem ativa é sempre visível.
  - Cada uma das duas rotas pode chegar a um final completo e o botão “Jogar de novo” reinicia corretamente.
  - Os controlos são navegáveis por teclado e possuem texto acessível.
  - A UI é legível, sem sobreposição ou corte em desktop e mobile.
  - Não existem texturas em falta, placeholders visuais nem erros de consola durante a execução.
  - A composição respeita a referência: fundo azul-tinta, luz clementina, vidro embaciado, retrato à direita e diálogo inferior esquerdo.
  - **Presentation proof:** uma captura do ecrã de abertura e uma captura de um momento de escolha demonstram cenário, retrato, diálogo e afinidade reais.
