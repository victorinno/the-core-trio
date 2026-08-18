import { chromium } from "@playwright/test";

const url = process.env.PUBLIC_GAME_URL ?? "https://victorinno.github.io/the-core-trio/";
const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const pageErrors = [];
const consoleErrors = [];
const failedResponses = [];

page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("response", (response) => {
  if (response.status() >= 400) failedResponses.push({ status: response.status(), url: response.url() });
});

await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
await page.waitForTimeout(4_000);
const canvas = await page.locator("canvas").count();
const result = { url: page.url(), title: await page.title(), canvas, pageErrors, consoleErrors, failedResponses };
console.log(JSON.stringify(result, null, 2));
await browser.close();
