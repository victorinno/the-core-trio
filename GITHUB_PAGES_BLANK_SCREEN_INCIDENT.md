# Incidente de publicação — GitHub Pages em branco

| Campo | Estado inicial |
|---|---|
| URL | `https://victorinno.github.io/the-core-trio/` |
| Data | 18 de agosto de 2026 |
| Resposta HTTP/documento | O título **The Croe Trio — Date Sim** foi carregado. |
| Sintoma | O navegador conectado não encontrou elementos interativos nem conteúdo visível do canvas. |
| Causa confirmada | O build adotava `the-croe-trio` como base padrão, mas a URL e o repositório publicados usam `the-core-trio`. Scripts e estilos foram solicitados na pasta errada e retornaram 404 no navegador. |

O diagnóstico confirmou que o HTML publicado carregava, porém pedia `assets/index-*.js` e `assets/index-*.css` em `/the-croe-trio/`. A correção altera a base padrão para `/the-core-trio/`; o bundle será reconstruído, publicado e testado novamente antes do encerramento.
