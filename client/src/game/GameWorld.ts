/**
 * STYLE — Quiet Presence: the illustrated location owns the frame; HUD and planning sheets are restrained.
 * Use one plum primary action, charcoal secondary rows, compact utility chrome, and frameless scene choices.
 */
import type { Scene } from "@babylonjs/core/scene";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Button } from "@babylonjs/gui/2D/controls/button";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { Ellipse } from "@babylonjs/gui/2D/controls/ellipse";
import { Grid } from "@babylonjs/gui/2D/controls/grid";
import { Image } from "@babylonjs/gui/2D/controls/image";
import { Rectangle } from "@babylonjs/gui/2D/controls/rectangle";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { ASSETS, type PortraitKey } from "./assets";
import {
  ACTIVITIES,
  PROFILE_DETAILS,
  STORE_ITEMS,
  buyItem,
  contribute,
  createEconomyState,
  invest,
  isWeekend,
  performActivity,
  slotName,
  travel,
  weekNumber,
  withdraw,
  type ActivityId,
  type EconomyState,
  type ItemId,
  type InvestmentProfile,
} from "./economy";
import { LOCATIONS, travelBlocks, type LocationId } from "./locations";
import { resolveKeyboardCommand, type KeyboardActionCategory, type KeyboardScreen } from "./keyboardNavigation";
import { PROLOGUE_SCENES } from "./prologue";
import {
  applyEffect,
  createRelationshipStates,
  relationshipOutcome,
  relationshipStatus,
  type RelationshipMetric,
  type RelationshipState,
} from "./relationship";
import { meetsRouteRequirement, OPENING_LINE, ROUTES, type ConversationBeat, type Intention, type NarrativeRoute, type RouteId, type StoryChoice } from "./story";

type Screen = KeyboardScreen;
type ActionCategory = KeyboardActionCategory;
type UtilityMenu = "calendar" | "npcs" | "bank" | "family";

type E2eStatePatch = {
  screen?: Screen;
  activeRoute?: RouteId | null;
  actionCategory?: ActionCategory;
  location?: LocationId;
  economy?: Partial<EconomyState>;
  route?: Partial<RelationshipState> & { metrics?: Partial<RelationshipState["metrics"]> };
};

type E2eSnapshot = {
  screen: Screen;
  prologueScene: number | null;
  accessibility: { textScale: "standard" | "large"; highContrast: boolean; reducedMotion: boolean; panelOpen: boolean };
  utilityMenu: UtilityMenu | null;
  activeRoute: RouteId | null;
  actionCategory: ActionCategory;
  location: LocationId;
  economy: EconomyState;
  routes: Record<RouteId, RelationshipState>;
  beat: { title: string; choiceIds: string[] } | null;
  outcome: { title: string; line: string; detail: string } | null;
};

type AccessibilitySettings = {
  textScale: "standard" | "large";
  highContrast: boolean;
  reducedMotion: boolean;
};

declare global {
  interface Window {
    __CROE_TEST__?: {
      snapshot: () => E2eSnapshot;
      reset: () => void;
      setState: (input: E2eStatePatch) => void;
      runActivity: (id: ActivityId) => void;
      buy: (id: ItemId) => void;
      invest: (profile: InvestmentProfile) => void;
      travel: (destination: LocationId) => void;
      openRoute: (route: RouteId) => void;
      choose: (index: number) => void;
      advance: () => void;
    };
  }
}

const INTENTION_COLORS: Record<Intention, string> = {
  Escutar: "#D69468",
  Perguntar: "#92B6D9",
  "Ser honesto": "#D47394",
  "Dar espaço": "#9ABBA1",
};

const METRICS: Array<{ id: RelationshipMetric; short: string; label: string; color: string }> = [
  { id: "bond", short: "V", label: "Vínculo", color: "#D69468" },
  { id: "clarity", short: "C", label: "Clareza", color: "#92B6D9" },
  { id: "safety", short: "S", label: "Segurança", color: "#9ABBA1" },
  { id: "tension", short: "T", label: "Tensão", color: "#D47394" },
];

const LOCATION_BACKDROP: Record<LocationId, "locationApartment" | "locationBedroom" | "locationDowntown" | "locationSoleil" | "locationMarket" | "locationViolet" | "locationStation" | "locationCoast"> = {
  apartment: "locationApartment",
  "player-room": "locationBedroom",
  downtown: "locationDowntown",
  soleil: "locationSoleil",
  market: "locationMarket",
  violet: "locationViolet",
  station: "locationStation",
  coast: "locationCoast",
};

export class GameWorld {
  private readonly ui: AdvancedDynamicTexture;
  private dynamicControls: Control[] = [];
  private readonly onKeyDown: (event: KeyboardEvent) => void;
  private readonly onWindowResize: () => void;
  private activeScreen: Screen = "title";
  private activeRoute: RouteId | null = null;
  private activeChoice: StoryChoice | null = null;
  private prologueSceneIndex = 0;
  private states = createRelationshipStates();
  private economy: EconomyState = createEconomyState();
  private actionCategory: ActionCategory = "work";
  private location: LocationId = "apartment";
  private accessibility: AccessibilitySettings = this.loadAccessibility();
  private accessibilityOpen = false;
  private utilityMenu: UtilityMenu | null = null;
  private locationBackground: Image | null = null;
  private narrow = window.innerWidth < 720;
  private elapsed = 0;
  private pulse: Ellipse | null = null;
  private readonly demoMode = new URLSearchParams(window.location.search).get("demo");
  private readonly demoEnabled = new URLSearchParams(window.location.search).has("demo");
  private readonly e2eEnabled = import.meta.env.DEV && new URLSearchParams(window.location.search).get("e2e") === "1";

  constructor(private readonly scene: Scene) {
    this.ui = AdvancedDynamicTexture.CreateFullscreenUI("croe-ui", true, scene);
    this.configureScale();
    this.createAtmosphere();
    this.onKeyDown = (event) => this.handleKeydown(event);
    this.onWindowResize = () => this.handleResize();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("resize", this.onWindowResize);
    scene.onBeforeRenderObservable.add(() => this.update());

    if (this.demoMode === "prologue") {
      this.activeScreen = "prologue";
    } else if (this.demoMode === "week") {
      this.activeScreen = "dashboard";
    } else if (this.demoMode === "world") {
      this.activeScreen = "world-map";
    } else if (this.demoMode === "location") {
      this.location = "downtown";
      this.activeScreen = "location";
    } else if (this.demoMode === "actions") {
      this.activeScreen = "actions";
    } else if (this.demoMode === "store") {
      this.activeScreen = "store";
    } else if (this.demoMode === "wallet") {
      this.activeScreen = "wallet";
    } else if (this.demoMode === "market") {
      this.activeScreen = "market";
    } else if (this.demoMode === "pamela") {
      this.activeRoute = "trio";
      this.activeScreen = "conversation";
    } else if (this.demoMode === "pamela-date") {
      this.activeRoute = "trio";
      this.states.trio = {
        ...this.states.trio,
        chapter: 3,
        metrics: { bond: 3, clarity: 3, safety: 4, tension: 2 },
        memories: ["Você devolveu a Pamela a escolha de como contar a própria história.", "Você deixou o tempo de Pamela existir sem punição."],
      };
      this.activeScreen = "conversation";
    } else if (this.demoMode === "pamela-finale") {
      this.activeRoute = "trio";
      this.states.trio = {
        ...this.states.trio,
        chapter: 4,
        complete: true,
        metrics: { bond: 5, clarity: 5, safety: 5, tension: 1 },
        memories: ["Você perguntou o que ‘perto’ significava para Pamela hoje.", "Você deixou o tempo de Pamela existir sem punição.", "Vocês escolheram uma noite sem pedir que ela provasse nada.", "Vocês criaram uma forma de perguntar cedo."],
      };
      this.activeScreen = "finale";
    } else if (this.demoEnabled) {
      this.activeRoute = "trio";
      this.activeChoice = ROUTES.trio.beats[0].choices[2];
      this.states.trio = applyEffect(this.states.trio, this.activeChoice.effect);
      this.activeScreen = "reflection";
    }
    this.installE2eBridge();
    this.render();
  }

  private e2eSnapshot(): E2eSnapshot {
    const route = this.requireRoute();
    const state = this.activeRoute ? this.states[this.activeRoute] : null;
    const beat = route && state && !state.complete ? this.resolveBeat(route, state) : null;
    return structuredClone({
      screen: this.activeScreen,
      prologueScene: this.activeScreen === "prologue" ? this.prologueSceneIndex : null,
      accessibility: { ...this.accessibility, panelOpen: this.accessibilityOpen },
      utilityMenu: this.utilityMenu,
      activeRoute: this.activeRoute,
      actionCategory: this.actionCategory,
      location: this.location,
      economy: this.economy,
      routes: this.states,
      beat: beat ? { title: beat.title, choiceIds: beat.choices.map((choice) => choice.id) } : null,
      outcome: route?.outcome && state?.complete ? route.outcome(state.metrics) : null,
    });
  }

  private applyE2eState(input: E2eStatePatch) {
    if (input.economy) {
      this.economy = {
        ...this.economy,
        ...input.economy,
        inventory: input.economy.inventory ? [...input.economy.inventory] : this.economy.inventory,
        purchasedItemsThisWeek: input.economy.purchasedItemsThisWeek ? [...input.economy.purchasedItemsThisWeek] : this.economy.purchasedItemsThisWeek,
        usedCareThisWeek: input.economy.usedCareThisWeek ? [...input.economy.usedCareThisWeek] : this.economy.usedCareThisWeek,
      };
    }
    if (input.route) {
      const current = this.states.trio;
      this.states.trio = {
        ...current,
        ...input.route,
        metrics: { ...current.metrics, ...input.route.metrics },
        memories: input.route.memories ? [...input.route.memories] : current.memories,
      };
    }
    if (input.location) this.location = input.location;
    if (input.actionCategory) this.actionCategory = input.actionCategory;
    if (input.activeRoute !== undefined) this.activeRoute = input.activeRoute;
    if (input.screen) this.activeScreen = input.screen;
    this.render();
  }

