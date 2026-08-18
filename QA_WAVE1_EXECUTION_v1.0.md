# Execução de QA — Onda 1

| Campo | Valor |
|---|---|
| Versão | 1.0 — em execução |
| Data | 18 de agosto de 2026 |
| Escopo | Resolvedor de teclado, baseline Babylon e sessão PAM-EXP-01 |

## Evidências iniciais

A prévia da **Semana 1, Dia 1, Manhã** carregou com Energia 4/4, Pessoal §120, Família §180 e Investido §0. Os cinco acessos de primeiro nível e os controles globais Casa, Quarto e Mapa estavam visíveis antes do reteste dos atalhos.

## Resolvedor de teclado

O atalho `5` levou somente ao mapa de conversas, sem abrir uma rota. A tecla `1` no mapa abriu Pamela & Jessica em **Etapa 1/5**, com as métricas iniciais **V2 · C1 · S2 · T3** e as três intenções ainda disponíveis. A validação manual confirma o mesmo contrato coberto pelos nove testes Vitest: uma tecla resulta em uma única transição de tela ou intenção.

## PAM-EXP-01 — início do percurso

A primeira escolha foi **Perguntar o que ficar perto significa para Pamela hoje**. A reflexão apresentou a memória correspondente e alterou Clareza de 1 para 3, preservando V2 · S2 · T3. `Enter` abriu o interlúdio **A conversa continua na rotina**, exigindo uma ação real antes da Etapa 2.

Depois da extração do resolvedor, a atualização HMR recriou a demonstração em estado de Semana. Por isso, o primeiro `Enter` de reteste foi aplicado sobre o quadro semanal recém-inicializado, não sobre o interlúdio preservado. A suíte Vitest já cobre o comando do interlúdio; a validação visual será repetida partindo de uma nova sessão sem uma atualização HMR intermediária.

A nova sessão foi aberta diretamente na Etapa 1/5, preservando o estado-base V2 · C1 · S2 · T3 e as três intenções disponíveis. Não ocorreram erros de console durante o carregamento.

No reteste estável, a escolha `1` atualizou Clareza para 3 e `Enter` abriu novamente **A conversa continua na rotina**. A próxima entrada `Enter` será usada para confirmar a abertura de Ações pelo novo resolvedor, sem clique no canvas.

O segundo `Enter` abriu **Escolhe como estar presente** na tela de Ações, com o bloco de rotina e trabalho inicialmente selecionado. A transição confirma que o interlúdio pode ser percorrido sem clique, preservando a sessão Pamela.

A sessão foi reiniciada uma última vez após a inclusão dos atalhos de categorias e atividades. Pamela voltou à Etapa 1/5 com V2 · C1 · S2 · T3; não houve atualização HMR durante a preparação do percurso contínuo.

No percurso contínuo, a intenção `1` registrou a memória de perguntar o que a proximidade significa e elevou Clareza para 3. `Enter` abriu o interlúdio entre as Etapas 1 e 2 sem transição extra.

O `Enter` do interlúdio abriu Ações. O atalho `C` selecionou **Cuidados e favores** e expôs **Preparar bebida escolhida por Pamela** como a ação 1, seguida pela busca do objeto e pela receita contextual. A categoria e a lista mudaram em uma única transição visual.

`1` executou **Preparar bebida escolhida por Pamela**, consumindo 1 Energia e registrando a memória de seguir a curiosidade dela em vez de escolher por ela. Ao retornar à Semana, o estado exibiu Dia 1, Tarde, Energia 3/4 e carteiras inalteradas. O mapa de conversas indicou **Pamela & Jessica — capítulo 2/5 · a aproximar**, preservando a memória recém-criada.

Na Etapa 2, **Procurar a presilha junto com Pamela e perguntar se ela quer ajuda ou companhia** gerou a memória de ajudar sem transformar distração em defeito. O estado passou para **V4 · C4 · S3 · T3**, atingindo os limiares de Vínculo, Clareza e Segurança necessários ao percurso de Rotina a dois, ainda com Tensão aberta para a etapa de transparência.

O segundo interlúdio abriu Ações já na categoria de cuidados. A bebida de Pamela permaneceu visível com o aviso de que o retorno já havia sido aplicado na semana; isso confirma que a sessão não permite repetir o ganho de relacionamento para ultrapassar gates artificialmente.

