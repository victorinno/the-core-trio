import assert from "node:assert/strict";
import {
  buyItem,
  contribute,
  createEconomyState,
  invest,
  isWeekend,
  performActivity,
  travel,
  withdraw,
} from "../client/src/game/economy.ts";
import { applyEffect, createRelationshipStates } from "../client/src/game/relationship.ts";
import { meetsRouteRequirement, ROUTES } from "../client/src/game/story.ts";

let economy = createEconomyState();
let relationships = createRelationshipStates();
relationships.trio.chapter = 1;

assert.equal(economy.personal, 120, "A carteira pessoal deve começar com §120.");
assert.equal(economy.family, 180, "O fundo da família deve começar com §180.");

let result = performActivity(economy, relationships, "tea-pamela");
economy = result.economy;
relationships = result.relationships;
assert.equal(relationships.trio.metrics.safety, 3, "Uma bebida escolhida por Pamela deve aumentar segurança.");

result = buyItem(economy, "ingredients");
economy = result.economy;
assert.equal(economy.personal, 108, "Comprar ingredientes deve reduzir §12 da carteira pessoal.");
assert.ok(economy.inventory.includes("ingredients"), "Ingredientes devem entrar no inventário.");

result = performActivity(economy, relationships, "cook-trio");
economy = result.economy;
relationships = result.relationships;
assert.equal(economy.energy, 2, "A bebida e a receita de Pamela devem consumir duas unidades de energia ao todo.");
assert.equal(relationships.trio.metrics.bond, 4, "Cozinhar deve aumentar vínculo com Pamela.");
assert.equal(relationships.trio.metrics.safety, 4, "Cozinhar deve aumentar segurança com Pamela.");
assert.equal(relationships.trio.metrics.tension, 3, "Cozinhar não deve apagar uma tensão que ainda pede conversa.");
assert.equal(buyItem(economy, "ingredients").economy.lastUpdate.title, "Compra repetida nesta semana", "Um item consumido não pode ser comprado novamente na mesma semana para repetir o mesmo gesto.");

result = performActivity(economy, relationships, "shift");
economy = result.economy;
assert.equal(economy.personal, 168, "O turno deve acrescentar §60 à carteira pessoal.");

result = contribute(economy, 30);
economy = result.economy;
assert.equal(economy.personal, 138, "A contribuição deve sair da carteira pessoal.");
assert.equal(economy.family, 210, "A contribuição deve entrar no fundo da família.");

result = invest(economy, "reserve", 40);
economy = result.economy;
assert.equal(economy.personal, 98, "Investir deve reduzir a carteira pessoal.");
assert.equal(economy.invested, 40, "Investir deve aumentar a alocação fictícia.");

result = withdraw(economy);
economy = result.economy;
assert.equal(economy.personal, 138, "O resgate deve devolver o capital fictício à carteira pessoal.");
assert.equal(economy.invested, 0, "O resgate deve esvaziar a alocação fictícia.");

let careEconomy = createEconomyState();
let careRelationships = createRelationshipStates();
const initialAliceSafety = careRelationships.alice.metrics.safety;
result = performActivity(careEconomy, careRelationships, "tidy-alice");
careEconomy = result.economy;
careRelationships = result.relationships;
assert.equal(careRelationships.alice.metrics.safety, initialAliceSafety + 1, "O primeiro cuidado da semana deve aumentar segurança.");
result = performActivity(careEconomy, careRelationships, "tidy-alice");
careEconomy = result.economy;
careRelationships = result.relationships;
assert.equal(careRelationships.alice.metrics.safety, initialAliceSafety + 1, "O cuidado repetido na semana não deve aumentar segurança novamente.");
assert.match(careEconomy.lastUpdate.text, /gesto repetido/, "O retorno decrescente deve explicar o motivo ao jogador.");

let sleepEconomy = createEconomyState();
result = performActivity(sleepEconomy, createRelationshipStates(), "rest");
sleepEconomy = result.economy;
result = performActivity(sleepEconomy, createRelationshipStates(), "rest");
sleepEconomy = result.economy;
assert.equal(sleepEconomy.slot, 2, "Dormir só deve ficar disponível depois do bloco noturno.");
result = performActivity(sleepEconomy, createRelationshipStates(), "sleep");
sleepEconomy = result.economy;
assert.equal(sleepEconomy.day, 2, "Dormir deve avançar para o dia seguinte.");
assert.equal(sleepEconomy.energy, 4, "Dormir deve recuperar toda a energia ao amanhecer.");

let investmentEconomy = createEconomyState();
investmentEconomy = invest(investmentEconomy, "reserve", 40).economy;
investmentEconomy = invest(investmentEconomy, "reserve", 40).economy;
assert.equal(investmentEconomy.investedThisWeek, 80, "O limite semanal deve registrar a exposição acumulada.");
assert.equal(invest(investmentEconomy, "reserve", 40).economy.lastUpdate.title, "Limite semanal alcançado", "Não deve ser possível exceder §80 de investimento na semana.");

