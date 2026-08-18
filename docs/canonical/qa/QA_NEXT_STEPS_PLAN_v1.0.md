# Plano de QA — Próxima Onda: Pamela, Teclado e Bundle Babylon

| Campo | Valor |
|---|---|
| Versão | 1.0 — planejado |
| Data | 18 de agosto de 2026 |
| Escopo | Sessões exploratórias da rota Pamela, automação de teclado e experimento de code-splitting |
| Pré-requisito | Relatório de QA v1.0 aprovado e regressões de teclado corrigidas |
| Critério de encerramento | Os quatro epílogos são explorados manualmente; os atalhos P0 são automatizados; qualquer mudança de bundle é medida, reversível e não cria regressão visual ou de Pages. |

## 1. Propósito e princípios de decisão

Esta onda transforma as pendências do relatório de QA anterior em três trilhas verificáveis. A primeira avalia a experiência longa da rota Pamela; a segunda impede que a regressão de queda de teclado volte a acontecer; a terceira reduz o tamanho do carregamento de forma **mensurável**, sem trocar uma advertência do build por regressões de inicialização, navegação ou publicação. O plano preserva a regra narrativa de que nenhum epílogo é uma recompensa obrigatória: proximidade, amizade e pausa devem continuar sendo resultados íntegros.[1] [2]

> **Regra de parada:** não iniciar otimização de bundle se a automação de teclado ainda não cobrir as duas regressões corrigidas. Não aceitar code-splitting que apenas esconda o aviso de tamanho ou que piore o tempo até a primeira tela jogável.

| Trilha | Prioridade | Dono sugerido | Entregável | Definição de pronto |
|---|---:|---|---|---|
| A. Epílogos de Pamela | P0 | QA narrativo | Quatro fichas de sessão com diário e estado final | Cada epílogo termina, volta ao mapa e preserva memórias coerentes. |
| B. Teclado automatizado | P0 | Desenvolvimento | Suíte Vitest para o resolvedor de comandos | `pnpm test` verifica que uma tecla gera, no máximo, um comando por tela. |
| C. Code-splitting Babylon | P1 | Desenvolvimento + QA técnico | Relatório de baseline, experimento e decisão | A redução é demonstrada no build normal e no GitHub Pages sem piorar o fluxo principal. |

## 2. Trilha A — Sessões exploratórias longas para Pamela

Cada sessão deve começar em estado limpo com `R`, registrar escolhas, energia, saldo, inventário, métricas e memórias ao final de cada etapa. A pessoa testadora não deve usar o modo de demonstração para concluir a sessão; demos são permitidas somente para comparar uma tela ou reproduzir uma falha. Cada sessão termina com duas verificações: abrir o mapa de conversas e iniciar outra rota sem carregar memória indevida, depois reiniciar com `R` e confirmar o estado-base.

### 2.1 Instrumentação manual obrigatória

| Momento | Registrar | Falha que revela |
|---|---|---|
| Início da sessão | Dia, bloco, Energia, carteiras, métricas Pamela | Estado inicial contaminado. |
| Antes de cada escolha | Etapa, variante principal ou fallback, escolha disponível | Gate oculto, escolha automática ou variante errada. |
| Após cada rotina | Ação, custo, memória, mudança de atributos | Economia comprando afeto, cuidado repetido ou consumo incorreto. |
| Antes do epílogo | Vínculo, Clareza, Segurança, Tensão e memórias-chave | Resultado não correspondente ao estado. |
| Depois do epílogo | Mapa, diário e reinício | Beco sem saída, persistência indevida ou retorno quebrado. |

### 2.2 Matriz de quatro epílogos

