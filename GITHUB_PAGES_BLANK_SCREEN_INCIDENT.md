# Incidente de publicação — GitHub Pages em branco

| Campo | Estado inicial |
|---|---|
| URL | `https://victorinno.github.io/the-core-trio/` |
| Data | 18 de agosto de 2026 |
| Resposta HTTP/documento | O título **The Croe Trio — Date Sim** foi carregado. |
| Sintoma | O navegador conectado não encontrou elementos interativos nem conteúdo visível do canvas. |
| Causas confirmadas | O build adotava `the-croe-trio` como base padrão, mas a URL e o repositório publicados usam `the-core-trio`. Além disso, o build direto não ativava a rota de `game-assets`, fazendo retratos e cenário permanecerem em `/manus-storage/`, indisponível no GitHub Pages. |

O diagnóstico confirmou que o HTML publicado carregava, porém pedia `assets/index-*.js` e `assets/index-*.css` em `/the-croe-trio/`. Depois da correção da base, o canvas montou, mas os recursos visuais ainda retornaram 404 porque continuavam apontando para `/manus-storage/`. A correção final usa a base do build como fonte da rota de assets e o empacotador canônico, que copia a arte para `game-assets/`.

## Verificação de recuperação

O diagnóstico automatizado pós-publicação confirmou um canvas montado, sem erros de página, sem erros de console e sem respostas 404. No navegador conectado, a primeira captura mostrou somente o campo noturno durante a inicialização do WebGL; na atualização seguinte, a tela inicial ficou visível com o penthouse, Pamela, Jessica, título e botão de início. A recuperação da publicação foi confirmada.
