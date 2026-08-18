/**
 * STYLE — The Croe Trio is an adult ensemble romance: blue dawn, warm glass, plum honesty and relationship memory.
 * The canvas presents a map of conversations, per-route relationship state and choices that preserve autonomy.
 */
import type { Scene } from "@babylonjs/core/scene";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Button } from "@babylonjs/gui/2D/controls/button";
import { Control } from "@babylonjs/gui/2D/controls/control";
import { Ellipse } from "@babylonjs/gui/2D/controls/ellipse";
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
  type InvestmentProfile,
} from "./economy";
import { LOCATIONS, travelBlocks, type LocationId } from "./locations";
import {
  applyEffect,
  createRelationshipStates,
  relationshipOutcome,
  relationshipStatus,
  type RelationshipMetric,
  type RelationshipState,
} from "./relationship";
import { OPENING_LINE, ROUTES, type Intention, type RouteId, type StoryChoice } from "./story";

type Screen = "title" | "dashboard" | "actions" | "store" | "wallet" | "market" | "economy-feedback" | "world-map" | "location" | "map" | "conversation" | "reflection" | "finale";
type ActionCategory = "work" | "care" | "social";

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

export class GameWorld {
  private readonly ui: AdvancedDynamicTexture;
  private dynamicControls: Control[] = [];
  private readonly onKeyDown: (event: KeyboardEvent) => void;
  private readonly onWindowResize: () => void;
  private activeScreen: Screen = "title";
  private activeRoute: RouteId | null = null;
  private activeChoice: StoryChoice | null = null;
  private states = createRelationshipStates();
  private economy: EconomyState = createEconomyState();
  private actionCategory: ActionCategory = "work";
  private location: LocationId = "apartment";
  private narrow = window.innerWidth < 720;
  private elapsed = 0;
  private pulse: Ellipse | null = null;
  private readonly demoMode = new URLSearchParams(window.location.search).get("demo");
  private readonly demoEnabled = new URLSearchParams(window.location.search).has("demo");

  constructor(private readonly scene: Scene) {
    this.ui = AdvancedDynamicTexture.CreateFullscreenUI("croe-ui", true, scene);
    this.configureScale();
    this.createAtmosphere();
    this.onKeyDown = (event) => this.handleKeydown(event);
    this.onWindowResize = () => this.handleResize();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("resize", this.onWindowResize);
    scene.onBeforeRenderObservable.add(() => this.update());

    if (this.demoMode === "week") {
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
    } else if (this.demoEnabled) {
      this.activeRoute = "trio";
      this.activeChoice = ROUTES.trio.beats[0].choices[2];
      this.states.trio = applyEffect(this.states.trio, this.activeChoice.effect);
      this.activeScreen = "reflection";
    }
    this.render();
  }

  private configureScale() {
    this.ui.idealWidth = this.narrow ? 720 : 1600;
    this.ui.renderAtIdealSize = false;
  }

  private createAtmosphere() {
    const background = new Image("croe-penthouse", ASSETS.penthouse);
    background.width = "100%";
    background.height = "100%";
    background.stretch = Image.STRETCH_FILL;
    background.isPointerBlocker = false;
    this.ui.addControl(background);

    const wash = new Rectangle("blue-glass-wash");
    wash.width = "100%";
    wash.height = "100%";
    wash.background = "#071126";
    wash.alpha = 0.4;
    wash.thickness = 0;
    wash.isPointerBlocker = false;
    this.ui.addControl(wash);

    const halo = new Ellipse("plum-halo");
    halo.width = "460px";
    halo.height = "460px";
    halo.background = "#B84A71";
    halo.alpha = 0.1;
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
      dot.alpha = index === 2 ? 0.82 : 0.45;
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
      line.alpha = 0.5;
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
      frame.alpha = 0.04;
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
    if (this.pulse) this.pulse.alpha = 0.56 + Math.sin(this.elapsed * 1.6) * 0.24;
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
    node.fontSize = size;
    node.color = color;
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
    node.background = "#0C1630";
    node.alpha = 0.93;
    node.thickness = 1;
    node.color = `${accent}AA`;
    node.cornerRadius = this.narrow ? 22 : 28;
    return node;
  }

