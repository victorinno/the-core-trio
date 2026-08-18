/**
 * STYLE — The Croe Trio treats money as a planning resource, never as a shortcut to affection.
 * All market values are fictional game values; the Crescent Market is not financial advice or real market data.
 */
import { applyEffect, type RelationshipState } from "./relationship";
import { meetsRouteRequirement, type RouteId, type RouteRequirement } from "./story";

export type TimeSlot = "Manhã" | "Tarde" | "Noite";
export type InvestmentProfile = "reserve" | "neighborhood" | "violet";
export type ItemId = "ingredients" | "book" | "plant" | "vinyl" | "dessert" | "tea" | "jessica-memento";
export type ActivityId =
  | "rest"
  | "sleep"
  | "shift"
  | "remote"
  | "cook-trio"
  | "tea-pamela"
  | "find-pamela-clip"
  | "gift-jessica"
  | "date-pamela-lowcost"
  | "tidy-alice"
  | "help-elise"
  | "date-raven"
  | "soup-saskia"
  | "gift-elise"
  | "gift-raven"
  | "gift-saskia"
  | "date-trio";

export interface EconomyState {
  day: number;
  slot: number;
  energy: number;
  personal: number;
  family: number;
  invested: number;
  investedThisWeek: number;
  profile: InvestmentProfile | null;
  inventory: ItemId[];
  purchasedItemsThisWeek: ItemId[];
  usedCareThisWeek: ActivityId[];
  weeklyNotice: string | null;
  lastUpdate: EconomyUpdate | null;
}

export interface EconomyUpdate {
  title: string;
  text: string;
  costLabel: string;
  memory?: string;
  route?: RouteId;
}

export interface StoreItem {
  id: ItemId;
  name: string;
  cost: number;
  description: string;
}

export interface Activity {
  id: ActivityId;
  name: string;
  kind: "Rotina" | "Trabalho" | "Cuidado" | "Date" | "Presente";
  description: string;
  energy: number;
  cost?: number;
  income?: number;
  requires?: ItemId;
  route?: RouteId;
  effect?: { bond?: number; clarity?: number; safety?: number; tension?: number; memory: string };
  gated?: boolean;
  nightOnly?: boolean;
  minChapter?: number;
  routeRequirement?: RouteRequirement;
}

export const STORE_ITEMS: StoreItem[] = [
  { id: "ingredients", name: "Ingredientes frescos", cost: 12, description: "Permitem cozinhar uma refeição de cuidado para o Croe Trio." },
  { id: "book", name: "Livro anotado", cost: 24, description: "Um presente de conversa para Elise, disponível depois de uma escolha de escuta." },
  { id: "plant", name: "Planta de janela", cost: 18, description: "Um gesto pequeno para Saskia, pensado para uma visita combinada." },
  { id: "vinyl", name: "Disco de vinil", cost: 28, description: "Um convite para Raven escolher a música e o ritmo da noite." },
  { id: "dessert", name: "Sobremesa para partilhar", cost: 16, description: "Um gesto coletivo para Pamela e Jessica, sem transformar cuidado em obrigação." },
  { id: "tea", name: "Chá aromático", cost: 8, description: "Uma opção de bebida para Pamela escolher pelo aroma, temperatura ou memória." },
  { id: "jessica-memento", name: "Lembrança simples para Jessica", cost: 12, description: "Só ganha sentido se Pamela quiser tornar o carinho por Jessica visível na conversa." },
];

