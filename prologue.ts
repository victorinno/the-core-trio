/**
 * STYLE — Static cinematic prologue: one held image, one deliberate paragraph, one player-controlled advance.
 * The narrative begins with ambiguity and care; it never assigns romance as a reward or debt.
 */
import type { PortraitKey } from "./assets";

export type PrologueBackground = "prologue01" | "prologue02" | "prologue03" | "prologue04" | "prologue05" | "prologue06" | "prologue07";

export type PrologueScene = {
  chapter: string;
  title: string;
  copy: string;
  background: PrologueBackground;
  portraits: PortraitKey[];
  alignment: "left" | "right";
};

export const PROLOGUE_SCENES: PrologueScene[] = [
  {
    chapter: "TWO YEARS EARLIER",
    title: "The shape of home",
    copy: "Alice met you in high school—the kind of inseparable that feels like gravity. After graduation, you married. When she found polyamory, something in her lit up. You said yes, not from need, but from love.",
    background: "prologue01",
    portraits: ["alice"],
    alignment: "left",
  },
  {
    chapter: "THE FIRST YEAR",
    title: "An expanding table",
    copy: "At first, the polycule felt like an expansion: more warmth, more laughter, more hands reaching across dinner. Jessica drew you in with easy confidence, until joining no longer felt like joining. It felt like coming home.",
    background: "prologue02",
    portraits: ["jessica", "pamela"],
    alignment: "left",
  },
  {
    chapter: "THE SECOND YEAR",
    title: "Things left unsaid",
    copy: "Pamela was the quiet surprise: gentle, attentive, already wearing your shirts as if the line between yours and mine had stopped mattering. Adam was easy to love. Everyone said so. That had been the first mistake.",
    background: "prologue03",
    portraits: ["alice", "adam"],
    alignment: "right",
  },
  {
    chapter: "EARLY MORNING",
    title: "An unclaimed hour",
    copy: "Alice began staying in Adam’s room. Their inside jokes accumulated; their laughter sounded looser, lighter. You said nothing. The apartment made absences visible, and the couch before sunrise became the only hour that felt entirely unclaimed.",
    background: "prologue04",
    portraits: ["pamela"],
    alignment: "left",
  },
  {
    chapter: "A NEW ROUTINE",
    title: "Room for one more",
    copy: "Then Pamela appeared: hair loose, still half-asleep, and sat beside you without asking. Her head found your shoulder. Jessica discovered you there, asked, “Room for one more?” and climbed over the back of the couch. That became your morning.",
    background: "prologue05",
    portraits: ["pamela", "jessica"],
    alignment: "left",
  },
  {
    chapter: "THIS MORNING",
    title: "The threshold",
    copy: "Pamela began to seek the particular way you looked at her. Jessica caught you looking across an ordinary Tuesday and spent three days naming the feeling. Adam felt no distance at all. This morning, Alice wakes in his bed and feels the shape of an absence.",
    background: "prologue06",
    portraits: ["alice"],
    alignment: "right",
  },
  {
    chapter: "THE DOORWAY",
    title: "A changed centre",
    copy: "Alice follows the soft voices to the living room. Pamela curls beneath your chin; Jessica leans into your shoulder, one arm around each of them. Alice has seen them close before. This is different. Jessica looks up. A beat of silence. “Morning,” Alice says.",
    background: "prologue07",
    portraits: ["alice", "pamela", "jessica"],
    alignment: "left",
  },
];