  private buildHeader(routeId: RouteId | null = this.activeRoute) {
    const bar = this.add(new Rectangle("top-bar"));
    bar.width = "100%";
    bar.height = this.narrow ? "76px" : "88px";
    bar.background = "#071126";
    bar.alpha = 0.74;
    bar.thickness = 0;
    bar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    const logo = new StackPanel("croe-mark");
    logo.width = this.narrow ? "58px" : "70px";
    logo.height = "38px";
    logo.isVertical = false;
    logo.spacing = this.narrow ? 4 : 5;
    logo.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    logo.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    logo.left = this.narrow ? "18px" : "34px";
    bar.addControl(logo);
    ["#D69468", "#B84A71", "#92B6D9"].forEach((color, index) => {
      const curve = new Ellipse(`croe-line-${index}`);
      curve.width = this.narrow ? "14px" : "17px";
      curve.height = this.narrow ? "30px" : "35px";
      curve.thickness = 2;
      curve.color = color;
      curve.background = "#071126";
      curve.alpha = index === 1 ? 1 : 0.72;
      logo.addControl(curve);
    });

    const wordmark = this.text("croe-wordmark", "THE CROE TRIO", this.narrow ? 15 : 20);
    wordmark.fontFamily = "DM Serif Display";
    wordmark.fontWeight = "700";
    wordmark.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    wordmark.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    wordmark.left = this.narrow ? "87px" : "122px";
    wordmark.width = this.narrow ? "180px" : "260px";
    bar.addControl(wordmark);

    if (routeId) {
      const state = this.states[routeId];
      const metrics = this.text(
        "relationship-metrics",
        METRICS.map((metric) => `${metric.short}${state.metrics[metric.id]}`).join("  ·  "),
        this.narrow ? 12 : 15,
        "#E8B5C6",
      );
      metrics.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      metrics.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      metrics.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      metrics.left = this.narrow ? "-14px" : "-34px";
      metrics.width = this.narrow ? "170px" : "230px";
      bar.addControl(metrics);
    }

    if (this.activeScreen !== "title") {
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
    button.width = width;
    button.height = height;
    button.color = "#FFF8F2";
    button.fontFamily = "Manrope";
    button.fontSize = this.narrow ? 14 : 16;
    button.fontWeight = "700";
    button.background = color;
    button.cornerRadius = 16;
    button.thickness = 0;
    button.hoverCursor = "pointer";
    button.onPointerEnterObservable.add(() => {
      button.scaleX = 1.015;
      button.scaleY = 1.015;
    });
    button.onPointerOutObservable.add(() => {
      button.scaleX = 1;
      button.scaleY = 1;
    });
    button.onPointerClickObservable.add(onClick);
    return button;
  }

  private buildTitle() {
    this.buildHeader(null);
    this.addPortraits(["pamela", "jessica"], this.narrow ? 0.55 : 0.78);

    const copy = this.add(new StackPanel("title-copy"));
    copy.width = this.narrow ? "86%" : "35%";
    copy.height = this.narrow ? "520px" : "600px";
    copy.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    copy.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    copy.left = this.narrow ? "8%" : "8%";
    copy.top = this.narrow ? "-60px" : "22px";
    copy.isVertical = true;
    copy.spacing = this.narrow ? 14 : 18;

    const eyebrow = this.text("title-eyebrow", "ROMANCE INTERATIVO · MEMÓRIAS E ESCOLHAS", this.narrow ? 12 : 15, "#E8B5C6");
    eyebrow.fontWeight = "700";
    eyebrow.height = "30px";
    copy.addControl(eyebrow);
    const title = this.text("title", "The Croe\nTrio", this.narrow ? 58 : 82);
    title.fontFamily = "DM Serif Display";
    title.fontWeight = "700";
    title.height = this.narrow ? "142px" : "175px";
    title.lineSpacing = "-8px";
    copy.addControl(title);
    const rule = new Rectangle("plum-rule");
    rule.width = "112px";
    rule.height = "4px";
    rule.background = "#B84A71";
    rule.thickness = 0;
    rule.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    copy.addControl(rule);
    const subtitle = this.text("title-subtitle", "Uma escolha deixa memória. Uma memória muda a próxima conversa.", this.narrow ? 18 : 20, "#EFE0D8");
    subtitle.height = this.narrow ? "92px" : "118px";
    subtitle.lineSpacing = "5px";
    copy.addControl(subtitle);

    const intentRail = new Rectangle("intent-rail");
    intentRail.width = "100%";
    intentRail.height = this.narrow ? "38px" : "42px";
    intentRail.background = "#101F3A";
    intentRail.alpha = 0.84;
    intentRail.color = "#B84A7166";
    intentRail.thickness = 1;
    intentRail.cornerRadius = 12;
    intentRail.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    const intentCopy = this.text("intent-copy", "VÍNCULO · CLAREZA · SEGURANÇA · TENSÃO", this.narrow ? 9 : 11, "#E8B5C6");
    intentCopy.fontWeight = "700";
    intentCopy.width = "92%";
    intentCopy.height = "80%";
    intentCopy.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    intentCopy.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    intentCopy.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    intentRail.addControl(intentCopy);
    copy.addControl(intentRail);

    const start = this.createButton("start", "Começar a semana", this.narrow ? "270px" : "310px", this.narrow ? "58px" : "64px", "#A93C63", () => this.openDashboard());
    start.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    copy.addControl(start);
    const hint = this.text("title-hint", "Enter para começar · R para recomeçar", this.narrow ? 12 : 14, "#B8C2D4");
    hint.height = "26px";
    copy.addControl(hint);
  }

  private buildDashboard() {
    this.buildHeader(null);
    this.addPortraits(["pamela", "jessica"], this.narrow ? 0.24 : 0.44);
    const panel = this.add(this.panel("week-dashboard", this.narrow ? "90%" : "64%", this.narrow ? "690px" : "610px", "#B84A71"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "5%";
    panel.top = this.narrow ? "24px" : "30px";
    const threshold = new Rectangle("week-threshold");
    threshold.width = this.narrow ? "6px" : "9px";
    threshold.height = "78%";
    threshold.background = "#B84A71";
    threshold.alpha = 0.76;
    threshold.thickness = 0;
    threshold.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    threshold.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    threshold.left = this.narrow ? "13px" : "19px";
    panel.addControl(threshold);
    const content = new StackPanel("week-dashboard-content");
    content.width = "86%";
    content.height = "88%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 8 : 8;
    panel.addControl(content);

    const kicker = this.text("week-kicker", `SEMANA ${weekNumber(this.economy)} · DIA ${this.economy.day} · ${slotName(this.economy).toUpperCase()}${isWeekend(this.economy) ? " · FIM DE SEMANA" : ""}`, this.narrow ? 12 : 14, "#E8B5C6");
    kicker.fontWeight = "700";
    kicker.height = "24px";
    content.addControl(kicker);
    const relationshipMark = this.text("week-relation-mark", "○  ○  ○   A CASA AINDA ESTÁ A ESCUTAR", this.narrow ? 9 : 11, "#E8B5C6");
    relationshipMark.fontWeight = "700";
    relationshipMark.height = "20px";
    relationshipMark.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    content.addControl(relationshipMark);
    const heading = this.text("week-heading", "O que cabe agora?", this.narrow ? 32 : 42);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "62px" : "70px";
    content.addControl(heading);
    const status = this.text("week-status", `Energia ${this.economy.energy}/4  ·  Pessoal §${this.economy.personal}  ·  Família §${this.economy.family}  ·  Investido §${this.economy.invested}`, this.narrow ? 12 : 15, "#C6D0DD");
    status.height = this.narrow ? "38px" : "30px";
    content.addControl(status);
    const note = this.text("week-note", "Dinheiro abre possibilidades; presença, limite e contexto determinam o que uma ação significa.", this.narrow ? 12 : 14, "#B9C7D7");
    note.height = this.narrow ? "42px" : "34px";
    content.addControl(note);
    if (this.economy.weeklyNotice) {
      const weeklyNotice = this.text("weekly-notice", this.economy.weeklyNotice, this.narrow ? 11 : 13, "#E7C891");
      weeklyNotice.height = this.narrow ? "42px" : "34px";
      content.addControl(weeklyNotice);
    }

    const buttons: Array<[string, string, () => void, string]> = [
      ["1 · Tempo", "Escolher uma forma de presença", () => this.openScreen("actions"), "#A93C63"],
      ["2 · Bolsa", "Preparar um gesto com contexto", () => this.openScreen("store"), "#273C60"],
      ["3 · Casa", "Cuidar do recurso que é partilhado", () => this.openScreen("wallet"), "#806342"],
      ["4 · Mercado", "Decidir quanto risco cabe na semana", () => this.openScreen("market"), "#416A8A"],
      ["5 · Conversas", "Perguntar quem precisa de presença", () => this.openMap(), "#285B57"],
    ];
    buttons.forEach(([title, subtitle, handler, color], index) => {
      const button = this.createButton(`dashboard-${index}`, `${title}  —  ${subtitle}`, "100%", this.narrow ? "50px" : "52px", color, handler);
      button.fontSize = this.narrow ? 12 : 15;
      content.addControl(button);
    });
  }

  private buildActions() {
    this.buildHeader(null);
    const panel = this.add(this.panel("action-panel", this.narrow ? "90%" : "66%", this.narrow ? "700px" : "635px", "#D69468"));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    panel.left = this.narrow ? "5%" : "5%";
    panel.top = this.narrow ? "25px" : "30px";
    const content = new StackPanel("action-content");
    content.width = "86%";
    content.height = "90%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 5 : 6;
    panel.addControl(content);

    const kicker = this.text("action-kicker", `DIA ${this.economy.day} · ${slotName(this.economy).toUpperCase()} · ENERGIA ${this.economy.energy}/4`, this.narrow ? 11 : 13, "#D69468");
    kicker.fontWeight = "700";
    kicker.height = "21px";
    content.addControl(kicker);
    const heading = this.text("action-heading", "Escolhe como estar presente", this.narrow ? 28 : 36);
    heading.fontFamily = "DM Serif Display";
    heading.fontWeight = "700";
    heading.height = this.narrow ? "48px" : "56px";
    content.addControl(heading);
    const prompt = this.text("action-prompt", "Ações de cuidado criam memórias uma vez por semana; trabalho cria margem; dates exigem Segurança 3.", this.narrow ? 10 : 12, "#B9C7D7");
    prompt.height = this.narrow ? "34px" : "28px";
    content.addControl(prompt);

    const categories: Array<{ id: ActionCategory; label: string; color: string }> = [
      { id: "work", label: "Rotina e trabalho", color: "#385A88" },
      { id: "care", label: "Cuidados e favores", color: "#806342" },
      { id: "social", label: "Dates e presentes", color: "#A93C63" },
    ];
    categories.forEach((category) => {
      const button = this.createButton(`action-category-${category.id}`, category.label, "100%", this.narrow ? "34px" : "38px", this.actionCategory === category.id ? category.color : "#162642", () => {
        this.actionCategory = category.id;
        this.render();
      });
      button.fontSize = this.narrow ? 10 : 12;
      content.addControl(button);
    });

    const filteredActivities = ACTIVITIES.filter((activity) => {
      if (activity.nightOnly && this.economy.slot !== 2) return false;
      if (this.actionCategory === "work") return activity.kind === "Rotina" || activity.kind === "Trabalho";
      if (this.actionCategory === "care") return activity.kind === "Cuidado";
      return activity.kind === "Date" || activity.kind === "Presente";
    });
    filteredActivities.forEach((activity, index) => {
      const suffix = activity.income ? `+§${activity.income}` : activity.cost ? `−§${activity.cost}` : activity.requires ? `usa item` : "sem custo";
      const color = activity.kind === "Trabalho" ? "#385A88" : activity.kind === "Date" ? "#A93C63" : activity.kind === "Cuidado" ? "#806342" : "#285B57";
      const repeatedCare = activity.kind === "Cuidado" && this.economy.usedCareThisWeek.includes(activity.id);
      const label = `${index + 1} · ${activity.kind.toUpperCase()} · ${activity.name}  (${suffix} · energia ${activity.energy})${repeatedCare ? " · retorno já aplicado esta semana" : ""}`;
      const button = this.createButton(`action-${activity.id}`, label, "100%", this.narrow ? "46px" : "50px", color, () => this.runActivity(activity.id));
      button.fontSize = this.narrow ? 10 : 13;
      content.addControl(button);
    });
  }

  private buildStore() {
    this.buildHeader(null);
    const panel = this.add(this.panel("store-panel", this.narrow ? "90%" : "62%", this.narrow ? "650px" : "560px", "#D69468"));
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
    const panel = this.add(this.panel("wallet-panel", this.narrow ? "90%" : "56%", this.narrow ? "510px" : "460px", "#D69468"));
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
    const panel = this.add(this.panel("market-panel", this.narrow ? "90%" : "61%", this.narrow ? "600px" : "530px", "#92B6D9"));
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
    const panel = this.add(this.panel("economy-feedback", this.narrow ? "90%" : "60%", this.narrow ? "430px" : "390px", update.route ? ROUTES[update.route].accent : "#B84A71"));
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
    const panel = this.add(this.panel("world-map-panel", this.narrow ? "90%" : "66%", this.narrow ? "690px" : "650px", "#86A9D4"));
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

    const destinationIds: LocationId[] = ["apartment", "player-room", "downtown", "soleil", "market", "violet", "station", "coast"];
    destinationIds.forEach((id, index) => {
      const destination = LOCATIONS[id];
      const blocks = travelBlocks(this.location, id);
      const isHere = id === this.location;
      const coastUnavailable = id === "coast" && !isWeekend(this.economy);
      const cost = id === "coast" ? "tempo −1 bloco · energia −1" : blocks ? "tempo −1 bloco" : "sem custo de tempo";
      const label = isHere
        ? `${index + 1} · ${destination.title}  —  estás aqui`
        : `${index + 1} · ${destination.title}  —  ${coastUnavailable ? "disponível no fim de semana" : cost}`;
      const button = this.createButton(`destination-${id}`, label, "100%", this.narrow ? "43px" : "42px", isHere ? "#285B57" : coastUnavailable ? "#23324C" : "#162642", () => this.travelTo(id));
      button.fontSize = this.narrow ? 11 : 14;
      button.thickness = 1;
      button.color = `${destination.accent}C8`;
      content.addControl(button);
    });
  }

  private buildLocation() {
    const destination = LOCATIONS[this.location];
    this.buildHeader(null);
    const panel = this.add(this.panel("location-panel", this.narrow ? "90%" : "60%", this.narrow ? "590px" : "520px", destination.accent));
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
    const panel = this.add(this.panel("map-panel", this.narrow ? "90%" : "62%", this.narrow ? "700px" : "615px"));
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
    const status = state.complete ? "epílogo disponível" : `capítulo ${state.chapter + 1}/3 · ${relationshipStatus(state.metrics)}`;
    const latestMemory = state.memories.at(-1) ?? "Nenhuma memória registada ainda.";
    const label = `${index + 1}  ·  ${route.people}  —  ${status}`;
    const button = this.createButton(`route-${id}`, label, "100%", this.narrow ? "50px" : "54px", "#162642", () => this.openRoute(id));
    button.fontSize = this.narrow ? 12 : 15;
    button.thickness = 1;
    button.color = `${route.accent}C8`;
    parent.addControl(button);
    const memory = this.text(`memory-${id}`, `Última memória: ${latestMemory}`, this.narrow ? 10 : 11, "#AEBCCD");
    memory.height = this.narrow ? "17px" : "18px";
    parent.addControl(memory);
  }

  private buildConversation() {
    const route = this.requireRoute();
    if (!route) return;
    const state = this.states[route.id];
    const beat = route.beats[state.chapter];
    this.buildHeader(route.id);
    this.addPortraits(route.portraits);

    const tag = this.add(this.panel("route-tag", this.narrow ? "48%" : "31%", this.narrow ? "64px" : "72px", route.accent));
    tag.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    tag.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    tag.left = this.narrow ? "-5%" : "-4%";
    tag.top = this.narrow ? "92px" : "108px";
    const tagText = this.text("route-people", `${route.people}\nCAPÍTULO ${state.chapter + 1}/3`, this.narrow ? 11 : 14, "#F1E5E0");
    tagText.width = "86%";
    tagText.height = "84%";
    tagText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    tagText.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    tag.addControl(tagText);

    const panel = this.add(this.panel("dialogue-panel", this.narrow ? "90%" : "61%", this.narrow ? "630px" : "450px", route.accent));
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.left = this.narrow ? "5%" : "5%";
    panel.top = this.narrow ? "-22px" : "-36px";
    const content = new StackPanel("dialogue-content");
    content.width = "86%";
    content.height = "88%";
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    content.isVertical = true;
    content.spacing = this.narrow ? 10 : 12;
    panel.addControl(content);

    const location = this.text("location", beat.location, this.narrow ? 12 : 14, route.accent);
    location.fontWeight = "700";
    location.height = "24px";
    content.addControl(location);
    const chapter = this.text("chapter", `${route.chapter} · ${beat.title.toUpperCase()}`, this.narrow ? 12 : 15, "#C6D0DD");
    chapter.height = "26px";
    content.addControl(chapter);
    const line = this.text("route-line", beat.line, this.narrow ? 16 : 19, "#FAF1E9");
    line.height = this.narrow ? "158px" : "122px";
    line.lineSpacing = "5px";
    content.addControl(line);
    const lastMemory = state.memories.at(-1);
    if (lastMemory) {
      const memory = this.text("active-memory", `Memória ativa: ${lastMemory}`, this.narrow ? 11 : 13, "#E8B5C6");
      memory.height = this.narrow ? "32px" : "28px";
      content.addControl(memory);
    }
    const prompt = this.text("prompt", "Escolhe uma intenção. Ela altera o que esta relação pode conversar a seguir.", this.narrow ? 11 : 13, "#B9C7D7");
    prompt.height = "28px";
    content.addControl(prompt);
    beat.choices.forEach((choice, index) => this.addChoiceButton(content, choice, index));
  }

  private addChoiceButton(parent: StackPanel, choice: StoryChoice, index: number) {
    const color = INTENTION_COLORS[choice.intention];
    const button = this.createButton(`choice-${choice.id}`, `${index + 1}  ·  ${choice.text}`, "100%", this.narrow ? "60px" : "62px", "#162642", () => this.choose(choice));
    button.fontSize = this.narrow ? 12 : 15;
    button.thickness = 1;
    button.color = `${color}CC`;
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
    const metrics = this.text("reflection-metrics", this.metricSummary(state), this.narrow ? 12 : 14, "#C6D0DD");
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
    const outcome = relationshipOutcome(state.metrics);
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

  private metricSummary(state: RelationshipState) {
    return METRICS.map((metric) => `${metric.label}: ${state.metrics[metric.id]}/5`).join("   ·   ");
  }

  private requireRoute() {
    return this.activeRoute ? ROUTES[this.activeRoute] : null;
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
    this.applyEconomyResult(performActivity(this.economy, this.states, id));
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
    this.activeScreen = this.states[id].complete ? "finale" : "conversation";
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
      this.activeScreen = "conversation";
    } else {
      state.complete = true;
      this.activeChoice = null;
      this.activeScreen = "finale";
    }
    this.render();
  }

  private reset() {
    this.states = createRelationshipStates();
    this.economy = createEconomyState();
    this.location = "apartment";
    this.activeRoute = null;
    this.activeChoice = null;
    this.activeScreen = "title";
    this.render();
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key.toLowerCase() === "r") {
      this.reset();
      return;
    }
    if (this.activeScreen === "title" && event.key === "Enter") this.openDashboard();
    if (event.key.toLowerCase() === "m") this.openWorldMap();
    if (event.key.toLowerCase() === "h") this.returnToApartment();
    if (event.key.toLowerCase() === "q") this.returnToBedroom();
    if (this.activeScreen === "world-map" && ["1", "2", "3", "4", "5", "6", "7", "8"].includes(event.key)) {
      const destinations: LocationId[] = ["apartment", "player-room", "downtown", "soleil", "market", "violet", "station", "coast"];
      this.travelTo(destinations[Number(event.key) - 1]);
    }
    if (this.activeScreen === "dashboard" && ["1", "2", "3", "4", "5"].includes(event.key)) {
      const destinations: Array<"actions" | "store" | "wallet" | "market" | "map"> = ["actions", "store", "wallet", "market", "map"];
      const destination = destinations[Number(event.key) - 1];
      if (destination === "map") this.openMap();
      else this.openScreen(destination);
    }
    if (this.activeScreen === "map" && ["1", "2", "3", "4", "5"].includes(event.key)) {
      const ids: RouteId[] = ["trio", "alice", "elise", "raven", "saskia"];
      this.openRoute(ids[Number(event.key) - 1]);
    }
    if (this.activeScreen === "conversation" && this.activeRoute && ["1", "2", "3"].includes(event.key)) {
      const choice = ROUTES[this.activeRoute].beats[this.states[this.activeRoute].chapter].choices[Number(event.key) - 1];
      this.choose(choice);
    }
    if ((this.activeScreen === "reflection" || this.activeScreen === "finale") && event.key === "Enter") {
      if (this.activeScreen === "reflection") this.advance();
      else this.openMap();
    }
    if (["actions", "store", "wallet", "market", "economy-feedback", "world-map", "location", "map"].includes(this.activeScreen) && event.key === "Escape") {
      this.openDashboard();
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
    if (this.activeScreen === "title") this.buildTitle();
    if (this.activeScreen === "dashboard") this.buildDashboard();
    if (this.activeScreen === "actions") this.buildActions();
    if (this.activeScreen === "store") this.buildStore();
    if (this.activeScreen === "wallet") this.buildWallet();
    if (this.activeScreen === "market") this.buildMarket();
    if (this.activeScreen === "economy-feedback") this.buildEconomyFeedback();
    if (this.activeScreen === "world-map") this.buildWorldMap();
    if (this.activeScreen === "location") this.buildLocation();
    if (this.activeScreen === "map") this.buildMap();
    if (this.activeScreen === "conversation") this.buildConversation();
    if (this.activeScreen === "reflection") this.buildReflection();
    if (this.activeScreen === "finale") this.buildFinale();
  }

  dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("resize", this.onWindowResize);
    this.clearDynamic();
    this.ui.dispose();
  }
}