  private installE2eBridge() {
    if (!this.e2eEnabled) return;
    window.__CROE_TEST__ = {
      snapshot: () => this.e2eSnapshot(),
      reset: () => this.reset(),
      setState: (input) => this.applyE2eState(input),
      runActivity: (id) => this.runActivity(id),
      buy: (id) => this.buy(id),
      invest: (profile) => this.investMoney(profile),
      travel: (destination) => this.travelTo(destination),
      openRoute: (route) => this.openRoute(route),
      choose: (index) => {
        if (!this.activeRoute) return;
        const route = ROUTES[this.activeRoute];
        const choice = this.resolveBeat(route, this.states[this.activeRoute]).choices[index];
        if (choice) this.choose(choice);
      },
      advance: () => (this.activeScreen === "prologue" ? this.advancePrologue() : this.advance()),
    };
  }

  private configureScale() {
    this.ui.idealWidth = this.narrow ? 720 : 1600;
    this.ui.renderAtIdealSize = false;
  }

  private createAtmosphere() {
    const background = new Image("croe-location-background", ASSETS.penthouse);
    background.width = "100%";
    background.height = "100%";
    background.stretch = Image.STRETCH_FILL;
    background.isPointerBlocker = false;
    this.ui.addControl(background);
    this.locationBackground = background;

    const wash = new Rectangle("blue-glass-wash");
    wash.width = "100%";
    wash.height = "100%";
    wash.background = "#071126";
    wash.alpha = 0.5;
    wash.thickness = 0;
    wash.isPointerBlocker = false;
    this.ui.addControl(wash);

    const halo = new Ellipse("plum-halo");
    halo.width = "460px";
    halo.height = "460px";
    halo.background = "#B84A71";
    halo.alpha = 0.025;
    halo.thickness = 1;
    halo.color = "#D4739455";
    halo.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    halo.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    halo.left = "-70px";
    halo.top = "-185px";
    halo.isPointerBlocker = false;
    this.ui.addControl(halo);

    const dots = [
      ["22%", "16%", "#D69468"],
      ["29%", "11%", "#F2D4B3"],
      ["36%", "17%", "#D47394"],
      ["43%", "10%", "#92B6D9"],
      ["50%", "19%", "#9ABBA1"],
    ] as const;
    dots.forEach(([left, top, color], index) => {
      const dot = new Ellipse(`connection-dot-${index}`);
      dot.width = index === 2 ? "10px" : "6px";
      dot.height = index === 2 ? "10px" : "6px";
      dot.background = color;
      dot.alpha = index === 2 ? 0.16 : 0.06;
      dot.thickness = 0;
      dot.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      dot.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      dot.left = left;
      dot.top = top;
      dot.isPointerBlocker = false;
      this.ui.addControl(dot);
      if (index === 2) this.pulse = dot;
    });

    [
      ["18%", "17.1%", "86px", "#D69468"],
      ["29%", "12.1%", "92px", "#B84A71"],
      ["40%", "17.1%", "86px", "#92B6D9"],
    ].forEach(([left, top, width, color], index) => {
      const line = new Rectangle(`relationship-line-${index}`);
      line.width = width;
      line.height = "1px";
      line.background = color;
      line.alpha = 0.12;
      line.thickness = 0;
      line.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      line.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      line.left = left;
      line.top = top;
      line.isPointerBlocker = false;
      this.ui.addControl(line);
    });

    ["8%", "57%", "82%"].forEach((left, index) => {
      const frame = new Rectangle(`glass-frame-${index}`);
      frame.width = index === 1 ? "22%" : "11%";
      frame.height = "100%";
      frame.color = "#C8D7E322";
      frame.thickness = 1;
      frame.background = "#071126";
      frame.alpha = 0.01;
      frame.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      frame.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      frame.left = left;
      frame.top = "0%";
      frame.isPointerBlocker = false;
      this.ui.addControl(frame);
    });
  }

  private update() {
    this.elapsed += this.scene.getEngine().getDeltaTime() / 1000;
    if (this.pulse) this.pulse.alpha = this.accessibility.reducedMotion ? 0.56 : 0.56 + Math.sin(this.elapsed * 1.6) * 0.24;
  }

  private add<T extends Control>(control: T): T {
    this.ui.addControl(control);
    this.dynamicControls.push(control);
    return control;
  }

  private clearDynamic() {
    this.dynamicControls.forEach((control) => {
      this.ui.removeControl(control);
      control.dispose();
    });
    this.dynamicControls = [];
  }

  private text(name: string, value: string, size: number, color = "#FAF1E9") {
    const node = new TextBlock(name, value);
    node.fontFamily = "Manrope";
    node.fontSize = Math.round(size * this.textScaleFactor());
    node.color = this.accessibility.highContrast ? "#FFFFFF" : color;
    node.width = "100%";
    node.textWrapping = true;
    node.resizeToFit = false;
    node.isPointerBlocker = false;
    return node;
  }

  private panel(name: string, width: string, height: string, accent = "#C57B94") {
    const node = new Rectangle(name);
    node.width = width;
    node.height = height;
    node.background = this.accessibility.highContrast ? "#020713" : "#0A1222";
    node.alpha = this.accessibility.highContrast ? 0.99 : 0.88;
    node.thickness = 1;
    node.color = this.accessibility.highContrast ? "#FFFFFF" : "#FFFFFF2A";
    node.cornerRadius = this.narrow ? 8 : 10;
    return node;
  }

  private textScaleFactor() {
    return this.accessibility.textScale === "large" ? 1.2 : 1;
  }

  private loadAccessibility(): AccessibilitySettings {
    const fallback: AccessibilitySettings = { textScale: "standard", highContrast: false, reducedMotion: false };
    try {
      const stored = window.sessionStorage.getItem("croe-accessibility");
      return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
    } catch {
      return fallback;
    }
  }

  private saveAccessibility() {
    try {
      window.sessionStorage.setItem("croe-accessibility", JSON.stringify(this.accessibility));
    } catch {
      // Storage can be unavailable; controls remain active for the current runtime.
    }
  }

  private toggleAccessibility() {
    this.accessibilityOpen = !this.accessibilityOpen;
    this.render();
  }

  private openUtility(utility: UtilityMenu) {
    this.utilityMenu = this.utilityMenu === utility ? null : utility;
    this.render();
  }

  private applyLocationBackground() {
    if (!this.locationBackground) return;
    if (this.activeScreen === "title" || this.activeScreen === "prologue") {
      this.locationBackground.source = ASSETS.penthouse;
      return;
    }
    this.locationBackground.source = ASSETS[LOCATION_BACKDROP[this.location]];
  }

  private buildHeader(routeId: RouteId | null = this.activeRoute) {
    const bar = this.add(new Rectangle("top-bar"));
    bar.width = "100%";
    bar.height = this.narrow ? "54px" : "58px";
    bar.background = "#071126";
    bar.alpha = 0.58;
    bar.thickness = 0;
    bar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    const logo = new StackPanel("croe-mark");
    logo.width = this.narrow ? "40px" : "48px";
    logo.height = "26px";
    logo.isVertical = false;
    logo.spacing = this.narrow ? 4 : 5;
    logo.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    logo.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    logo.left = this.narrow ? "14px" : "24px";
    bar.addControl(logo);
    ["#D69468", "#B84A71", "#92B6D9"].forEach((color, index) => {
      const curve = new Ellipse(`croe-line-${index}`);
      curve.width = this.narrow ? "10px" : "12px";
      curve.height = this.narrow ? "22px" : "25px";
      curve.thickness = 1;
      curve.color = color;
      curve.background = "#071126";
      curve.alpha = index === 1 ? 1 : 0.72;
      logo.addControl(curve);
    });

    const wordmark = this.text("croe-wordmark", "THE CROE TRIO", this.narrow ? 13 : 16);
    wordmark.fontFamily = "DM Serif Display";
    wordmark.fontWeight = "700";
    wordmark.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    wordmark.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    wordmark.left = this.narrow ? "62px" : "82px";
    wordmark.width = this.narrow ? "160px" : "220px";
    bar.addControl(wordmark);

    const access = Button.CreateSimpleButton("open-accessibility", "A  ACCESS");
    access.width = this.narrow ? "52px" : "58px";
    access.height = this.narrow ? "23px" : "25px";
    access.color = "#E8B5C6";
    access.fontFamily = "Manrope";
    access.fontSize = this.narrow ? 8 : 9;
    access.fontWeight = "700";
    access.background = this.accessibility.highContrast ? "#B84A71" : "#162642";
    access.cornerRadius = 7;
    access.thickness = 1;
    access.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    access.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    access.left = this.narrow ? "-10px" : "-18px";
    access.top = this.narrow ? "6px" : "7px";
    access.onPointerClickObservable.add(() => this.toggleAccessibility());
    bar.addControl(access);

    const hint = this.text("top-utility-hint", "", this.narrow ? 9 : 10, "#B8C9D9");
    hint.width = this.narrow ? "220px" : "340px";
    hint.height = "14px";
    hint.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    hint.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    hint.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    hint.left = this.narrow ? "-10px" : "-24px";
    hint.top = "-3px";
    bar.addControl(hint);

    const rail = new StackPanel("utility-icon-rail");
    rail.width = this.narrow ? "282px" : "454px";
    rail.height = "25px";
    rail.isVertical = false;
    rail.spacing = this.narrow ? 3 : 5;
    rail.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rail.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    rail.left = this.narrow ? "-8px" : "-86px";
    bar.addControl(rail);
    const utilities: Array<[string, string, () => void]> = [
      ["◒", "Energy — focused actions remaining", () => this.openUtility("calendar")],
      ["CAL", "Calendar (C) — week, day and time", () => this.openUtility("calendar")],
      ["NPC", "NPC status (N) — availability and pace", () => this.openUtility("npcs")],
      ["BANK", "Player bank (B) — personal money", () => this.openUtility("bank")],
      ["FAM", "Family money (M) — shared household fund", () => this.openUtility("family")],
      ["ROOM", "Player bedroom (Q)", () => this.returnToBedroom()],
      ["HOME", "Home (H) — apartment", () => this.returnToApartment()],
      ["WORLD", "World map (G)", () => this.openWorldMap()],
    ];
    utilities.forEach(([label, description, handler], index) => {
      const button = Button.CreateSimpleButton(`utility-${index}`, label);
      button.width = this.narrow ? "31px" : label.length > 3 ? "48px" : "31px";
      button.height = "23px";
      button.color = "#D8E6F2";
      button.fontFamily = "Manrope";
      button.fontSize = this.narrow ? 6 : 7;
      button.fontWeight = "700";
      button.background = "#0F1A2BCC";
      button.cornerRadius = 6;
      button.thickness = 1;
      button.onPointerEnterObservable.add(() => { hint.text = description; button.background = "#223452"; });
      button.onPointerOutObservable.add(() => { hint.text = ""; button.background = "#0F1A2BCC"; });
      button.onPointerClickObservable.add(handler);
      rail.addControl(button);
    });

    if (false && this.activeScreen !== "title" && this.activeScreen !== "prologue") {
      const nav = new StackPanel("persistent-place-nav");
      nav.width = this.narrow ? "250px" : "290px";
      nav.height = "38px";
      nav.isVertical = false;
      nav.spacing = this.narrow ? 5 : 7;
      nav.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      nav.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      nav.left = this.narrow ? "276px" : "360px";
      bar.addControl(nav);
      const controls: Array<[string, string, () => void, string]> = [
        ["nav-apartment", "CASA", () => this.returnToApartment(), "#B84A71"],
        ["nav-bedroom", "QUARTO", () => this.returnToBedroom(), "#385A88"],
        ["nav-map", "MAPA", () => this.openWorldMap(), "#285B57"],
      ];
      controls.forEach(([name, label, handler, color]) => {
        const button = Button.CreateSimpleButton(name, label);
        button.width = this.narrow ? "76px" : "88px";
        button.height = this.narrow ? "30px" : "32px";
        button.color = "#FFF8F2";
        button.fontFamily = "Manrope";
        button.fontSize = this.narrow ? 9 : 11;
        button.fontWeight = "700";
        button.background = color;
        button.cornerRadius = 10;
        button.thickness = 0;
        button.hoverCursor = "pointer";
        button.onPointerClickObservable.add(handler);
        nav.addControl(button);
      });
    }
  }

