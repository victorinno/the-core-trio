# Execução da Automação Playwright — The Croe Trio

| Campo | Valor |
|---|---|
| Versão | 1.0 |
| Data | 18 de agosto de 2026 |
| Runner | Playwright Test 1.62.1, Chromium |
| Resultado inicial | **8 cenários aprovados em 27,2 segundos** |

## Uso recorrente

| Comando | Finalidade |
|---|---|
| `pnpm test:e2e` | Executa a suíte Chromium de forma headless. |
| `pnpm test:e2e:headed` | Executa a mesma suíte com o navegador visível para depuração. |
| `pnpm test:e2e:report` | Abre o relatório HTML da última execução. |
| `pnpm test` | Mantém os testes unitários do resolvedor de teclado. |
| `pnpm tsx tools/economy-smoke.mjs` | Mantém a validação determinística de economia e da rota Pamela. |

> A configuração usa o servidor local Vite e um `baseURL` único. O Playwright inicia o servidor quando necessário e reutiliza o servidor de desenvolvimento existente fora de CI, conforme a configuração recomendada pela documentação oficial.[1]

## Cobertura executada

| Especificação | Casos canônicos | Asserções principais | Resultado |
|---|---|---|---|
| `boot-and-navigation.spec.ts` | QA-01, QA-02, QA-12 | título, transição única por tecla, Semana → Conversas → Pamela, atalhos globais e reinício | Aprovado |
| `routine-and-economy.spec.ts` | QA-03 a QA-06 | gate de sono, recuperação de energia, teto de investimento, compra única e cuidado repetido | Aprovado |
| `world-map.spec.ts` | QA-07 | bloqueio de The Coast em dia útil e custo de tempo/energia no fim de semana | Aprovado |
| `pamela.spec.ts` | QA-08 a QA-11, PAM-EXP-01 | interlúdio, reparação, date contextual, quatro epílogos e Rotina a dois | Aprovado |

## Arquitetura de teste

O canvas Babylon continua sendo a superfície visual do jogo. Para evitar asserts frágeis sobre pixels ou elementos de GUI semânticos, os cenários enviam teclas reais para o jogo e leem uma fotografia de estado de `window.__CROE_TEST__`. Essa ponte só existe em desenvolvimento quando a URL contém `?e2e=1`, é removida no descarte do `GameWorld` e não é habilitada no build de produção.

Ela não replica regras de economia ou narrativa. Cada ação usa os métodos reais do motor; a ponte só prepara estados controlados onde o caso precisa começar em uma noite, fim de semana, capítulo ou atributo específico. O resultado mantém a causalidade do teste e reduz a duração da suíte.

## Manutenção

Ao introduzir uma nova tecla, tela, atividade ou gate narrativo, atualize primeiro `keyboardNavigation.ts` e seu teste unitário. Em seguida, acrescente ou ajuste o cenário Playwright correspondente e execute `pnpm test:e2e` antes do build. Em falhas, o Playwright retém trace, vídeo e captura; use `pnpm test:e2e:report` para inspecionar a execução sem depender de uma reprodução manual.

## Referências

[1]: https://playwright.dev/docs/test-webserver "Playwright — Web server"
[2]: https://playwright.dev/docs/intro "Playwright — Installation and test runner"
[3]: https://github.com/microsoft/playwright "Microsoft Playwright no GitHub"
