# Location-led UX Specification — The Croe Trio

## Design rule

The scene is the primary interface. The player sees **where they are, who is present and what the moment feels like** before they see a system. The top bar is a slim utility rail, not a dashboard. Hovering an icon opens a one-line explanation; clicking an icon reveals a compact anchored menu rather than a modal dialog. Narrative choices sit directly in the center of the illustrated scene as translucent text buttons, never inside a large dialogue box.

## Persistent top bar

| Control | Icon label | Hotkey | Hover explanation | Click behavior |
|---|---|---:|---|---|
| Energy | `◒` plus four pips | — | “Energy: actions that need attention consume pips.” | Shows a small contextual readout; no separate screen. |
| Calendar | `CAL` | `C` | “Week, day and current time block.” | Opens a compact time ribbon with Morning/Afternoon/Night. |
| NPC status | `NPC` | `N` | “Who is available, and what each connection can hold today.” | Expands a slim roster with names, availability and non-numeric pace labels. |
| Player bank | `BANK` | `B` | “Personal money for plans, gifts and work.” | Anchored personal-balance menu with Store and Market shortcuts. |
| Family money | `FAMILY` | `M` | “Shared household money. It cannot buy individual care.” | Anchored shared-fund menu with contribution shortcut. |
| Player room | `ROOM` | `Q` | “Return to the player’s room.” | Travels to the bedroom. |
| Home | `HOME` | `H` | “Return to the polycule apartment.” | Travels home. |
| World | `WORLD` | `G` | “Open the city and travel map.” | Opens the location map. |
| Access | `A` | `A` | “Text, contrast, motion and keyboard help.” | Opens the existing Access overlay. |

The former global `M` map shortcut changes to `G` so `M` can always mean Family Money. Within the action menu, Care moves from `C` to `F` to reserve `C` for Calendar at all times.

## Location backgrounds

| Location | Visual purpose | Foreground emphasis |
|---|---|---|
| Polycule Apartment | Shared emotional crossroads. | Current household availability and Home controls. |
| Player Room | Rest, private reflection, sleep and stored items. | Energy recovery and personal inventory. |
| Downtown | Practical obligations and independent movement. | Work and travel. |
| Soleil Café | Low-pressure conversation and dates. | Connection availability. |
| Market | Contextual gifts and household errands. | Personal bank. |
| Clube Violeta | Group social energy and late-night possibility. | NPC availability. |
| Station | Threshold and future travel. | Calendar and World. |
| The Coast | Weekend, time-rich scenes. | Energy and date availability. |

## Narrative choices without a dialogue box

The scene line remains in a minimal, upper-third caption. Beneath it, two to three transparent choice buttons float in a vertically spaced center rail. Each button contains an intention label and plain language, such as **LISTEN — “I can stay with you in the quiet.”** Hovering warms its border and reveals a short implication; no choice shows exact metric values. The route’s relationship state stays in the top bar under `NPC`, keeping the scene open for art and body language.

## Implementation slices

| Slice | Visible change |
|---|---|
| UX-L1 | Replace header navigation with the icon rail, tooltips and global hotkeys. |
| UX-L2 | Add the non-modal context rail for Calendar, NPC, Bank and Family. |
| UX-L3 | Switch location screens to destination backgrounds. |
| UX-L4 | Remove conversation and reflection panels; use scene captions and unboxed choices. |

## Validation note

The first local canvas check after the header refactor remained on the dark background without the expected dashboard controls. This is recorded as a blocking runtime issue; the implementation will be inspected through client logs before visual validation continues.

The cause was Babylon attempting to fetch `Shaders/layer.vertex.fx` and `Shaders/layer.fragment.fx` from the Vite fallback, which returned `index.html`. The GUI layer shaders are now embedded through explicit Babylon imports. After a clean restart, the local Week One screen rendered the apartment background, compact top rail, Energy pips, CAL/NPC/BANK/FAM/ROOM/HOME/WORLD controls and the existing dashboard.

The Pamela route check confirmed the scene line, context sentence and intention buttons are drawn directly over the apartment image rather than inside a large dialogue card. The choice list remains visible as a center-screen rail, while the top utility bar stays available.

## Public validation

The GitHub Pages deployment for the location-led UX completed successfully. The public diagnostic confirmed the expected page title, one canvas, no page errors, no console errors and no failed asset responses.
