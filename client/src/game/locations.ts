/**
 * STYLE — The Croe Trio map treats every place as an emotional question: home, work, care, date or pause.
 * The Polycule Apartment stays the safe hub; travel changes available actions but never bypasses relationship gates.
 */
export type LocationId =
  | "apartment"
  | "player-room"
  | "downtown"
  | "soleil"
  | "market"
  | "violet"
  | "station"
  | "coast";

export type LocationRegion = "Penthouse" | "Downtown" | "Bairro" | "Costa";

export interface LocationDefinition {
  id: LocationId;
  title: string;
  region: LocationRegion;
  label: string;
  description: string;
  systems: string;
  accent: string;
  children?: LocationId[];
}

export const LOCATIONS: Record<LocationId, LocationDefinition> = {
  apartment: {
    id: "apartment",
    title: "Polycule Apartment",
    region: "Penthouse",
    label: "CASA · HUB",
    description: "A casa partilhada. Aqui a semana começa, as conversas regressam e o cuidado pode ser gratuito.",
    systems: "Agenda · Conversas · Fundo da família · Cozinha · Varanda",
    accent: "#B84A71",
    children: ["player-room"],
  },
  "player-room": {
    id: "player-room",
    title: "Quarto da pessoa jogadora",
    region: "Penthouse",
    label: "ESPAÇO PESSOAL",
    description: "Um lugar para descansar, organizar a agenda, responder mensagens e decidir o próximo passo sem dever presença a ninguém.",
    systems: "Descanso · Agenda · Carteira pessoal · Crescent Market",
    accent: "#92B6D9",
  },
  downtown: {
    id: "downtown",
    title: "Downtown",
    region: "Downtown",
    label: "DISTRITO DE ROTINA",
    description: "Trabalho, encontros breves e compras com contexto. Nenhuma loja compra uma resposta emocional.",
    systems: "Trabalho · Loja · Dates · Soleil Café · Clube Violeta",
    accent: "#D69468",
    children: ["soleil", "market", "violet"],
  },
  soleil: {
    id: "soleil",
    title: "Soleil Café",
    region: "Downtown",
    label: "CAFÉ · TRABALHO REMOTO",
    description: "Uma mesa para trabalho remoto, pausa e conversas curtas que não precisam virar promessa.",
    systems: "Trabalho remoto · Ajuda a Elise · Pausa",
    accent: "#D6A995",
  },
  market: {
    id: "market",
    title: "Mercado & Banca de Livros",
    region: "Downtown",
    label: "LOJA · CURIOSIDADE",
    description: "Ingredientes, pequenas lembranças e uma banca onde gosto só importa quando foi escutado antes.",
    systems: "Loja · Inventário · Ingredientes · Presentes contextuais",
    accent: "#D69468",
  },
  violet: {
    id: "violet",
    title: "Clube Violeta",
    region: "Downtown",
    label: "NOITE · RITMO",
    description: "Música, autonomia e uma forma explícita de voltar para casa. A noite não substitui uma conversa pendente.",
    systems: "Date com Raven · Conversa noturna",
    accent: "#A57BE6",
  },
  station: {
    id: "station",
    title: "Bairro & Estação",
    region: "Bairro",
    label: "CAMINHADA · PAUSA",
    description: "Caminhos de baixo custo para uma conversa curta, uma mensagem honesta ou uma visita combinada.",
    systems: "Caminhada · Pausa · Rota de Saskia",
    accent: "#93B99D",
  },
  coast: {
    id: "coast",
    title: "The Coast",
    region: "Costa",
    label: "FIM DE SEMANA · CONVERSA LONGA",
    description: "Uma viagem de um bloco e uma unidade de energia para dias em que existe tempo suficiente para uma conversa que não cabe na cidade.",
    systems: "Evento de grupo · Caminhada · Date de curiosidade · Custo de energia",
    accent: "#86A9D4",
  },
};

export function travelBlocks(from: LocationId, to: LocationId) {
  if (from === to) return 0;
  if ((from === "apartment" && to === "player-room") || (from === "player-room" && to === "apartment")) return 0;
  if (to === "apartment" || to === "player-room") return 0;
  if (LOCATIONS[from].region === LOCATIONS[to].region) return 0;
  return 1;
}