| Sessão | Objetivo de estado final | Rota sugerida de escolhas e rotina | Resultado esperado | Critério de reprovação |
|---|---|---|---|---|
| PAM-EXP-01 — Rotina a dois | Vínculo ≥4, Clareza ≥4, Segurança ≥4, Tensão ≤1 | Etapa 1: perguntar o que “perto” significa; interlúdio: bebida escolhida; Etapa 2: check-in de conversa, distração ou espaço; Etapa 3: esperar sem punição; interlúdio: date de curiosidade; Etapa 4: chá, música e distância ajustável; Etapa 5: check-in semanal. | **Rotina a dois**, com check-in e date revisável. | O jogo declara vitória romântica fixa, ignora Jessica ou não permite voltar ao mapa. |
| PAM-EXP-02 — Proximidade escolhida | Vínculo ≥3, Clareza ≥3, Segurança ≥4, sem atingir o limiar de Rotina a dois | Construir clareza e segurança com uma rotina de cuidado; escolher transparência sobre Jessica; no final, marcar conversa futura com Pamela e, se ela quiser, Jessica. Evitar a combinação completa de Vínculo/Clareza/Tensão da sessão 01. | **Proximidade escolhida**, com próximo encontro e transparência opcional. | A rota pula para Rotina a dois apesar do estado abaixo do limiar, ou trata Jessica como obstáculo. |
| PAM-EXP-03 — Amizade íntima e honesta | Segurança ≥3, mas Vínculo ou Clareza abaixo do limiar de proximidade | Escolher espaço na abertura, priorizar chá e conversa curta, evitar date contextual ou escolher amizade na etapa final. | **Amizade íntima e honesta**, sem linguagem de falha. | O jogo reduz amizade a rejeição, remove o cuidado acumulado ou bloqueia o mapa. |
| PAM-EXP-04 — Pausa que preserva | Tensão ≥3 ou Segurança ≤2 | Escolher linguagem que expõe pressa sem reparação suficiente, tentar uma possibilidade cedo e, no fim, pedir pausa com data de revisão. | **Pausa que preserva**, com retorno conversado. | A pausa encerra a rota de modo punitivo, não oferece data/revisão ou altera recursos sem ação. |

### 2.3 Roteiro da sessão exploratória

A duração-alvo é de **45 a 60 minutos por epílogo**, incluindo a repetição de uma cena quando houver comportamento inesperado. A pessoa testadora deve explorar ao menos uma alternativa em cada etapa antes de retomar o percurso planejado. Essa exploração serve para verificar se o jogo continua a oferecer escolhas completas quando o estado está longe do “melhor” resultado.

| Fase | Duração alvo | Perguntas de QA |
|---|---:|---|
| Preparação | 5 min | O estado foi reiniciado? Os atalhos Casa, Quarto e Mapa estão disponíveis? |
| Etapas 1–2 | 10–15 min | A primeira escolha altera somente uma intenção? O primeiro interlúdio exige uma rotina real? |
| Transparência e date | 15–20 min | A variante de Jessica respeita Clareza/Segurança? O date bloqueado oferece alternativa saudável? |
| Final e retorno | 10–15 min | O epílogo corresponde às métricas? Memórias, mapa e reset permanecem coerentes? |

## 3. Trilha B — Testes automatizados de navegação por teclado

O projeto já dispõe de Vitest como dependência de desenvolvimento, mas não de script, configuração ou suíte de interface. A primeira implementação não deve tentar inspecionar o canvas Babylon; deve extrair a decisão de teclado para uma função pura, por exemplo `resolveKeyboardCommand(screen, key, state)`. O `GameWorld` continuará executando o comando e renderizando, enquanto a função pura passa a ser testável sem WebGL.

### 3.1 Mudança de arquitetura mínima

| Item | Decisão proposta | Critério de aceitação |
|---|---|---|
| Módulo | Criar `client/src/game/keyboardNavigation.ts`. | Não importa Babylon, DOM ou `GameWorld`. |
| Contrato | Entrada: tela ativa, tecla e flags mínimas; saída: um único comando sem efeitos colaterais. | O tipo não permite retornar duas transições concorrentes. |
| Integração | `GameWorld.handleKeydown` resolve um comando e o executa em um `switch`. | Cada evento tratado retorna imediatamente após o comando. |
| Suíte | Criar `client/src/game/__tests__/keyboardNavigation.test.ts`. | Roda por `pnpm test` e por `pnpm test:watch`. |
| CI futura | Inserir `pnpm test`, `pnpm check` e `GITHUB_PAGES=true pnpm build` no fluxo de PR. | Uma regressão de teclado bloqueia a integração. |

