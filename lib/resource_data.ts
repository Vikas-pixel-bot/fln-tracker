import { Play, FileText, Gamepad2, GraduationCap, Laptop, BookOpen, Lightbulb, MonitorPlay, SpellCheck, Binary } from "lucide-react";

export type Resource = {
  title: string;
  category: "Video" | "Article" | "Simulation";
  level?: "Letter" | "Word" | "Para/Story" | "1-9" | "10-99" | "Operations";
  description: string;
  id?: string; // YouTube ID or Component Name
  content?: string; // For articles
  image?: string;
  link?: string;
  tags?: string[];
};

export const VIDEOS: Resource[] = [
  {
    title: "TaRL Classroom Demo (Level-1)",
    category: "Video",
    level: "1-9",
    description: "Real-world demonstration of grouping students and handling Level-1 (Number 1-9) activities.",
    id: "S6vX_2A-n_8",
  },
  {
    title: "Language Activity: Story Level",
    category: "Video",
    level: "Para/Story",
    description: "Advanced literacy coaching: How to help students move from comprehension to storytelling.",
    id: "m6E6A2Y77I4",
  },
  {
    title: "Math Activity: Number Recognition",
    category: "Video",
    level: "10-99",
    description: "Using the sticks and bundles method in a physical classroom setting.",
    id: "S9oE66E2E88",
  },
  {
    title: "Teacher Grouping Strategies",
    category: "Video",
    description: "The core of TaRL: How to effectively group 30+ students by their level.",
    id: "9G6j9W_0z0E",
  }
];

export const ARTICLES: Resource[] = [
  {
    title: "The Power of Level-Wise Grouping",
    category: "Article",
    description: "Why teaching at the student's current level is 3x more effective than using age-based curriculum.",
    content: "Teaching at the Right Level (TaRL) is an evidence-based pedagogical approach developed by Pratham. The key is to evaluate children on their basic reading and arithmetic skills and then group them by their actual learning level rather than by their grade or age...",
    tags: ["Pedagogy", "Grouping", "TaRL Basics"]
  },
  {
    title: "Using Digital Manipulatives in the Field",
    category: "Article",
    description: "Best practices for using tablets and simulations like 'Bundle Builder' during field visits.",
    content: "When using digital tools in rural classrooms, the focus should still be on student interaction. Let the student touch the screen to 'Tie the Bundle'. This physical interaction reinforces the mental model of 10 ones becoming 1 ten...",
    tags: ["Technology", "Coaching", "Field Work"]
  }
];

export const SIMULATIONS: Resource[] = [
  {
    title: "Number Hunter",
    category: "Simulation",
    level: "1-9",
    description: "Match visual counts to number symbols. Perfect for students at the 'Beginner' level.",
    id: "NumberHunter",
    link: "/resources/simulations"
  },
  {
    title: "Bundle Builder",
    category: "Simulation",
    level: "10-99",
    description: "The classic sticks and bundles tool for place-value understanding.",
    id: "BundleBuilder",
    link: "/resources/simulations"
  },
  {
    title: "Addition Master",
    category: "Simulation",
    level: "Operations",
    description: "Solve two-digit addition problems by physically re-bundling sticks.",
    id: "AdditionMaster",
    link: "/resources/simulations"
  },
  {
    title: "Sound Explorer",
    category: "Simulation",
    level: "Letter",
    description: "Phonics matching game. Match the sound to the correct letter.",
    id: "SoundExplorer",
    link: "/resources/simulations"
  },
  {
    title: "Word Builder",
    category: "Simulation",
    level: "Word",
    description: "Drag Letters to build words. Categorized by phonetic sounds.",
    id: "WordBuilder",
    link: "/resources/simulations"
  },
  {
    title: "Sentence Architect",
    category: "Simulation",
    level: "Para/Story",
    description: "Sequence stories and paragraphs to build reading comprehension.",
    id: "SentenceArchitect",
    link: "/resources/simulations"
  },
  {
    title: "Flash Math Sprint",
    category: "Simulation",
    tags: ["2v2", "Competitive", "Timer"],
    description: "2v2 Arithmetic Race: Solve addition and subtraction problems against the clock!",
    id: "MathSprint",
    link: "/resources/simulations"
  },
  {
    title: "Phonics Sound Duel",
    category: "Simulation",
    tags: ["2v2", "Competitive", "Timer"],
    description: "2v2 Literacy Battle: Match the sound to the correct letter faster than the other team.",
    id: "SoundDuel",
    link: "/resources/simulations"
  },
  {
    title: "🛒 Math Mania Market",
    category: "Simulation",
    level: "Operations",
    tags: ["Ultimate", "Marketplace", "All Operations"],
    description: "Ultimate Math Mania — Earn rupees by solving math challenges, then spend them in a full Marathi marketplace across 6 unlockable stalls.",
    id: "math-mania-market",
    link: "/resources/simulations"
  },
  {
    title: "📖 Vachan Pravas",
    category: "Simulation",
    level: "Para/Story",
    tags: ["Ultimate", "Marathi", "4 Worlds"],
    description: "Ultimate Marathi Literacy Quest — Journey through 4 worlds (Letters → Words → Sentences → Stories) earning pearls across 24 challenges.",
    id: "vachan-pravas",
    link: "/resources/simulations"
  }
];
