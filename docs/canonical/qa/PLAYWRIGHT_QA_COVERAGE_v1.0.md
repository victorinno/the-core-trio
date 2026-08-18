# Cobertura Playwright — The Croe Trio

| Campo | Valor |
|---|---|
| Versão | 1.0 |
| Escopo | Navegação no canvas Babylon, economia, mapa, Coast e rota Pamela |
| Ambiente | Servidor Vite local; ponte de testes disponível somente em desenvolvimento com `?e2e=1` |
| Fonte de verdade | `QA_TEST_PLAN_AND_EXECUTION_v1.0.md` e `QA_NEXT_STEPS_PLAN_v1.0.md` |

## Princípio de automação

O canvas Babylon não oferece uma árvore DOM semântica para locators. A suíte usará o teclado como entrada do jogador e consultará uma ponte de estado **somente de leitura por padrão**, habilitada exclusivamente durante desenvolvimento. Cenários que exigem uma semana, horário ou atributo específico poderão preparar o estado na ponte antes de executar a ação real que será verificada. A regra testada continua sendo executada pelo motor do jogo.

| Arquivo Playwright | Casos canônicos | Fluxo automatizado |
|---|---|---|
| `boot-and-navigation.spec.ts` | QA-01, QA-02, QA-12, KBD-01 a KBD-09 | Inicialização, Semana → Conversas → Pamela, mapa global, retornos e reinício. |
| `routine-and-economy.spec.ts` | QA-03, QA-04, QA-05, QA-06 | Sono por horário, semana seguinte, trabalho, teto de investimento, compra repetida e retorno decrescente. |
| `world-map.spec.ts` | QA-07 | Bloqueio de The Coast em dia útil/sem energia e viagem no fim de semana. |
| `pamela.spec.ts` | QA-08, QA-09, QA-10, QA-11, PAM-EXP-01 | Abertura, interlúdio, reparação, date contextual, quatro finais e caminho de Rotina a dois. |

## Critérios de aprovação

Cada cenário deve esperar a ponte do canvas, executar entradas do jogador e afirmar tanto o ecrã final quanto os recursos relevantes. Um teste falha se um atalho provocar duas transições, uma regra bloqueada consumir recursos, a rota avançar sem interlúdio ou o resultado narrativo divergir das métricas. Os testes devem ser executáveis por `pnpm test:e2e` e em modo visível por `pnpm test:e2e:headed`.

## Resultado inicial

Os quatro ficheiros de especificação foram executados no Chromium local com **8 de 8 cenários aprovados**. A suíte confirma os caminhos críticos sem exigir que o DOM do canvas exponha textos ou botões convencionais.
