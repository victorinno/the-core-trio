import assert from "node:assert/strict";
import {
  buyItem,
  contribute,
  createEconomyState,
  invest,
  performActivity,
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

console.log("Economy smoke test: OK");
