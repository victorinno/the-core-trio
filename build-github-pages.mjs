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
for (const filename of ["croe-prologue-01-gravity.png", "croe-prologue-02-expansion.png", "croe-prologue-03-first-mistake.png", "croe-prologue-04-unclaimed-hour.png", "croe-prologue-05-room-for-one-more.png", "croe-prologue-06-threshold.png", "croe-prologue-07-changed-centre.png"]) {
  cpSync(path.join(localAssets, filename), path.join(assetOutput, filename));
}
writeFileSync(path.join(outputDir, ".nojekyll"), "");
cpSync(path.join(outputDir, "index.html"), path.join(outputDir, "404.html"));

console.log(`GitHub Pages package ready: ${outputDir}`);
