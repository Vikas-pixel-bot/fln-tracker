export interface SessionActivity {
  name: string;
  marathiName?: string;
  duration: number; // minutes
  description: string;
  instructions: string[];
  materials: string[];
  simulationId?: string;
  daySpecific?: 1 | 2;
}

export interface LevelGroup {
  name: string;        // e.g. "Akshargandh"
  marathiName?: string;
  subtitle: string;    // e.g. "Beginner & Letter"
  color: string;       // tailwind bg class
  activities: SessionActivity[];
  totalTime: number;
  note?: string;
}

export interface SessionPlan {
  classRange: string;
  totalTime: number;
  subject?: string;
  groups: LevelGroup[]; // 1 group for Class 1-2, 2 groups for Class 3-4
  note?: string;
}

// ─── CLASS 1–2 ─────────────────────────────────────────────────────────────
// Single 90-min session, 3 daily activities (15 min each) + TLM (45 min)
export const CLASS_1_2_PLAN: SessionPlan = {
  classRange: "1-2",
  totalTime: 90,
  groups: [
    {
      name: "Full Class",
      subtitle: "All Students Together",
      color: "blue",
      totalTime: 90,
      activities: [
        {
          name: "चला खेळूया",
          marathiName: "चला खेळूया",
          duration: 15,
          description: "Play — Games that build social, physical and language skills",
          instructions: [
            "Gather all students in a circle or open space",
            "Choose one physical/language game (clapping game, song + movement, letter sound game)",
            "Rotate who leads the game — builds confidence",
            "Keep energy high — this sets the tone for the day"
          ],
          materials: ["Open space or circle seating", "Handkerchief / small prop if needed"],
          simulationId: "g-oddone"
        },
        {
          name: "चला ऐकुया",
          marathiName: "चला ऐकुया – समजून घेऊया – चर्चा करूया",
          duration: 15,
          description: "Listen → Understand → Discuss — Teacher reads aloud; students respond",
          instructions: [
            "Teacher reads a short picture story or rhyme aloud with expression",
            "Ask 2–3 comprehension questions: 'Who is in the picture?' 'What is happening?'",
            "Encourage every child to speak — even one word counts",
            "Praise participation, not just correct answers"
          ],
          materials: ["Picture card or storybook", "Chitra Card from TaRL kit"],
          simulationId: "sound-explorer"
        },
        {
          name: "चला करूया",
          marathiName: "चला करूया – विचार करा – बोला",
          duration: 15,
          description: "Think → Do → Speak — Hands-on activity then share with class",
          instructions: [
            "Give each child a simple task: draw a letter, trace a number, circle a word",
            "Allow 8 minutes of individual work",
            "Ask 2–3 children to show their work and say one sentence about it",
            "Correct gently using Chaudakhadi reference if needed"
          ],
          materials: ["Notebook or slate", "Pencil / chalk", "Letter/number cards"],
          simulationId: "g-letters"
        },
        {
          name: "TLM Based Activities",
          marathiName: "शैक्षणिक साहित्य आधारित कृती",
          duration: 45,
          description: "Teaching Learning Materials — Flashcards, blocks, stones, bundles",
          instructions: [
            "Split students into small groups of 4–5",
            "Assign level-appropriate TLM activity per group (letter cards, number stones, bundles of 10)",
            "Rotate between groups every 10–12 minutes to check and guide",
            "Use the digital simulations on this device as a supplementary station",
            "End with a 5-minute whole-class share-out"
          ],
          materials: [
            "Chitra Cards", "Number Flash Cards", "Linking Cards",
            "Stones / Seeds for counting", "Bundles of sticks (tens)",
            "Chaudakhadi chart"
          ],
          simulationId: "bundle-builder"
        }
      ]
    }
  ]
};

