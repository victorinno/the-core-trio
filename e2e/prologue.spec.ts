import { expect, test } from "@playwright/test";
import { openGame, snapshot } from "./helpers";

test.describe("Static cinematic prologue", () => {
  test("opens as a held scene, advances once per Enter press, and skips cleanly to Week One", async ({ page }) => {
    await openGame(page, "prologue");
    await expect.poll(() => snapshot(page)).toMatchObject({ screen: "prologue", prologueScene: 0 });

    await page.keyboard.press("Enter");
    await expect.poll(() => snapshot(page)).toMatchObject({ screen: "prologue", prologueScene: 1 });

    await page.keyboard.press("s");
    await expect.poll(() => snapshot(page)).toMatchObject({ screen: "dashboard", prologueScene: null });
  });
});
