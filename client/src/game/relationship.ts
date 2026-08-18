/**
 * STYLE — The Croe Trio models quality of relationship, never ownership: bond, clarity, safety and tension live per route.
 */
import type { RouteId } from "./story";

export type RelationshipMetric = "bond" | "clarity" | "safety" | "tension";

export interface RelationshipMetrics {
  bond: number;
  clarity: number;
  safety: number;
  tension: number;
}

export interface RelationshipState {
  chapter: number;
  complete: boolean;
  metrics: RelationshipMetrics;
  memories: string[];
}

export interface RelationshipEffect extends Partial<RelationshipMetrics> {
  memory: string;
}

const INITIAL_STATES: Record<RouteId, RelationshipMetrics> = {
  trio: { bond: 2, clarity: 1, safety: 2, tension: 3 },
  alice: { bond: 1, clarity: 1, safety: 1, tension: 4 },
  elise: { bond: 1, clarity: 1, safety: 3, tension: 1 },
  raven: { bond: 1, clarity: 1, safety: 2, tension: 2 },
  saskia: { bond: 1, clarity: 1, safety: 2, tension: 1 },
};

const cap = (value: number) => Math.max(0, Math.min(5, value));

export function createRelationshipStates(): Record<RouteId, RelationshipState> {
  const makeState = (id: RouteId): RelationshipState => ({
    chapter: 0,
    complete: false,
    metrics: { ...INITIAL_STATES[id] },
    memories: [],
  });
  return {
    trio: makeState("trio"),
    alice: makeState("alice"),
    elise: makeState("elise"),
    raven: makeState("raven"),
    saskia: makeState("saskia"),
  };
}

export function applyEffect(state: RelationshipState, effect: RelationshipEffect) {
  const next: RelationshipState = {
    ...state,
    metrics: {
      bond: cap(state.metrics.bond + (effect.bond ?? 0)),
      clarity: cap(state.metrics.clarity + (effect.clarity ?? 0)),
      safety: cap(state.metrics.safety + (effect.safety ?? 0)),
      tension: cap(state.metrics.tension + (effect.tension ?? 0)),
    },
    memories: [...state.memories, effect.memory],
  };
  return next;
}

export function relationshipStatus(metrics: RelationshipMetrics) {
  if (metrics.tension >= 4) return "em pausa";
  if (metrics.safety >= 3 && metrics.clarity >= 3 && metrics.bond >= 3) return "a aproximar";
  if (metrics.clarity >= 2) return "a clarificar";
  return "a reparar";
}

export function relationshipOutcome(metrics: RelationshipMetrics) {
  if (metrics.tension >= 4) {
    return {
      title: "Uma pausa que protege",
      line: "A relação não precisa de ser decidida hoje. O próximo gesto é respeitar o limite que acabou de ser nomeado.",
      detail: "A pausa mantém a porta aberta sem exigir disponibilidade imediata.",
    };
  }
  if (metrics.safety >= 3 && metrics.clarity >= 3 && metrics.bond >= 3) {
    return {
      title: "Um próximo passo claro",
      line: "A conversa não apagou o passado, mas criou uma forma de estar presente sem pedir que ninguém se diminua.",
      detail: "Segurança e clareza permitem aproximação escolhida, não presumida.",
    };
  }
  if (metrics.safety >= 3) {
    return {
      title: "Ritmo partilhado",
      line: "Ficou combinado um ritmo possível: devagar o bastante para cada pessoa continuar inteira na conversa.",
      detail: "O cuidado permanece; a definição pode chegar mais tarde.",
    };
  }
  return {
    title: "A conversa continua",
    line: "Ainda há coisas por entender, mas a relação já não depende de silêncio para se manter de pé.",
    detail: "Uma próxima conversa pode ser mais honesta porque esta foi possível.",
  };
}
