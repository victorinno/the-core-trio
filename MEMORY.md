# Memory

- O jogo é um visual novel de escolha, e não um simulador de movimentos ou física.
- A implementação será feita em canvas Babylon com GUI 2D, para manter o conteúdo do jogo num único ecrã e preservar a divisão React/engine.
- As imagens estão a ser geradas e devem ser referenciadas diretamente pelas URLs em `ASSETS.md`.
- A prioridade visual é a relação entre a luz quente do café e a noite azul, não o realismo fotográfico.
- A cena foi validada em desktop e em 375 × 812 px. O painel de diálogo mobile usa 700 px de altura para conter as três escolhas sem corte.
- `pnpm check` e `pnpm build` concluíram com êxito. A compilação avisa apenas que o pacote Babylon resulta num chunk de produção grande; não há falhas de tipo ou build.

## The Croe Trio — recursos confirmados

- O cenário atualizado apresenta o núcleo romântico Pamela–Jessica–Pessoa Jogadora, com Alice e Adam como tensão de reparação emocional e rotas complementares para Elise, Raven e Saskia.
- `pamela_1k.png` é um retrato quadrado de ilustração anime, com cabelo castanho muito encaracolado, luz dourada de interior e expressão acolhedora; encaixa no tom de cuidado e intimidade do apartamento.
- `jessica_1k.png` é um retrato quadrado de ilustração anime, com cabelo ruivo longo, olhos verdes e acessórios dourados; a paleta quente e o olhar direto reforçam a energia extrovertida e protetora da personagem.
- `elise_1k.png` é um retrato quadrado de ilustração anime, com cabelo castanho ondulado, olhos avelã e luz suave de café; apresenta uma linguagem visual delicada e serena para uma rota de reconhecimento sem pressão.
- `raven_1k.png` é um retrato quadrado de ilustração anime, com cabelo preto de reflexos púrpura e vermelhos, maquilhagem gótica, piercings e luz néon violeta; fornece um contraponto noturno mais intenso para uma rota que pede autonomia e clareza.
- A adaptação The Croe Trio usa cinco rotas de conversa: Pamela & Jessica, Alice & Adam, Elise, Raven e Saskia. As escolhas apresentam intenções — escutar, perguntar, ser honesto e dar espaço — e não uma mecânica de posse.
- As artes do utilizador foram copiadas para `/home/ubuntu/webdev-static-assets/croe-trio/` e publicadas em URLs de armazenamento do projeto. A abertura usa os retratos de Pamela e Jessica, enquanto cada rota liga os restantes retratos ao respetivo arco.
- A composição foi verificada em desktop e numa cena narrativa mobile. `pnpm check` e `pnpm build` concluíram com êxito após a adaptação.

## Mecânicas relacionais

- Cada rota mantém quatro valores independentes: vínculo, clareza, segurança e tensão. Uma escolha aplica efeitos explicitamente definidos e acrescenta uma memória ao diário da rota.
- As cinco rotas possuem três capítulos: notar, responder e escolher. O mapa de conversas mostra o capítulo ativo, o estado relacional e a última memória de cada rota.
- O epílogo usa segurança, clareza, vínculo e tensão para escolher entre aproximação, ritmo partilhado, continuação aberta ou pausa respeitosa. Não existe uma resposta universalmente correta.
- A reflexão da escolha foi validada em desktop e mobile. `pnpm check` e `pnpm build` concluíram com êxito após a implementação do sistema.

## Economia relacional e rotina

- O quadro semanal usa três blocos por dia — manhã, tarde e noite —, quatro pontos de energia e uma carteira pessoal inicial de §120. Trabalho, cuidado, dates, presentes e descanso avançam o bloco de tempo.
- O fundo da família inicia em §180 e recebe contribuições voluntárias; não pode comprar recompensa individual. A carteira pessoal custeia presentes, dates, ingredientes e o Crescent Market.
- As ações de cuidado criam memórias e aplicam efeitos às rotas existentes. Dates exigem segurança mínima; presentes requerem o item certo e não contornam uma relação em pausa.
- O Crescent Market é uma simulação inteiramente fictícia, limitada a §80 por semana; os perfis Reserva Nocturna, Círculo de Bairro e Palco Violeta não usam dados de mercado reais.
- O teste `tools/economy-smoke.mjs` valida compra, cuidado, trabalho, contribuição, investimento e resgate. A verificação de tipos e a compilação de produção concluíram com êxito.
