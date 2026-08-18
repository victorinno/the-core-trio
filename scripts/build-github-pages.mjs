import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptsDir, "..");
const repository = process.env.GITHUB_PAGES_REPOSITORY || "the-core-trio";
const outputDir = path.resolve(process.env.GITHUB_PAGES_OUTPUT || path.join(projectRoot, "..", `${repository}-pages`));
const buildEnv = {
  ...process.env,
  GITHUB_PAGES: "true",
  GITHUB_PAGES_REPOSITORY: repository,
  VITE_GITHUB_PAGES: "true",
};

execFileSync("pnpm", ["vite", "build"], { cwd: projectRoot, env: buildEnv, stdio: "inherit" });

const staticBuild = path.join(projectRoot, "dist", "public");
if (!existsSync(staticBuild)) throw new Error("O build estático não foi gerado.");
rmSync(outputDir, { recursive: true, force: true });
cpSync(staticBuild, outputDir, { recursive: true });

const assetOutput = path.join(outputDir, "game-assets");
mkdirSync(assetOutput, { recursive: true });
const bundledArt = path.join(projectRoot, "art");
const localAssets = path.join(projectRoot, "..", "webdev-static-assets");
const assetRoot = existsSync(bundledArt) ? bundledArt : localAssets;
const userAssets = path.join(assetRoot, "croe-trio");
const penthouse = path.join(assetRoot, "croe-trio-penthouse-dawn.png");
cpSync(userAssets, assetOutput, { recursive: true });
cpSync(penthouse, path.join(assetOutput, "croe-trio-penthouse-dawn.png"));
for (const filename of ["croe-prologue-action-01-wedding.png", "croe-prologue-action-02-dinner.png", "croe-prologue-action-03-distance.png", "croe-prologue-action-04-coffee.png", "croe-prologue-action-05-trio-morning.png", "croe-prologue-action-06-alice-threshold.png", "croe-prologue-action-07-doorway.png"]) {
  cpSync(path.join(localAssets, filename), path.join(assetOutput, filename));
}
writeFileSync(path.join(outputDir, ".nojekyll"), "");
cpSync(path.join(outputDir, "index.html"), path.join(outputDir, "404.html"));

console.log(`GitHub Pages package ready: ${outputDir}`);
