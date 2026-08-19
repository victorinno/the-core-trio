# The Croe Trio — UX Refinement v1.0

## Purpose

This refinement applies the dating-sim UX brief without changing the game’s routes, characters, relationship model, economy, or location-led visual identity. Its first implementation slice prioritizes **clear next steps**, **emotionally legible relationship feedback**, and **transparent availability rules** while preserving the frameless, scene-first choice screen.

## First implementation slice

| Current problem | UX change | Why the experience improves | Expected player behavior |
|---|---|---|---|
| Route screens exposed compact numeric relationship values such as `V2 · C1 · S2 · T3`. | Replace the visible numerical summary with a short emotional readout, such as “Comfort is growing; keep the pace shared.” | The player understands the relationship’s direction without treating a character like a spreadsheet. | Players read the emotional temperature before making a choice, then use the choice wording and character response to learn more. |
| The weekly dashboard described several systems but did not establish one immediate priority. | Add a context-sensitive “Current focus” sentence that names the next useful action, such as creating an ordinary moment before another conversation. | The system reduces uncertainty without forcing a route or revealing outcomes. | Players can decide whether to act on the suggested focus or use the planning tools deliberately. |
| Actions could be visible but only explained as unavailable after the player clicked them. | Keep the action visible and add a quiet reason directly in its label: “needs one more conversation first,” “rest before this,” or “pick up [item] first.” | The player learns why an action is not ready with no wasted click and no opaque condition. | Players can form a small, understandable plan from the available options. |
| Conversation-map cards mixed chapter counts with relationship state. | Replace chapter numbering with readable availability language: “a conversation is ready,” “make room in the routine first,” or “an ending is ready.” | Progress is communicated as opportunity and pacing rather than raw completion. | Players return to routes because the moment feels ready, not only to fill a progress bar. |

## Preserved decisions

Narrative choices remain **the only central controls** in a conversation scene. There is no dialogue box, no scene title, no prompt, no relationship stat panel, and no portrait framing the choice menu. The top utility rail remains persistent, because it contains low-frequency planning tools rather than emotional scene content.

The planning, store, household, and market screens retain monetary and energy information. Those values are appropriate there because those screens are about scheduling and resource decisions. Relationship values stay internal and are communicated through wording, availability, memories, and character responses.

## Next UX slices

The next practical improvements are a dialogue-history control, a small “new opportunity” cue on the NPC utility rail, and a lightweight quick-save/quick-load design. These should be added only after each one can remain contextual, unobtrusive, and consistent with the location-led composition.
