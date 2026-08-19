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

export const ASSETS: Record<PortraitKey | "penthouse" | "prologue01" | "prologue02" | "prologue03" | "prologue04" | "prologue05" | "prologue06" | "prologue07", string> = {
  penthouse: assetPath("/manus-storage/croe-trio-penthouse-dawn_1f6b31e7.png", "croe-trio-penthouse-dawn.png"),
  prologue01: assetPath("/manus-storage/croe-prologue-01-gravity_74d4114e.png", "croe-prologue-01-gravity.png"),
  prologue02: assetPath("/manus-storage/croe-prologue-02-expansion_96361fc1.png", "croe-prologue-02-expansion.png"),
  prologue03: assetPath("/manus-storage/croe-prologue-03-first-mistake_62dbdc3f.png", "croe-prologue-03-first-mistake.png"),
  prologue04: assetPath("/manus-storage/croe-prologue-04-unclaimed-hour_2cada1c4.png", "croe-prologue-04-unclaimed-hour.png"),
  prologue05: assetPath("/manus-storage/croe-prologue-05-room-for-one-more_9ef3218f.png", "croe-prologue-05-room-for-one-more.png"),
  prologue06: assetPath("/manus-storage/croe-prologue-06-threshold_fc9a1194.png", "croe-prologue-06-threshold.png"),
  prologue07: assetPath("/manus-storage/croe-prologue-07-changed-centre_0315f7fd.png", "croe-prologue-07-changed-centre.png"),
  pamela: assetPath("/manus-storage/pamela_1k_60ff582e.png", "pamela_1k.png"),
  jessica: assetPath("/manus-storage/jessica_1k_01342195.png", "jessica_1k.png"),
  alice: assetPath("/manus-storage/alice_1k_535c4339.png", "alice_1k.png"),
  adam: assetPath("/manus-storage/adam_1k_3037b6d4.png", "adam_1k.png"),
  elise: assetPath("/manus-storage/elise_1k_df643105.png", "elise_1k.png"),
  raven: assetPath("/manus-storage/raven_1k_ba52592a.png", "raven_1k.png"),
  saskia: assetPath("/manus-storage/saskia_1k_cd4fced2.png", "saskia_1k.png"),
  spouse: assetPath("/manus-storage/spouse_male_1k_b4794579.png", "spouse_male_1k.png"),
};
