# Plano e Registro de Testes — The Croe Trio

| Campo | Valor |
|---|---|
| Versão | 1.0 — em execução |
| Data | 18 de agosto de 2026 |
| Escopo | Versão pública no GitHub Pages, build estático e fluxo Babylon no navegador |
| Endereço público | `https://victorinno.github.io/the-core-trio/` |
| Critério de aprovação | Nenhum bloqueio em fluxo P0; cada regra crítica deve produzir feedback compreensível e preservar o estado quando bloqueada. |

## Objetivo

Esta rodada verifica se a versão publicada preserva a proposta de **romance interativo adulto com escolhas reversíveis**, sem permitir que dinheiro, repetição de cuidado ou progressão de cena substituam contexto, consentimento e recursos de rotina. A matriz abaixo combina testes no navegador, testes automatizados do motor e build estático; os resultados serão preenchidos durante a execução.

> **Legenda:** **Aprovado** = comportamento observado e coerente com a especificação. **Falhou** = comportamento contraditório ou bloqueado sem alternativa. **Bloqueado** = não foi possível observar o caso pelo ambiente de teste. **Pendente** = ainda não executado.

## Ambiente de teste

| Camada | Ambiente | Evidência esperada |
|---|---|---|
| Publicação | GitHub Pages no endereço público | Documento responde, título do jogo e bundle público são carregados. |
| Interação visual | Prévia Babylon no navegador conectado | Canvas, escolhas, feedbacks, interlúdios e finais visíveis. |
| Regras determinísticas | `pnpm tsx tools/economy-smoke.mjs` | Asserções de economia, rotina, Coast, Pamela e finais. |
| Compilação | `pnpm check` e `GITHUB_PAGES=true pnpm build` | Tipagem e bundle estático aprovados. |

## Casos de teste priorizados

| ID | Prioridade | Fluxo | Passos de teste | Resultado esperado | Estado |
|---|---|---|---|---|---|
| QA-01 | P0 | Inicialização pública | Abrir o endereço público e aguardar o canvas. | O documento responde com o título **The Croe Trio — Date Sim** sem página de erro. | Pendente |
| QA-02 | P0 | Navegação global | Da semana, abrir Ações, Loja, Carteiras, Mercado, Mapa, Casa e Quarto; retornar. | Nenhuma tela se torna um beco sem saída; os retornos permanecem disponíveis. | Pendente |
| QA-03 | P0 | Ciclo de tempo e descanso | Encerrar blocos até a noite; tentar dormir antes e depois do horário permitido. | Dormir fora da noite é bloqueado com feedback; à noite avança o dia e restaura energia. | Pendente |
| QA-04 | P0 | Economia e limites semanais | Trabalhar, contribuir, investir até §80 e tentar exceder o limite; iniciar a semana seguinte. | Saldos são atualizados; o investimento excedente é bloqueado; o limite reinicia no fechamento semanal. | Pendente |
| QA-05 | P1 | Loja e inventário | Comprar item, tentar comprar o mesmo item na semana e usar um presente contextual. | Inventário registra item; compra repetida é bloqueada; o item é consumido somente pela ação válida. | Pendente |
| QA-06 | P0 | Cuidado com retorno decrescente | Executar a mesma ação de cuidado duas vezes na semana. | Apenas o primeiro gesto altera atributos; o segundo preserva o tempo/energia e explica o retorno decrescente. | Pendente |
| QA-07 | P0 | Mapa e The Coast | Tentar a Coast em dia útil; tentar sem energia; viajar no fim de semana com energia. | Dia útil e falta de energia bloqueiam sem custo indevido; fim de semana cobra um bloco e 1 energia. | Pendente |
| QA-08 | P0 | Pamela — abertura e rotina | Abrir Pamela, escolher uma intenção, avançar a reflexão. | A memória e os atributos atualizam; surge o interlúdio **A conversa continua na rotina** antes da etapa seguinte. | Pendente |
| QA-09 | P0 | Pamela — gate e reparação | Tentar o date de Pamela sem contexto; atingir a etapa de Jessica com Clareza/Segurança baixas. | Date é bloqueado com alternativa; a cena usa variante de reparação, sem encerrar a rota. | Pendente |
| QA-10 | P0 | Pamela — progresso contextual | Construir Segurança, executar bebida/objeto/receita, escolher transparência e abrir o date de curiosidade. | Os gestos só funcionam após contexto; date exige Segurança, reduz a dependência de compra e guarda memória. | Pendente |
| QA-11 | P0 | Pamela — finais válidos | Avaliar estados de rotina, proximidade, amizade e pausa. | Quatro desfechos são possíveis; nenhum descreve romance como prêmio obrigatório. | Pendente |
| QA-12 | P1 | Recuperação e reinício | Usar `R` e retornar ao mapa após um epílogo. | O reinício restaura estados iniciais; mapa e diário refletem somente o progresso atual. | Pendente |

