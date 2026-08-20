# Engine Options for The Croe Trio — Research Notes v1

## Verified findings

Ren’Py 8.5.3 is a specialised, open-source visual-novel engine. Its script language is designed for large visual novels and can call Python for more complex simulation mechanics. The official site lists desktop, mobile, and a beta HTML5/WebAssembly target. This makes it the strongest Python-adjacent option for a narrative-first date sim with relationship flags, routes, inventory, and choices. [1]

Dialogic 2 is a Godot plugin for creating dialogue-driven games and full visual novels. Its timelines support text, conditions, animations, signals, variables, custom events, character/portrait management, translation via CSV, and writer-friendly visual or text editors. Its official documentation also warns that Dialogic 2 remains in Alpha and requires Godot 4.5 or newer, so its feature set is attractive but carries workflow-stability risk. [2]

Dialogue Manager 4 is a separate Godot addon with a stateless branching-dialogue editor/runtime and a script-like writing format. Its current main line targets Godot 4.6+, while documented older releases cover Godot 4.3–4.5. Its active repository includes tests, extensive release history, GDScript and C# support, conditions/mutations, translations, dialogue balloons, and a dedicated API. It is therefore a stronger conservative choice than an alpha framework when a Godot project needs custom gameplay around a mature branching-dialogue layer. [3]

Godot can export browser builds through HTML5/WebAssembly and WebGL 2.0. Its documentation recommends the single-threaded web export by default because it avoids the cross-origin-isolation overhead of threaded exports, but notes that web deployments have platform constraints: Godot 4 C# cannot export to web, persistence depends on IndexedDB/cookie access, and mobile web performance is below native builds. [4]

Rakugo is a smaller Godot dialogue-system alternative inspired by Ren’Py. Its public repository is active and MIT-licensed, but its adoption signal is materially lower than Dialogue Manager’s: 282 stars versus roughly 3.8k for Dialogue Manager at the time of review. It is worth a prototype only if its Ren’Py-like writing approach is especially appealing; it should not be the default migration target for an existing project. [5]

## Sources

[1]: https://www.renpy.org/
[2]: https://docs.dialogic.pro/
[3]: https://github.com/nathanhoad/godot_dialogue_manager
[4]: https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html
[5]: https://github.com/rakugoteam/Rakugo-Dialogue-System

## Fit for The Croe Trio

| Option | Best use | Narrative workflow | Web delivery | Migration cost from the current browser game | Recommendation |
|---|---|---|---|---|---|
| **Keep BabylonJS + React** | Continue the current browser-first game. | Story data and relationship/economy logic already exist in TypeScript. | Already published on GitHub Pages. | None. | **Best immediate path.** Improve the current engine rather than restart it. |
| **Ren’Py 8** | A desktop/mobile visual novel whose centre of gravity is writing, character presentation, save/load, and route management. | Ren’Py script for scenes and choices; Python for the existing relationship and economy rules. | HTML5/WebAssembly is marked beta. | High: rewrite UI, story runtime, state, save model, and asset presentation. | **Best Python option** for a future standalone edition, not a replacement for the live web build. |
| **Godot 4 + Dialogue Manager** | A more game-like date sim with custom maps, animations, controller support, richer audio, and native distribution. | Script-like branching dialogue plus Godot code for time, economy, locations, and relationships. | Viable through single-threaded WebAssembly/WebGL 2.0, with platform caveats. | Very high: rebuild all UI, scenes, state, and browser deployment. | **Best Godot option** if native/mobile/console ambition becomes central. |
| **Godot 4 + Dialogic** | Writer-facing timelines and portrait-heavy VN authoring in a Godot project. | Visual or text timelines with events, variables, portraits, and custom scripts. | Same Godot web considerations. | Very high. | Prototype only: the current documentation labels Dialogic 2 Alpha. |
| **Godot + Rakugo** | Experimenting with a smaller, Ren’Py-inspired Godot workflow. | Narrative toolset aimed at VNs and adjacent genres. | Same Godot web considerations. | Very high. | Explore only after a small proof of concept; lower adoption signal than Dialogue Manager. |

> **Recommendation.** Do not migrate The Croe Trio now. The game’s current constraints — GitHub Pages, a browser-first build, an existing BabylonJS/React UI, and already-implemented branching routes and economy — make an engine rewrite more expensive than beneficial. Continue improving the existing web game. If the project later targets a downloadable/mobile visual novel with a writer-operated scene pipeline, prototype one Pamela chapter in **Ren’Py 8**. If it instead targets controller input, native distribution, animated environments, or a more spatial map, prototype that same chapter in **Godot 4 with Dialogue Manager**.
