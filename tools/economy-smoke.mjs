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
import { createRelationshipStates } from "../client/src/game/relationship.ts";

let economy = createEconomyState();
let relationships = createRelationshipStates();

assert.equal(economy.personal, 120, "A carteira pessoal deve começar com §120.");
assert.equal(economy.family, 180, "O fundo da família deve começar com §180.");

let result = buyItem(economy, "ingredients");
economy = result.economy;
assert.equal(economy.personal, 108, "Comprar ingredientes deve reduzir §12 da carteira pessoal.");
assert.ok(economy.inventory.includes("ingredients"), "Ingredientes devem entrar no inventário.");

result = performActivity(economy, relationships, "cook-trio");
economy = result.economy;
relationships = result.relationships;
assert.equal(economy.energy, 3, "Cozinhar deve consumir uma unidade de energia.");
assert.equal(relationships.trio.metrics.bond, 3, "Cozinhar deve aumentar vínculo do Croe Trio.");
assert.equal(relationships.trio.metrics.safety, 3, "Cozinhar deve aumentar segurança do Croe Trio.");
assert.equal(relationships.trio.metrics.tension, 2, "Cozinhar deve reduzir tensão do Croe Trio.");

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

console.log("Economy smoke test: OK");
