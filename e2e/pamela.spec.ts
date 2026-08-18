import { expect, test } from "@playwright/test";
import { callGame, openGame, patchState, snapshot } from "./helpers";

test.describe("QA-08 a QA-11 e PAM-EXP-01 — Pamela & Jessica", () => {
  test("exige contexto para o date e abre reparação quando a conversa sobre Jessica ainda não é segura", async ({ page }) => {
    await openGame(page, "pamela");
    await callGame(page, "runActivity", "date-pamela-lowcost");
    expect((await snapshot(page)).economy.lastUpdate?.title).toBe("Este gesto ainda pede mais contexto");

    await patchState(page, { activeRoute: "trio", screen: "conversation", route: { chapter: 2, metrics: { bond: 2, clarity: 1, safety: 2, tension: 4 } } });
    const repair = await snapshot(page);
    expect(repair.beat?.title).toBe("Uma conversa antes da conversa");
    expect(repair.beat?.choiceIds).toContain("pamela-2-repair-listen");
  });

  test("abre date contextual e produz todos os quatro finais válidos", async ({ page }) => {
    await openGame(page, "pamela");
    await patchState(page, { activeRoute: "trio", screen: "actions", route: { chapter: 3, metrics: { bond: 3, clarity: 3, safety: 4, tension: 2 } } });
    await callGame(page, "runActivity", "date-pamela-lowcost");
    const date = await snapshot(page);
    expect(date.routes.trio.metrics.bond).toBe(4);
    expect(date.routes.trio.metrics.clarity).toBe(4);

    const endings = [
      [{ bond: 5, clarity: 5, safety: 5, tension: 1 }, "Rotina a dois"],
      [{ bond: 4, clarity: 4, safety: 4, tension: 2 }, "Proximidade escolhida"],
      [{ bond: 2, clarity: 2, safety: 3, tension: 2 }, "Amizade íntima e honesta"],
      [{ bond: 2, clarity: 1, safety: 2, tension: 4 }, "Pausa que preserva"],
    ] as const;

    for (const [metrics, title] of endings) {
      await patchState(page, { activeRoute: "trio", screen: "finale", route: { chapter: 4, complete: true, metrics } });
      expect((await snapshot(page)).outcome?.title).toBe(title);
    }
  });

  test("PAM-EXP-01 alcança Rotina a dois por escolhas que reduzem Tensão", async ({ page }) => {
    await openGame(page, "pamela");
    await callGame(page, "choose", 0);
    await callGame(page, "advance");
    await callGame(page, "runActivity", "tea-pamela");
    await callGame(page, "openRoute", "trio");
    await callGame(page, "choose", 2);
    await callGame(page, "advance");
    await callGame(page, "runActivity", "rest");
    await callGame(page, "openRoute", "trio");
    await callGame(page, "choose", 1);
    await callGame(page, "advance");
    await callGame(page, "runActivity", "date-pamela-lowcost");
    await callGame(page, "openRoute", "trio");
    await callGame(page, "choose", 2);
    await callGame(page, "advance");
    await callGame(page, "runActivity", "rest");
    await callGame(page, "openRoute", "trio");
    await callGame(page, "choose", 0);
    await callGame(page, "advance");

    const finale = await snapshot(page);
    expect(finale.screen).toBe("finale");
    expect(finale.routes.trio.metrics.tension).toBeLessThanOrEqual(1);
    expect(finale.outcome?.title).toBe("Rotina a dois");
  });
});
