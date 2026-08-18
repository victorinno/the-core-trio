# Baseline de Bundle — The Croe Trio

| Campo | Valor |
|---|---|
| Versão | 1.0 — pré-code-splitting |
| Data | 18 de agosto de 2026 |
| Comando | `GITHUB_PAGES=true pnpm build` |
| Resultado | Aprovado com advertência de chunk acima de 500 kB |

## Métricas registradas

| Métrica | Valor |
|---|---:|
| Bundle principal | `assets/index-DrmKkb7T.js` |
| Bundle principal — bruto | 1.378.095 bytes (1.378,10 kB) |
| Bundle principal — gzip | 355.004 bytes (aprox. 357,82 kB na saída Vite) |
| Arquivos em `assets/` | 23 |
| Total bruto de `assets/` | 1.579.774 bytes |
| Tempo de build | 19,43 s |

## Observações de QA

O build estático concluiu sem erro, mas emitiu a advertência padrão do Vite para chunks acima de 500 kB. Esta é a linha de base para BND-02 e BND-03: nenhuma alteração de configuração deve ser aceita apenas por ocultar a advertência. A redução deve ser observável no maior chunk e não pode piorar a primeira tela jogável, o foco do canvas, o descarte da cena ou o caminho-base do GitHub Pages.

## Critérios comparativos para os experimentos

| Indicador | Baseline | Aceitável após experimento |
|---|---:|---|
| Maior chunk bruto | 1.378.095 bytes | Menor que o baseline, com redução explicável. |
| Maior chunk gzip | 355.004 bytes | Menor que o baseline, sem adiar recursos críticos da Semana. |
| Build Pages | Aprovado | Continua aprovado. |
| Tipagem | Aprovada | Continua aprovada. |
| KBD-01 a KBD-09 | Ainda não automatizados | Todos aprovados antes de publicar code-splitting. |
