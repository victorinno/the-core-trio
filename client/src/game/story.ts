/**
 * STYLE — Each Croe Trio route has three chapters and multiple valid relational outcomes; no dialogue is a universal “win”.
 */
import type { PortraitKey } from "./assets";
import type { RelationshipEffect, RelationshipMetrics } from "./relationship";

export type RouteId = "trio" | "alice" | "elise" | "raven" | "saskia";
export type Intention = "Escutar" | "Perguntar" | "Ser honesto" | "Dar espaço";

export interface StoryChoice {
  id: string;
  text: string;
  intention: Intention;
  effect: RelationshipEffect;
  response: string;
}

export interface RouteRequirement {
  minimum?: Partial<RelationshipMetrics>;
  maximum?: Partial<RelationshipMetrics>;
}

export interface BeatVariant {
  title?: string;
  location?: string;
  line: string;
  choices: StoryChoice[];
  requirement?: RouteRequirement;
}

export interface ConversationBeat {
  title: string;
  location: string;
  line: string;
  choices: StoryChoice[];
  variants?: BeatVariant[];
  fallback?: BeatVariant;
  interlude?: string;
}

export interface RouteOutcome {
  title: string;
  line: string;
  detail: string;
}

export interface NarrativeRoute {
  id: RouteId;
  people: string;
  chapter: string;
  accent: string;
  portraits: PortraitKey[];
  beats: ConversationBeat[];
  outcome?: (metrics: RelationshipMetrics) => RouteOutcome;
}

export const OPENING_LINE =
  "07:12. A cidade ainda está azul através das janelas do penthouse. Há espaço — mas nenhum lugar é neutro quando tanta coisa ficou por dizer.";

const choice = (
  id: string,
  intention: Intention,
  text: string,
  effect: RelationshipEffect,
  response: string,
): StoryChoice => ({ id, intention, text, effect, response });

export function meetsRouteRequirement(metrics: RelationshipMetrics, requirement?: RouteRequirement) {
  if (!requirement) return true;
  const minimumMet = Object.entries(requirement.minimum ?? {}).every(([metric, value]) => metrics[metric as keyof RelationshipMetrics] >= (value ?? 0));
  const maximumMet = Object.entries(requirement.maximum ?? {}).every(([metric, value]) => metrics[metric as keyof RelationshipMetrics] <= (value ?? 5));
  return minimumMet && maximumMet;
}

const pamelaOutcome = (metrics: RelationshipMetrics): RouteOutcome => {
  if (metrics.tension >= 3 || metrics.safety <= 2) {
    return {
      title: "Pausa que preserva",
      line: "Pamela pede espaço com uma data para voltar à conversa. Ninguém some; o cuidado passa a ser não forçar uma definição antes da hora.",
      detail: "Vocês escolheram espaço antes que o silêncio virasse ferida.",
    };
  }
  if (metrics.bond >= 4 && metrics.clarity >= 4 && metrics.safety >= 4 && metrics.tension <= 1) {
    return {
      title: "Rotina a dois",
      line: "Pamela propõe um check-in semanal, um date revisável e a liberdade de ajustar os dois. A proximidade deixa de parecer uma promessa fechada.",
      detail: "Vocês construíram espaço para a conexão mudar sem desabar.",
    };
  }
  if (metrics.bond >= 3 && metrics.clarity >= 3 && metrics.safety >= 4) {
    return {
      title: "Proximidade escolhida",
      line: "Pamela escolhe o próximo encontro e deixa a transparência com Jessica fazer parte do caminho, não uma conversa escondida depois dele.",
      detail: "Vocês continuaram sem exigir que o futuro se explicasse inteiro.",
    };
  }
  return {
    title: "Amizade íntima e honesta",
    line: "Pamela preserva carinho e presença sem declarar um romance antes da hora. O vínculo continua possível porque nenhum gesto precisou virar dívida.",
    detail: "Vocês preservaram cuidado sem transformá-lo em obrigação.",
  };
};