// ─── CLASS 3–4, LANGUAGE ──────────────────────────────────────────────────
// Two levels run simultaneously: Level 1 (90 min) + Level 2 (90 min)
export const CLASS_3_4_LANGUAGE_PLAN: SessionPlan = {
  classRange: "3-4",
  subject: "language",
  totalTime: 180,
  note: "Both groups work simultaneously. Teacher circulates between them.",
  groups: [
    {
      name: "Akshargandh + Shabdgandh",
      marathiName: "अक्षरगंध / शब्दगंध",
      subtitle: "Beginner, Letter, Word & Paragraph levels",
      color: "violet",
      totalTime: 90,
      activities: [
        {
          name: "Warm Up",
          marathiName: "वॉर्मअप",
          duration: 10,
          description: "Activities for mental, physical, language and social development",
          instructions: [
            "Quick game: clapping rhythm with letters/words, or 'Simon says' with body movements",
            "Ask one child to share something from yesterday — builds recall",
            "Can use tongue twisters (ukhane) for language warm-up"
          ],
          materials: ["None required"],
          simulationId: "g-rhyme"
        },
        {
          name: "Discussion & Story",
          marathiName: "चर्चा आणि गोष्ट",
          duration: 30,
          description: "Picture discussion + story reading in small groups",
          instructions: [
            "Show a picture card — ask: 'What do you see? Who is this? What is happening?'",
            "Teacher models reading the story aloud with expression (haavbhaav)",
            "Choral reading — whole group reads together once",
            "Individual reading — 2–3 students read aloud; others follow with finger",
            "Ask comprehension: 'What happened first? What does this word mean?'",
            "Students circle difficult words and write them in their notebooks"
          ],
          materials: ["Story cards / Basic Stories booklet", "Picture Cards", "Paragraph Pustika", "Notebooks"],
          simulationId: "g-story"
        },
        {
          name: "Sound Recognition",
          marathiName: "आवाज ओळख / अक्षर खेळ",
          duration: 15,
          description: "Identifying letters, sounds, and building words — using Chaudakhadi",
          instructions: [
            "Point to a row in the Chaudakhadi — read one syllable slowly, students repeat",
            "Ask: 'Find the letter ब in your notebook — how many words start with ब?'",
            "Play: 'Vara vahato' — students standing, called letter sits",
            "Akshargandh group: focus on recognizing individual letters",
            "Shabdgandh group: focus on building 2–3 letter words from those sounds"
          ],
          materials: ["Chaudakhadi chart", "Letter cards", "Slates or notebooks"],
          simulationId: "marathi-letters"
        },
        {
          name: "Play",
          marathiName: "चला खेळूया — शब्दांचे खेळ",
          duration: 15,
          description: "Word and letter games that bring fun and reinforce learning",
          instructions: [
            "Choose one game: Antakshari (words), Shabd Antakshari, Topli-che Khel, or Chimni Ood",
            "For Akshargandh: play with letter sounds and recognition",
            "For Shabdgandh: play word-building or rhyming games",
            "Keep it energetic — students can stand and move"
          ],
          materials: ["Word cards if available", "Chalk for floor games"],
          simulationId: "marathi-words"
        },
        {
          name: "Write",
          marathiName: "लेखन",
          duration: 20,
          description: "Drawing stories, free writing, dictation",
          instructions: [
            "Akshargandh: Draw a picture and write the letters they recognize below it",
            "Shabdgandh: Write 3–5 words from today's story; try a sentence",
            "Give a dictation of 3–5 words from the lesson",
            "Ask one child to read back what they wrote",
            "Correct errors using Chaudakhadi — help, don't scold"
          ],
          materials: ["Notebook", "Pencil", "Dictation word list from story"],
          simulationId: "word-builder"
        }
      ]
    },
    {
      name: "Pushpagandh",
      marathiName: "पुष्पगंध",
      subtitle: "Story level — one lesson over 2 days",
      color: "rose",
      totalTime: 90,
      note: "One story/lesson is implemented over Day 1 and Day 2",
      activities: [
        // DAY 1
        {
          name: "Story Related Activities",
          marathiName: "गोष्ट / पाठ संबंधित कृती",
          duration: 30,
          description: "Deep reading and comprehension activities around the story",
          instructions: [
            "Teacher reads the story once with full expression",
            "Choral reading — group reads together",
            "Silent reading — students read alone, circling unknown words",
            "Form groups of 3–4; each group reads a section and discusses",
            "Ask inference questions: 'Why did the character do this? What will happen next?'",
            "Each group summarizes their section for the class"
          ],
          materials: ["Basic Stories booklet", "Anuched Pustika", "Notebooks"],
          simulationId: "g-true",
          daySpecific: 1
        },
        {
          name: "Mind Map",
          marathiName: "माइंड मॅप",
          duration: 15,
          description: "Visualizing the story structure on board or paper",
          instructions: [
            "Write the main topic/character in the center of the board",
            "Students call out key words from the story — add them as branches",
            "Ask: 'What are the main events? What words describe the character?'",
            "Students copy the mind map into their notebooks",
            "Use the mind map to sequence events in order"
          ],
          materials: ["Blackboard + chalk", "Notebooks"],
          daySpecific: 1
        },
        {
          name: "Preparation for Role Play",
          marathiName: "भूमिका नाटकाची तयारी",
          duration: 15,
          description: "Choosing characters and practicing dialogues for tomorrow",
          instructions: [
            "Assign characters from the story to students",
            "Students practice their lines in pairs or small groups",
            "Teacher helps with pronunciation and expression",
            "Remind students to remember their character for Day 2"
          ],
          materials: ["Story text", "Character name cards if available"],
          daySpecific: 1
        },
        {
          name: "Writing (Worksheet)",
          marathiName: "लेखन / कार्यपत्रिका",
          duration: 20,
          description: "Individual written practice based on today's story",
          instructions: [
            "Students answer 2–3 written questions from the story",
            "Write a summary of the story in their own words (3–4 sentences)",
            "Optional: illustrate a scene from the story",
            "Teacher circulates and provides individual feedback"
          ],
          materials: ["Bal Library Worksheet", "Notebook", "Pencil"],
          simulationId: "sentence-arch",
          daySpecific: 1
        },
        // DAY 2
        {
          name: "Role Play",
          marathiName: "भूमिका नाटक",
          duration: 20,
          description: "Performance of the story characters",
          instructions: [
            "Students perform the story as a short play with their assigned characters",
            "Audience asks one question to each performer",
            "Discuss: 'What did we learn from this story?'",
            "Appreciate effort — clap for everyone"
          ],
          materials: ["Story text", "Basic props if available"],
          simulationId: "marathi-sent",
          daySpecific: 2
        },
        {
          name: "Writing",
          marathiName: "स्वयंलेखन",
          duration: 20,
          description: "Creative writing — express own ideas",
          instructions: [
            "Ask students to write what they would do if they were the main character",
            "Or: write an alternate ending to the story",
            "Share with a partner and give one comment",
            "Teacher collects notebooks for review"
          ],
          materials: ["Notebook", "Pencil"],
          daySpecific: 2
        },
        {
          name: "Worksheet",
          marathiName: "कार्यपत्रिका",
          duration: 20,
          description: "Structured worksheet — vocabulary, grammar, comprehension",
          instructions: [
            "Fill in blanks, match words, answer questions from the story",
            "Check with a partner when done",
            "Go over answers as a class — discuss any mistakes"
          ],
          materials: ["Bal Library Worksheet", "Pencil"],
          daySpecific: 2
        }
      ]
    }
  ]
};

