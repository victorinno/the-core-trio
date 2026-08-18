# UX Reference Study — *Our Life: Beginnings & Always*

| Field | Decision |
|---|---|
| Reference role | UX and interaction-pattern reference only; no art, interface layout, characters, copy or proprietary content is to be copied. |
| Target | Improve player agency, readability, emotional pacing and replayability in *The Croe Trio*. |
| Primary sources | Official Steam and GB Patch itch.io pages. |

## What the reference demonstrates

*Our Life* presents its player agency through character details, remembered preferences, relationship pace and a readable accessibility path. Its official materials describe adjustable name, appearance, personality and pronouns; choices and preferences that characters remember; a relationship that can move from friendship to romance at the player’s chosen pace; and text style/size controls opened through the `A` key.[1] [2]

> “Shape your personality, feelings, and preferences, then see them reflected in the story as characters remember who you are.” — GB Patch, official game page.[2]

The applicable lesson is not to reproduce a single-love-interest life simulator. It is to make **self-definition, relationship tempo and accessibility visible controls rather than hidden assumptions**.

| Reference pattern | Original Croe Trio application | Expected player benefit |
|---|---|---|
| Preferences are remembered | Add a **Memory Anchors** strip to the journal, stating what a character noticed and whether it can be revised. | Consequences feel personal rather than opaque. |
| Pace is player-directed | Add a revisable **Connection Pace** panel for each route: friendship, exploratory, intentional, or pause. | Romance is never treated as the default reward. |
| Everyday details matter | Surface care, drinks, routines and gifts as contextual moments with clear diminishing-return messaging. | The existing economy feels relational instead of grind-driven. |
| Text controls are first-class | Add an `A` accessibility overlay: text scale, high contrast, reduced motion and instant scene advance. | The visual novel remains readable on varied screens and needs. |
| Life is divided into readable steps | Present Croe Trio’s weekly phases as **Morning / Afternoon / Night** with a compact recap of what changed. | The player understands time and can plan without losing narrative immersion. |

## Recommended Croe Trio experience roadmap

| Priority | Improvement | Scope | Acceptance criterion |
|---:|---|---|---|
| P0 | Accessibility overlay | Text scale, high-contrast glass, reduced motion, keyboard help. | `A` opens the overlay at any non-modal screen; settings persist during the session. |
| P0 | Choice intent and recap | Each narrative choice states its relational intent; after reflection, a one-line “What changed” summary appears. | A player can identify the effect category without exposing exact hidden calculations. |
| P1 | Connection Pace panel | Revisable route-level preference: friendship, exploring, intentional, pause. | The panel changes eligible conversation framing but never overrides consent or gates. |
| P1 | Memory Anchors journal | Persistent, route-specific recollections with source and revision status. | At least one anchor is added after each Pamela chapter. |
| P2 | Week recap and planning | A brief end-of-slot summary linked to next available systems. | The dashboard says what advanced, what was spent and what remains available. |

## Current Croe Trio comparison

| Experience area | Current Croe Trio strength | Gap revealed by the reference | Recommended response |
|---|---|---|---|
| Intro and pacing | Seven manually advanced illustrated prologue scenes, with skip and replay controls. | The player has no dedicated way to state their preferred relationship pace before early routes open. | Add a light **How do you want to be close?** prompt after the prologue; it must stay revisable. |
| Choice language | Choices already follow intent categories such as listening, asking, honesty and giving space. | Effects are remembered, but a player lacks a compact, player-facing recap after each choice. | Add a non-numeric **What changed** line at reflection, e.g. “Pamela heard that you made room for her pace.” |
| Routine loop | Day slots, energy, care, gifts, work, two wallets and Coast gates make everyday decisions meaningful. | The dashboard gives resources but not an explicit prior-slot narrative recap. | Add a one-sentence **Last time** journal marker before the next set of actions. |
| Route progress | Pamela supports repair, pause, friendship and closeness rather than a single winning state. | The current metric header uses compressed abbreviations and does not explain each route’s current social boundary. | Add a readable route-status card explaining the current available pace without revealing hidden math. |
| Accessibility | Keyboard navigation is unusually thorough for a Babylon canvas and the prologue provides direct controls. | No global text-size, high-contrast or reduced-motion settings are exposed to the player. | Add an `A` access panel modeled as a Croe Trio blue-glass overlay, not a copy of another game’s settings menu. |

## Implementation order

The most valuable first build is the accessibility overlay and reflection recap together. They improve every route, do not alter narrative canon, and let players understand choices without converting relationships into a score chase. The pace prompt and Memory Anchors are the next layer; they should follow only after the existing route text is fully localized to English.

| Delivery | Included interaction | Explicitly excluded from this delivery | Verification |
|---|---|---|---|
| UX-01 — Readable by default | `A` opens text scale, high contrast, reduced-motion and keyboard-help controls. | No recreation of Our Life’s layout or visual identity. | A player can change settings from title, prologue, dashboard and conversation. |
| UX-02 — Choices that explain themselves | An intent label before selection and a “What changed” reflection afterward. | Exact metric deltas and gamified optimal-choice hints. | Each Pamela choice produces one readable relational recap. |
| UX-03 — A pace that can be revised | A route-specific connection preference available after the prologue. | Mandatory romance, permanent locks or a universal relationship setting. | Friendship, exploration, intention and pause each change copy eligibility without bypassing consent gates. |
| UX-04 — Memory as context | A route journal that surfaces recalled preferences and the last important choice. | Replacing the existing weekly routine/economy systems. | One or more memory anchors appear after every completed chapter. |

## UX-01 implementation check

The first visible improvement is now present on the dashboard: an **A Access** control appears in the top-right header, providing a discoverable counterpart to the keyboard shortcut. The underlying visual-novel surface and current routes remain unchanged until the overlay is opened.

The panel was checked visually over the dashboard and contains session-scoped Text Size, High Contrast and Reduced Motion controls plus keyboard help. Unit tests cover the `A` command, and the Playwright navigation suite confirms that `A` opens the overlay without changing the current screen while Escape closes it.

## Guardrails

The Croe Trio should preserve its own blue-glass penthouse identity, ensemble focus, adult-only cast and existing Safety/Clarity/Bond/Tension model. The reference’s soft, developmental pacing should inform **clarity of consent and choices**, not replace Croe Trio’s shared-household, polycule-specific systems. Preferences should be editable; the player should never be punished merely for choosing friendship, slowing down, or stepping back.

## References

[1]: https://store.steampowered.com/app/1129190/Our_Life_Beginnings__Always/ "Our Life: Beginnings & Always — Official Steam page"

[2]: https://gbpatch.itch.io/our-life "Our Life: Beginnings & Always — Official GB Patch itch.io page"
