export interface SessionActivity {
  name: string;
  marathiName?: string;
  description: string;
  duration: number; // in minutes
  type?: string;
  daySpecific?: 1 | 2;
}

export interface SessionStructure {
  totalTime: number;
  activities: SessionActivity[];
}

export const GRADE_1_2_STRUCTURE: SessionStructure = {
  totalTime: 90,
  activities: [
    { 
      name: "Manual Based Activities", 
      description: "Teacher-led physical and manual engagement activities.", 
      duration: 45,
      type: "Manual"
    },
    { 
      name: "TLM Based Activities", 
      description: "Learning using Teaching Learning Materials (Flashcards, Blocks, Stones).", 
      duration: 45,
      type: "TLM"
    }
  ]
};

export const LANGUAGE_LEVEL_1: SessionStructure = {
  totalTime: 90,
  activities: [
    { name: "Warm up", description: "Mental, physical, language, and social development", duration: 10 },
    { name: "Sound Recognition", description: "Identifying words and sounds", duration: 15 },
    { name: "Play", description: "Games for classroom fun", duration: 15 },
    { name: "Write", description: "Drawing stories and writing", duration: 20 },
    { name: "Discussion & Story", description: "Picture discussion and story reading", duration: 30 }
  ]
};

export const LANGUAGE_LEVEL_2: SessionStructure = {
  totalTime: 90,
  activities: [
    { name: "Pushpagandh / Story", description: "Reading advanced stories and complex texts.", duration: 15 },
    { name: "Preparation for Role Play", description: "Choosing characters and practicing dialogues.", duration: 15 },
    { name: "Mind Map", description: "Visualizing concepts and connections on the board.", duration: 20 },
    { name: "Writing", description: "Creative writing and summarization.", duration: 20 },
    { name: "Worksheet", description: "Day 1: Individual written practice.", duration: 30, daySpecific: 1 },
    { name: "Role Play", description: "Day 2: Group performance of the story.", duration: 20, daySpecific: 2 }
  ]
};

export const MATH_LEVEL_1: SessionStructure = {
  totalTime: 90,
  activities: [
    { name: "Warm-up / Games", description: "Quick mental math games and physical movement.", duration: 10 },
    { name: "Discussion around Mathematics", description: "Talking about math in daily life contexts.", duration: 10 },
    { name: "Number Recognition", description: "Identifying numbers 1-99 on cards or board.", duration: 10 },
    { name: "Basic Operation / Word Problem", description: "Addition and Subtraction challenges.", duration: 20 },
    { name: "Level Specific (Pankti/Samay)", description: "Focused drills on identified learning gaps.", duration: 40 }
  ]
};

export const MATH_LEVEL_2: SessionStructure = {
  totalTime: 90,
  activities: [
    { name: "Mashal (Three Digit)", description: "Advanced number recognition and place value.", duration: 10 },
    { name: "Discussion around Mathematics", description: "Complex logic and problem solving talk.", duration: 10 },
    { name: "Number Recognition", description: "Identifying numbers 100-999.", duration: 20 },
    { name: "Basic Operation / Word Problem", description: "Multiplication and Division challenges.", duration: 20 },
    { name: "Small Group Work", description: "Collaborative problem solving in small teams.", duration: 30 }
  ]
};

export const DAILY_ROUTINES = [
  { name: "Think-Talk-Act", marathiName: "चला करूया – विचार करा - बोला", duration: 15 },
  { name: "Listen-Understand-Discuss", marathiName: "चला ऐकुया – समजून घेऊया – चर्चा करूया", duration: 15 },
  { name: "Play", marathiName: "चला खेळूया", duration: 15 }
];