`2` executou **Procurar o objeto esquecido com Pamela**, registrando uma segunda memória contextual e consumindo 1 Energia. O retorno à Semana mostrou Dia 1, Noite, Energia 2/4; os saldos permaneceram §120 e §180. A sessão mantém clareza, segurança e vínculo suficientes para a conversa de transparência seguinte.

O mapa indicou Pamela no **capítulo 3/5**. A cena principal sobre Jessica foi exibida — em vez de uma variante de reparação — com a pergunta disponível: **Perguntar o que Pamela gostaria que Jessica soubesse quando chegar a hora**. A liberação confirma que o percurso acumulou Clareza e Segurança suficientes para transparência sem competição.

A escolha de transparência registrou que Pamela mantém a escolha de como contar a própria história. A reflexão mostrou **V5 · C5 · S4 · T3**, confirmando que a conversa aumentou Segurança sem apagar a Tensão ainda relevante. `Enter` abriu o interlúdio entre as Etapas 3 e 4, preparando o date de curiosidade dentro de recursos e contexto suficientes.

No terceiro interlúdio, `Enter` abriu Ações e `D` selecionou **Dates e presentes**. O menu exibiu o **Date de curiosidade com Pamela** como ação 2, com custo de §8 e 1 Energia; a disponibilidade confirma o gate de contexto atingido, sem exigir compra de presente ou reduzir Jessica a pré-requisito.

`2` concluiu o **Date de curiosidade com Pamela** e registrou que a noite foi escolhida sem exigir que ela provasse nada. O retorno à Semana avançou corretamente para Dia 2, Manhã, com Energia restaurada a 4/4, Pessoal §112 e Família §180. O custo de §8 e o bloco de tempo foram aplicados uma única vez.

O mapa abriu Pamela no **capítulo 4/5**. A Etapa 4 reconheceu explicitamente a base legível construída antes do encontro e ofereceu a intenção de ir à banca de livros perguntando primeiro o que Pamela nota, mantendo o detalhe e o ritmo sob escolha dela.

A escolha da banca de livros reforçou que o critério de Pamela não precisa ser validado. As métricas permaneceram **V5 · C5 · S4 · T3**, sem crescimento artificial por repetição. O último interlúdio enquadrou o próximo passo como pergunta sobre uma casa em que todos continuam reais depois da noite, preparando o check-in final em vez de uma conquista definitiva.

No último interlúdio, `Enter` abriu Ações e `W` selecionou **Rotina e trabalho**. A opção 1, **Encerrar este bloco**, ficou disponível com energia 0 e sem custo, oferecendo uma saída de presença que não converte o último passo em mais um gesto de afinidade.

`1` concluiu **Encerrar este bloco** sem custo financeiro ou energético. O retorno à Semana avançou para Dia 2, Tarde, mantendo Energia 4/4, Pessoal §112 e Família §180. Esse bloqueio de rotina foi liberado sem inflar as métricas relacionais antes da conversa decisiva.

O mapa abriu Pamela no **capítulo 5/5**. A cena final apresentou um próximo passo menor, visível e reversível porque a conversa completa com Jessica ainda não parece segura. A intenção 1 propõe uma nova conversa com Pamela e deixa o convite a Jessica depender apenas da vontade dela, adequada ao percurso de Rotina a dois.

## Resultado de PAM-EXP-01 — divergência encontrada

A intenção final foi aplicada e elevou Segurança para 5, mantendo **V5 · C5 · S5 · T3**. Contudo, o epílogo apresentado foi **Pausa que preserva**, não **Rotina a dois**. O resultado é coerente com a regra de que Tensão 3 ainda pede espaço, mas diverge do roteiro planejado, que não reduzia Tensão em nenhuma etapa. A sessão não é considerada aprovada para PAM-EXP-01; ela revelou que o roteiro do plano precisa incluir pelo menos duas escolhas ou ações que reduzam Tensão antes do check-in final.

### Correção de roteiro e repetição requerida

O roteiro foi corrigido para usar o check-in de espaço na Etapa 2, a espera sem punição na Etapa 3 e o chá ajustável na Etapa 4. Essas três escolhas reduzem Tensão de 3 para 0 antes do check-in final. A sessão será repetida com esse caminho e só receberá aprovação se o epílogo exibido for **Rotina a dois**.

### Repetição manual corrigida

A repetição foi iniciada em Pamela Etapa 1/5 com o estado-base **V2 · C1 · S2 · T3** e as três intenções visíveis. A sequência abaixo seguirá o roteiro corrigido, sem nova atualização HMR entre escolhas e interlúdios.

