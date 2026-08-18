import { expect, test } from "@playwright/test";
import { callGame, openGame, patchState, snapshot } from "./helpers";

test.describe("QA-07 — mapa e The Coast", () => {
  test("bloqueia The Coast no dia útil e cobra um bloco com uma Energia no fim de semana", async ({ page }) => {
    await openGame(page, "world");
    await patchState(page, { economy: { day: 1, slot: 0, energy: 4 }, screen: "world-map", location: "apartment" });
    await callGame(page, "travel", "coast");
    const weekday = await snapshot(page);
    expect(weekday.economy.lastUpdate?.title).toContain("fim de semana");
    expect(weekday.economy.energy).toBe(4);

    await patchState(page, { economy: { day: 6, slot: 0, energy: 1 }, screen: "world-map", location: "apartment" });
    await callGame(page, "travel", "coast");
    const weekend = await snapshot(page);
    expect(weekend.location).toBe("coast");
    expect(weekend.economy.energy).toBe(0);
    expect(weekend.economy.slot).toBe(1);
  });
});
