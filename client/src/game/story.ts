/**
 * STYLE — Each Croe Trio route has three chapters and multiple valid relational outcomes; no dialogue is a universal “win”.
 */
import type { PortraitKey } from "./assets";
import type { RelationshipEffect } from "./relationship";

export type RouteId = "trio" | "alice" | "elise" | "raven" | "saskia";
export type Intention = "Escutar" | "Perguntar" | "Ser honesto" | "Dar espaço";

export interface StoryChoice {
  id: string;
  text: string;
  intention: Intention;
  effect: RelationshipEffect;
  response: string;
}

export interface ConversationBeat {
  title: string;
  location: string;
  line: string;
  choices: StoryChoice[];
}

export interface NarrativeRoute {
  id: RouteId;
  people: string;
  chapter: string;
  accent: string;
  portraits: PortraitKey[];
  beats: ConversationBeat[];
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

export const ROUTES: Record<RouteId, NarrativeRoute> = {
  trio: {
    id: "trio",
    people: "Pamela & Jessica",
    chapter: "O NÚCLEO QUE FICOU",
    accent: "#D69468",
    portraits: ["pamela", "jessica"],
    beats: [
      {
        title: "O sofá às 07:12",
        location: "SALA DO PENTHOUSE · MANHÃ CEDO",
        line:
          "Pamela aproxima uma caneca, sem presumir que vais aceitá-la. Jessica deixa espaço no sofá. “Não precisamos fingir que esta manhã é simples”, diz ela. “Mas podemos tratá-la com cuidado.”",
        choices: [
          choice("trio-1-listen", "Escutar", "Sentar-me e perguntar o que esta manhã significa para vocês.", { clarity: 1, safety: 1, tension: -1, memory: "Perguntaste o que a manhã significava para Pamela e Jessica." }, "Pamela segura a caneca com as duas mãos. Jessica agradece por a pergunta não tentar decidir por nenhuma das duas."),
          choice("trio-1-question", "Perguntar", "Perguntar se o que está a crescer entre nós já tem um nome.", { clarity: 2, tension: 1, memory: "Pediste linguagem para o que está a crescer." }, "Jessica sorri de lado. Pamela responde com cuidado: “Ainda estamos a descobrir. Obrigada por perguntares.”"),
          choice("trio-1-honest", "Ser honesto", "Dizer que me senti deixado de fora e não quero voltar a desaparecer em silêncio.", { clarity: 1, bond: 1, tension: -1, memory: "Nomeaste a ausência sem culpar ninguém." }, "Pamela diz: “Não precisas de pedir para ser visto.”"),
        ],
      },
      {
        title: "O que pertence a todos",
        location: "COZINHA DO PENTHOUSE · MAIS TARDE",
        line:
          "Jessica desenha três círculos no vidro embaciado. Pamela observa, pensativa. “O problema não é quem fica perto”, diz ela. “É quando alguém acha que já não tem lugar.”",
        choices: [
          choice("trio-2-boundary", "Dar espaço", "Pedir que ninguém prometa um formato antes de saber se ele é seguro para todos.", { safety: 2, clarity: 1, memory: "Protegeste o ritmo do trio antes de pedir definição." }, "Jessica apaga um dos círculos com a manga. “Então começamos por não prometer demais.”"),
          choice("trio-2-listen", "Escutar", "Perguntar do que Pamela e Jessica precisam para não se perderem uma na outra.", { bond: 1, safety: 1, memory: "Escutaste o vínculo que Pamela e Jessica já tinham." }, "Pamela olha para Jessica antes de responder. A pausa entre elas deixa claro que a pergunta importa."),
          choice("trio-2-honest", "Ser honesto", "Dizer que quero pertencer sem ocupar um espaço que não me foi oferecido.", { clarity: 2, safety: 1, memory: "Pediste pertença sem a transformar em direito." }, "Jessica deixa o marcador na mesa. “Isso é exatamente o tipo de conversa que eu queria ter.”"),
        ],
      },
      {
        title: "A manhã seguinte",
        location: "VARANDA · CIDADE A ACORDAR",
        line:
          "O café já arrefeceu. A cidade começa a ganhar cor. Pamela propõe uma manhã por semana só para conversar; Jessica pergunta se isso parece próximo demais ou insuficiente.",
        choices: [
          choice("trio-3-accept", "Ser honesto", "Aceitar a rotina e dizer que quero aprender a aparecer antes de a falta doer.", { bond: 2, clarity: 1, tension: -1, memory: "Escolheste uma rotina de presença com Pamela e Jessica." }, "As duas assentem. A proposta deixa de ser uma promessa grande e passa a ser uma data concreta no calendário."),
          choice("trio-3-pause", "Dar espaço", "Pedir tempo para pensar numa rotina que não transforme cuidado em obrigação.", { safety: 2, tension: -1, memory: "Pediste tempo antes de transformar a rotina em compromisso." }, "Pamela concorda de imediato. Jessica escreve apenas: “rever na próxima semana”."),
          choice("trio-3-question", "Perguntar", "Perguntar como vamos notar cedo quando alguém começar a afastar-se outra vez.", { clarity: 2, safety: 1, memory: "Criaste uma pergunta para prevenir novos silêncios." }, "Jessica pensa um instante. “A gente pergunta antes de preencher a história por conta própria.”"),
        ],
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