  private buildUtilityMenu() {
    if (!this.utilityMenu || this.activeScreen === "title" || this.activeScreen === "prologue") return;
    const menu = this.add(this.panel("utility-context-menu", this.narrow ? "88%" : "360px", this.narrow ? "188px" : "164px", "#92B6D9"));
    menu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    menu.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    menu.left = this.narrow ? "-6%" : "-24px";
    menu.top = this.narrow ? "82px" : "92px";
    menu.alpha = 0.97;
    const content = new StackPanel("utility-context-content");
    content.width = "86%";
    content.height = "82%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.spacing = 5;
    menu.addControl(content);
    const copy: Record<UtilityMenu, [string, string]> = {
      calendar: [`WEEK ${weekNumber(this.economy)} · DAY ${this.economy.day}`, `${slotName(this.economy)} · Energy ${this.economy.energy}/4`],
      npcs: ["WHO IS AVAILABLE", Object.values(ROUTES).map((route) => `${route.people} — ${relationshipStatus(this.states[route.id].metrics)}`).join("\n")],
      bank: ["PLAYER BANK", `Personal $${this.economy.personal} · Invested $${this.economy.invested}`],
      family: ["FAMILY FUND", `$${this.economy.family} shared · contributions support the household`],
    };
    const [title, detail] = copy[this.utilityMenu];
    const heading = this.text("utility-heading", title, this.narrow ? 13 : 14, "#BFD5EA");
    heading.fontWeight = "700";
    heading.height = "28px";
    content.addControl(heading);
    const body = this.text("utility-body", detail, this.narrow ? 13 : 15, "#FAF1E9");
    body.height = this.utilityMenu === "npcs" ? (this.narrow ? "106px" : "84px") : this.narrow ? "72px" : "54px";
    content.addControl(body);
    const close = this.createButton("utility-close", "Close", "110px", "30px", "#385A88", () => { this.utilityMenu = null; this.render(); });
    close.fontSize = this.narrow ? 10 : 11;
    content.addControl(close);
  }

  private addPortrait(key: PortraitKey, index: number, total: number, alpha = 1) {
    const portrait = this.add(new Image(`portrait-${key}-${index}`, ASSETS[key]));
    portrait.width = this.narrow ? (total > 1 ? "37%" : "50%") : total > 1 ? "30%" : "38%";
    portrait.height = this.narrow ? (total > 1 ? "32%" : "44%") : total > 1 ? "55%" : "70%";
    portrait.stretch = Image.STRETCH_UNIFORM;
    portrait.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    portrait.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    portrait.left = this.narrow ? `${-4 - index * 28}%` : `${-4 - index * 22}%`;
    portrait.top = this.narrow ? "-12%" : "-4%";
    portrait.alpha = alpha;
    portrait.isPointerBlocker = false;
  }

  private addPortraits(keys: PortraitKey[], alpha = 1) {
    keys.forEach((key, index) => this.addPortrait(key, index, keys.length, alpha));
  }

  private createButton(name: string, label: string, width: string, height: string, color: string, onClick: () => void) {
    const button = Button.CreateSimpleButton(name, label);
    const primary = color === "#A93C63" || color === "#B84A71";
    const baseBackground = primary ? "#B84A71" : "#142139E8";
    button.width = width;
    button.height = height;
    button.color = "#FFF8F2";
    button.fontFamily = "Manrope";
    button.fontSize = Math.round((this.narrow ? 14 : 16) * this.textScaleFactor());
    button.fontWeight = "700";
    button.background = baseBackground;
    button.cornerRadius = 8;
    button.thickness = primary ? 0 : 1;
    button.color = primary ? "#FFF8F2" : "#E5EDF5";
    button.hoverCursor = "pointer";
    button.onPointerEnterObservable.add(() => {
      button.background = primary ? "#C85282" : "#223452";
      if (!this.accessibility.reducedMotion) {
        button.scaleX = 1.015;
        button.scaleY = 1.015;
      }
    });
    button.onPointerOutObservable.add(() => {
      button.background = baseBackground;
      button.scaleX = 1;
      button.scaleY = 1;
    });
    button.onPointerClickObservable.add(onClick);
    return button;
  }

  private buildTitle() {
    this.buildHeader(null);

    const copy = this.add(new StackPanel("title-copy"));
    copy.width = this.narrow ? "84%" : "32%";
    copy.height = this.narrow ? "420px" : "430px";
    copy.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    copy.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    copy.left = this.narrow ? "8%" : "8%";
    copy.top = this.narrow ? "-24px" : "12px";
    copy.isVertical = true;
    copy.spacing = this.narrow ? 12 : 14;

    const eyebrow = this.text("title-eyebrow", "INTERACTIVE ROMANCE · MEMORY AND CHOICE", this.narrow ? 12 : 15, "#E8B5C6");
    eyebrow.fontWeight = "700";
    eyebrow.height = "30px";
    copy.addControl(eyebrow);
    const title = this.text("title", "The Croe\nTrio", this.narrow ? 52 : 70);
    title.fontFamily = "DM Serif Display";
    title.fontWeight = "700";
    title.height = this.narrow ? "126px" : "148px";
    title.lineSpacing = "-8px";
    copy.addControl(title);
    const rule = new Rectangle("plum-rule");
    rule.width = "112px";
    rule.height = "4px";
    rule.background = "#B84A71";
    rule.thickness = 0;
    rule.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    copy.addControl(rule);
    const subtitle = this.text("title-subtitle", "A choice leaves a memory. A memory changes the next conversation.", this.narrow ? 16 : 18, "#EFE0D8");
    subtitle.height = this.narrow ? "62px" : "72px";
    subtitle.lineSpacing = "5px";
    copy.addControl(subtitle);

    const start = this.createButton("start", "Begin the story", this.narrow ? "250px" : "270px", this.narrow ? "52px" : "54px", "#A93C63", () => this.openPrologue());
    start.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    copy.addControl(start);
    const hint = this.text("title-hint", "Enter to begin · S to skip to Week One · R to restart", this.narrow ? 12 : 14, "#B8C2D4");
    hint.height = "26px";
    copy.addControl(hint);
  }

