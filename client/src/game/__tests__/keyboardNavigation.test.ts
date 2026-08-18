import { describe, expect, it } from "vitest";
import { resolveKeyboardCommand, type KeyboardScreen } from "../keyboardNavigation";

describe("resolveKeyboardCommand", () => {
  it("KBD-01: resolves reset before any screen-specific command", () => {
    expect(resolveKeyboardCommand("conversation", "R")).toEqual({ type: "reset" });
  });

  it("KBD-02: opens the prologue from the title and allows a clean skip", () => {
    expect(resolveKeyboardCommand("title", "Enter")).toEqual({ type: "open-prologue" });
    expect(resolveKeyboardCommand("title", "S")).toEqual({ type: "open-dashboard" });
    expect(resolveKeyboardCommand("dashboard", "Enter")).toBeNull();
  });

  it("KBD-10: advances or skips the prologue without competing global navigation", () => {
    expect(resolveKeyboardCommand("prologue", "Enter")).toEqual({ type: "advance-prologue" });
    expect(resolveKeyboardCommand("prologue", "S")).toEqual({ type: "skip-prologue" });
    expect(resolveKeyboardCommand("prologue", "m")).toBeNull();
  });

  it("KBD-03 and KBD-04: resolves one dashboard destination per key", () => {
    expect(resolveKeyboardCommand("dashboard", "1")).toEqual({ type: "open-screen", screen: "actions" });
    expect(resolveKeyboardCommand("dashboard", "4")).toEqual({ type: "open-screen", screen: "market" });
    expect(resolveKeyboardCommand("dashboard", "5")).toEqual({ type: "open-map" });
  });

  it("KBD-05: opens a route from the conversation map without choosing a dialogue option", () => {
    expect(resolveKeyboardCommand("map", "1")).toEqual({ type: "open-route", route: "trio" });
    expect(resolveKeyboardCommand("map", "5")).toEqual({ type: "open-route", route: "saskia" });
  });

  it("KBD-06: chooses only one numbered conversation intention", () => {
    expect(resolveKeyboardCommand("conversation", "1")).toEqual({ type: "choose", index: 0 });
    expect(resolveKeyboardCommand("conversation", "3")).toEqual({ type: "choose", index: 2 });
  });

  it("KBD-07: advances reflection and returns from finale without competing commands", () => {
    expect(resolveKeyboardCommand("route-interlude", "Enter")).toEqual({ type: "open-screen", screen: "actions" });
    expect(resolveKeyboardCommand("reflection", "Enter")).toEqual({ type: "advance" });
    expect(resolveKeyboardCommand("finale", "Enter")).toEqual({ type: "open-map" });
  });

  it("KBD-08: returns to the dashboard only from designated transient screens", () => {
    const transientScreens: KeyboardScreen[] = ["actions", "store", "wallet", "market", "economy-feedback", "world-map", "location", "map", "route-interlude"];
    transientScreens.forEach((screen) => expect(resolveKeyboardCommand(screen, "Escape")).toEqual({ type: "return-dashboard" }));
    expect(resolveKeyboardCommand("conversation", "Escape")).toBeNull();
  });

  it("KBD-09: keeps global map, home and room shortcuts deterministic", () => {
    expect(resolveKeyboardCommand("dashboard", "m")).toEqual({ type: "open-world-map" });
    expect(resolveKeyboardCommand("map", "h")).toEqual({ type: "return-home" });
    expect(resolveKeyboardCommand("conversation", "q")).toEqual({ type: "return-room" });
  });

  it("selects a routine category and one visible activity without affecting navigation", () => {
    expect(resolveKeyboardCommand("actions", "c")).toEqual({ type: "select-action-category", category: "care" });
    expect(resolveKeyboardCommand("actions", "d")).toEqual({ type: "select-action-category", category: "social" });
    expect(resolveKeyboardCommand("actions", "1")).toEqual({ type: "run-visible-activity", index: 0 });
  });

  it("maps locations and ignores keys outside the current screen contract", () => {
    expect(resolveKeyboardCommand("world-map", "8")).toEqual({ type: "travel", destination: "coast" });
    expect(resolveKeyboardCommand("world-map", "9")).toBeNull();
    expect(resolveKeyboardCommand("wallet", "2")).toBeNull();
  });
});
