# Figma Feature Display Adaptation — The Croe Trio

## Scope

This note records interface patterns observed in the user-provided Figma file. It is a structural reference only: The Croe Trio will retain its existing illustrated locations, narrative tone, typography, colors, and character art.

## Observed patterns

| Reference area | Pattern | Adaptation for The Croe Trio |
|---|---|---|
| Main hub | A small group of labelled feature tiles separates Friends, Missions, Settings, Memories, Map, Bag, Skills, Store, and Diary. | Replace the current long weekly list with a compact **Planning Hub**: Time, Conversations, Map, Bag, Household, and Market appear as equal, scannable tiles. |
| Calendar / agenda | Day and time are a single compact module; the schedule is visually distinct from feature navigation. | Use one utility card for Day, time block, and Energy rather than repeating these values in several headings. |
| Activities | Tasks are presented as collectible, illustrated action cards, not dense textual rows. | Show weekly actions as brief **activity cards** with one verb, a short effect line, cost/energy chips, and an availability state. |
| Profile / relationship screen | Relationship data uses visual meters and symbols rather than a table of numbers. | Preserve the current non-numeric relationship language; represent it with a small trust/comfort/clarity indicator and contextual copy, never exposed RPG stats. |
| Map / room organization | Places are grouped spatially and use visual destination affordances. | Present locations as destination cards with image crops and compact travel tags, while keeping the existing world illustration and keyboard access. |

## Constraints

The Figma file is not a stylistic asset source. Its pastel chibi art, stationery textures, and icon illustration are not transferable. The Croe Trio keeps **Quiet Presence**: nocturnal apartment imagery, blue-glass surfaces, plum emotional emphasis, DM Serif Display focal titles, Manrope utility text, and unboxed story choices.

## First implementation slice

1. Replace the weekly vertical action list with a two-column planning hub of compact tiles.
2. Move day, time, energy, personal funds, and family funds into one compact status card.
3. Change routine entries into readable activity cards showing action, consequence, cost, and availability before click.
4. Rework the conversation and location maps into visual route/destination cards while preserving their current behavior.