export const ACTIVITIES: Activity[] = [
  { id: "rest", name: "Encerrar este bloco", kind: "Rotina", description: "Usar o tempo para respirar, organizar as ideias ou simplesmente não produzir.", energy: 0 },
  { id: "sleep", name: "Dormir até amanhã", kind: "Rotina", description: "Encerrar a noite, recuperar energia e ver o que a agenda de amanhã oferece.", energy: 0, nightOnly: true },
  { id: "shift", name: "Fazer turno de trabalho", kind: "Trabalho", description: "Turno inteiro. Dá folga financeira, mas consome energia e um bloco do dia.", energy: 2, income: 60 },
  { id: "remote", name: "Aceitar trabalho remoto", kind: "Trabalho", description: "Rendimento menor e mais espaço para uma conversa no fim do dia.", energy: 1, income: 35 },
  { id: "tea-pamela", name: "Preparar bebida escolhida por Pamela", kind: "Cuidado", description: "Perguntar pelo aroma, temperatura ou lembrança antes de preparar a bebida.", energy: 1, route: "trio", minChapter: 1, effect: { bond: 1, safety: 1, memory: "Você seguiu a curiosidade de Pamela em vez de escolher por ela." } },
  { id: "find-pamela-clip", name: "Procurar o objeto esquecido com Pamela", kind: "Cuidado", description: "Acompanhar a busca sem tratar a distração dela como defeito.", energy: 1, route: "trio", minChapter: 1, effect: { bond: 1, clarity: 1, memory: "Você ajudou Pamela sem transformar distração em defeito." } },
  { id: "cook-trio", name: "Cozinhar receita escolhida com Pamela", kind: "Cuidado", description: "Preparar uma receita pelos sabores que Pamela escolher, sem usar comida como compensação.", energy: 1, requires: "ingredients", route: "trio", minChapter: 1, routeRequirement: { minimum: { safety: 3 } }, effect: { bond: 1, safety: 1, memory: "Vocês fizeram comida para descobrir um sabor, não para apagar um conflito." } },
  { id: "gift-jessica", name: "Acompanhar a lembrança para Jessica", kind: "Presente", description: "Deixar Pamela decidir se quer incluir Jessica e como quer tornar esse cuidado visível.", energy: 1, requires: "jessica-memento", route: "trio", minChapter: 2, routeRequirement: { minimum: { clarity: 2 } }, effect: { clarity: 1, tension: -1, memory: "Você reconheceu que o carinho de Pamela por Jessica continua sendo parte da sua vida." } },
  { id: "date-pamela-lowcost", name: "Date de curiosidade com Pamela", kind: "Date", description: "Uma saída simples ou um chá no penthouse, com Pamela escolhendo o ritmo e a hora de voltar.", energy: 1, cost: 8, route: "trio", minChapter: 3, routeRequirement: { minimum: { safety: 3 }, maximum: { tension: 3 } }, effect: { bond: 1, clarity: 1, memory: "Vocês escolheram uma noite sem pedir que ela provasse nada." } },
  { id: "tidy-alice", name: "Arrumar o escritório de Alice & Adam", kind: "Cuidado", description: "Organizar o espaço antes da conversa, sem falar por ninguém.", energy: 1, route: "alice", effect: { safety: 1, tension: -1, memory: "Tornaste o espaço de trabalho respirável antes da conversa." } },
  { id: "help-elise", name: "Ajudar Elise a fechar o café", kind: "Cuidado", description: "Ficar até o fim do turno sem transformar ajuda numa promessa.", energy: 1, route: "elise", effect: { bond: 1, clarity: 1, memory: "Ficaste até fechar, sem transformar ajuda em promessa." } },
  { id: "date-raven", name: "Marcar uma noite calma com Raven", kind: "Date", description: "Uma saída com hora de fim e forma clara de voltar para casa.", energy: 1, cost: 28, route: "raven", gated: true, effect: { bond: 1, safety: 1, clarity: 1, memory: "Definiste uma saída e uma forma clara de voltar." } },
  { id: "soup-saskia", name: "Levar sopa para Saskia", kind: "Cuidado", description: "Participar de uma rotina pequena sem tomar conta dela.", energy: 1, cost: 12, route: "saskia", effect: { bond: 1, safety: 1, memory: "Participaste numa rotina pequena sem tomar conta dela." } },
  { id: "gift-elise", name: "Oferecer o livro a Elise", kind: "Presente", description: "Entregar o livro depois de perguntar se ela quer conversar.", energy: 1, requires: "book", route: "elise", effect: { clarity: 1, safety: 1, memory: "Ofereceste um livro e perguntaste se Elise queria recebê-lo." } },
  { id: "gift-raven", name: "Oferecer o disco a Raven", kind: "Presente", description: "Deixar Raven escolher a faixa e o volume da noite.", energy: 1, requires: "vinyl", route: "raven", effect: { bond: 1, safety: 1, memory: "Ofereceste o disco e deixaste Raven escolher a música." } },
  { id: "gift-saskia", name: "Levar a planta a Saskia", kind: "Presente", description: "Perguntar primeiro se há espaço para ela junto à janela.", energy: 1, requires: "plant", route: "saskia", effect: { bond: 1, safety: 1, memory: "Perguntaste onde a planta caberia antes de a oferecer." } },
  { id: "date-trio", name: "Partilhar sobremesa com Pamela & Jessica", kind: "Date", description: "Uma noite coletiva de sobremesa e conversa, sem decidir o formato de ninguém.", energy: 1, requires: "dessert", route: "trio", minChapter: 2, gated: true, effect: { bond: 1, clarity: 1, memory: "Partilhaste sobremesa sem transformar a noite em exigência." } },
];

export const PROFILE_DETAILS: Record<InvestmentProfile, { name: string; risk: string; note: string }> = {
  reserve: { name: "Reserva Nocturna", risk: "baixo", note: "Movimento pequeno e previsível no final da semana fictícia." },
  neighborhood: { name: "Círculo de Bairro", risk: "médio", note: "Oscila entre uma semana tranquila e uma semana apertada." },
  violet: { name: "Palco Violeta", risk: "alto", note: "Maior variação, sempre limitada ao universo ficcional do jogo." },
};

