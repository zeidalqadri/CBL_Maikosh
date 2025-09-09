export const moduleData = {
  id: 4,
  title: 'Fouls & Official Signals',
  description: 'Learn about different types of fouls and the official signals used by referees.',
  theme: 'officiating',
  
  learningOutcomes: [
    'Distinguish between a foul and a violation according to MABA rules.',
    'Identify different types of personal fouls (blocking, charging, holding, etc.).',
    'Understand technical, flagrant, and intentional fouls.',
    'Learn the correct 3-step procedure for reporting a foul to scorer\'s table.',
    'Recognize and demonstrate key official hand signals used in basketball.'
  ],
  
  keyConcepts: [
    {
      title: 'Foul Definition',
      description: 'Understanding what constitutes a foul per MABA curriculum',
      details: [
        'An illegal action involving physical contact between opposing players',
        'Basketball is generally a non-contact game - contact violations are fouls',
        'Results in free throws, possession change, or both depending on situation',
        'Counted toward personal and team foul totals',
        'Different from violations which involve rule infractions without contact'
      ]
    },
    {
      title: 'Types of Personal Fouls',
      description: 'Common fouls involving physical contact from MABA rules',
      details: [
        'Personal Fouls include: Hitting, Pushing, Slapping, Holding, Illegal pick/screen',
        'Charging: Offensive foul when player pushes or runs over defensive player',
        'Blocking: Illegal contact from defender not establishing position in time',
        'Penalties: 2 free throws if fouled while shooting (1 if shot made), 3 free throws if fouled on 3-point attempt',
        'Non-shooting fouls result in inbound pass for fouled team'
      ]
    },
    {
      title: 'Technical and Special Fouls',
      description: 'Non-contact and severe fouls according to MABA curriculum',
      details: [
        'Technical Foul: About "manners" of the game - foul language, obscenity, arguing, improper scorebook filling',
        'Flagrant Foul: Violent contact including hitting, kicking, punching - results in free throws plus possession',
        'Intentional Foul: Physical contact with no reasonable effort to steal ball (judgment call)',
        'Team Fouls: Five or more fouls by team results in two free throws for each subsequent foul'
      ]
    },
    {
      title: 'Foul Reporting Procedure',
      description: 'Official 3-step sequence for reporting fouls',
      details: [
        'Step 1: Number of Player who committed foul',
        'Step 2: Type of Foul (signal)',
        'Step 3: Result - Free Throws or Direction of play',
        'Clear communication to scorer\'s table'
      ]
    },
    {
      title: 'Key Official Signals',
      description: 'MABA official hand signals for fouls and violations',
      details: [
        'Blocking: Both hands on hips',
        'Charging: Closed fist pushing forward (with ball) / Point clenched fist (without ball)',
        'Traveling: Half rotation forward direction',
        'Technical Foul: Form "T" with hands, palm showing',
        'Illegal Use of Hands: Strike wrist',
        'Holding: Grasp wrist (downward for offensive, upward for defensive)',
        'Three-point signals: 1-3 fingers extended for free throws awarded'
      ]
    }
  ],
  
  practicalDrills: [
    {
      name: 'MABA 3-Step Foul Reporting',
      objective: 'Master the official 3-step foul reporting procedure',
      description: 'Practice the MABA standard sequence: Player Number > Type of Foul > Result.',
      setup: 'Players in groups of 3 (referee, scorer, observer)',
      keyPoints: [
        'Step 1: Show player number clearly',
        'Step 2: Demonstrate correct foul signal',
        'Step 3: Indicate free throws or direction of play',
        'Practice reporting to scorer\'s table'
      ],
      duration: '15 minutes',
      equipment: ['Whistle', 'MABA signal reference chart', 'Practice scorebook']
    },
    {
      name: 'Referee Signal Mirror',
      objective: 'Learn official MABA hand signals',
      description: 'Coach performs signals; players mirror to learn the game\'s visual language.',
      setup: 'Players facing coach in semicircle',
      keyPoints: [
        'Demonstrate each MABA signal clearly',
        'Players mirror simultaneously',
        'Call out the foul name with signal',
        'Quiz players randomly on signals'
      ],
      duration: '10 minutes',
      equipment: ['Whistle', 'MABA signal reference chart']
    },
    {
      name: 'Charge vs. Block Challenge',
      objective: 'Differentiate between charging and blocking fouls',
      description: 'Controlled 1-on-1 to practice and differentiate charge vs. block.',
      setup: 'Half court with offensive and defensive players',
      keyPoints: [
        'Establish legal defensive position',
        'Practice taking charges safely',
        'Identify blocking fouls',
        'Discuss each call as a group'
      ],
      duration: '20 minutes',
      equipment: ['Basketball', 'Cones for marking positions']
    }
  ],
  
  assessmentQuestions: [
    {
      id: 'q4-1',
      question: 'What is the main difference between a foul and a violation?',
      options: [
        'Fouls are more serious',
        'Fouls involve illegal physical contact; violations do not',
        'Violations result in free throws',
        'There is no difference'
      ],
      correctAnswer: 1,
      explanation: 'Fouls involve illegal physical contact with an opponent, while violations are rule infractions without contact.'
    },
    {
      id: 'q4-2',
      question: 'According to MABA rules, what is the correct 3-step sequence for reporting a foul to the scorer\'s table?',
      options: [
        'Type of Foul > Player Number > Result',
        'Player Number > Type of Foul > Number of Free Throws/Direction of Play',
        'Result > Player Number > Type of Foul',
        'Type of Foul > Result > Player Number'
      ],
      correctAnswer: 1,
      explanation: 'The MABA standard sequence is: Step 1 - Player Number, Step 2 - Type of Foul (signal), Step 3 - Result (free throws awarded or direction of play).'
    },
    {
      id: 'q4-3',
      question: 'What is the official signal for a "blocking" foul?',
      options: [
        'Rotating fists',
        'Both hands on hips',
        'Closed fist pushing forward',
        'Making a "T" with hands'
      ],
      correctAnswer: 1,
      explanation: 'The blocking foul signal is both hands placed on the hips.'
    },
    {
      id: 'q4-4',
      question: 'According to MABA curriculum, a "technical foul" involves what?',
      options: [
        'Illegal physical contact between players',
        'Traveling or dribbling violations',
        'The "manners" of the game - foul language, arguing, improper procedures',
        'Being in the key area too long'
      ],
      correctAnswer: 2,
      explanation: 'Technical fouls are about the "manners" of the game and can include foul language, obscenity, arguing, and even improper scorebook filling.'
    },
    {
      id: 'q4-5',
      question: 'The signal for "traveling" is:',
      options: [
        'Both hands on hips',
        'Rotate fists',
        'Point to the ground',
        'Wave arms side to side'
      ],
      correctAnswer: 1,
      explanation: 'The traveling signal is rotating both fists in a circular motion.'
    }
  ],
  
  resources: [
    {
      title: 'Official Signals Guide',
      type: 'document',
      description: 'Complete guide to all referee hand signals',
      url: '/resources/signals-guide.pdf'
    },
    {
      title: 'Foul Types Video Library',
      type: 'video',
      description: 'Video examples of different foul types',
      url: '/resources/fouls-video-library'
    }
  ],
  
  assignments: [
    {
      title: 'Practice MABA Officiating',
      description: 'Officiate a 10-minute practice game using MABA rules and signals, including proper 3-step foul reporting. Submit reflection on challenges faced.',
      type: 'practical',
      dueWeeks: 1,
      rubric: {
        excellent: 'Confident calls, correct signals, good positioning, thoughtful reflection',
        good: 'Most calls correct, good signals, adequate positioning',
        satisfactory: 'Some correct calls and signals, basic understanding',
        needsImprovement: 'Struggled with calls or signals, needs more practice'
      }
    }
  ],
  
  moduleNotes: {
    instructorGuidelines: [
      'Emphasize MABA-specific signals and procedures',
      'Practice the 3-step foul reporting sequence repeatedly',
      'Use game footage to show real examples of MABA officiating',
      'Emphasize that basketball is generally a non-contact game',
      'Connect signals to actual game situations'
    ],
    commonChallenges: [
      'Distinguishing between charge and block in real-time',
      'Remembering all hand signals',
      'Making confident calls under pressure'
    ],
    tips: [
      'Start with slow-motion practice',
      'Create signal flashcards for study',
      'Practice calling fouls during scrimmages'
    ]
  }
};