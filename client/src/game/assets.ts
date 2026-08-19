/**
 * STYLE — The Croe Trio: blue-glass city night, warm apartment light and plum-magenta honesty.
 * User-supplied character art is the visual centre of every route.
 */
export type PortraitKey =
  | "pamela"
  | "jessica"
  | "alice"
  | "adam"
  | "elise"
  | "raven"
  | "saskia"
  | "spouse";

const assetPath = (storedPath: string, filename: string) => {
  if (import.meta.env.VITE_GITHUB_PAGES === "true" || import.meta.env.BASE_URL !== "/") return `${import.meta.env.BASE_URL}game-assets/${filename}`;
  if (import.meta.env.VITE_LOCAL_ART === "true") {
    const folder = filename === "croe-trio-penthouse-dawn.png" ? "" : "croe-trio/";
    return `/art/${folder}${filename}`;
  }
  return storedPath;
};

export const ASSETS: Record<PortraitKey | "penthouse" | "prologue01" | "prologue02" | "prologue03" | "prologue04" | "prologue05" | "prologue06" | "prologue07" | "locationApartment" | "locationBedroom" | "locationDowntown" | "locationSoleil" | "locationMarket" | "locationViolet" | "locationStation" | "locationCoast", string> = {
  penthouse: assetPath("/manus-storage/croe-trio-penthouse-dawn_1f6b31e7.png", "croe-trio-penthouse-dawn.png"),
  prologue01: assetPath("/manus-storage/croe-prologue-action-01-wedding_68e69c3f.png", "croe-prologue-action-01-wedding.png"),
  prologue02: assetPath("/manus-storage/croe-prologue-action-02-dinner_3d77c0b4.png", "croe-prologue-action-02-dinner.png"),
  prologue03: assetPath("/manus-storage/croe-prologue-action-03-distance_ef06c89e.png", "croe-prologue-action-03-distance.png"),
  prologue04: assetPath("/manus-storage/croe-prologue-action-04-coffee_a21249ea.png", "croe-prologue-action-04-coffee.png"),
  prologue05: assetPath("/manus-storage/croe-prologue-action-05-trio-morning_3abca188.png", "croe-prologue-action-05-trio-morning.png"),
  prologue06: assetPath("/manus-storage/croe-prologue-action-06-alice-threshold_3e74eaf9.png", "croe-prologue-action-06-alice-threshold.png"),
  prologue07: assetPath("/manus-storage/croe-prologue-action-07-doorway_4692191b.png", "croe-prologue-action-07-doorway.png"),
  locationApartment: assetPath("/manus-storage/croe-location-apartment_66e5d9ce.png", "croe-location-apartment.png"),
  locationBedroom: assetPath("/manus-storage/croe-location-bedroom_a46ccfa7.png", "croe-location-bedroom.png"),
  locationDowntown: assetPath("/manus-storage/croe-location-downtown_3d584638.png", "croe-location-downtown.png"),
  locationSoleil: assetPath("/manus-storage/croe-location-soleil_4b36bba0.png", "croe-location-soleil.png"),
  locationMarket: assetPath("/manus-storage/croe-location-market_98c250bd.png", "croe-location-market.png"),
  locationViolet: assetPath("/manus-storage/croe-location-violet_15a6a44d.png", "croe-location-violet.png"),
  locationStation: assetPath("/manus-storage/croe-trio-penthouse-dawn_1f6b31e7.png", "croe-trio-penthouse-dawn.png"),
  locationCoast: assetPath("/manus-storage/croe-location-coast_f308d3c0.png", "croe-location-coast.png"),
  pamela: assetPath("/manus-storage/pamela_1k_60ff582e.png", "pamela_1k.png"),
  jessica: assetPath("/manus-storage/jessica_1k_01342195.png", "jessica_1k.png"),
  alice: assetPath("/manus-storage/alice_1k_535c4339.png", "alice_1k.png"),
  adam: assetPath("/manus-storage/adam_1k_3037b6d4.png", "adam_1k.png"),
  elise: assetPath("/manus-storage/elise_1k_df643105.png", "elise_1k.png"),
  raven: assetPath("/manus-storage/raven_1k_ba52592a.png", "raven_1k.png"),
  saskia: assetPath("/manus-storage/saskia_1k_cd4fced2.png", "saskia_1k.png"),
  spouse: assetPath("/manus-storage/spouse_male_1k_b4794579.png", "spouse_male_1k.png"),
};