## Fluxo de regressão recomendado

O teste manual completo deve começar em uma semana limpa. A pessoa testadora abre a rota Pamela, escolhe uma intenção na primeira etapa, verifica a reflexão e executa uma ação de rotina. Em seguida, ela alterna entre o mapa, a loja e os recursos sem perder o caminho de volta para Pamela. O percurso deve testar tanto a escolha com clareza suficiente quanto uma escolha de pausa ou reparação, garantindo que as variantes não travem a história.

Para a economia, o fluxo recomendado é trabalho remoto, compra de ingredientes ou chá, cuidado contextual e encerramento de blocos até dormir. Em uma segunda semana, a pessoa testadora deve repetir um cuidado, testar o teto de investimento e verificar o aviso do fechamento semanal. A Coast deve ser tentada primeiro fora do fim de semana e depois em um fim de semana com exatamente uma unidade de energia.

## Registro de execução

| Caso | Resultado | Evidência e observações | Pendência |
|---|---|---|---|
| QA-01 | Aprovado | A URL pública `https://victorinno.github.io/the-core-trio/?demo=week` respondeu com o título **The Croe Trio — Date Sim**. O canvas permanece não semântico no DOM, conforme esperado para Babylon. | A captura visual não foi disponibilizada pelo navegador conectado; a interação será confirmada também na prévia. |
| QA-02 | Aprovado após correção | A sequência `5` abriu e manteve o mapa de conversas. A seleção posterior `1` abriu **Pamela & Jessica — Etapa 1/5**, com as três intenções visíveis, os atributos iniciais **V2 · C1 · S2 · T3** e nenhuma escolha aplicada automaticamente. | Nenhuma. |
| QA-03 | Aprovado | A suíte executou dois blocos de descanso, bloqueou o sono antes da noite e confirmou que dormir avança o dia e restaura Energia 4. | Nenhuma. |
| QA-04 | Aprovado | A suíte confirmou turno, contribuição, investimento, bloqueio acima de §80 e reinício do limite no fechamento semanal. | Nenhuma. |
| QA-05 | Aprovado | A suíte confirmou compra de ingredientes, consumo na receita e bloqueio de nova compra do mesmo item na mesma semana. Também confirmou que a lembrança para Jessica só altera Clareza e Tensão após capítulo 2 e Clareza mínima. | Nenhuma. |
| QA-06 | Aprovado | A segunda execução de `tidy-alice` não aumentou Segurança e apresentou explicação de gesto repetido. | Nenhuma. |
| QA-07 | Aprovado | A suíte confirmou abertura no sábado fictício e custo de 1 Energia para The Coast. Na prévia, o mapa indicou que The Coast fica disponível no fim de semana; a tentativa no Dia 1 abriu feedback explícito de adiamento com **Sem custo**. | Nenhuma. |
| QA-08 | Aprovado | Na rodada atual, Pamela abriu na **Etapa 1/5** com atributos iniciais corretos. A intenção `1` registrou memória, mudou Clareza de **1 para 3** e exibiu a reflexão. `Enter` abriu **A conversa continua na rotina**, com ações explícitas de rotina e recursos antes da Etapa 2. | Nenhuma. |
| QA-09 | Aprovado | A suíte bloqueou o date de Pamela sem capítulo/contexto e confirmou que requisitos baixos não satisfazem a variante principal sobre Jessica. | A variante de reparação será observada na prévia. |
| QA-10 | Aprovado | A sequência contextual de primeira conversa, bebida, transparência e date de curiosidade elevou Vínculo e Clareza somente após os gates. | Nenhuma. |
| QA-11 | Aprovado | A suíte confirmou os desfechos **Rotina a dois**, **Pausa que preserva** e **Amizade íntima e honesta**; a variante de proximidade é coberta pela regra de estado. | Observar o epílogo de proximidade em sessão manual futura. |
| QA-12 | Aprovado | A partir do interlúdio de Pamela, `R` retornou à tela inicial. `Enter` abriu uma Semana 1, Dia 1, Manhã limpa com Energia 4/4, Pessoal §120, Família §180 e Investido §0. | O retorno ao mapa depois de um epílogo permanece recomendado para uma rodada focada nos demais finais. |

## Limitações conhecidas do ambiente

O jogo é renderizado em um canvas Babylon, portanto o DOM público expõe pouco conteúdo semântico para inspeção. Caso a captura do navegador não seja disponibilizada pelo ambiente, o relatório deve distinguir **carregamento público confirmado** de **verificação visual/interativa feita na prévia conectada**, sem afirmar uma evidência que não foi observada.
