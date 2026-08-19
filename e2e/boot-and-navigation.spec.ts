import { expect, test } from "@playwright/test";
import { openGame, snapshot } from "./helpers";

test.describe("QA-01, QA-02 e QA-12 — inicialização e navegação", () => {
  test("mantém uma transição por tecla entre Semana, Conversas e Pamela", async ({ page }) => {
    await openGame(page);
    await expect(page).toHaveTitle("The Croe Trio — Date Sim");
    expect((await snapshot(page)).screen).toBe("dashboard");

    await page.keyboard.press("5");
    expect((await snapshot(page)).screen).toBe("map");

    await page.keyboard.press("1");
    const opened = await snapshot(page);
    expect(opened.screen).toBe("conversation");
    expect(opened.activeRoute).toBe("trio");
    expect(opened.routes.trio.chapter).toBe(0);
    expect(opened.routes.trio.memories).toHaveLength(0);

    await page.keyboard.press("1");
    expect((await snapshot(page)).screen).toBe("reflection");
    await page.keyboard.press("Enter");
    expect((await snapshot(page)).screen).toBe("route-interlude");

    await page.keyboard.press("r");
    const reset = await snapshot(page);
    expect(reset.screen).toBe("title");
    expect(reset.economy.energy).toBe(4);
    expect(reset.routes.trio.memories).toHaveLength(0);
  });

  test("preserva atalhos globais de família, mapa, casa e quarto", async ({ page }) => {
    await openGame(page);
    await page.keyboard.press("m");
    expect((await snapshot(page)).utilityMenu).toBe("family");
    await page.keyboard.press("Escape");
    expect((await snapshot(page)).utilityMenu).toBeNull();
    await page.keyboard.press("g");
    expect((await snapshot(page)).screen).toBe("world-map");
    await page.keyboard.press("h");
    expect((await snapshot(page)).location).toBe("apartment");
    await page.keyboard.press("q");
    expect((await snapshot(page)).location).toBe("player-room");
  });

  test("abre o painel Access sem consumir a tela atual e o fecha por Escape", async ({ page }) => {
    await openGame(page);
    await page.keyboard.press("a");
    const opened = await snapshot(page);
    expect(opened.screen).toBe("dashboard");
    expect(opened.accessibility.panelOpen).toBe(true);
    await page.keyboard.press("Escape");
    expect((await snapshot(page)).accessibility.panelOpen).toBe(false);
  });
});