// ─── CLASS 3–4, MATHS ─────────────────────────────────────────────────────
export const CLASS_3_4_MATHS_PLAN: SessionPlan = {
  classRange: "3-4",
  subject: "maths",
  totalTime: 180,
  note: "Both groups work simultaneously. Teacher circulates between them.",
  groups: [
    {
      name: "Pankti + Samay",
      marathiName: "पंक्ती / समय",
      subtitle: "Beginner, 1-digit & 2-digit levels",
      color: "blue",
      totalTime: 90,
      activities: [
        {
          name: "Warm-up Pre-Maths",
          marathiName: "वॉर्मअप — गणित खेळ",
          duration: 10,
          description: "Quick mental math games and physical movement to activate number sense",
          instructions: [
            "Count aloud as a group: forward, backward, by 2s or 5s",
            "Clap-count: clap once for odd numbers, twice for even",
            "Quick flash: show a number card, students say the next number",
            "Pankti group: count objects (stones, seeds) 1 to 9",
            "Samay group: count in tens — 10, 20, 30..."
          ],
          materials: ["Number Flash Cards", "Stones / seeds for Pankti group"],
          simulationId: "g-bigger"
        },
        {
          name: "Discussion around Mathematics",
          marathiName: "गणितावर चर्चा",
          duration: 10,
          description: "Connecting math to daily life through discussion",
          instructions: [
            "Ask: 'How many rotis did you eat this morning? If you ate 2 more, how many total?'",
            "Discuss a real scenario: 'The shop has 15 mangoes. 8 were sold. How many left?'",
            "Let students suggest their own daily-life math problems",
            "Write one problem on the board — students discuss before solving"
          ],
          materials: ["Blackboard", "Word Problem Cards"],
          simulationId: "g-counting"
        },
        {
          name: "Number Recognition",
          marathiName: "संख्या ओळख",
          duration: 20,
          description: "Identifying and working with numbers using cards and TLM",
          instructions: [
            "Flash a number card — students read aloud and write on slate",
            "Pankti: identify numbers 1–9, match dots to numbers",
            "Samay: identify 10–99, identify tens and ones using bundles",
            "Play: 'Who has the biggest number?' — compare two number cards",
            "Ask students to find numbers in the room (on books, walls, etc.)"
          ],
          materials: ["Number Flash Cards", "Stones/seeds", "Bundles of 10 sticks", "Slates"],
          simulationId: "num-race-b"
        },
        {
          name: "Basic Operation & Word Problem",
          marathiName: "मूलभूत क्रिया व शाब्दिक प्रश्न",
          duration: 40,
          description: "Addition, subtraction, and word problems — the core 40-minute block",
          instructions: [
            "Pankti group: single-digit addition using stones (3 stones + 4 stones = ?)",
            "Samay group: two-digit addition with bundles of 10; introduce carry-over",
            "Write 3–4 word problems on board — students solve individually first",
            "Pair-check: swap slates with a neighbor and verify",
            "Teacher calls one student per group to explain their working at the board",
            "Correct misconceptions immediately using TLM (physical bundles/stones)"
          ],
          materials: [
            "Stones / seeds", "Bundles of 10 sticks", "Slates + chalk",
            "Word Problem Cards", "Math Worksheets (Class 3-5, Level 1)"
          ],
          simulationId: "addition-master"
        },
        {
          name: "Games",
          marathiName: "गणिताचे खेळ",
          duration: 10,
          description: "Fun math game to close the session and reinforce learning",
          instructions: [
            "Pick one: Number Train (fill missing number), Bigger-Smaller race, or Market Math roleplay",
            "Keep it fast-paced and energetic — everyone participates",
            "Award points or stars to encourage friendly competition"
          ],
          materials: ["Number cards", "Stones if needed"],
          simulationId: "g-train"
        }
      ]
    },
    {
      name: "Mashal",
      marathiName: "मशाल",
      subtitle: "3-digit numbers — advanced level",
      color: "orange",
      totalTime: 60,
      activities: [
        {
          name: "Discussion around Mathematics",
          marathiName: "गणितावर चर्चा",
          duration: 10,
          description: "Complex logic and 3-digit problem discussion",
          instructions: [
            "Start with a 3-digit puzzle: 'I have 3 hundreds, 2 tens and 5 ones — what number am I?'",
            "Discuss: how is 325 different from 235? What changes?",
            "Students suggest their own 3-digit riddles for the group to solve"
          ],
          materials: ["Blackboard", "Word Problem Cards"],
          simulationId: "g-place"
        },
        {
          name: "Number Recognition",
          marathiName: "संख्या ओळख — तीन अंकी",
          duration: 10,
          description: "Identifying 3-digit numbers using H-T-O grid",
          instructions: [
            "Show H-T-O grid on board: fill in hundreds, tens, ones columns",
            "Flash number cards 100–999 — students write on slates",
            "Ask: 'What is the hundreds digit? The tens digit?'",
            "Students arrange pebbles in H-T-U columns to represent numbers"
          ],
          materials: ["H-T-O grid (drawn on board)", "Pebbles/seeds", "Slates"],
          simulationId: "pv-battle-b"
        },
        {
          name: "Basic Operation & Word Problem",
          marathiName: "मूलभूत क्रिया व शाब्दिक प्रश्न",
          duration: 20,
          description: "3-digit addition/subtraction and word problems",
          instructions: [
            "Solve 2–3 three-digit addition problems using the column method on the board",
            "Demonstrate borrowing/carrying with physical bundles if needed",
            "Students solve 2 word problems individually, then share working",
            "Pair-check answers — discuss differences in approach"
          ],
          materials: [
            "Blackboard", "Slates", "Word Problem Cards",
            "Math Worksheets (Class 3-5, Level 2)"
          ],
          simulationId: "math-duel-b"
        },
        {
          name: "Working in Small Groups",
          marathiName: "छोट्या गटात काम",
          duration: 20,
          description: "Collaborative problem solving — students teach each other",
          instructions: [
            "Form groups of 3–4 students",
            "Give each group a different word problem or puzzle card",
            "Groups solve together and present their solution to the class",
            "Encourage students to explain their reasoning, not just the answer",
            "Teacher observes and asks probing questions to each group"
          ],
          materials: ["Word Problem Cards", "Blackboard for group presentations", "Slates"],
          simulationId: "g-market"
        }
      ]
    }
  ]
};

// ─── HELPERS ──────────────────────────────────────────────────────────────

export function getSessionPlan(classNum: number, subject?: string): SessionPlan {
  if (classNum <= 2) return CLASS_1_2_PLAN;
  if (subject === 'maths') return CLASS_3_4_MATHS_PLAN;
  return CLASS_3_4_LANGUAGE_PLAN;
}

export const GROUP_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/20",   border: "border-blue-200 dark:border-blue-800",   text: "text-blue-700 dark:text-blue-300",   badge: "bg-blue-500" },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/20", border: "border-violet-200 dark:border-violet-800", text: "text-violet-700 dark:text-violet-300", badge: "bg-violet-500" },
  rose:   { bg: "bg-rose-50 dark:bg-rose-950/20",   border: "border-rose-200 dark:border-rose-800",   text: "text-rose-700 dark:text-rose-300",   badge: "bg-rose-500" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-200 dark:border-orange-800", text: "text-orange-700 dark:text-orange-300", badge: "bg-orange-500" },
};
