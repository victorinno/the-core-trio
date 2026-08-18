import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  throw new Error("Usage: node tools/localize-player-text.mjs <input.ts> <output.ts>");
}

const source = await readFile(resolve(input), "utf8");
const response = await fetch(`${process.env.OPENAI_API_BASE}/chat/completions`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-5-mini",
    max_completion_tokens: 120000,
    messages: [
      {
        role: "system",
        content: "You are a precise localization compiler for a TypeScript narrative game. Return only valid TypeScript source, never Markdown. Translate every player-visible Portuguese string literal and template literal to natural US English. Preserve all TypeScript syntax, imports, exports, identifiers, object keys, IDs, route IDs, variable names, comments, indentation, interpolation expressions, and behavior exactly. Do not translate internal comments, types, IDs, variable names, filenames, or technical terms not shown to the player. Keep the relationship tone adult, consensual, non-possessive, and emotionally precise."
      },
      {
        role: "user",
        content: `Localize the player-visible strings in this file. File: ${basename(input)}\n\n${source}`
      }
    ]
  }),
});
if (!response.ok) throw new Error(`Localization API failed: ${response.status} ${await response.text()}`);
const payload = await response.json();
let localized = payload.choices?.[0]?.message?.content;
if (typeof localized !== "string" || !localized.trim()) throw new Error("Localization API returned no source.");
localized = localized.replace(/^```(?:typescript|ts)?\s*/i, "").replace(/\s*```$/, "");
await writeFile(resolve(output), localized, "utf8");
console.log(`Localized ${basename(input)} -> ${output}`);
