# Governança de Documentação — The Croe Trio

## Objetivo

Esta convenção elimina ambiguidade entre card-fonte, rascunhos, revisões e documentos de design. Para cada nova implementação, a equipe deve primeiro abrir o índice canônico e então seguir a ordem de leitura indicada. Um documento de menor prioridade nunca substitui um fato do card-fonte ou uma regra aprovada no GDD atual.

## Estrutura de destino no repositório

```text
docs/
├── canonical/
│   ├── README.md                         # Índice e versão ativa do jogo
│   ├── game-map/
│   │   └── GAME_MAP_v1.0.md              # Lugares, transições e sistemas
│   └── pamela/
│       ├── CURRENT.md                    # Ponto único de entrada para Pamela
│       └── GDD_PAMELA_v1.1.md            # Especificação canônica da rota
├── reference/
│   └── pamela/
│       ├── PAMELA_SOURCE_CARDS_10.json   # Conjunto-fonte factual da personagem
│       ├── ALIGNMENT_REVIEW_v1.0.md      # Auditoria de aderência ao card
│       └── SYSTEMS_INTEGRATION_v1.0.md   # Detalhamento de integração de sistemas
└── archive/
    └── pamela/
        └── ROUTE_PLAN_v0.1.md            # Rascunho anterior, não autoritativo
```

## Ordem de precedência

| Prioridade | Tipo de documento | Papel | Regra de conflito |
|---:|---|---|---|
| **1** | Card-fonte da personagem | Estabelece identidade, relações, limites e fatos de Pamela. | Sempre vence sobre um rascunho narrativo. |
| **2** | `CURRENT.md` | Declara qual GDD está aprovado e como os documentos devem ser lidos. | Sempre é a entrada inicial de desenvolvimento. |
| **3** | GDD canônico versionado | Define mecânicas, cenas, progressão, economia e critérios de aceite. | Vence sobre planos anteriores. |
| **4** | Mapa canônico do jogo | Define locais, transições, gates e onde cada sistema opera. | Vence sobre anotações de interface dispersas. |
| **5** | Revisões e matrizes de referência | Explicam decisões, auditorias e detalhes de implementação. | Complementam o GDD; não o substituem. |
| **6** | Arquivo | Conserva contexto histórico. | Nunca deve ser implementado sem validação explícita. |

## Versionamento semântico de design

| Alteração | Incremento | Exemplo |
|---|---|---|
| Muda a identidade de uma personagem, o arco central ou a estrutura de rota. | **Major** | `v1.x` → `v2.0` |
| Acrescenta sistema, local, cena, integração ou caminho sem negar a versão atual. | **Minor** | `v1.0` → `v1.1` |
| Corrige linguagem, link, tabela ou cálculo sem mudar intenção de design. | **Patch** | `v1.1` → `v1.1.1` |

## Regra de uso para Pamela

1. Ler `docs/canonical/pamela/CURRENT.md`.
2. Ler `GDD_PAMELA_v1.1.md` como especificação de implementação.
3. Consultar `PAMELA_SOURCE_CARDS_10.json` quando houver dúvida sobre voz, comportamento, lealdade a Jessica ou atração pela pessoa jogadora.
4. Consultar `SYSTEMS_INTEGRATION_v1.0.md` quando a tarefa tocar rotina, energia, carteiras, loja, dates ou investimento.
5. Tratar `ROUTE_PLAN_v0.1.md` apenas como histórico; seus trechos de sobrecarga doméstica foram substituídos pela versão canônica.
