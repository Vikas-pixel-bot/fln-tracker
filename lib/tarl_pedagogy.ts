/**
 * Compact TaRL (Teaching at the Right Level) pedagogical knowledge base.
 * Sourced from: Pratham TaRL manuals, ASER framework, Gurushala time-distribution slides,
 * and the Level 1 & Level 2 Language/Math activity manuals for Maharashtra.
 *
 * This string is injected into the AI prompt so The Brain can make
 * specific, actionable pedagogical recommendations — not just data analysis.
 */

export const TARL_PEDAGOGY_KNOWLEDGE = `
═══════════════════════════════════════════════════════
PRATHAM TaRL PEDAGOGY KNOWLEDGE BASE (Maharashtra FLN)
═══════════════════════════════════════════════════════

─── ASER LEVEL FRAMEWORK ────────────────────────────

LITERACY LEVELS (0–4):
  0 = Beginner     Cannot recognize letters. Approach: alphabet songs, letter tracing, Chaudakhadi chart, Linking Cards. Key activity: point-and-say letter drills.
  1 = Letter        Recognizes letters but not words. Approach: CVC word building, letter-to-picture matching, Chitra Cards. Key activity: sorting Linking Cards by first letter.
  2 = Word          Reads simple words. Approach: 2-line sentences, word families, reading aloud in pairs. Key activity: Paragraph 2-Line Stories booklet.
  3 = Paragraph     Reads Std 1-level paragraph. Approach: short stories with comprehension questions. Key activity: Basic Stories 1/2 booklets + Chitra Card comprehension.
  4 = Story         Reads Std 2 story fluently. Approach: complex comprehension, creative retelling, peer teaching. Key activity: Anuched Pustika + student-led discussion.

NUMERACY LEVELS (0–3):
  0 = Beginner      Cannot recognize numbers. Approach: counting physical objects (stones/seeds), number songs, touch-counting. Key activity: stone counting circle game.
  1 = 1–9           Recognizes single digits. Approach: 1-digit addition/subtraction with objects, Number Flash Cards, number line games. Key activity: "Who am I?" number riddles.
  2 = 10–99         Recognizes 2-digit numbers. Approach: tens-and-ones with bundle sticks, place-value board, 2-digit operations. Key activity: BundleBuilder (bundle 10 sticks = 1 ten).
  3 = Subtraction+  Can subtract; needs 3-digit mastery. Approach: H-T-O grid, borrowing with physical bundles, 3-digit word problems. Key activity: Word Problem Cards + peer explanation.

─── 90-MINUTE DAILY FLOW ────────────────────────────

CLASS 1–2  (Single group, all students together):
  15m — चला खेळूया (Play):     Circle game, alphabet/number song + movement. Builds energy and social skills.
  15m — चला ऐकुया (Listen):   Teacher reads picture story aloud with expression; 2–3 comprehension questions; every child speaks.
  15m — चला करूया (Do):       Individual task (trace letter / draw number / circle a word); 2 children share aloud.
  45m — TLM Activities:         Groups of 4–5 rotate through: Chitra Cards, Number Stones, Linking Cards, Bundle Sticks, digital simulations.

CLASS 3–4 LANGUAGE  (Two simultaneous level-groups, 90 min each):
  GROUP 1 — Akshargandh + Shabdgandh (Literacy Levels 0–3):
    10m Warm Up → 15m चला ऐकुया (picture story) → 20m Reading Practice (pairs, Chitra Cards) → 25m Group Work (sorting, matching, word games) → 20m Story/Writing Activity
  GROUP 2 — Pushpagandh (Literacy Level 4, runs a 2-day story cycle):
    Day 1: 10m Warm Up → 30m New Story Introduction (read + predict) → 25m Comprehension Questions → 25m Creative Writing / Retelling
    Day 2: 10m Warm Up → 30m Re-read + Discussion (character, moral) → 25m Extended Activity (role play / sequencing) → 25m Peer Writing + Share

CLASS 3–4 MATHS  (Two simultaneous level-groups):
  GROUP 1 — Pankti + Samay (Numeracy Levels 0–2):
    10m Warm Up → 15m Number Identification (flash cards, number line) → 25m Operations Practice (with objects/bundles) → 25m Number Games (train, river, bigger-smaller) → 15m Wrap-Up + Share
  GROUP 2 — Mashal (Numeracy Level 3, advanced):
    10m Discussion (3-digit riddles) → 10m Number Recognition (H-T-O grid, 3-digit flash cards) → 20m Word Problems (column method, borrowing) → 20m Small Group Problem-Solving + Presentation

─── AVAILABLE TLM MATERIALS ─────────────────────────

  • Chitra Cards           — picture + word cards for literacy Levels 1–3; use for matching, sorting, comprehension.
  • Linking Cards          — letter → sound → picture chains; critical for Levels 0–1 to bridge letter and word.
  • Chaudakhadi Chart      — Marathi alphabet reference; every classroom must have one visible.
  • Number Flash Cards     — digit recognition drills for numeracy Levels 0–1; also used for speed challenges.
  • Bundle Sticks (tens)   — physical place-value tool; group 10 sticks into 1 bundle for "tens" concept (Level 2).
  • H-T-O Grid             — Hundreds-Tens-Ones board drawn on blackboard; essential for Level 3.
  • Word Problem Cards     — contextual real-life maths scenarios for Levels 2–3.
  • Basic Stories 1/2/3    — graduated reading booklets for Levels 2–4.
  • Anuched Pustika        — paragraph booklet for Levels 3–4 deep reading.
  • Bal Library Worksheets — take-home reading reinforcement for Levels 2–4.

─── CORE TaRL PEDAGOGICAL PRINCIPLES ───────────────

  1. TEACH AT THE RIGHT LEVEL — Group students by current ASER level, NOT by class/grade. A Class 5 student at Level 1 joins the Level 1 group.
  2. DAILY STRUCTURED FLOW — Every session: Play → Listen → Do → TLM. Never skip the play phase; it sets engagement for the whole session.
  3. SIMULTANEOUS GROUPS — Class 3–4 always runs two groups at the same time. Teacher circulates every 15–20 minutes. Students must be self-sufficient within their group.
  4. GAMES BEFORE DRILLS — Introduce every concept through a game first. Competitive and cooperative games both work; avoid pure drilling.
  5. MANIPULATIVES BEFORE ABSTRACT — Always use physical objects (stones, cards, bundles) before moving to written symbols or printed worksheets.
  6. PEER LEARNING LADDER — Students at higher sub-levels within a group teach lower ones. This consolidates the teacher's learning AND builds confidence.
  7. DAILY MICRO-OBSERVATION — During TLM time, teacher targets 3–4 students per day for 2-minute individual observation. Track movement between ASER levels.
  8. FREQUENCY OVER DURATION — Short daily practice beats long weekly sessions. 90 minutes every day is the core commitment.

─── INTERVENTION RECIPES BY BOTTLENECK ─────────────

  HIGH % AT LITERACY LEVEL 0 (Beginner stuck):
    → Run "Chaudakhadi Relay": 2 teams, one letter called out, first to find it on the chart wins a point.
    → Use Linking Cards daily for 10 minutes — letter sound → picture → word chain.
    → Send Linking Cards home for parent-assisted practice.

  HIGH % AT LITERACY LEVEL 1 (Letter-but-not-word):
    → Word-building game with cut-up Chitra Card letters.
    → Chitra Card sorting: group cards by first letter, then by last letter.
    → Daily 5-minute "read aloud 1 word to a partner" activity.

  HIGH % AT NUMERACY LEVEL 0 (Cannot recognize numbers):
    → Stone counting: scatter 1–9 stones, children pick up the number called.
    → Number song with body: clap N times for each number 1–9.
    → Number Flash Card "fastest hand": flash card, first child to slap the right number wins.

  HIGH % AT NUMERACY LEVEL 1 (Single digit but no operations):
    → Number line jump: physical number line on floor, teacher calls "3 + 2", child jumps.
    → Domino addition: use domino tiles for visual addition.
    → "Market game": pretend shop with stones as coins (max 9).

  LOW ENDLINE IMPROVEMENT (Stagnant cohort):
    → Review group composition — students may have been mis-leveled at baseline.
    → Increase TLM rotation frequency: every 8 minutes instead of 12.
    → Introduce "speed rounds" to build fluency and confidence.
    → Ensure Warm Up game is changed daily to maintain novelty.
═══════════════════════════════════════════════════════
`;

/**
 * Short activity lookup by ASER level for quick suggestions.
 * Key: "literacy-0", "numeracy-2", etc.
 */
export const LEVEL_ACTIVITY_MAP: Record<string, string> = {
  'literacy-0': 'Chaudakhadi Relay — students race to find the called letter on the chart',
  'literacy-1': 'Chitra Card Sort — group picture cards by first letter, then swap groups to check',
  'literacy-2': 'Paragraph 2-Line Stories — pairs read one line each, then switch',
  'literacy-3': 'Basic Stories + comprehension — read aloud, pause for prediction, 3 questions',
  'literacy-4': 'Anuched Pustika + student-led retelling with role play',
  'numeracy-0': 'Stone Counting Circle — teacher calls a number 1–9, child picks that many stones',
  'numeracy-1': 'Number Flash Card Speed Round — flash card, slap the matching number',
  'numeracy-2': 'Bundle Sticks — group 10 sticks into 1 bundle, build 2-digit numbers physically',
  'numeracy-3': 'Word Problem Cards — solve in pairs, explain reasoning to the class',
};