### 3.2 Casos automatizados P0

| ID | Estado de entrada | Tecla | Comando esperado | Asserção de segurança |
|---|---|---|---|---|
| KBD-01 | Qualquer tela | `R` | Resetar jogo | Nenhum segundo comando é emitido. |
| KBD-02 | Título | `Enter` | Abrir semana | Não abre rota ou ação. |
| KBD-03 | Semana | `1`–`4` | Abrir Ações, Loja, Carteiras ou Mercado | Não abre mapa ou rota. |
| KBD-04 | Semana | `5` | Abrir **somente** mapa de conversas | Não seleciona Saskia ou outra rota. |
| KBD-05 | Mapa de conversas | `1`–`5` | Abrir somente a rota correspondente | Não seleciona uma intenção da conversa. |
| KBD-06 | Conversa | `1`–`3` | Aplicar somente a intenção correspondente | Não avança capítulo no mesmo evento. |
| KBD-07 | Reflexão | `Enter` | Avançar etapa ou epílogo | Não retorna ao mapa no mesmo evento. |
| KBD-08 | Ações, Loja, Carteiras, Mercado, mapa de lugares, local, feedback ou interlúdio | `Escape` | Voltar à semana | Não altera atributos, carteiras ou posição. |
| KBD-09 | Qualquer tela permitida | `M`, `H`, `Q` | Abrir mapa de lugares, Casa ou Quarto | Rotas e escolhas ativas são limpas uma única vez. |

### 3.3 Critérios de conclusão da automação

A suíte deve falhar antes da correção conhecida dos atalhos `5` e `1`, e passar depois dela. Os testes devem cobrir estado normal, tela inexistente/sem comando e teclas que não possuem efeito. A adição de browser E2E fica para uma fase posterior, somente se for necessário validar foco real, listener duplicado ou acessibilidade do canvas; ela não substitui os testes unitários do roteador.

## 4. Trilha C — Plano de code-splitting para Babylon

O baseline a preservar é o último build aprovado: o principal bundle JavaScript registrado ficou próximo de **1,38 MB sem compressão e 358 kB gzip**, com advertência de chunk maior que 500 kB.[1] A configuração Vite atual ainda não define `manualChunks`; o bootstrap cria a cena e instancia `GameWorld` diretamente. Isso permite experimentar divisão sem alterar a história, mas exige validação de carga assíncrona, foco do canvas, descarte e caminho-base do GitHub Pages.[3]

### 4.1 Métricas antes de qualquer alteração

| Métrica | Como medir | Baseline / limiar |
|---|---|---|
| Tamanho de cada chunk | Saída de `GITHUB_PAGES=true pnpm build` | Registrar bytes raw e gzip de cada arquivo. |
| Maior chunk | Comparar contra o maior arquivo JS atual | Redução real, sem elevar artificialmente o limite de aviso. |
| Custo até a primeira tela jogável | Cronometrar Título → Semana em prévia e GitHub Pages | Não piorar mais que 5% do baseline medido na mesma máquina. |
| Requisições iniciais | Log de rede do navegador | Identificar quais chunks são necessários antes da Semana. |
| Integridade funcional | QA P0 e roteiro de Pamela | Zero regressão em teclado, reset, mapa e interlúdios. |

### 4.2 Experimentos em ordem segura