const coastState = { ...createEconomyState(), day: 6, energy: 1 };
assert.equal(isWeekend(coastState), true, "The Coast deve abrir no sábado e domingo fictícios.");
const coastTrip = travel(coastState, "The Coast", 1, 1).economy;
assert.equal(coastTrip.energy, 0, "A viagem para The Coast deve custar uma unidade de energia.");

const weeklyState = { ...createEconomyState(), day: 7, slot: 2, energy: 4, invested: 40, investedThisWeek: 40, profile: "reserve" };
const nextWeek = performActivity(weeklyState, createRelationshipStates(), "sleep").economy;
assert.equal(nextWeek.day, 8, "O sono da noite de domingo deve iniciar a próxima semana.");
assert.equal(nextWeek.investedThisWeek, 0, "O fechamento semanal deve liberar um novo limite de investimento.");
assert.ok(nextWeek.weeklyNotice, "O início da semana deve emitir um aviso de fechamento do Crescent Market.");

let jessicaEconomy = createEconomyState();
let jessicaRelationships = createRelationshipStates();
jessicaRelationships.trio.chapter = 2;
jessicaRelationships.trio.metrics.clarity = 2;
jessicaEconomy = buyItem(jessicaEconomy, "jessica-memento").economy;
result = performActivity(jessicaEconomy, jessicaRelationships, "gift-jessica");
jessicaEconomy = result.economy;
jessicaRelationships = result.relationships;
assert.equal(jessicaRelationships.trio.metrics.clarity, 3, "A lembrança contextual para Jessica deve aumentar Clareza somente depois de Pamela ter contexto para o gesto.");
assert.equal(jessicaRelationships.trio.metrics.tension, 2, "A lembrança contextual para Jessica deve reduzir Tensão quando o gesto é escolhido com transparência.");

let pamelaEconomy = createEconomyState();
let pamelaRelationships = createRelationshipStates();
assert.equal(performActivity(pamelaEconomy, pamelaRelationships, "date-pamela-lowcost").economy.lastUpdate.title, "Este gesto ainda pede mais contexto", "O date de Pamela deve ficar bloqueado antes da conversa e do contexto necessário.");
pamelaRelationships.trio = applyEffect(pamelaRelationships.trio, ROUTES.trio.beats[0].choices[0].effect);
pamelaRelationships.trio.chapter = 1;
result = performActivity(pamelaEconomy, pamelaRelationships, "tea-pamela");
pamelaEconomy = result.economy;
pamelaRelationships = result.relationships;
assert.equal(pamelaRelationships.trio.metrics.clarity, 3, "A primeira conversa de Pamela deve abrir Clareza suficiente para a rota.");
assert.equal(pamelaRelationships.trio.metrics.safety, 3, "O cuidado contextual deve abrir a base de Segurança para a rota.");
pamelaRelationships.trio.chapter = 2;
pamelaRelationships.trio = applyEffect(pamelaRelationships.trio, ROUTES.trio.beats[2].choices[1].effect);
pamelaRelationships.trio.chapter = 3;
result = performActivity(pamelaEconomy, pamelaRelationships, "date-pamela-lowcost");
pamelaEconomy = result.economy;
pamelaRelationships = result.relationships;
assert.equal(pamelaRelationships.trio.metrics.bond, 4, "O date de curiosidade deve aumentar Vínculo quando há segurança e contexto.");
assert.equal(pamelaRelationships.trio.metrics.clarity, 4, "O date de curiosidade deve aumentar Clareza quando há segurança e contexto.");
pamelaRelationships.trio.chapter = 4;
pamelaRelationships.trio = applyEffect(pamelaRelationships.trio, ROUTES.trio.beats[4].choices[0].effect);
assert.equal(ROUTES.trio.outcome(pamelaRelationships.trio.metrics).title, "Rotina a dois", "O percurso de transparência e check-in deve alcançar o epílogo de Rotina a dois.");
assert.equal(ROUTES.trio.outcome({ bond: 2, clarity: 1, safety: 2, tension: 4 }).title, "Pausa que preserva", "Tensão alta deve abrir um epílogo de pausa, não fechar a rota como falha.");
assert.equal(ROUTES.trio.outcome({ bond: 2, clarity: 2, safety: 3, tension: 2 }).title, "Amizade íntima e honesta", "Segurança suficiente com vínculo ou clareza ainda baixos deve preservar uma amizade íntima válida.");
assert.equal(meetsRouteRequirement({ bond: 2, clarity: 1, safety: 2, tension: 4 }, ROUTES.trio.beats[2].variants[0].requirement), false, "A conversa principal sobre Jessica deve converter-se em reparação quando faltam clareza e segurança.");

console.log("Economy smoke test: OK");
