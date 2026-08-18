import { expect, test } from "@playwright/test";
import { callGame, openGame, patchState, snapshot } from "./helpers";

test.describe("QA-03 a QA-06 — rotina, economia, inventário e retorno decrescente", () => {
  test("bloqueia sono fora da noite e restaura recursos quando a noite termina", async ({ page }) => {
    await openGame(page, "actions");
    await patchState(page, { economy: { slot: 1, energy: 2 }, screen: "actions" });
    await callGame(page, "runActivity", "sleep");
    expect((await snapshot(page)).economy.lastUpdate?.title).toBe("Ainda não é hora de dormir");

    await patchState(page, { economy: { slot: 2, energy: 1 }, screen: "actions" });
    await callGame(page, "runActivity", "sleep");
    const rested = await snapshot(page);
    expect(rested.economy.day).toBe(2);
    expect(rested.economy.slot).toBe(0);
    expect(rested.economy.energy).toBe(4);
  });

  test("aplica teto semanal de investimento, compra única e retorno decrescente de cuidado", async ({ page }) => {
    await openGame(page, "week");
    await patchState(page, { economy: { personal: 200 }, screen: "dashboard" });
    await callGame(page, "invest", "reserve");
    await callGame(page, "invest", "reserve");
    expect((await snapshot(page)).economy.investedThisWeek).toBe(80);
    await callGame(page, "invest", "reserve");
    expect((await snapshot(page)).economy.lastUpdate?.title).toBe("Limite semanal alcançado");

    await callGame(page, "buy", "ingredients");
    expect((await snapshot(page)).economy.inventory).toContain("ingredients");
    await callGame(page, "buy", "ingredients");
    expect((await snapshot(page)).economy.lastUpdate?.title).toBe("Já tens este item");

    await patchState(page, { screen: "actions", activeRoute: "trio", route: { chapter: 1, metrics: { bond: 2, clarity: 2, safety: 2, tension: 3 } } });
    await callGame(page, "runActivity", "tea-pamela");
    const firstCare = await snapshot(page);
    expect(firstCare.routes.trio.metrics.safety).toBe(3);
    await callGame(page, "runActivity", "tea-pamela");
    const repeatedCare = await snapshot(page);
    expect(repeatedCare.routes.trio.metrics.safety).toBe(3);
    expect(repeatedCare.economy.lastUpdate?.text).toContain("gesto repetido trouxe conforto");
  });
});