| Experimento | Alteração limitada | Hipótese | Critério de seguir | Critério de reverter |
|---|---|---|---|---|
| BND-01 — Medição | Nenhuma mudança no código; salvar manifesto de chunks e tempos. | Cria uma base comparável. | Métricas registradas para build normal e Pages. | Não aplicável. |
| BND-02 — Cena assíncrona | Trocar o import estático de `scene.ts` no host por `await import()` após a criação do Engine. | Separa o shell React do módulo de jogo sem mudar o contrato `GameHandle`. | Título, Semana, foco e descarte funcionam em normal/Pages; chunk inicial reduz. | Tela em branco, foco ausente, duplicação de Engine ou piora maior que 5%. |
| BND-03 — Vendors controlados | Definir `rollupOptions.output.manualChunks` para separar Babylon Core, Babylon GUI e dependências React. | Evita que UI, engine e shell apareçam em um único arquivo monolítico. | Maior chunk diminui e não surgem 404s ou cascata excessiva de requisições. | O total crítico piora, paths de Pages quebram ou o aviso apenas é mascarado. |
| BND-04 — Conteúdo narrativo sob demanda | Separar `story.ts` por rota e carregar o conteúdo apenas ao abrir uma rota. | O jogador não precisa baixar o texto de todas as rotas antes da Semana. | Rota abre sem atraso perceptível e retornos mantêm memória/estado. | Qualquer escolha, memória ou epílogo não carregar de forma determinística. |

### 4.3 Guardrails técnicos

O experimento não deve mudar `chunkSizeWarningLimit` apenas para esconder o alerta. Cada passo deve começar por um checkpoint, ocorrer em commit separado e terminar com `pnpm test`, `pnpm check`, build normal, `GITHUB_PAGES=true pnpm build`, prévia visual e teste na URL pública. O caminho-base configurado para Pages, os plugins de log e o proxy de assets permanecem inalterados.[3]

> **Decisão go/no-go:** publicar uma alteração de bundle apenas quando a redução for observável, a primeira tela jogável não regredir e todos os casos KBD-01 a KBD-09 passarem. Caso contrário, restaurar o checkpoint do experimento e manter a baseline atual.

## 5. Ordem de execução e capacidade

| Onda | Escopo | Esforço estimado | Dependência | Resultado |
|---|---|---:|---|---|
| 0 | Registrar baseline de build, rede e primeira tela | 1–2 h | Nenhuma | Linha de base técnica. |
| 1 | Extrair roteador de teclado e implementar KBD-01 a KBD-09 | 2–3 h | Onda 0 | Regressões de queda de evento protegidas. |
| 2 | Executar PAM-EXP-01 a PAM-EXP-04 | 3–4 h | Onda 1 | Quatro fichas narrativas e possíveis defeitos de conteúdo. |
| 3 | Rodar BND-02 e BND-03, com decisão de publicação | 2–4 h | Onda 0 e testes de teclado | Redução comprovada ou decisão explícita de não alterar. |
| 4 | Avaliar BND-04 somente se o maior custo restante for texto narrativo | 3–6 h | Onda 3 | Divisão de rotas ou encerramento justificado. |

## 6. Artefatos esperados

| Artefato | Local proposto | Atualização |
|---|---|---|
| Fichas exploratórias de Pamela | `docs/canonical/qa/exploration/pamela/` | Uma por epílogo. |
| Suíte de teclado | `client/src/game/__tests__/keyboardNavigation.test.ts` | A cada alteração de atalho ou tela. |
| Registro de tamanho de bundle | `docs/canonical/qa/performance/BUNDLE_BASELINE_v1.0.md` | Antes e depois de cada experimento BND. |
| Relatório de decisão de code-splitting | `docs/canonical/qa/performance/CODE_SPLITTING_DECISION_v1.0.md` | Ao encerrar as ondas BND. |
| Atualização do relatório principal | `docs/canonical/qa/QA_TEST_PLAN_AND_EXECUTION_v1.0.md` | Depois de cada onda concluída. |

## Referências

[1]: ./QA_TEST_PLAN_AND_EXECUTION_v1.0.md "Plano e Registro de Testes — The Croe Trio"
[2]: ../pamela/GDD_PAMELA_v1.1.md "GDD Canônico da Rota Pamela v1.1"
[3]: ../../../vite.config.ts "Configuração de build Vite do projeto"