export function createEconomyState(): EconomyState {
  return {
    day: 1,
    slot: 0,
    energy: 4,
    personal: 120,
    family: 180,
    invested: 0,
    investedThisWeek: 0,
    profile: null,
    inventory: [],
    purchasedItemsThisWeek: [],
    usedCareThisWeek: [],
    weeklyNotice: null,
    lastUpdate: null,
  };
}

export function slotName(state: EconomyState): TimeSlot {
  return ["Manhã", "Tarde", "Noite"][state.slot] as TimeSlot;
}

const copyState = (state: EconomyState): EconomyState => ({
  ...state,
  inventory: [...state.inventory],
  purchasedItemsThisWeek: [...state.purchasedItemsThisWeek],
  usedCareThisWeek: [...state.usedCareThisWeek],
});

export function weekNumber(state: EconomyState) {
  return Math.ceil(state.day / 7);
}

export function isWeekend(state: EconomyState) {
  const weekday = (state.day - 1) % 7;
  return weekday >= 5;
}

function closeWeek(next: EconomyState) {
  const before = next.invested;
  if (next.invested > 0) {
    const multipliers: Record<InvestmentProfile, number> = { reserve: 1.06, neighborhood: next.day % 2 === 0 ? 0.92 : 1.12, violet: next.day % 3 === 0 ? 0.75 : 1.18 };
    next.invested = Math.max(0, Math.round(before * multipliers[next.profile ?? "reserve"]));
    next.weeklyNotice = `Semana ${weekNumber(next)}: o Crescent Market fictício atualizou de §${before} para §${next.invested}.`;
  } else {
    next.weeklyNotice = `Semana ${weekNumber(next)} começou. Ainda não há capital fictício aplicado.`;
  }
  next.investedThisWeek = 0;
  next.purchasedItemsThisWeek = [];
  next.usedCareThisWeek = [];
}

function progressTime(state: EconomyState, energyCost: number) {
  const next = copyState(state);
  next.weeklyNotice = null;
  next.energy = Math.max(0, state.energy - energyCost);
  next.slot += 1;
  if (next.slot >= 3) {
    next.slot = 0;
    next.day += 1;
    next.energy = 4;
    if (next.day % 7 === 1) closeWeek(next);
  }
  return next;
}

function error(state: EconomyState, title: string, text: string) {
  return { economy: { ...state, lastUpdate: { title, text, costLabel: "Sem custo" } }, relationships: null };
}

export function travel(state: EconomyState, destination: string, blocks = 1, energyCost = 0) {
  if (state.energy < energyCost) return error(state, "Energia insuficiente para a viagem", "Podes descansar, dormir ou escolher um destino mais próximo antes de sair.");
  let next = copyState(state);
  for (let block = 0; block < blocks; block += 1) next = progressTime(next, block === 0 ? energyCost : 0);
  next.lastUpdate = {
    title: blocks ? `Chegaste a ${destination}` : `Entraste em ${destination}`,
    text: blocks ? "A deslocação usou um bloco de tempo. O que acontecer a seguir depende do lugar e da tua presença." : "Este espaço está dentro do Penthouse e não consome um bloco de tempo.",
    costLabel: blocks ? `Tempo −${blocks} bloco · Energia −${energyCost}` : "Sem custo de tempo",
  };
  return { economy: next, relationships: null };
}

export function buyItem(state: EconomyState, id: ItemId) {
  const item = STORE_ITEMS.find((candidate) => candidate.id === id);
  if (!item) return error(state, "Item indisponível", "Este item não existe na loja.");
  if (state.inventory.includes(id)) return error(state, "Já tens este item", "Guarda-o para uma ação de cuidado que faça sentido para a relação.");
  if (state.purchasedItemsThisWeek.includes(id)) return error(state, "Compra repetida nesta semana", "Um gesto não se torna mais significativo ao repetir a mesma compra. Guarda o orçamento ou escolhe outro contexto.");
  if (state.personal < item.cost) return error(state, "Saldo pessoal insuficiente", "Um turno ou trabalho remoto pode abrir espaço no orçamento.");
  return {
    economy: { ...state, personal: state.personal - item.cost, inventory: [...state.inventory, id], purchasedItemsThisWeek: [...state.purchasedItemsThisWeek, id], lastUpdate: { title: `${item.name} comprado`, text: item.description, costLabel: `Pessoal −§${item.cost}` } },
    relationships: null,
  };
}

export function contribute(state: EconomyState, amount = 30) {
  if (state.personal < amount) return error(state, "Saldo pessoal insuficiente", "Não é preciso contribuir agora; a casa não transforma cuidado em dívida.");
  return {
    economy: { ...state, personal: state.personal - amount, family: state.family + amount, lastUpdate: { title: "Contribuição para a casa", text: "O recurso coletivo aumentou. A contribuição não compra uma decisão individual.", costLabel: `Pessoal −§${amount} · Família +§${amount}` } },
    relationships: null,
  };
}