  private buildPrologue() {
    const scene = PROLOGUE_SCENES[this.prologueSceneIndex];
    const background = this.add(new Image(`prologue-background-${this.prologueSceneIndex}`, ASSETS[scene.background]));
    background.width = "100%";
    background.height = "100%";
    background.stretch = Image.STRETCH_FILL;
    background.isPointerBlocker = false;

    const shade = this.add(new Rectangle("prologue-shade"));
    shade.width = "100%";
    shade.height = "100%";
    shade.background = "#050B1D";
    shade.alpha = 0.18;
    shade.thickness = 0;
    shade.isPointerBlocker = false;
    this.buildHeader(null);

    const panel = this.add(this.panel("prologue-copy", this.narrow ? "88%" : "58%", this.narrow ? "438px" : "404px", "#B84A71"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = "0px";
    panel.top = this.narrow ? "18px" : "12px";
    panel.alpha = 0.58;

    const content = new StackPanel("prologue-content");
    content.width = "84%";
    content.height = "84%";
    content.isVertical = true;
    content.spacing = this.narrow ? 13 : 16;
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.addControl(content);
    const count = this.text("prologue-count", `${this.prologueSceneIndex + 1} / ${PROLOGUE_SCENES.length}  ·  ${scene.chapter}`, this.narrow ? 10 : 12, "#E8B5C6");
    count.fontWeight = "700";
    count.height = "26px";
    count.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(count);
    const title = this.text("prologue-title", scene.title, this.narrow ? 34 : 48, "#FFF8F2");
    title.fontFamily = "DM Serif Display";
    title.fontWeight = "700";
    title.height = this.narrow ? "72px" : "82px";
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(title);
    const divider = new Rectangle("prologue-divider");
    divider.width = "90px";
    divider.height = "3px";
    divider.background = "#B84A71";
    divider.thickness = 0;
    divider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(divider);
    const copy = this.text("prologue-copy-text", scene.copy, this.narrow ? 17 : 20, "#F4E8E0");
    copy.height = this.narrow ? "162px" : "145px";
    copy.lineSpacing = "5px";
    copy.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(copy);
    const actionLabel = this.prologueSceneIndex === PROLOGUE_SCENES.length - 1 ? "Step into Week One" : "Continue";
    const action = this.createButton("prologue-advance", actionLabel, this.narrow ? "230px" : "250px", this.narrow ? "52px" : "56px", "#A93C63", () => this.advancePrologue());
    action.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(action);
    const controls = this.text("prologue-controls", "ENTER TO CONTINUE  ·  S TO SKIP  ·  R TO RESTART", this.narrow ? 9 : 10, "#BBC7D7");
    controls.height = "18px";
    controls.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(controls);
  }

  private buildAccessibilityOverlay() {
    const veil = this.add(new Rectangle("accessibility-veil"));
    veil.width = "100%";
    veil.height = "100%";
    veil.background = "#020713";
    veil.alpha = 0.74;
    veil.thickness = 0;
    veil.isPointerBlocker = true;

    const panel = this.add(this.panel("accessibility-panel", this.narrow ? "90%" : "520px", this.narrow ? "560px" : "500px", "#92B6D9"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.alpha = this.accessibility.highContrast ? 1 : 0.96;
    const content = new StackPanel("accessibility-content");
    content.width = "82%";
    content.height = "84%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 12 : 14;
    panel.addControl(content);

    const eyebrow = this.text("accessibility-eyebrow", "PLAY YOUR WAY", this.narrow ? 11 : 13, "#92B6D9");
    eyebrow.fontWeight = "700";
    eyebrow.height = "24px";
    eyebrow.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(eyebrow);
    const heading = this.text("accessibility-heading", "Accessibility", this.narrow ? 35 : 44);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "70px" : "78px";
    heading.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(heading);
    const note = this.text("accessibility-note", "These settings apply to this session and keep the story fully playable by keyboard.", this.narrow ? 13 : 15, "#D9E3F2");
    note.height = this.narrow ? "62px" : "50px";
    note.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(note);

    const textSize = this.createButton("accessibility-text", `TEXT SIZE · ${this.accessibility.textScale === "large" ? "LARGE" : "STANDARD"}`, "100%", "48px", "#385A88", () => {
      this.accessibility.textScale = this.accessibility.textScale === "large" ? "standard" : "large";
      this.saveAccessibility();
      this.render();
    });
    content.addControl(textSize);
    const contrast = this.createButton("accessibility-contrast", `HIGH CONTRAST · ${this.accessibility.highContrast ? "ON" : "OFF"}`, "100%", "48px", this.accessibility.highContrast ? "#A93C63" : "#273C60", () => {
      this.accessibility.highContrast = !this.accessibility.highContrast;
      this.saveAccessibility();
      this.render();
    });
    content.addControl(contrast);
    const motion = this.createButton("accessibility-motion", `REDUCED MOTION · ${this.accessibility.reducedMotion ? "ON" : "OFF"}`, "100%", "48px", this.accessibility.reducedMotion ? "#285B57" : "#273C60", () => {
      this.accessibility.reducedMotion = !this.accessibility.reducedMotion;
      this.saveAccessibility();
      this.render();
    });
    content.addControl(motion);
    const help = this.text("accessibility-help", "KEYBOARD\nA  Accessibility  ·  Enter  Continue  ·  M  World map  ·  H  Home  ·  Q  Room  ·  R  Restart", this.narrow ? 10 : 12, "#BBC7D7");
    help.height = this.narrow ? "72px" : "58px";
    help.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(help);
    const close = this.createButton("accessibility-close", "Close", this.narrow ? "210px" : "230px", "48px", "#A93C63", () => this.toggleAccessibility());
    close.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(close);
  }

  private createPlanningTile(id: string, label: string, title: string, detail: string, primary: boolean, onClick: () => void) {
    const tile = new Rectangle(`planning-${id}`);
    tile.width = "48%";
    tile.height = this.narrow ? "82px" : "86px";
    tile.background = primary ? "#B84A71" : "#0E1B31E8";
    tile.color = primary ? "#D96C92" : "#FFFFFF30";
    tile.thickness = 1;
    tile.cornerRadius = 9;
    tile.isPointerBlocker = true;
    tile.hoverCursor = "pointer";
    tile.onPointerEnterObservable.add(() => { tile.background = primary ? "#C85282" : "#1D304D"; });
    tile.onPointerOutObservable.add(() => { tile.background = primary ? "#B84A71" : "#0E1B31E8"; });
    tile.onPointerClickObservable.add(onClick);

    const content = new StackPanel(`planning-${id}-content`);
    content.width = "82%";
    content.height = "92%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = 1;
    tile.addControl(content);

    const eyebrow = this.text(`planning-${id}-label`, label.toUpperCase(), this.narrow ? 8 : 9, primary ? "#FFE4EE" : "#A9BDD5");
    eyebrow.height = "16px";
    eyebrow.fontWeight = "700";
    content.addControl(eyebrow);
    const name = this.text(`planning-${id}-title`, title, this.narrow ? 14 : 16, "#FFF8F2");
    name.fontFamily = "DM Serif Display";
    name.fontWeight = "700";
    name.height = "26px";
    content.addControl(name);
    const description = this.text(`planning-${id}-detail`, detail, this.narrow ? 8 : 9, primary ? "#FFF0F5" : "#C6D4E3");
    description.height = "20px";
    content.addControl(description);
    return tile;
  }

  private buildDashboard() {
    this.buildHeader(null);
    const panel = this.add(this.panel("week-dashboard", this.narrow ? "90%" : "52%", this.narrow ? "650px" : "560px", "#B84A71"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "8%";
    panel.top = this.narrow ? "18px" : "14px";
    const content = new StackPanel("week-dashboard-content");
    content.width = "84%";
    content.height = "84%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 7 : 6;
    panel.addControl(content);

    const kicker = this.text("week-kicker", `SEMANA ${weekNumber(this.economy)} · DIA ${this.economy.day} · ${slotName(this.economy).toUpperCase()}${isWeekend(this.economy) ? " · FIM DE SEMANA" : ""}`, this.narrow ? 12 : 14, "#E8B5C6");
    kicker.fontWeight = "700";
    kicker.height = "24px";
    content.addControl(kicker);
    const heading = this.text("week-heading", "What needs your attention?", this.narrow ? 30 : 36);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "54px" : "60px";
    content.addControl(heading);
    const guidance = this.text("week-guidance", this.nextStepGuidance(), this.narrow ? 14 : 17, "#FAF1E9");
    guidance.height = this.narrow ? "54px" : "42px";
    guidance.lineSpacing = "3px";
    content.addControl(guidance);
    const status = this.text("week-status", `Energy ${this.economy.energy}/4  ·  Personal §${this.economy.personal}  ·  Family §${this.economy.family}`, this.narrow ? 11 : 13, "#C6D0DD");
    status.height = this.narrow ? "30px" : "25px";
    content.addControl(status);
    const note = this.text("week-note", "Money can prepare a moment. Care, pace, and consent determine what it means.", this.narrow ? 11 : 12, "#B9C7D7");
    note.height = this.narrow ? "34px" : "25px";
    content.addControl(note);
    if (this.economy.weeklyNotice) {
      const weeklyNotice = this.text("weekly-notice", this.economy.weeklyNotice, this.narrow ? 11 : 13, "#E7C891");
      weeklyNotice.height = this.narrow ? "42px" : "34px";
      content.addControl(weeklyNotice);
    }

    const hub = new Grid("planning-hub");
    hub.width = "100%";
    hub.height = this.narrow ? "246px" : "240px";
    hub.addColumnDefinition(0.5);
    hub.addColumnDefinition(0.5);
    hub.addRowDefinition(1 / 3);
    hub.addRowDefinition(1 / 3);
    hub.addRowDefinition(1 / 3);
    content.addControl(hub);

    const tiles: Array<[string, string, string, string, boolean, () => void]> = [
      ["time", "Today", "Time", "Choose how to show up", true, () => this.openScreen("actions")],
      ["talk", "Connections", "Conversations", "See who has room to connect", false, () => this.openMap()],
      ["map", "Places", "World map", "Choose a place to be", false, () => this.openWorldMap()],
      ["bag", "Personal", "Bag", `${this.economy.inventory.length} items ready to use`, false, () => this.openScreen("store")],
      ["house", "Shared", "Household", `Family fund §${this.economy.family}`, false, () => this.openScreen("wallet")],
      ["market", "Optional", "Market", `§${this.economy.invested} currently invested`, false, () => this.openScreen("market")],
    ];
    tiles.forEach(([id, label, title, detail, primary, handler], index) => {
      const tile = this.createPlanningTile(id, label, title, detail, primary, handler);
      tile.width = this.narrow ? "94%" : "92%";
      tile.height = this.narrow ? "70px" : "72px";
      tile.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
      tile.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      hub.addControl(tile, Math.floor(index / 2), index % 2);
    });
  }

  private buildActions() {
    this.buildHeader(null);
    const panel = this.add(this.panel("action-panel", this.narrow ? "90%" : "48%", this.narrow ? "650px" : "540px", "#D69468"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "8%";
    panel.top = this.narrow ? "18px" : "14px";
    const content = new StackPanel("action-content");
    content.width = "86%";
    content.height = "90%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 5 : 6;
    panel.addControl(content);

    const kicker = this.text("action-kicker", `DAY ${this.economy.day} · ${slotName(this.economy).toUpperCase()} · ENERGY ${this.economy.energy}/4`, this.narrow ? 11 : 13, "#D69468");
    kicker.fontWeight = "700";
    kicker.height = "21px";
    content.addControl(kicker);
    const heading = this.text("action-heading", "Choose how to show up", this.narrow ? 27 : 32);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "46px" : "50px";
    content.addControl(heading);
    const prompt = this.text("action-prompt", "Care becomes meaningful once per week; work makes room; dates need a shared sense of comfort.", this.narrow ? 10 : 12, "#B9C7D7");
    prompt.height = this.narrow ? "34px" : "28px";
    content.addControl(prompt);

    const categories: Array<{ id: ActionCategory; label: string; color: string }> = [
      { id: "work", label: "Routine & work", color: "#385A88" },
      { id: "care", label: "Care & favors", color: "#806342" },
      { id: "social", label: "Dates & gifts", color: "#A93C63" },
    ];
    categories.forEach((category) => {
      const button = this.createButton(`action-category-${category.id}`, category.label, "100%", this.narrow ? "32px" : "32px", this.actionCategory === category.id ? "#B84A71" : "#162642", () => {
        this.actionCategory = category.id;
        this.render();
      });
      button.fontSize = this.narrow ? 10 : 12;
      content.addControl(button);
    });

    const filteredActivities = this.visibleActivities();
    filteredActivities.forEach((activity, index) => {
      const suffix = activity.income ? `+§${activity.income}` : activity.cost ? `−§${activity.cost}` : activity.requires ? "uses an item" : "no cost";
      const color = activity.kind === "Trabalho" ? "#385A88" : activity.kind === "Date" ? "#A93C63" : activity.kind === "Cuidado" ? "#806342" : "#285B57";
      const repeatedCare = activity.kind === "Cuidado" && this.economy.usedCareThisWeek.includes(activity.id);
      const readiness = this.activityReadiness(activity);
      const kind = activity.kind === "Rotina" ? "ROUTINE" : activity.kind === "Trabalho" ? "WORK" : activity.kind === "Cuidado" ? "CARE" : activity.kind === "Presente" ? "GIFT" : "DATE";
      const label = `${kind} · ${activity.name}  (${suffix} · energy ${activity.energy})${repeatedCare ? " · familiar, but no new growth this week" : readiness ? ` · ${readiness}` : ""}`;
      const button = this.createButton(`action-${activity.id}`, label, "100%", this.narrow ? "46px" : "50px", color, () => this.runActivity(activity.id));
      button.fontSize = this.narrow ? 10 : 13;
      if (readiness) button.alpha = 0.64;
      content.addControl(button);
    });
  }

  private buildStore() {
    this.buildHeader(null);
    const panel = this.add(this.panel("store-panel", this.narrow ? "90%" : "48%", this.narrow ? "650px" : "560px", "#D69468"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "5%";
    panel.top = this.narrow ? "24px" : "30px";
    const content = new StackPanel("store-content");
    content.width = "86%";
    content.height = "88%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 8 : 10;
    panel.addControl(content);
    const kicker = this.text("store-kicker", `BOLSA PESSOAL · §${this.economy.personal} DISPONÍVEIS`, this.narrow ? 12 : 14, "#D69468");
    kicker.fontWeight = "700";
    kicker.height = "24px";
    content.addControl(kicker);
    const heading = this.text("store-heading", "Presentes com contexto", this.narrow ? 30 : 38);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "55px" : "62px";
    content.addControl(heading);
    const note = this.text("store-note", "Compra um item para habilitar um gesto; nunca para comprar uma resposta.", this.narrow ? 11 : 13, "#B9C7D7");
    note.height = this.narrow ? "36px" : "28px";
    content.addControl(note);
    STORE_ITEMS.forEach((item) => {
      const owned = this.economy.inventory.includes(item.id);
      const purchasedThisWeek = this.economy.purchasedItemsThisWeek.includes(item.id);
      const label = owned ? `${item.name} · guardado` : purchasedThisWeek ? `${item.name} · comprado nesta semana` : `${item.name} · §${item.cost}`;
      const button = this.createButton(`buy-${item.id}`, label, "100%", this.narrow ? "48px" : "52px", owned || purchasedThisWeek ? "#285B57" : "#273C60", () => this.buy(item.id));
      button.fontSize = this.narrow ? 12 : 14;
      content.addControl(button);
    });
    const inventory = this.text("inventory", `Inventário: ${this.economy.inventory.length ? this.economy.inventory.join(" · ") : "vazio"}`, this.narrow ? 10 : 12, "#E8B5C6");
    inventory.height = "26px";
    content.addControl(inventory);
  }

  private buildWallet() {
    this.buildHeader(null);
    const panel = this.add(this.panel("wallet-panel", this.narrow ? "90%" : "46%", this.narrow ? "510px" : "460px", "#D69468"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "7%";
    const content = new StackPanel("wallet-content");
    content.width = "82%";
    content.height = "82%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 14 : 16;
    panel.addControl(content);
    const kicker = this.text("wallet-kicker", "RECURSOS COM RESPONSABILIDADES DIFERENTES", this.narrow ? 11 : 13, "#E8B5C6");
    kicker.fontWeight = "700";
    kicker.height = "24px";
    content.addControl(kicker);
    const heading = this.text("wallet-heading", "Duas carteiras", this.narrow ? 34 : 44);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "68px" : "76px";
    content.addControl(heading);
    const personal = this.text("personal-wallet", `Pessoal  §${this.economy.personal}\nUsa para trabalho, presentes, dates e investimento simulado.`, this.narrow ? 16 : 19, "#F2C0D0");
    personal.height = this.narrow ? "78px" : "70px";
    content.addControl(personal);
    const family = this.text("family-wallet", `Fundo da família  §${this.economy.family}\nRecurso coletivo da casa; não compra cuidado individual.`, this.narrow ? 16 : 19, "#E7C891");
    family.height = this.narrow ? "78px" : "70px";
    content.addControl(family);
    const contributeButton = this.createButton("contribute", "Contribuir §30 para a casa", this.narrow ? "250px" : "280px", this.narrow ? "52px" : "56px", "#806342", () => this.contributeToFamily());
    contributeButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(contributeButton);
  }

  private buildMarket() {
    this.buildHeader(null);
    const panel = this.add(this.panel("market-panel", this.narrow ? "90%" : "48%", this.narrow ? "600px" : "530px", "#92B6D9"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "6%";
    const content = new StackPanel("market-content");
    content.width = "84%";
    content.height = "84%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 10 : 12;
    panel.addControl(content);
    const kicker = this.text("market-kicker", "CRESCENT MARKET · SIMULAÇÃO FICCIONAL", this.narrow ? 11 : 13, "#92B6D9");
    kicker.fontWeight = "700";
    kicker.height = "24px";
    content.addControl(kicker);
    const heading = this.text("market-heading", "Risco que cabe na semana", this.narrow ? 30 : 39);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "58px" : "66px";
    content.addControl(heading);
    const summary = this.text("market-summary", `Pessoal §${this.economy.personal} · Aplicado §${this.economy.invested} · Nesta semana §${this.economy.investedThisWeek}/80${this.economy.profile ? ` · ${PROFILE_DETAILS[this.economy.profile].name}` : ""}`, this.narrow ? 12 : 15, "#C6D0DD");
    summary.height = this.narrow ? "38px" : "30px";
    content.addControl(summary);
    (Object.keys(PROFILE_DETAILS) as InvestmentProfile[]).forEach((profile) => {
      const detail = PROFILE_DETAILS[profile];
      const button = this.createButton(`invest-${profile}`, `${detail.name} · risco ${detail.risk} · aplicar §40`, "100%", this.narrow ? "54px" : "58px", "#416A8A", () => this.investMoney(profile));
      button.fontSize = this.narrow ? 11 : 14;
      content.addControl(button);
    });
    const withdrawButton = this.createButton("withdraw", "Resgatar investimento fictício", this.narrow ? "245px" : "280px", this.narrow ? "50px" : "54px", "#285B57", () => this.withdrawMoney());
    withdrawButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(withdrawButton);
  }

  private buildEconomyFeedback() {
    this.buildHeader(null);
    const update = this.economy.lastUpdate ?? { title: "Nada mudou", text: "Escolhe uma ação no quadro da semana.", costLabel: "Sem custo" };
    const panel = this.add(this.panel("economy-feedback", this.narrow ? "90%" : "46%", this.narrow ? "430px" : "390px", update.route ? ROUTES[update.route].accent : "#B84A71"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "7%";
    const content = new StackPanel("economy-feedback-content");
    content.width = "82%";
    content.height = "82%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 14 : 16;
    panel.addControl(content);
    const kicker = this.text("feedback-kicker", update.route ? `CUIDADO · ${ROUTES[update.route].people.toUpperCase()}` : "ROTINA E ECONOMIA", this.narrow ? 12 : 14, "#E8B5C6");
    kicker.fontWeight = "700";
    kicker.height = "25px";
    content.addControl(kicker);
    const heading = this.text("feedback-heading", update.title, this.narrow ? 34 : 44);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "72px" : "80px";
    content.addControl(heading);
    const text = this.text("feedback-text", update.text, this.narrow ? 15 : 18, "#FAF1E9");
    text.height = this.narrow ? "94px" : "78px";
    content.addControl(text);
    const cost = this.text("feedback-cost", update.costLabel, this.narrow ? 12 : 14, "#C6D0DD");
    cost.height = "28px";
    content.addControl(cost);
    if (update.memory) {
      const memory = this.text("feedback-memory", `Memória guardada: ${update.memory}`, this.narrow ? 11 : 13, "#E8B5C6");
      memory.height = this.narrow ? "46px" : "34px";
      content.addControl(memory);
    }
    const back = this.createButton("feedback-back", "Voltar à semana", this.narrow ? "220px" : "250px", this.narrow ? "52px" : "56px", "#A93C63", () => this.openDashboard());
    back.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(back);
  }

  private buildWorldMap() {
    this.buildHeader(null);
    const panel = this.add(this.panel("world-map-panel", this.narrow ? "90%" : "58%", this.narrow ? "690px" : "650px", "#86A9D4"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "5%";
    panel.top = this.narrow ? "22px" : "30px";
    const content = new StackPanel("world-map-content");
    content.width = "87%";
    content.height = "90%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 5 : 6;
    panel.addControl(content);

    const kicker = this.text("world-map-kicker", `MAPA DE LUGARES · DIA ${this.economy.day} · ${slotName(this.economy).toUpperCase()}`, this.narrow ? 11 : 13, "#92B6D9");
    kicker.fontWeight = "700";
    kicker.height = "23px";
    content.addControl(kicker);
    const heading = this.text("world-map-heading", "Onde queres estar?", this.narrow ? 31 : 40);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "55px" : "64px";
    content.addControl(heading);
    const note = this.text("world-map-note", `Estás em ${LOCATIONS[this.location].title}. Viajar usa tempo; voltar para casa ou quarto é sempre sem custo. The Coast pede fim de semana e energia.`, this.narrow ? 11 : 13, "#C6D0DD");
    note.height = this.narrow ? "34px" : "28px";
    content.addControl(note);

    const destinationGrid = new Grid("destination-grid");
    destinationGrid.width = "100%";
    destinationGrid.height = this.narrow ? "436px" : "410px";
    destinationGrid.addColumnDefinition(0.5);
    destinationGrid.addColumnDefinition(0.5);
    destinationGrid.addRowDefinition(0.25);
    destinationGrid.addRowDefinition(0.25);
    destinationGrid.addRowDefinition(0.25);
    destinationGrid.addRowDefinition(0.25);
    content.addControl(destinationGrid);

    const destinationIds: LocationId[] = ["apartment", "player-room", "downtown", "soleil", "market", "violet", "station", "coast"];
    destinationIds.forEach((id, index) => {
      const destination = LOCATIONS[id];
      const blocks = travelBlocks(this.location, id);
      const isHere = id === this.location;
      const coastUnavailable = id === "coast" && !isWeekend(this.economy);
      const cost = id === "coast" ? "1 time · 1 energy" : blocks ? "1 time block" : "no time cost";
      const state = isHere ? "Current place" : coastUnavailable ? "Weekend only" : destination.label;
      const detail = coastUnavailable ? "Return when the weekend opens" : cost;
      const tile = this.createPlanningTile(`destination-${id}`, state, destination.title, detail, false, () => this.travelTo(id));
      tile.width = this.narrow ? "94%" : "92%";
      tile.height = this.narrow ? "84px" : "82px";
      tile.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
      tile.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      tile.color = `${destination.accent}88`;
      tile.alpha = coastUnavailable ? 0.56 : 1;
      destinationGrid.addControl(tile, Math.floor(index / 2), index % 2);
    });
  }

  private buildLocation() {
    const destination = LOCATIONS[this.location];
    this.buildHeader(null);
    const panel = this.add(this.panel("location-panel", this.narrow ? "90%" : "46%", this.narrow ? "590px" : "520px", destination.accent));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "7%";
    panel.top = this.narrow ? "24px" : "30px";
    const content = new StackPanel("location-content");
    content.width = "84%";
    content.height = "86%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 10 : 12;
    panel.addControl(content);

    const kicker = this.text("location-kicker", `${destination.label} · ${slotName(this.economy).toUpperCase()}`, this.narrow ? 11 : 13, destination.accent);
    kicker.fontWeight = "700";
    kicker.height = "24px";
    content.addControl(kicker);
    const heading = this.text("location-heading", destination.title, this.narrow ? 33 : 43);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "68px" : "78px";
    content.addControl(heading);
    const description = this.text("location-description", destination.description, this.narrow ? 16 : 19, "#FAF1E9");
    description.height = this.narrow ? "104px" : "82px";
    description.lineSpacing = "4px";
    content.addControl(description);
    const systems = this.text("location-systems", `Sistemas aqui: ${destination.systems}`, this.narrow ? 11 : 13, "#C6D0DD");
    systems.height = this.narrow ? "44px" : "34px";
    content.addControl(systems);

    this.locationActions(destination.id).forEach(([name, label, handler, color]) => {
      const button = this.createButton(name, label, "100%", this.narrow ? "48px" : "52px", color, handler);
      button.fontSize = this.narrow ? 11 : 14;
      content.addControl(button);
    });
    const mapButton = this.createButton("location-open-map", "Abrir mapa de destinos", this.narrow ? "220px" : "260px", this.narrow ? "48px" : "52px", "#385A88", () => this.openWorldMap());
    mapButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(mapButton);
  }

  private locationActions(id: LocationId): Array<[string, string, () => void, string]> {
    if (id === "apartment") {
      return [
        ["apartment-week", "Abrir o quadro da semana", () => this.openDashboard(), "#A93C63"],
        ["apartment-care", "Ir para a cozinha e escolher um cuidado", () => { this.actionCategory = "care"; this.openScreen("actions"); }, "#806342"],
        ["apartment-talk", "Subir para a varanda e abrir conversas", () => this.openMap(), "#285B57"],
      ];
    }
    if (id === "player-room") {
      const actions: Array<[string, string, () => void, string]> = [
        ["bedroom-rest", "Descansar e encerrar este bloco", () => this.runActivity("rest"), "#385A88"],
        ["bedroom-week", "Ver agenda e carteiras", () => this.openDashboard(), "#A93C63"],
      ];
      if (this.economy.slot === 2) actions.splice(1, 0, ["bedroom-sleep", "Dormir até amanhã e recuperar energia", () => this.runActivity("sleep"), "#285B57"]);
      return actions;
    }
    if (id === "downtown") {
      return [
        ["downtown-work", "Escolher rotina e trabalho", () => { this.actionCategory = "work"; this.openScreen("actions"); }, "#385A88"],
        ["downtown-store", "Ir às compras com contexto", () => this.openScreen("store"), "#D69468"],
      ];
    }
    if (id === "soleil") {
      return [
        ["soleil-remote", "Aceitar trabalho remoto", () => this.runActivity("remote"), "#385A88"],
        ["soleil-care", "Ajudar Elise a fechar", () => this.runActivity("help-elise"), "#D6A995"],
      ];
    }
    if (id === "market") {
      return [["market-store", "Abrir loja e inventário", () => this.openScreen("store"), "#D69468"]];
    }
    if (id === "violet") {
      return [["violet-date", "Ver dates e presentes", () => { this.actionCategory = "social"; this.openScreen("actions"); }, "#A57BE6"]];
    }
    if (id === "station") {
      return [["station-talk", "Abrir o mapa de conversas", () => this.openMap(), "#93B99D"]];
    }
    if (!isWeekend(this.economy)) return [["coast-weekend", "O fim de semana acabou — regressa quando houver tempo", () => this.openWorldMap(), "#385A88"]];
    return [["coast-talk", "Abrir conversas de fim de semana", () => this.openMap(), "#86A9D4"]];
  }

  private buildMap() {
    this.buildHeader(null);
    const panel = this.add(this.panel("map-panel", this.narrow ? "90%" : "48%", this.narrow ? "700px" : "615px"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "5%";
    panel.top = this.narrow ? "30px" : "42px";
    const content = new StackPanel("map-content");
    content.width = "87%";
    content.height = "90%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 8 : 10;
    panel.addControl(content);

    const kicker = this.text("map-kicker", "MAPA DE CONVERSAS · MEMÓRIAS GUARDADAS", this.narrow ? 12 : 14, "#E8B5C6");
    kicker.fontWeight = "700";
    kicker.height = "25px";
    content.addControl(kicker);
    const heading = this.text("map-heading", "Onde vais estar presente?", this.narrow ? 30 : 38);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "52px" : "60px";
    content.addControl(heading);
    const intro = this.text("map-intro", OPENING_LINE, this.narrow ? 14 : 17, "#C8D2DF");
    intro.height = this.narrow ? "68px" : "60px";
    intro.lineSpacing = "4px";
    content.addControl(intro);
    (Object.keys(ROUTES) as RouteId[]).forEach((id, index) => this.addRouteCard(content, id, index));
  }

  private addRouteCard(parent: StackPanel, id: RouteId, index: number) {
    const route = ROUTES[id];
    const state = this.states[id];
    const status = state.complete ? "an ending is ready" : state.needsRoutine ? "make room in the routine first" : `${relationshipStatus(state.metrics)} · a conversation is ready`;
    const latestMemory = state.memories.at(-1) ?? "Nenhuma memória registada ainda.";
    const label = `${index + 1}  ·  ${route.people}  —  ${status}`;
    const button = this.createButton(`route-${id}`, label, "100%", this.narrow ? "50px" : "54px", "#162642", () => this.openRoute(id));
    button.fontSize = this.narrow ? 12 : 15;
    button.thickness = 1;
    button.color = `${route.accent}C8`;
    parent.addControl(button);
    const memory = this.text(`memory-${id}`, `Latest shared memory: ${latestMemory}`, this.narrow ? 10 : 11, "#AEBCCD");
    memory.height = this.narrow ? "17px" : "18px";
    parent.addControl(memory);
  }

  private buildConversation() {
    const route = this.requireRoute();
    if (!route) return;
    const state = this.states[route.id];
    const beat = this.resolveBeat(route, state);
    this.buildHeader(route.id);

    // Location-led UX: choices are the only central narrative UI—no dialogue box, title, copy, portrait, or prompt.
    const choiceMenu = this.add(new StackPanel("choice-menu"));
    choiceMenu.width = this.narrow ? "88%" : "46%";
    choiceMenu.height = this.narrow ? "330px" : "280px";
    choiceMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    choiceMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    choiceMenu.top = this.narrow ? "26px" : "18px";
    choiceMenu.isVertical = true;
    choiceMenu.spacing = this.narrow ? 14 : 18;

    beat.choices.forEach((choice, index) => this.addChoiceButton(choiceMenu, choice, index));
  }

  private buildRouteInterlude() {
    const route = this.requireRoute();
    if (!route) return;
    const state = this.states[route.id];
    const previousBeat = route.beats[Math.max(0, state.chapter - 1)];
    this.buildHeader(route.id);
    this.addPortraits(route.portraits, this.narrow ? 0.5 : 0.76);

    const panel = this.add(this.panel("route-interlude-panel", this.narrow ? "90%" : "60%", this.narrow ? "460px" : "420px", route.accent));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "7%";
    const content = new StackPanel("route-interlude-content");
    content.width = "82%";
    content.height = "82%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 13 : 16;
    panel.addControl(content);

    const eyebrow = this.text("route-interlude-eyebrow", `PAMELA & JESSICA · ENTRE A ETAPA ${state.chapter} E ${state.chapter + 1}`, this.narrow ? 11 : 13, route.accent);
    eyebrow.fontWeight = "700";
    eyebrow.height = "26px";
    content.addControl(eyebrow);
    const heading = this.text("route-interlude-heading", "A conversa continua na rotina", this.narrow ? 31 : 41);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "66px" : "74px";
    content.addControl(heading);
    const copy = this.text("route-interlude-copy", previousBeat.interlude ?? "Antes da próxima conversa, escolhe como queres organizar tempo, energia e presença.", this.narrow ? 14 : 17, "#FAF1E9");
    copy.height = this.narrow ? "104px" : "84px";
    copy.lineSpacing = "4px";
    content.addControl(copy);
    const routine = this.createButton("route-interlude-routine", "Escolher uma ação de rotina", this.narrow ? "250px" : "290px", this.narrow ? "52px" : "56px", "#A93C63", () => this.openScreen("actions"));
    routine.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(routine);
    const map = this.createButton("route-interlude-map", "Ver mapa e recursos", this.narrow ? "220px" : "260px", this.narrow ? "46px" : "50px", "#385A88", () => this.openDashboard());
    map.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(map);
  }

  private addChoiceButton(parent: StackPanel, choice: StoryChoice, index: number) {
    const color = INTENTION_COLORS[choice.intention];
    const button = this.createButton(`choice-${choice.id}`, choice.text, "100%", this.narrow ? "60px" : "64px", "#00000000", () => this.choose(choice));
    button.fontSize = this.narrow ? 13 : 16;
    button.thickness = 0;
    button.color = "#F7F1EB";
    button.background = "#00000000";
    button.onPointerEnterObservable.add(() => { button.background = `${color}1F`; button.color = color; });
    button.onPointerOutObservable.add(() => { button.background = "#00000000"; button.color = "#F7F1EB"; });
    parent.addControl(button);
  }

  private buildReflection() {
    const route = this.requireRoute();
    const selected = this.activeChoice;
    if (!route || !selected) return;
    const state = this.states[route.id];
    this.buildHeader(route.id);
    this.addPortraits(route.portraits, 0.92);

    const panel = this.add(this.panel("reflection-panel", this.narrow ? "90%" : "64%", this.narrow ? "515px" : "480px", route.accent));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.left = this.narrow ? "5%" : "6%";
    panel.top = this.narrow ? "-22px" : "-46px";
    const threshold = new Rectangle("reflection-threshold");
    threshold.width = this.narrow ? "7px" : "10px";
    threshold.height = "78%";
    threshold.background = "#B84A71";
    threshold.alpha = 0.72;
    threshold.thickness = 0;
    threshold.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    threshold.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    threshold.left = this.narrow ? "14px" : "20px";
    panel.addControl(threshold);
    const content = new StackPanel("reflection-content");
    content.width = "84%";
    content.height = "86%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 12 : 14;
    panel.addControl(content);

    const relationMark = this.text("reflection-relation-mark", "○  ○  ○   PORTA DA CONVERSA", this.narrow ? 10 : 12, "#E8B5C6");
    relationMark.fontWeight = "700";
    relationMark.height = "22px";
    relationMark.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    content.addControl(relationMark);

    const eyebrow = this.text("reflection-eyebrow", `${selected.intention.toUpperCase()} · MEMÓRIA REGISTADA`, this.narrow ? 12 : 14, INTENTION_COLORS[selected.intention]);
    eyebrow.fontWeight = "700";
    eyebrow.height = "24px";
    content.addControl(eyebrow);
    const title = this.text("reflection-title", "A conversa mudou de lugar", this.narrow ? 32 : 43);
    title.fontFamily = "DM Serif Display";
    title.fontWeight = "700";
    title.height = this.narrow ? "62px" : "70px";
    content.addControl(title);
    const response = this.text("reflection-response", selected.response, this.narrow ? 16 : 19, "#FAF1E9");
    response.height = this.narrow ? "100px" : "82px";
    response.lineSpacing = "4px";
    content.addControl(response);
    const memory = this.text("reflection-memory", `Diário: ${state.memories.at(-1)}`, this.narrow ? 12 : 14, "#E8B5C6");
    memory.height = this.narrow ? "45px" : "34px";
    content.addControl(memory);
    const metrics = this.text("reflection-metrics", this.relationshipReadout(route.id), this.narrow ? 12 : 14, "#C6D0DD");
    metrics.height = "26px";
    content.addControl(metrics);
    const isLast = state.chapter >= route.beats.length - 1;
    const nextLabel = isLast ? (this.narrow ? "Ver epílogo" : "Ver epílogo da rota") : this.narrow ? "Próximo capítulo" : "Continuar para o próximo capítulo";
    const next = this.createButton("advance", nextLabel, this.narrow ? "230px" : "290px", this.narrow ? "52px" : "56px", "#A93C63", () => this.advance());
    next.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(next);
  }

  private buildFinale() {
    const route = this.requireRoute();
    if (!route) return;
    const state = this.states[route.id];
    const outcome = route.outcome?.(state.metrics) ?? relationshipOutcome(state.metrics);
    this.buildHeader(route.id);
    this.addPortraits(route.portraits, 0.92);

    const panel = this.add(this.panel("finale-panel", this.narrow ? "90%" : "64%", this.narrow ? "525px" : "490px", route.accent));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.left = this.narrow ? "5%" : "6%";
    panel.top = this.narrow ? "-22px" : "-44px";
    const threshold = new Rectangle("finale-threshold");
    threshold.width = this.narrow ? "7px" : "10px";
    threshold.height = "78%";
    threshold.background = "#B84A71";
    threshold.alpha = 0.72;
    threshold.thickness = 0;
    threshold.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    threshold.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    threshold.left = this.narrow ? "14px" : "20px";
    panel.addControl(threshold);
    const content = new StackPanel("finale-content");
    content.width = "84%";
    content.height = "86%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 12 : 14;
    panel.addControl(content);

    const relationMark = this.text("finale-relation-mark", "○  ○  ○   PORTA DA CONVERSA", this.narrow ? 10 : 12, "#E8B5C6");
    relationMark.fontWeight = "700";
    relationMark.height = "22px";
    relationMark.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    content.addControl(relationMark);

    const eyebrow = this.text("finale-eyebrow", `${route.people.toUpperCase()} · ${relationshipStatus(state.metrics).toUpperCase()}`, this.narrow ? 12 : 14, route.accent);
    eyebrow.fontWeight = "700";
    eyebrow.height = "25px";
    content.addControl(eyebrow);
    const title = this.text("finale-title", outcome.title, this.narrow ? 34 : 45);
    title.fontFamily = "DM Serif Display";
    title.fontWeight = "700";
    title.height = this.narrow ? "66px" : "74px";
    content.addControl(title);
    const line = this.text("finale-line", outcome.line, this.narrow ? 16 : 18, "#FAF1E9");
    line.height = this.narrow ? "110px" : "90px";
    line.lineSpacing = "4px";
    content.addControl(line);
    const details = this.text("finale-detail", outcome.detail, this.narrow ? 12 : 14, "#C6D0DD");
    details.height = this.narrow ? "44px" : "34px";
    content.addControl(details);
    const journal = this.text("finale-journal", `Memórias guardadas: ${state.memories.length}`, this.narrow ? 12 : 14, "#E8B5C6");
    journal.height = "24px";
    content.addControl(journal);
    const back = this.createButton("back-map", "Voltar ao mapa de conversas", this.narrow ? "250px" : "285px", this.narrow ? "52px" : "56px", "#A93C63", () => this.openMap());
    back.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(back);
  }

  private relationshipReadout(routeId: RouteId) {
    const metrics = this.states[routeId].metrics;
    if (metrics.tension >= 4) return "This connection needs room to breathe.";
    if (metrics.safety >= 3 && metrics.clarity >= 3 && metrics.bond >= 3) return "There is room for a careful next step.";
    if (metrics.safety >= 3) return "Comfort is growing; keep the pace shared.";
    if (metrics.clarity >= 2) return "The right words are beginning to make room.";
    return "Patience and clear listening will matter here.";
  }

  private nextStepGuidance() {
    const trio = this.states.trio;
    if (trio.needsRoutine) return "Pamela and Jessica need an ordinary moment before the next conversation.";
    if (trio.complete) return "A shared ending is ready whenever you want to return to their conversation.";
    if (trio.chapter > 0) return "A conversation with Pamela and Jessica is available when you are ready to continue.";
    return "The apartment has room for one honest first question.";
  }

  private activityReadiness(activity: (typeof ACTIVITIES)[number]) {
    if (activity.nightOnly && this.economy.slot !== 2) return "available tonight";
    if (this.economy.energy < activity.energy) return "rest before this";
    if ((activity.cost ?? 0) > this.economy.personal) return "needs more personal funds";
    if (activity.requires && !this.economy.inventory.includes(activity.requires)) return `pick up ${STORE_ITEMS.find((item) => item.id === activity.requires)?.name ?? "the item"} first`;
    if (activity.route && activity.minChapter !== undefined && this.states[activity.route].chapter < activity.minChapter) return "needs one more conversation first";
    if (activity.route && !meetsRouteRequirement(this.states[activity.route].metrics, activity.routeRequirement)) return "needs a steadier pace first";
    if (activity.gated && activity.route && this.states[activity.route].metrics.safety < 3) return "build more comfort first";
    return null;
  }

  private requireRoute() {
    return this.activeRoute ? ROUTES[this.activeRoute] : null;
  }

  private resolveBeat(route: NarrativeRoute, state: RelationshipState): ConversationBeat {
    const beat = route.beats[state.chapter];
    const variant = beat.variants?.find((candidate) => meetsRouteRequirement(state.metrics, candidate.requirement));
    if (variant) return { ...beat, ...variant };
    if (beat.fallback) return { ...beat, ...beat.fallback };
    return beat;
  }

  private openWorldMap() {
    this.activeRoute = null;
    this.activeChoice = null;
    this.activeScreen = "world-map";
    this.render();
  }

  private travelTo(destination: LocationId) {
    if (destination === "coast" && !isWeekend(this.economy)) {
      this.applyEconomyResult({
        economy: { ...this.economy, lastUpdate: { title: "The Coast fica para o fim de semana", text: "Reserva um dia com mais tempo antes de transformar a viagem numa obrigação. Até lá, a cidade continua disponível.", costLabel: "Sem custo" } },
        relationships: null,
      });
      return;
    }
    const blocks = travelBlocks(this.location, destination);
    const energyCost = destination === "coast" ? 1 : 0;
    if (this.economy.energy < energyCost) {
      this.applyEconomyResult(travel(this.economy, LOCATIONS[destination].title, blocks, energyCost));
      return;
    }
    const result = travel(this.economy, LOCATIONS[destination].title, blocks, energyCost);
    this.economy = result.economy;
    this.location = destination;
    this.activeRoute = null;
    this.activeChoice = null;
    this.activeScreen = "location";
    this.render();
  }

  private returnToApartment() {
    this.travelTo("apartment");
  }

  private returnToBedroom() {
    this.travelTo("player-room");
  }

  private openDashboard() {
    this.activeRoute = null;
    this.activeChoice = null;
    this.activeScreen = "dashboard";
    this.render();
  }

  private openScreen(screen: "actions" | "store" | "wallet" | "market") {
    this.activeRoute = null;
    this.activeChoice = null;
    this.activeScreen = screen;
    this.render();
  }

  private applyEconomyResult(result: { economy: EconomyState; relationships: Record<RouteId, RelationshipState> | null }) {
    this.economy = result.economy;
    if (result.relationships) this.states = result.relationships;
    this.activeRoute = null;
    this.activeChoice = null;
    this.activeScreen = "economy-feedback";
    this.render();
  }

  private runActivity(id: ActivityId) {
    const result = performActivity(this.economy, this.states, id);
    const activity = ACTIVITIES.find((candidate) => candidate.id === id);
    const completed = result.economy.lastUpdate?.title === activity?.name;
    if (this.states.trio.needsRoutine && completed) {
      const relationships = result.relationships ?? this.states;
      result.relationships = { ...relationships, trio: { ...relationships.trio, needsRoutine: false } };
    }
    this.applyEconomyResult(result);
  }

  private visibleActivities() {
    return ACTIVITIES.filter((activity) => {
      if (activity.nightOnly && this.economy.slot !== 2) return false;
      if (this.actionCategory === "work") return activity.kind === "Rotina" || activity.kind === "Trabalho";
      if (this.actionCategory === "care") return activity.kind === "Cuidado";
      return activity.kind === "Date" || activity.kind === "Presente";
    });
  }

  private buy(id: import("./economy").ItemId) {
    this.applyEconomyResult(buyItem(this.economy, id));
  }

  private contributeToFamily() {
    this.applyEconomyResult(contribute(this.economy));
  }

  private investMoney(profile: InvestmentProfile) {
    this.applyEconomyResult(invest(this.economy, profile));
  }

  private withdrawMoney() {
    this.applyEconomyResult(withdraw(this.economy));
  }

  private openMap() {
    this.activeScreen = "map";
    this.activeRoute = null;
    this.activeChoice = null;
    this.render();
  }

  private openRoute(id: RouteId) {
    this.activeRoute = id;
    this.activeChoice = null;
    this.activeScreen = this.states[id].complete ? "finale" : this.states[id].needsRoutine ? "route-interlude" : "conversation";
    this.render();
  }

  private choose(choice: StoryChoice) {
    if (!this.activeRoute) return;
    this.states[this.activeRoute] = applyEffect(this.states[this.activeRoute], choice.effect);
    this.activeChoice = choice;
    this.activeScreen = "reflection";
    this.render();
  }

  private advance() {
    if (!this.activeRoute) return;
    const route = ROUTES[this.activeRoute];
    const state = this.states[this.activeRoute];
    if (state.chapter < route.beats.length - 1) {
      state.chapter += 1;
      this.activeChoice = null;
      state.needsRoutine = route.id === "trio";
      this.activeScreen = state.needsRoutine ? "route-interlude" : "conversation";
    } else {
      state.complete = true;
      this.activeChoice = null;
      this.activeScreen = "finale";
    }
    this.render();
  }

  private openPrologue() {
    this.prologueSceneIndex = 0;
    this.activeScreen = "prologue";
    this.render();
  }

  private advancePrologue() {
    if (this.prologueSceneIndex < PROLOGUE_SCENES.length - 1) {
      this.prologueSceneIndex += 1;
      this.render();
      return;
    }
    this.openDashboard();
  }

  private skipPrologue() {
    this.openDashboard();
  }

  private reset() {
    this.states = createRelationshipStates();
    this.economy = createEconomyState();
    this.location = "apartment";
    this.activeRoute = null;
    this.activeChoice = null;
    this.prologueSceneIndex = 0;
    this.activeScreen = "title";
    this.render();
  }

  private handleKeydown(event: KeyboardEvent) {
    if (this.accessibilityOpen && event.key === "Escape") return this.toggleAccessibility();
    if (this.utilityMenu && event.key === "Escape") {
      this.utilityMenu = null;
      return this.render();
    }
    const command = resolveKeyboardCommand(this.activeScreen, event.key);
    if (!command) return;
    if (command.type === "reset") return this.reset();
    if (command.type === "toggle-accessibility") return this.toggleAccessibility();
    if (command.type === "open-utility") return this.openUtility(command.utility);
    if (command.type === "open-prologue") return this.openPrologue();
    if (command.type === "advance-prologue") return this.advancePrologue();
    if (command.type === "skip-prologue") return this.skipPrologue();
    if (command.type === "open-dashboard" || command.type === "return-dashboard") return this.openDashboard();
    if (command.type === "open-world-map") return this.openWorldMap();
    if (command.type === "return-home") return this.returnToApartment();
    if (command.type === "return-room") return this.returnToBedroom();
    if (command.type === "travel") return this.travelTo(command.destination);
    if (command.type === "open-screen") return this.openScreen(command.screen);
    if (command.type === "open-map") return this.openMap();
    if (command.type === "open-route") return this.openRoute(command.route);
    if (command.type === "select-action-category") {
      this.actionCategory = command.category;
      return this.render();
    }
    if (command.type === "run-visible-activity") {
      const activity = this.visibleActivities()[command.index];
      if (activity) this.runActivity(activity.id);
      return;
    }
    if (command.type === "advance") return this.advance();
    if (command.type === "choose" && this.activeRoute) {
      const route = ROUTES[this.activeRoute];
      const choice = this.resolveBeat(route, this.states[this.activeRoute]).choices[command.index];
      if (choice) this.choose(choice);
    }
  }

  private handleResize() {
    const next = window.innerWidth < 720;
    if (next !== this.narrow) {
      this.narrow = next;
      this.configureScale();
      this.render();
    }
  }

  private render() {
    this.clearDynamic();
    this.applyLocationBackground();
    if (this.activeScreen === "title") this.buildTitle();
    if (this.activeScreen === "prologue") this.buildPrologue();
    if (this.activeScreen === "dashboard") this.buildDashboard();
    if (this.activeScreen === "actions") this.buildActions();
    if (this.activeScreen === "store") this.buildStore();
    if (this.activeScreen === "wallet") this.buildWallet();
    if (this.activeScreen === "market") this.buildMarket();
    if (this.activeScreen === "economy-feedback") this.buildEconomyFeedback();
    if (this.activeScreen === "world-map") this.buildWorldMap();
    if (this.activeScreen === "location") this.buildLocation();
    if (this.activeScreen === "map") this.buildMap();
    if (this.activeScreen === "route-interlude") this.buildRouteInterlude();
    if (this.activeScreen === "conversation") this.buildConversation();
    if (this.activeScreen === "reflection") this.buildReflection();
    if (this.activeScreen === "finale") this.buildFinale();
    this.buildUtilityMenu();
    if (this.accessibilityOpen) this.buildAccessibilityOverlay();
  }

  dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("resize", this.onWindowResize);
    if (this.e2eEnabled) delete window.__CROE_TEST__;
    this.clearDynamic();
    this.ui.dispose();
  }
}
