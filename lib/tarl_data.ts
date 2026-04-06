export interface TaRLActivity {
  title: string;
  description: string;
  materials: string[];
}

export const LITERACY_ACTIVITIES: Record<number, TaRLActivity[]> = {
  0: [ // Beginner
    {
      title: "Sound Bingo",
      description: "Teacher says a letter sound, and students find objects in the room starting with that sound. The first to find 3 wins.",
      materials: ["Objects in classroom", "Pebbles as markers"]
    },
    {
      title: "Air Drawing",
      description: "Draw letters in the air using large arm movements. Have students repeat the letter's sound while drawing to build muscle memory.",
      materials: ["None"]
    }
  ],
  1: [ // Letter
    {
      title: "Mind-Mapping Objects",
      description: "Write a letter in the center of a chalkboard. Draw branches for every object students can name that starts with that letter.",
      materials: ["Chalk", "Blackboard"]
    },
    {
      title: "Letter Sand-Trays",
      description: "Provide shallow trays of sand or dirt. Have students trace letters they recognize. This tactile feedback is essential for recall.",
      materials: ["Sand/Dirt", "Shallow trays"]
    }
  ],
  2: [ // Word
    {
      title: "Read-Around-the-Circle",
      description: "Sit in a circle. Each student reads one basic word from a flashcard. If they get it right, they stay in; otherwise, they get a 'bonus' word.",
      materials: ["Word Flashcards"]
    },
    {
      title: "Word Building Blocks",
      description: "Use individual letter tiles (C-A-T). Have students physically move tiles to form new words like B-A-T or M-A-T.",
      materials: ["Letter tiles"]
    }
  ],
  3: [ // Paragraph
    {
      title: "Stop-and-Predict",
      description: "Read a paragraph aloud. Stop halfway and ask the student what they think will happen next to build active comprehension.",
      materials: ["Storybooks", "Paragraph cards"]
    },
    {
      title: "Sentence Jumble",
      description: "Write sentences from a paragraph on separate strips. Have the student arrange them in the correct sequential order.",
      materials: ["Paper strips", "Scissors"]
    }
  ],
  4: [ // Story
    {
      title: "Moral Summaries",
      description: "After reading a story, ask the student to write one 'moral' or lesson they learned in their own words.",
      materials: ["Notebook", "Pencil"]
    },
    {
      title: "Roleplay Theater",
      description: "Choose a story character and have the student act out their favorite scene. This deepens emotional connection to the text.",
      materials: ["Storybooks", "Basic props"]
    }
  ]
};

export const NUMERACY_ACTIVITIES: Record<number, TaRLActivity[]> = {
  0: [ // Beginner
    {
      title: "Number Songs",
      description: "Sing 'Five Little Ducks' or similar counting songs while using fingers to physically subtract numbers.",
      materials: ["None"]
    },
    {
      title: "Rock Counting",
      description: "Gather 10 stones. Count them one by one, moving them from a 'pile' to a 'line'. Ask 'How many now?' frequently.",
      materials: ["Stones/Seeds"]
    }
  ],
  1: [ // Num 1-9
    {
      title: "Dot Matching",
      description: "On a sheet of paper, draw groups of dots next to numbers. Have the student draw lines connecting the correct pairs.",
      materials: ["Paper", "Marker"]
    },
    {
      title: "Flashcard Hopscotch",
      description: "Draw hopscotch grids with numbers 1-9. The child must say the number aloud before jumping into the square.",
      materials: ["Chalk", "Outdoor space"]
    }
  ],
  2: [ // Num 10-99
    {
      title: "Bundle Races",
      description: "Give students 30 sticks. Whoever ties them into 3 bundles of 10 the fastest wins. Teaches the concept of 'tens'.",
      materials: ["Sticks/Straws", "Rubber bands"]
    },
    {
      title: "Shopping for Tens",
      description: "Roleplay a shop where items cost 10, 20, or 30. Use bundles of 10 to 'pay' for the items.",
      materials: ["Classroom items", "Bundles of 10"]
    }
  ],
  3: [ // Num 100-999
    {
      title: "Currency Play",
      description: "Use fake notes (100s and 10s). Ask students to 'withdraw' 425 from the pretend bank using the largest notes possible.",
      materials: ["Fake notes", "Bank roleplay corner"]
    },
    {
      title: "Place Value Grids",
      description: "Use an abacus or a drawn H-T-U (Hundreds, Tens, Units) grid. Have students place pebbles in each column to represent 562.",
      materials: ["H-T-U Grid", "Pebbles"]
    }
  ],
  4: [ // Addition
    {
      title: "Carry-over Grids",
      description: "Use a color-coded carry-over grid. When adding 9+5, show how the '1' jumps into the Tens column visually.",
      materials: ["Color markers", "Grid paper"]
    },
    {
      title: "Market Addition",
      description: "Give a budget of 50. Have students pick two items (15 and 20) and add their totals mentally.",
      materials: ["Price tags", "Classroom shop"]
    }
  ],
  5: [ // Subtraction
    {
      title: "Borrowing Roleplay",
      description: "Roleplay 'Borrowing a Bundle'. If I have 2 bundles and 3 sticks, and I need to give away 5, I must 'untie' one bundle.",
      materials: ["Bundles of 10", "Loose sticks"]
    }
  ],
  6: [ // Multiplication
    {
      title: "Stone Arrays",
      description: "Arrange stones in a 4x3 grid. Show how this is the same as counting 4 stones, 3 times over.",
      materials: ["Stones", "Array grid"]
    }
  ],
  7: [ // Division
    {
      title: "Fair Share Picnic",
      description: "Give a student 20 seeds and 4 friends. Ask them to distribute the seeds 'fairly' so everyone has an equal amount.",
      materials: ["Seeds", "Plates/Cups"]
    }
  ]
};