export function invest(state: EconomyState, profile: InvestmentProfile, amount = 40) {
  if (state.personal < amount) return error(state, "Saldo pessoal insuficiente", "O Crescent Market é opcional; não precisas de arriscar para avançar numa rota.");
  if (state.investedThisWeek + amount > 80) return error(state, "Limite semanal alcançado", "O jogo limita a exposição a §80 por semana para manter a economia leve e segura.");
  return {
    economy: { ...state, personal: state.personal - amount, invested: state.invested + amount, investedThisWeek: state.investedThisWeek + amount, profile, lastUpdate: { title: `${PROFILE_DETAILS[profile].name} selecionado`, text: PROFILE_DETAILS[profile].note, costLabel: `Pessoal −§${amount} · Investido +§${amount}` } },
    relationships: null,
  };
}

export function withdraw(state: EconomyState) {
  if (state.invested === 0) return error(state, "Nada para resgatar", "Não há capital fictício aplicado neste momento.");
  return {
    economy: { ...state, personal: state.personal + state.invested, invested: 0, profile: null, lastUpdate: { title: "Capital resgatado", text: "O resgate devolveu a alocação fictícia para a carteira pessoal.", costLabel: `Pessoal +§${state.invested}` } },
    relationships: null,
  };
}

export function performActivity(state: EconomyState, relationships: Record<RouteId, RelationshipState>, id: ActivityId) {
  const activity = ACTIVITIES.find((candidate) => candidate.id === id);
  if (!activity) return error(state, "Ação indisponível", "Esta atividade não está disponível agora.");
  if (activity.nightOnly && state.slot !== 2) return error(state, "Ainda não é hora de dormir", "Dormir fica disponível à noite; até lá, podes descansar ou escolher outra atividade.");
  if (state.energy < activity.energy) return error(state, "Energia insuficiente", "Encerrar o dia repõe energia; também podes escolher uma ação sem custo de energia.");
  if ((activity.cost ?? 0) > state.personal) return error(state, "Saldo pessoal insuficiente", "Esta ação pode esperar. Trabalho e cuidado de baixo custo continuam disponíveis.");
  if (activity.requires && !state.inventory.includes(activity.requires)) return error(state, "Falta um item", "Visita a loja primeiro ou escolhe uma ação de cuidado sem compra.");
  if (activity.route && activity.minChapter !== undefined && relationships[activity.route].chapter < activity.minChapter) return error(state, "Este gesto ainda pede mais contexto", "Continua a conversa com Pamela primeiro; uma ação só cria significado depois de existir um pedido ou uma escolha partilhada.");
  if (activity.route && !meetsRouteRequirement(relationships[activity.route].metrics, activity.routeRequirement)) return error(state, "Ainda não é a hora deste gesto", "Pamela precisa de mais clareza, segurança ou menos tensão antes de transformar esta possibilidade numa cena.");
  if (activity.gated && activity.route && relationships[activity.route].metrics.safety < 3) return error(state, "Ainda não é hora de um date", "Antes de marcar, cria mais segurança com uma conversa, favor ou gesto de cuidado.");

  const base = copyState(state);
  base.personal = base.personal - (activity.cost ?? 0) + (activity.income ?? 0);
  if (activity.requires) base.inventory = base.inventory.filter((item) => item !== activity.requires);
  const repeatedCare = activity.kind === "Cuidado" && base.usedCareThisWeek.includes(activity.id);
  if (activity.kind === "Cuidado" && !repeatedCare) base.usedCareThisWeek.push(activity.id);
  const economy = progressTime(base, activity.energy);
  let nextRelationships = relationships;
  if (activity.route && activity.effect && !repeatedCare) {
    nextRelationships = { ...relationships, [activity.route]: applyEffect(relationships[activity.route], activity.effect) };
  }
  economy.lastUpdate = {
    title: activity.name,
    text: repeatedCare ? `${activity.description} O gesto repetido trouxe conforto, mas não substitui uma nova conversa ou necessidade expressa.` : activity.route ? `${activity.description} A memória foi guardada na rota de ${activity.route === "trio" ? "Pamela & Jessica" : activity.route === "alice" ? "Alice & Adam" : activity.route[0].toUpperCase() + activity.route.slice(1)}.` : activity.description,
    costLabel: activity.income ? `Pessoal +§${activity.income} · Energia −${activity.energy}` : `Pessoal −§${activity.cost ?? 0} · Energia −${activity.energy}`,
    route: activity.route,
    memory: repeatedCare ? undefined : activity.effect?.memory,
  };
  return { economy, relationships: nextRelationships };
}
