/**
 * STYLE — Keyboard input resolves intent once, then GameWorld performs the scene-side effect.
 * This module is deliberately pure so navigation regressions can be tested without Babylon or DOM state.
 */
import type { LocationId } from "./locations";
import type { RouteId } from "./story";

export type KeyboardScreen =
  | "title"
  | "prologue"
  | "dashboard"
  | "actions"
  | "store"
  | "wallet"
  | "market"
  | "economy-feedback"
  | "world-map"
  | "location"
  | "map"
  | "route-interlude"
  | "conversation"
  | "reflection"
  | "finale";

export type KeyboardActionCategory = "work" | "care" | "social";

export type KeyboardCommand =
  | { type: "reset" }
  | { type: "toggle-accessibility" }
  | { type: "open-dashboard" }
  | { type: "open-prologue" }
  | { type: "advance-prologue" }
  | { type: "skip-prologue" }
  | { type: "open-world-map" }
  | { type: "return-home" }
  | { type: "return-room" }
  | { type: "travel"; destination: LocationId }
  | { type: "open-screen"; screen: "actions" | "store" | "wallet" | "market" }
  | { type: "open-map" }
  | { type: "open-route"; route: RouteId }
  | { type: "select-action-category"; category: KeyboardActionCategory }
  | { type: "run-visible-activity"; index: number }
  | { type: "choose"; index: number }
  | { type: "advance" }
  | { type: "return-dashboard" };

const dashboardScreens: Array<"actions" | "store" | "wallet" | "market"> = ["actions", "store", "wallet", "market"];
const routeIds: RouteId[] = ["trio", "alice", "elise", "raven", "saskia"];
const destinations: LocationId[] = ["apartment", "player-room", "downtown", "soleil", "market", "violet", "station", "coast"];
const dashboardReturnScreens: KeyboardScreen[] = ["actions", "store", "wallet", "market", "economy-feedback", "world-map", "location", "map", "route-interlude"];

export function resolveKeyboardCommand(screen: KeyboardScreen, key: string): KeyboardCommand | null {
  const normalized = key.toLowerCase();
  if (normalized === "r") return { type: "reset" };
  if (normalized === "a") return { type: "toggle-accessibility" };
  if (screen === "prologue" && key === "Enter") return { type: "advance-prologue" };
  if (screen === "prologue" && normalized === "s") return { type: "skip-prologue" };
  if (screen === "prologue") return null;
  if (normalized === "m") return { type: "open-world-map" };
  if (normalized === "h") return { type: "return-home" };
  if (normalized === "q") return { type: "return-room" };

  if (screen === "title" && key === "Enter") return { type: "open-prologue" };
  if (screen === "title" && normalized === "s") return { type: "open-dashboard" };

  if (screen === "world-map" && /^[1-8]$/.test(key)) {
    return { type: "travel", destination: destinations[Number(key) - 1] };
  }

  if (screen === "dashboard" && /^[1-5]$/.test(key)) {
    if (key === "5") return { type: "open-map" };
    return { type: "open-screen", screen: dashboardScreens[Number(key) - 1] };
  }

  if (screen === "map" && /^[1-5]$/.test(key)) {
    return { type: "open-route", route: routeIds[Number(key) - 1] };
  }

  if (screen === "conversation" && /^[1-3]$/.test(key)) {
    return { type: "choose", index: Number(key) - 1 };
  }

  if (screen === "actions" && normalized === "w") return { type: "select-action-category", category: "work" };
  if (screen === "actions" && normalized === "c") return { type: "select-action-category", category: "care" };
  if (screen === "actions" && normalized === "d") return { type: "select-action-category", category: "social" };
  if (screen === "actions" && /^[1-9]$/.test(key)) return { type: "run-visible-activity", index: Number(key) - 1 };

  if (screen === "route-interlude" && key === "Enter") return { type: "open-screen", screen: "actions" };
  if (screen === "reflection" && key === "Enter") return { type: "advance" };
  if (screen === "finale" && key === "Enter") return { type: "open-map" };
  if (dashboardReturnScreens.includes(screen) && key === "Escape") return { type: "return-dashboard" };
  return null;
}