export const ROUTES: Record<RouteId, NarrativeRoute> = {
  trio: {
    id: "trio",
    people: "Pamela & Jessica",
    chapter: "A GEOMETRIA DO CALOR",
    accent: "#D69468",
    portraits: ["pamela", "jessica"],
    outcome: pamelaOutcome,
    beats: [
      {
        title: "A camiseta emprestada",
        location: "QUARTO DE PAMELA · MANHÃ",
        line:
          "Pamela devolve uma camiseta que usou “só porque o cheiro lembrava você”. Ela percebe que ficou segurando o tecido tempo demais, sorri sem se esconder e pergunta se pode ficar perto por alguns minutos.",
        choices: [
          choice("pamela-0-meaning", "Perguntar", "Perguntar o que ficar perto significa para Pamela hoje.", { clarity: 2, memory: "Você perguntou o que ‘perto’ significava para Pamela hoje." }, "Pamela pensa antes de responder. “Obrigada por não fazer parecer que eu devia saber tudo já.”"),
          choice("pamela-0-limit", "Ser honesto", "Dizer que gosto dela perto, desde que possamos dizer quando alguma coisa mudar.", { bond: 1, safety: 1, memory: "Você deixou Pamela aproximar-se sem transformar o gesto em obrigação." }, "Pamela encosta o ombro no seu e pergunta se pode ficar assim por alguns minutos."),
          choice("pamela-0-jessica", "Escutar", "Reconhecer que não quer que essa aproximação machuque ou apague Jessica.", { clarity: 1, tension: 1, memory: "Você falou de Jessica sem fingir que a conversa era simples." }, "Pamela concorda devagar. “Ela não é um problema que a gente precisa contornar. É parte da minha vida.”"),
        ],
        interlude: "Pamela deixa a camiseta dobrada na cadeira. Um bloco de rotina dá espaço para a pergunta continuar existindo antes da próxima conversa.",
      },
      {
        title: "Coisas que Pamela esquece",
        location: "COZINHA DO PENTHOUSE · TARDE",
        line:
          "Pamela esqueceu uma presilha, deixou o chá esfriar e, entre procurar os dois, pergunta como você escolhe um perfume ou uma música. Ela ri da própria distração, mas espera para saber se você vai tentar consertá-la ou acompanhá-la.",
        choices: [
          choice("pamela-1-clip", "Escutar", "Procurar a presilha junto com Pamela e perguntar se ela quer ajuda ou companhia.", { bond: 1, clarity: 1, memory: "Você ajudou Pamela sem transformar distração em defeito." }, "Ela aponta para o sofá, depois muda de ideia e ri. “Companhia. A ajuda pode vir depois.”"),
          choice("pamela-1-tea", "Perguntar", "Deixar que Pamela escolha o aroma e a temperatura de uma nova bebida.", { bond: 1, safety: 1, memory: "Você seguiu a curiosidade de Pamela em vez de escolher por ela." }, "Pamela fecha os olhos para sentir o cheiro. “Isso parece pequeno, mas é exatamente o tipo de escolha que eu queria poder fazer.”"),
          choice("pamela-1-checkin", "Dar espaço", "Enviar um check-in: conversa, distração ou espaço — o que ela preferir.", { safety: 1, tension: -1, memory: "Você deixou Pamela escolher se queria conversa, distração ou espaço." }, "A resposta chega mais tarde: “Espaço agora. Mas obrigada por perguntar de um jeito que não soa como abandono.”"),
        ],
        interlude: "A pergunta importante fica entre vocês: Pamela quer saber se pode falar de Jessica sem fazer parecer que está deixando alguém para trás.",
      },
      {
        title: "O lugar seguro de Jessica",
        location: "VARANDA DO PENTHOUSE · NOITE",
        line:
          "Pamela fala de Jessica como história, quarto, infância e lugar seguro. A atração nova não diminui isso; o medo é que ela vire segredo ou competição antes de encontrar linguagem para existir.",
        choices: [
          choice("pamela-2-agency", "Perguntar", "Perguntar o que Pamela gostaria que Jessica soubesse quando chegar a hora.", { clarity: 2, safety: 1, memory: "Você devolveu a Pamela a escolha de como contar a própria história." }, "Pamela respira, aliviada. “Eu queria escolher as palavras antes de alguém escolher por mim.”"),
          choice("pamela-2-wait", "Dar espaço", "Dizer que vocês podem esperar até ela saber o que quer dizer, sem punição por isso.", { safety: 2, tension: -1, memory: "Você deixou o tempo de Pamela existir sem punição." }, "Pamela encosta na grade da varanda. “Esperar é diferente de esconder. Obrigada por saber a diferença.”"),
          choice("pamela-2-jessica-gift", "Ser honesto", "Oferecer companhia se Pamela quiser escolher uma lembrança simples para Jessica.", { bond: 1, clarity: 1, memory: "Você reconheceu que o carinho de Pamela por Jessica continua sendo parte da sua vida." }, "Pamela sorri com os olhos molhados. “Eu gosto que você tenha dito companhia, não autorização.”"),
        ],
        variants: [
          {
            requirement: { minimum: { clarity: 2 }, maximum: { tension: 3 } },
            line: "Pamela fala de Jessica como história, quarto, infância e lugar seguro. A atração nova não diminui isso; o medo é que ela vire segredo ou competição antes de encontrar linguagem para existir.",
            choices: [
              choice("pamela-2-agency-clear", "Perguntar", "Perguntar o que Pamela gostaria que Jessica soubesse quando chegar a hora.", { clarity: 2, safety: 1, memory: "Você devolveu a Pamela a escolha de como contar a própria história." }, "Pamela respira, aliviada. “Eu queria escolher as palavras antes de alguém escolher por mim.”"),
              choice("pamela-2-wait-clear", "Dar espaço", "Dizer que vocês podem esperar até ela saber o que quer dizer, sem punição por isso.", { safety: 2, tension: -1, memory: "Você deixou o tempo de Pamela existir sem punição." }, "Pamela encosta na grade da varanda. “Esperar é diferente de esconder. Obrigada por saber a diferença.”"),
              choice("pamela-2-jessica-clear", "Ser honesto", "Oferecer companhia se Pamela quiser escolher uma lembrança simples para Jessica.", { bond: 1, clarity: 1, memory: "Você reconheceu que o carinho de Pamela por Jessica continua sendo parte da sua vida." }, "Pamela sorri com os olhos molhados. “Eu gosto que você tenha dito companhia, não autorização.”"),
            ],
          },
          {
            requirement: { minimum: { safety: 3 }, maximum: { tension: 3 } },
            line: "Pamela confia que você pode ouvir uma coisa difícil: Jessica é história, quarto, infância e lugar seguro. A atração nova não diminui isso; ela só precisa de um modo honesto de existir.",
            choices: [
              choice("pamela-2-agency-safe", "Perguntar", "Perguntar o que Pamela gostaria que Jessica soubesse quando chegar a hora.", { clarity: 2, safety: 1, memory: "Você devolveu a Pamela a escolha de como contar a própria história." }, "Pamela respira, aliviada. “Eu queria escolher as palavras antes de alguém escolher por mim.”"),
              choice("pamela-2-wait-safe", "Dar espaço", "Dizer que vocês podem esperar até ela saber o que quer dizer, sem punição por isso.", { safety: 2, tension: -1, memory: "Você deixou o tempo de Pamela existir sem punição." }, "Pamela encosta na grade da varanda. “Esperar é diferente de esconder. Obrigada por saber a diferença.”"),
              choice("pamela-2-jessica-safe", "Ser honesto", "Oferecer companhia se Pamela quiser escolher uma lembrança simples para Jessica.", { bond: 1, clarity: 1, memory: "Você reconheceu que o carinho de Pamela por Jessica continua sendo parte da sua vida." }, "Pamela sorri com os olhos molhados. “Eu gosto que você tenha dito companhia, não autorização.”"),
            ],
          },
        ],
        fallback: {
          title: "Uma conversa antes da conversa",
          line: "Pamela olha para as luzes da cidade e admite que, agora, falar sobre Jessica parece rápido demais. O gesto mais honesto é reparar a tensão antes de pedir uma definição.",
          choices: [
            choice("pamela-2-repair-listen", "Escutar", "Dizer que você não precisa entender tudo agora; pode só ficar e ouvir.", { safety: 1, tension: -1, memory: "Você ofereceu escuta antes de pedir uma definição sobre Jessica." }, "Pamela deixa o silêncio durar um pouco. “Obrigada por não usar a minha hesitação como problema seu.”"),
            choice("pamela-2-repair-apology", "Ser honesto", "Reconhecer que uma pressa sua tornou a conversa mais pesada.", { clarity: 1, safety: 1, tension: -1, memory: "Você nomeou a pressa antes que ela virasse silêncio." }, "Pamela aceita o pedido de desculpa sem torná-lo uma cena de perdão instantâneo."),
            choice("pamela-2-repair-pause", "Dar espaço", "Marcar uma nova conversa com hora definida e deixar Pamela escolher se quer falar dela.", { safety: 2, tension: -1, memory: "Você marcou uma conversa futura sem exigir que Pamela a preenchesse agora." }, "“Assim eu consigo voltar”, Pamela diz. “Não porque devo, mas porque sei onde a porta está.”"),
          ],
        },
        interlude: "A casa continua existindo entre uma conversa e outra. Um bloco de rotina pode abrir espaço para que a transparência seja um gesto, não apenas uma fala.",
      },
      {
        title: "Um date de curiosidade",
        location: "DOWNTOWN · NOITE",
        line: "Com a base entre vocês mais legível, Pamela aceita um encontro simples. Ela escolhe o detalhe: a textura de uma capa de livro, uma fruta na feira ou a hora de voltar para casa.",
        choices: [
          choice("pamela-3-books", "Perguntar", "Ir à banca de livros e perguntar o que ela repara antes de escolher um título.", { bond: 1, clarity: 1, memory: "Vocês escolheram uma noite sem pedir que ela provasse nada." }, "Pamela escolhe um livro pelo papel. Depois ri: “Eu não sei se isso é um bom critério.” Você responde que não precisa ser.”"),
          choice("pamela-3-coast", "Escutar", "Propor uma caminhada curta e deixar Pamela escolher o caminho e a hora de voltar.", { bond: 1, safety: 1, memory: "Você deixou Pamela escolher o ritmo de uma caminhada de curiosidade." }, "Pamela aponta a rua menos iluminada, mas pergunta antes se você prefere outra. A decisão pequena vira uma prática de atenção."),
          choice("pamela-3-tea", "Dar espaço", "Ficar no penthouse para chá, música e uma distância que Pamela possa ajustar.", { safety: 1, tension: -1, memory: "Você deixou a intimidade continuar válida sem transformar a saída em obrigação." }, "Pamela escolhe uma música baixa. “Uma noite bonita não responde a casa inteira”, ela lembra. Você concorda e permanece."),
        ],
        variants: [
          {
            requirement: { minimum: { bond: 3, clarity: 3, safety: 3 }, maximum: { tension: 3 } },
            line: "Com a base entre vocês mais legível, Pamela aceita um encontro simples. Ela escolhe o detalhe: a textura de uma capa de livro, uma fruta na feira ou a hora de voltar para casa.",
            choices: [
              choice("pamela-3-books-open", "Perguntar", "Ir à banca de livros e perguntar o que ela repara antes de escolher um título.", { bond: 1, clarity: 1, memory: "Vocês escolheram uma noite sem pedir que ela provasse nada." }, "Pamela escolhe um livro pelo papel. Depois ri: “Eu não sei se isso é um bom critério.” Você responde que não precisa ser.”"),
              choice("pamela-3-coast-open", "Escutar", "Propor uma caminhada curta e deixar Pamela escolher o caminho e a hora de voltar.", { bond: 1, safety: 1, memory: "Você deixou Pamela escolher o ritmo de uma caminhada de curiosidade." }, "Pamela aponta a rua menos iluminada, mas pergunta antes se você prefere outra. A decisão pequena vira uma prática de atenção."),
              choice("pamela-3-tea-open", "Dar espaço", "Ficar no penthouse para chá, música e uma distância que Pamela possa ajustar.", { safety: 1, tension: -1, memory: "Você deixou a intimidade continuar válida sem transformar a saída em obrigação." }, "Pamela escolhe uma música baixa. “Uma noite bonita não responde a casa inteira”, ela lembra. Você concorda e permanece."),
            ],
          },
        ],
        fallback: {
          title: "Curiosidade sem saída",
          location: "SALA DO PENTHOUSE · FIM DE TARDE",
          line: "Pamela não acha que um date seja a conversa certa ainda. Ela oferece uma alternativa menor: chá, uma caminhada no quarteirão ou marcar outra noite com mais descanso e clareza.",
          choices: [
            choice("pamela-3-fallback-tea", "Escutar", "Aceitar o chá e perguntar que distância parece confortável hoje.", { safety: 1, memory: "Você deixou Pamela definir a distância durante um chá simples." }, "Pamela move a cadeira alguns centímetros e sorri quando você não interpreta isso como rejeição."),
            choice("pamela-3-fallback-schedule", "Perguntar", "Marcar uma noite futura com início, fim e uma forma clara de remarcar.", { clarity: 1, safety: 1, memory: "Você marcou uma noite futura sem transformar espera em silêncio." }, "Pamela anota a hora e acrescenta, por conta própria, que pode mudar de ideia sem explicar tudo."),
            choice("pamela-3-fallback-pause", "Dar espaço", "Dizer que o encontro pode esperar e que você prefere preservar a conversa.", { safety: 1, tension: -1, memory: "Você preferiu preservar a conversa em vez de usar um date como compensação." }, "Pamela parece aliviada. A proximidade não diminui; só fica menos apressada."),
          ],
        },
        interlude: "O date ou a alternativa deixam uma pergunta em aberto: que tipo de próximo passo cabe numa casa em que todos continuam sendo reais depois da noite terminar?",
      },
      {
        title: "Nova geometria",
        location: "VARANDA DO PENTHOUSE · AMANHECER",
        line: "Pamela revisita as memórias que vocês fizeram e diz o que precisa agora. Ela pergunta se gostaria de incluir Jessica numa conversa breve — não para pedir permissão, mas para que a mudança não exista atrás de uma porta fechada.",
        choices: [
          choice("pamela-4-checkin", "Ser honesto", "Criar um check-in semanal e um date revisável, com liberdade para ajustar os dois.", { bond: 1, clarity: 1, tension: -1, memory: "Vocês criaram uma forma de perguntar cedo." }, "Pamela escreve uma pergunta simples no telemóvel: “como isso está cabendo hoje?”. Ela diz que prefere perguntas pequenas a promessas enormes."),
          choice("pamela-4-friendship", "Dar espaço", "Definir amizade íntima e honesta, sem promessa romântica antes da hora.", { safety: 1, memory: "Você preservou cuidado sem transformá-lo em obrigação." }, "Pamela parece emocionada, não rejeitada. “Isso ainda é uma escolha de ficar na minha vida.”"),
          choice("pamela-4-pause", "Perguntar", "Pedir uma pausa com data de revisão, para que a distância não precise virar silêncio.", { safety: 1, tension: -1, memory: "Você escolheu uma pausa com uma data para retornar à conversa." }, "Pamela escolhe a data junto com você e pergunta se prefere uma mensagem curta ou uma caminhada para recomeçar."),
        ],
        variants: [
          {
            requirement: { minimum: { safety: 4 }, maximum: { tension: 2 } },
            line: "Pamela revisita as memórias que vocês fizeram e diz o que precisa agora. Ela pergunta se gostaria de incluir Jessica numa conversa breve — não para pedir permissão, mas para que a mudança não exista atrás de uma porta fechada.",
            choices: [
              choice("pamela-4-checkin-open", "Ser honesto", "Criar um check-in semanal e um date revisável, com liberdade para ajustar os dois.", { bond: 1, clarity: 1, tension: -1, memory: "Vocês criaram uma forma de perguntar cedo." }, "Pamela escreve uma pergunta simples no telemóvel: “como isso está cabendo hoje?”. Ela diz que prefere perguntas pequenas a promessas enormes."),
              choice("pamela-4-together-open", "Perguntar", "Marcar a próxima conversa com Pamela e, se ela quiser, Jessica.", { safety: 1, tension: -1, memory: "Você marcou transparência como próximo passo, não como exigência." }, "Pamela manda uma mensagem para Jessica só depois de escolher as palavras. “Obrigada por deixar isso ser meu também.”"),
              choice("pamela-4-friendship-open", "Dar espaço", "Definir amizade íntima e honesta, sem promessa romântica antes da hora.", { safety: 1, memory: "Você preservou cuidado sem transformá-lo em obrigação." }, "Pamela parece emocionada, não rejeitada. “Isso ainda é uma escolha de ficar na minha vida.”"),
            ],
          },
        ],
        fallback: {
          title: "Próximo passo menor",
          line: "A conversa completa com Jessica ainda não parece segura. Pamela prefere escolher um passo menor, visível e reversível antes de decidir mais do que vocês podem sustentar.",
          choices: [
            choice("pamela-4-fallback-conversation", "Perguntar", "Marcar uma nova conversa com Pamela e deixar que ela convide Jessica apenas se quiser.", { clarity: 1, safety: 1, memory: "Você deixou Pamela escolher se e quando Jessica entraria na conversa." }, "Pamela guarda a data e diz que um próximo encontro já é suficiente por enquanto."),
            choice("pamela-4-fallback-friendship", "Dar espaço", "Definir amizade íntima e honesta por agora.", { safety: 1, memory: "Você preservou cuidado sem transformá-lo em obrigação." }, "Pamela concorda que proximidade não precisa ser um rótulo apressado para ser real."),
            choice("pamela-4-fallback-pause", "Ser honesto", "Pedir uma pausa com data de revisão, antes que a tensão vire distância sem nome.", { safety: 1, tension: -1, memory: "Você escolheu uma pausa com uma data para retornar à conversa." }, "Pamela escolhe a data junto com você e pede uma mensagem curta quando chegar o dia."),
          ],
        },
      },
    ],
  },
  alice: {
    id: "alice",
    people: "Alice & Adam",
    chapter: "REPARAR NÃO É RETROCEDER",
    accent: "#86A9D4",
    portraits: ["alice", "adam"],
    beats: [
      {
        title: "A porta entreaberta",
        location: "CORREDOR DO PENTHOUSE · 07:18",
        line:
          "Alice para à entrada da sala. Adam permanece alguns passos atrás. “Eu não vi”, diz Alice. Adam não a desculpa nem a contradiz; apenas pergunta se há espaço para ouvir.",
        choices: [
          choice("alice-1-boundary", "Dar espaço", "Dizer que posso conversar, mas preciso que ninguém explique a minha dor por mim.", { safety: 2, clarity: 1, memory: "Definiste uma condição para a conversa com Alice e Adam." }, "Alice acena devagar. Adam confirma que vai escutar sem preencher as lacunas."),
          choice("alice-1-question", "Perguntar", "Perguntar quando Alice percebeu que eu estava a ficar sozinho.", { clarity: 2, tension: 1, memory: "Perguntaste quando Alice reparou na tua solidão." }, "Alice tira os óculos. A resposta chega sem defesa: “Reparei. E disse a mim mesma que passava.”"),
          choice("alice-1-honest", "Ser honesto", "Dizer que ainda não sei se quero reconstruir, mas aceito ouvir uma conversa verdadeira.", { clarity: 1, bond: 1, safety: 1, memory: "Abriste uma conversa sem oferecer perdão prematuro." }, "Ninguém se aproxima. Mesmo assim, a sala fica menos vazia."),
        ],
      },
      {
        title: "Responsabilidade concreta",
        location: "MESA DA COZINHA · MEIO-DIA",
        line:
          "Adam admite que confundiu boa intenção com atenção suficiente. Alice não o interrompe. “O que seria diferente desta vez?”, pergunta ela, sem pedir uma resposta a ti.",
        choices: [
          choice("alice-2-listen", "Escutar", "Pedir para ouvir o que cada um consegue fazer, sem decidir por mim ainda.", { safety: 1, clarity: 1, tension: -1, memory: "Pediste propostas concretas sem assumir um recomeço." }, "Adam fala de hábitos pequenos. Alice fala de não deixar a ausência passar despercebida."),
          choice("alice-2-honest", "Ser honesto", "Dizer que reparação sem mudança observável só me deixaria mais cansado.", { clarity: 2, tension: 1, memory: "Pediste mudança observável em vez de intenções vagas." }, "Alice fecha os olhos um instante. “Então não vou pedir que acredites antes de haver prova.”"),
          choice("alice-2-space", "Dar espaço", "Sugerir que a conversa pare por hoje e seja retomada com apoio externo, se todos concordarem.", { safety: 2, tension: -1, memory: "Propuseste mediação antes que a conversa se tornasse defesa." }, "Adam concorda primeiro. Alice demora, mas diz que prefere uma pausa honesta a mais uma discussão circular."),
        ],
      },
      {
        title: "O que vem depois",
        location: "SALA VAZIA · FIM DE TARDE",
        line:
          "Alice deixa uma chave sobre a mesa, não como despedida, mas como símbolo de escolha. Adam pergunta se a próxima conversa deve ser a sós, em conjunto, ou só quando tu quiseres.",
        choices: [
          choice("alice-3-next", "Perguntar", "Pedir uma conversa a sós com Alice, com limites claros e uma hora para terminar.", { clarity: 2, safety: 1, bond: 1, memory: "Escolheste uma conversa a sós com Alice e limites explícitos." }, "Alice aceita a hora marcada sem tentar prolongar o momento."),
          choice("alice-3-pause", "Dar espaço", "Dizer que preciso de uma pausa sem contacto antes de saber o que quero.", { safety: 2, tension: -2, memory: "Escolheste uma pausa de contacto para recuperar espaço próprio." }, "Adam pergunta apenas como pode respeitar a pausa. Alice escreve a resposta para não a esquecer."),
          choice("alice-3-honest", "Ser honesto", "Dizer que só continuo se ambos aceitarem que o casamento pode mudar de forma.", { clarity: 2, tension: -1, memory: "Disse que reparação não significa regressar ao formato antigo." }, "Alice não tenta salvar a frase. “Então vamos descobrir o que ainda é verdadeiro”, responde."),
        ],
      },
    ],
  },
  elise: {
    id: "elise",
    people: "Elise",
    chapter: "UM LUGAR SEM PRESSA",
    accent: "#D6A995",
    portraits: ["elise"],
    beats: [
      {
        title: "O café depois da chuva",
        location: "SOLEIL CAFÉ · FIM DE TARDE",
        line:
          "Elise não pergunta onde estiveste. Coloca uma chávena no balcão e espera. “Podes ficar sem contar tudo”, diz ela. “Só não quero que aches que tens de ficar sozinho.”",
        choices: [
          choice("elise-1-listen", "Escutar", "Agradecer-lhe por não transformar a minha presença numa exigência.", { safety: 2, bond: 1, memory: "Reconheceste o cuidado de Elise sem o tomar como garantido." }, "Elise sorri, quase impercetível. A cadeira junto à janela continua livre."),
          choice("elise-1-question", "Perguntar", "Perguntar o que a fez manter esta mesa livre para mim.", { clarity: 1, bond: 1, memory: "Perguntaste por que razão Elise guardou a mesa." }, "Elise olha para a chávena. “Porque reparei em como olhavas para a rua quando precisavas de respirar.”"),
          choice("elise-1-honest", "Ser honesto", "Dizer que tenho medo de confundir alívio com amor, mas quero conhecê-la devagar.", { clarity: 2, safety: 1, memory: "Separaste alívio de promessa ao falar com Elise." }, "“Devagar é bom”, responde Elise. “Desde que seja uma escolha dos dois.”"),
        ],
      },
      {
        title: "O ritmo da mesa junto à janela",
        location: "SOLEIL CAFÉ · DIA SEGUINTE",
        line:
          "Elise mostra-te um caderno com receitas e pequenos desenhos de clientes habituais. “Não preciso que isto seja uma história de salvação”, diz ela. “Só quero saber que ritmo parece seguro.”",
        choices: [
          choice("elise-2-question", "Perguntar", "Perguntar que gestos fazem Elise sentir-se escolhida, e quais a fazem sentir-se pressionada.", { clarity: 2, safety: 1, memory: "Perguntaste a Elise como reconhecer cuidado sem pressão." }, "Ela enumera coisas simples: avisar, perguntar e não desaparecer quando a conversa fica difícil."),
          choice("elise-2-space", "Dar espaço", "Dizer que prefiro manter o café como porto seguro por enquanto.", { safety: 2, tension: -1, memory: "Protegeste o café como um espaço seguro sem o transformar numa promessa." }, "Elise concorda. A mesa continua disponível sem passar a significar uma dívida."),
          choice("elise-2-honest", "Ser honesto", "Admitir que quero um encontro, mas não quero usá-lo para evitar os problemas em casa.", { clarity: 2, bond: 1, memory: "Quiseste um encontro com Elise sem o usar como fuga." }, "Elise fecha o caderno. “Então não fugimos. Saímos para caminhar e voltamos a falar.”"),
        ],
      },
      {
        title: "Uma cadeira para dois",
        location: "RUA DO SOLEIL · NOITE",
        line:
          "Depois de fechar o café, Elise segura duas chávenas de viagem. A rua está tranquila. Ela pergunta se preferes ficar mais dez minutos ou marcar outro dia, sem receio de que uma resposta magoe a outra.",
        choices: [
          choice("elise-3-stay", "Ser honesto", "Ficar mais dez minutos e dizer que quero aprender a estar aqui sem me esconder.", { bond: 2, safety: 1, tension: -1, memory: "Escolheste ficar presente com Elise por mais dez minutos." }, "Elise entrega-te uma chávena e começa por contar uma história pequena, sem transformar a noite em declaração."),
          choice("elise-3-schedule", "Perguntar", "Marcar um encontro curto, com uma hora de início e fim clara.", { clarity: 2, safety: 1, memory: "Marcaste um encontro com Elise de duração e expectativa claras." }, "Ela escreve a hora num guardanapo e pergunta se queres escolher o lugar juntos."),
          choice("elise-3-pause", "Dar espaço", "Dizer que hoje preciso de ir, mas que não quero desaparecer sem explicar.", { safety: 2, memory: "Explicaste uma saída sem transformar distância em silêncio." }, "Elise agradece a explicação e deixa a próxima mensagem como uma escolha, não uma cobrança."),
        ],
      },
    ],
  },
  raven: {
    id: "raven",
    people: "Raven",
    chapter: "ESCOLHER SEM SER ARRASTADO",
    accent: "#A57BE6",
    portraits: ["raven"],
    beats: [
      {
        title: "Música atrás da porta",
        location: "CLUBE VIOLETA · DEPOIS DA MEIA-NOITE",
        line:
          "Raven desliga a música antes de falar. A intensidade dela não chega como uma ordem. “Não quero ser uma fuga”, diz. “Quero saber se estás aqui porque escolheste estar.”",
        choices: [
          choice("raven-1-space", "Dar espaço", "Pedir uma noite para pensar antes de prometer qualquer coisa.", { safety: 2, tension: -1, memory: "Pediste tempo e Raven respeitou a pausa." }, "Raven devolve-te o casaco. “Pensa. Eu não vou confundir espera com abandono.”"),
          choice("raven-1-question", "Perguntar", "Perguntar o que ela viu no sonho antes de nos conhecermos.", { clarity: 1, bond: 1, memory: "Perguntaste sobre o sonho sem o tratar como destino." }, "Raven fala do sonho como uma melodia sem letra. Depois acrescenta: “Sonhos não substituem consentimento.”"),
          choice("raven-1-honest", "Ser honesto", "Dizer que a ligação me assusta, mas que não quero fingir que não a sinto.", { clarity: 2, bond: 1, tension: 1, memory: "Reconheceste a intensidade sem a transformar em certeza." }, "Raven sorri sem vitória. “Então descobrimos, se quisermos. Não porque estava escrito.”"),
        ],
      },
      {
        title: "Luzes acesas",
        location: "BECO DO CLUBE · CHUVA FINA",
        line:
          "Raven encosta-se à parede, longe da música. “Há uma diferença entre sermos intensos e sermos imprudentes”, diz. “Quero saber em qual lado vais ficar quando a noite acabar.”",
        choices: [
          choice("raven-2-boundary", "Dar espaço", "Dizer que preciso de uma palavra simples para parar uma conversa sem que pareça rejeição.", { safety: 2, clarity: 1, memory: "Criaste uma palavra de pausa para conversas intensas com Raven." }, "Raven escolhe uma palavra banal e ri. “Assim ela não vem carregada de drama quando precisarmos dela.”"),
          choice("raven-2-listen", "Escutar", "Perguntar o que Raven teme quando alguém se afasta sem explicar.", { bond: 1, safety: 1, memory: "Escutaste o medo de Raven sem lhe pedir que o minimize." }, "A resposta não é teatral. É apenas honesta: ela teme ter sido divertida, mas nunca escolhida."),
          choice("raven-2-honest", "Ser honesto", "Dizer que não quero que a intensidade apague as outras relações da minha vida.", { clarity: 2, tension: -1, memory: "Mantiveste as outras relações visíveis ao falar com Raven." }, "Raven concorda sem hesitar. “Uma ligação segura não precisa de te tornar mais pequeno.”"),
        ],
      },
      {
        title: "Depois da última música",
        location: "TELHADO DO CLUBE · MADRUGADA",
        line:
          "A cidade lateja ao longe. Raven pergunta se queres descer para mais uma música, ir embora sozinho ou marcar uma noite em que ambos cheguem com tempo e descanso.",
        choices: [
          choice("raven-3-dance", "Ser honesto", "Ficar para uma música e dizer que quero dançar, não fugir.", { bond: 2, safety: 1, memory: "Escolheste uma música com Raven sem a usar como fuga." }, "Raven estende a mão e espera que sejas tu a reduzir a distância."),
          choice("raven-3-schedule", "Perguntar", "Marcar uma noite futura com início, fim e expectativas claras.", { clarity: 2, safety: 1, memory: "Marcaste uma noite futura com Raven e expectativas claras." }, "Ela pega no telemóvel, mas pergunta primeiro qual é o horário que protege o teu descanso."),
          choice("raven-3-leave", "Dar espaço", "Ir embora agora e enviar uma mensagem quando chegar em segurança.", { safety: 2, tension: -1, memory: "Foste embora com clareza e combinaste uma mensagem de chegada." }, "Raven aceita sem dramatizar. A despedida fica intensa, mas não confusa."),
        ],
      },
    ],
  },
  saskia: {
    id: "saskia",
    people: "Saskia",
    chapter: "UM FUTURO SEM PRESSA",
    accent: "#93B99D",
    portraits: ["saskia"],
    beats: [
      {
        title: "Debaixo do mesmo guarda-chuva",
        location: "RUA DA ESTAÇÃO · CHUVA LEVE",
        line:
          "Saskia encontra-te no abrigo da estação com um guarda-chuva demasiado pequeno para duas pessoas. “Isto é objetivamente uma má solução”, brinca. “Mas podemos tentar sem fingir que já sabemos onde vamos dar.”",
        choices: [
          choice("saskia-1-question", "Perguntar", "Perguntar o que ela imagina quando pensa numa vida tranquila.", { clarity: 1, bond: 1, memory: "Perguntaste a Saskia como ela imagina estabilidade." }, "Saskia enumera pão quente, plantas sobreviventes e uma sala onde ninguém precisa de falar alto para ser ouvido."),
          choice("saskia-1-honest", "Ser honesto", "Dizer que ainda estou a aprender a não fugir quando as coisas ficam calmas.", { clarity: 2, safety: 1, memory: "Nomeaste o medo de calma sem o transformar em destino." }, "Saskia aperta o guarda-chuva contra o vento. “Então chamemos a isto hoje, não para sempre.”"),
          choice("saskia-1-boundary", "Dar espaço", "Perguntar se podemos caminhar juntos sem transformar isso numa promessa apressada.", { safety: 2, memory: "Pediste proximidade sem uma promessa prematura." }, "Ela passa o guarda-chuva para a mão livre. “Sim. E se a chuva apertar, dizemos.”"),
        ],
      },
      {
        title: "Coisas pequenas",
        location: "MERCADO DE BAIRRO · SÁBADO",
        line:
          "Saskia segura uma lista curta: sopa, velas, terra para uma planta. “Eu gosto de planos pequenos”, diz. “São os únicos que me deixam perceber se alguém aparece.”",
        choices: [
          choice("saskia-2-listen", "Escutar", "Perguntar quais dos planos pequenos ela já teve de fazer sozinha.", { bond: 1, safety: 1, memory: "Escutaste as pequenas responsabilidades que Saskia carregou sozinha." }, "Ela fala de forma prática, mas o cuidado com que escolheste ouvir muda a lista."),
          choice("saskia-2-honest", "Ser honesto", "Dizer que consigo oferecer consistência, mas não quero fingir que sei tudo já.", { clarity: 2, safety: 1, memory: "Ofereceste consistência sem prometer certeza absoluta." }, "Saskia sorri. “Consistência é melhor do que uma certeza que ninguém consegue cumprir.”"),
          choice("saskia-2-space", "Dar espaço", "Dizer que hoje posso ajudar no mercado, mas não quero invadir a rotina dela.", { safety: 2, memory: "Participaste na rotina de Saskia sem te apropriar dela." }, "Ela entrega-te metade da lista e deixa claro que podes dizer não a qualquer item."),
        ],
      },
      {
        title: "Uma chave que não é promessa",
        location: "PORTA DO APARTAMENTO DE SASKIA · NOITE",
        line:
          "Saskia mostra uma cópia de chave guardada num envelope, ainda sem nome. “Não é um convite automático”, explica. “É só uma conversa sobre o que tornaria isto prático e seguro.”",
        choices: [
          choice("saskia-3-boundary", "Dar espaço", "Dizer que a chave pode continuar no envelope até ambos sabermos que significa apoio, não pressão.", { safety: 2, clarity: 1, memory: "Deixaste a chave no envelope até que o gesto fosse seguro para os dois." }, "Saskia guarda o envelope na gaveta e parece mais tranquila, não menos próxima."),
          choice("saskia-3-question", "Perguntar", "Perguntar que limites fariam uma visita sentir-se leve para ela.", { clarity: 2, safety: 1, memory: "Perguntaste que limites tornariam uma visita leve para Saskia." }, "Ela responde com horários, mensagem antes de chegar e liberdade total para dizer que hoje não."),
          choice("saskia-3-honest", "Ser honesto", "Dizer que gosto da ideia, mas preciso que qualquer passo seja reversível e conversado.", { clarity: 2, safety: 1, memory: "Aceitaste imaginar proximidade apenas com passos reversíveis." }, "Saskia coloca o envelope de volta na mesa. “Reversível e conversado é exatamente o que eu queria ouvir.”"),
        ],
      },
    ],
  },
};
