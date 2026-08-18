import { chromium } from "@playwright/test";

const errors = [];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});
await page.goto("http://127.0.0.1:3000/?demo=prologue&e2e=1", { waitUntil: "networkidle" });
await page.waitForFunction(() => Boolean(window.__CROE_TEST__));
await page.waitForTimeout(1200);
const state = await page.evaluate(() => window.__CROE_TEST__?.snapshot());
const canvas = await page.locator("canvas").count();
await page.screenshot({ path: "/home/ubuntu/webdev-static-assets/prologue-browser-diagnosis.png" });
console.log(JSON.stringify({ state, canvas, errors }, null, 2));
await browser.close();
