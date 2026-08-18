import { expect, type Page } from "@playwright/test";

export type GameSnapshot = {
  screen: string;
  activeRoute: string | null;
  actionCategory: string;
  location: string;
  economy: {
    day: number;
    slot: number;
    energy: number;
    personal: number;
    family: number;
    invested: number;
    investedThisWeek: number;
    inventory: string[];
    lastUpdate: { title: string; text: string; costLabel: string } | null;
  };
  routes: Record<string, { chapter: number; complete: boolean; needsRoutine: boolean; metrics: { bond: number; clarity: number; safety: number; tension: number }; memories: string[] }>;
  beat: { title: string; choiceIds: string[] } | null;
  outcome: { title: string; line: string; detail: string } | null;
};

declare global {
  interface Window {
    __CROE_TEST__?: {
      snapshot(): GameSnapshot;
      reset(): void;
      setState(input: unknown): void;
      runActivity(id: string): void;
      buy(id: string): void;
      invest(profile: "reserve" | "neighborhood" | "violet"): void;
      travel(destination: string): void;
      openRoute(route: string): void;
      choose(index: number): void;
      advance(): void;
    };
  }
}

export async function openGame(page: Page, demo = "week") {
  await page.goto(`/?demo=${demo}&e2e=1`);
  await expect(page.locator("canvas[aria-label]")).toBeAttached();
  await page.waitForFunction(() => Boolean(window.__CROE_TEST__));
}

export async function snapshot(page: Page) {
  return page.evaluate(() => window.__CROE_TEST__!.snapshot());
}

export async function patchState(page: Page, input: unknown) {
  await page.evaluate((next) => window.__CROE_TEST__!.setState(next), input);
}

export async function callGame(page: Page, method: "reset" | "runActivity" | "buy" | "invest" | "travel" | "openRoute" | "choose" | "advance", value?: string | number) {
  await page.evaluate(({ name, argument }) => {
    const game = window.__CROE_TEST__!;
    if (name === "reset") return game.reset();
    if (name === "runActivity") return game.runActivity(argument as string);
    if (name === "buy") return game.buy(argument as string);
    if (name === "invest") return game.invest(argument as "reserve" | "neighborhood" | "violet");
    if (name === "travel") return game.travel(argument as string);
    if (name === "openRoute") return game.openRoute(argument as string);
    if (name === "choose") return game.choose(argument as number);
    return game.advance();
  }, { name: method, argument: value });
}
