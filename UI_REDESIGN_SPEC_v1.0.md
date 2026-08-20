# The Croe Trio — Modern Date Sim UI Redesign v1.0

## Decision

The previous interface overused large rounded panels, coloured action blocks, permanent decorative marks, and portrait collages. Those elements competed with the illustrated setting and made planning screens feel like a decorative dashboard instead of a contemporary romance game.

The replacement direction is **Quiet Presence**: a modern, scene-led date sim interface inspired by the clarity and player trust of contemporary visual novels, without copying a specific game.

## Visual rules

| Area | New rule | Explicitly removed |
|---|---|---|
| Scene | The location illustration owns most of the screen. A soft contrast wash is allowed only behind readable text. | Permanent frame lines, decorative dots, multiple halos, and portrait collages over the scene. |
| HUD | A 52px translucent utility strip uses compact labelled icons and is visually secondary to the scene. | The tall branded header and wide, button-by-button utility rail. |
| Planning | A narrow left-aligned sheet gives one current-focus sentence and a restrained list of options. | 60–66% width slabs, vertical accent bars, and a different saturated fill for every action. |
| Buttons | One plum primary action per screen. Other actions are charcoal or transparent rows with an 8px radius and a quiet hover tint. | Pill-shaped controls, oversized corner radii, number prefixes, and multicolour button stacks. |
| Narrative choices | A lower-centre vertical stack of text-first, unboxed options. Hover reveals a fine rule and a colour shift; no surrounding dialogue card. | Dialogue panels, title copy, instructions, stats, portraits, or coloured button containers around choices. |
| Type | DM Serif Display is reserved for a single focal title. Manrope carries labels, prose, and choices. | Multiple large headings, all-caps decorative labels, and competing text tiers. |

## Information architecture

The game has two modes. **Moment mode** covers scenes, prose, choices, and consequence: it shows only the scene, one passage at a time, and the next choice. **Planning mode** covers week, actions, locations, money, and maps: it shows one compact sheet plus an optional utility menu. The player can always return to the scene without crossing a full-screen system dashboard.

## Acceptance criteria

1. A narrative screenshot reads as a location illustration with choices, not as a panel-based app.
2. A planning screenshot has one clear primary action and no button stack where every row competes equally.
3. The top HUD occupies less than 9% of the desktop viewport height.
4. No standard screen uses a corner radius greater than 12px.
5. Existing keyboard shortcuts, accessibility controls, map, economy, route gates, and E2E IDs remain functional.