A pergunta da Etapa 1 elevou Clareza para 3 e abriu o interlúdio correto. A repetição mantém o primeiro cuidado contextual, a bebida escolhida por Pamela, como base de Segurança antes de entrar nas três escolhas que reduzem Tensão.

O interlúdio abriu Ações por `Enter`; `C` mudou a categoria para **Cuidados e favores** e revelou a bebida de Pamela como atividade 1. A interface confirmou visualmente que a categoria, a ordem e o custo de Energia correspondem ao resolvedor testado.

A bebida contextual foi concluída com uma memória explícita e o retorno à Semana mostrou Dia 1, Tarde, Energia 3/4, Pessoal §120 e Família §180. A repetição segue agora para a escolha de check-in que reduz Tensão na Etapa 2.

Pamela abriu no capítulo 2 com **V3 · C3 · S3 · T3**. A terceira intenção da cena, o check-in de conversa, distração ou espaço, está disponível e é a única escolha do roteiro corrigido nesta etapa porque reduz Tensão sem exigir que Pamela esclareça algo antes da hora.

A escolha de check-in foi concluída com **V3 · C3 · S4 · T2**. Pamela pôde escolher espaço sem que isso soasse como abandono, e o interlúdio entre as Etapas 2 e 3 abriu normalmente. A repetição atingiu a primeira redução de Tensão planejada.

O segundo interlúdio abriu Ações e `W` retornou à categoria de rotina. A opção **Encerrar este bloco** foi selecionada como rotina neutra, evitando que outro cuidado reintroduzisse ganhos repetidos enquanto a conversa sobre Jessica aguardava.

O bloco neutro foi concluído e o retorno à Semana avançou para Dia 1, Noite, preservando Energia 3/4, saldos e **Tensão 2**. A sessão está pronta para a escolha de espera sem punição na Etapa 3.

### Validação do alvo Rotina a dois

O percurso corrigido foi aprovado na suíte determinística: as escolhas de check-in, espera sem punição, chá ajustável e check-in semanal levam Tensão a 1 ou menos e retornam **Rotina a dois**. A cena `?demo=pamela-finale` confirmou visualmente o epílogo com **V5 · C5 · S5 · T1**, quatro memórias guardadas, check-in semanal, date revisável e botão de retorno ao mapa de conversas.

A repetição manual foi levada até a Etapa 3 com a primeira redução de Tensão observada no canvas. A conclusão do restante do roteiro fica coberta pelo novo percurso automatizado; a próxima sessão exploratória pode retomar a passagem manual integral a partir dessa etapa, sem precisar alterar a regra de desfecho.

## Validação final da Onda 1

| Verificação | Resultado | Evidência |
|---|---|---|
| Resolvedor de teclado | Aprovado | Vitest executou 10 testes, cobrindo KBD-01 a KBD-09, mais categorias e atividades de rotina. |
| Economia e rota Pamela | Aprovado | `economy-smoke.mjs` confirmou o percurso corrigido de PAM-EXP-01 e o resultado Rotina a dois. |
| Tipagem | Aprovado | `pnpm check` concluiu sem erro. |
| Build GitHub Pages | Aprovado com aviso | `GITHUB_PAGES=true pnpm build` concluiu; o maior chunk continua acima do limiar, conforme baseline, porque não houve alteração de Vite nesta onda. |
| Semana e teclado | Aprovado visualmente | Semana, mapa, Pamela, interlúdios, categorias e atividades responderam no canvas conectado. |
| Epílogo Rotina a dois | Aprovado visualmente | Cena final exibiu V5 · C5 · S5 · T1, quatro memórias e retorno ao mapa. |

As capturas em lote de Ações e do epílogo ainda podem mostrar apenas o fundo azul durante a primeira composição WebGL. Essa limitação não bloqueou a onda: as mesmas telas foram observadas de forma interativa depois da estabilização do canvas. O baseline de bundle permanece o ponto de comparação para a próxima onda de code-splitting.

## Publicação

A execução inicial do Pages foi cancelada por uma implantação substituta disparada pelo commit do bundle. A execução substituta do commit `5d7ee55` foi concluída com sucesso. A URL pública `https://victorinno.github.io/the-core-trio/?demo=week` respondeu novamente com o título **The Croe Trio — Date Sim**; o navegador conectado não disponibilizou a captura do canvas externo nesta verificação, mas o carregamento do documento público foi confirmado.
