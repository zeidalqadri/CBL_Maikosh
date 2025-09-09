export const moduleData = {
  id: 9,
  title: 'Strategy & Tactics',
  description: 'Learn offensive and defensive strategies to improve team performance on the court.',
  theme: 'strategy',
  
  learningOutcomes: [
    'Understand basic offensive plays (give-and-go, screen).',
    'Describe objectives of a fast break.',
    'Compare man-to-man vs. zone defense.',
    'Recognize principles of transition defense.'
  ],
  
  keyConcepts: [
    {
      title: 'Basic Offensive Plays',
      description: 'Fundamental plays every team should master',
      details: [
        'Give-and-Go: Pass and immediately cut to basket for return pass',
        'Pick and Roll: Screen setter rolls to basket after screen',
        'Screen (Pick): Stationary block on defender to free teammate',
        'Backdoor Cut: Cut behind defender when overplaying',
        'Post Entry: Getting ball to player in post position',
        'Motion Offense: Continuous movement and screening'
      ]
    },
    {
      title: 'Screen Types and Execution',
      description: 'Different screening techniques',
      details: [
        'Up Screen: Set toward half court',
        'Down Screen: Set toward baseline',
        'Cross Screen: Across the lane',
        'Back Screen: Behind defender',
        'Single vs Double Screens',
        'Staggered Screens: Multiple screens at different angles'
      ]
    },
    {
      title: 'Fast Break Principles',
      description: 'Quick transition offense fundamentals',
      details: [
        'Primary objective: Create easy, high-percentage shot',
        'Get ball to middle of court quickly',
        'Fill lanes wide for spacing',
        'Pass ahead to open player',
        'Attack before defense sets',
        'Numbers advantage (3-on-2, 2-on-1)'
      ]
    },
    {
      title: 'Man-to-Man Defense',
      description: 'Individual defensive assignments',
      details: [
        'Each defender guards specific player',
        'Follow your player everywhere',
        'Help defense when needed',
        'Communication is crucial',
        'Switch on screens if necessary',
        'Deny passing lanes'
      ]
    },
    {
      title: 'Zone Defense',
      description: 'Area-based defensive strategy',
      details: [
        'Defend an area rather than a player',
        'Common zones: 2-3, 3-2, 1-3-1',
        'Protect the paint',
        'Force outside shots',
        'Rebounding positioning built in',
        'Vulnerable to good ball movement'
      ]
    },
    {
      title: 'Transition Defense',
      description: 'Stopping fast breaks',
      details: [
        'Sprint back immediately after turnover',
        'Stop ball first priority',
        'Protect the paint',
        'Match up quickly',
        'Communicate loudly',
        'Tandem Defense: 2 defenders vs multiple attackers'
      ]
    }
  ],
  
  practicalDrills: [
    {
      name: 'Give and Go (2v0)',
      objective: 'Master timing and execution of give-and-go',
      description: 'Timing and execution without a defender.',
      setup: 'Two players, one ball, half court',
      keyPoints: [
        'Passer cuts immediately after pass',
        'Cutter goes hard to basket',
        'Return pass leads the cutter',
        'Finish with lay-up',
        'Add defender when ready'
      ],
      duration: '10 minutes',
      equipment: ['Basketball', 'Half court']
    },
    {
      name: 'Defend the Down Screen (3v0)',
      objective: 'Learn screen timing and spacing',
      description: 'Timing/spacing running off a screen.',
      setup: 'Three players: ball handler, screener, cutter',
      keyPoints: [
        'Screener sets solid screen',
        'Cutter waits for screen to be set',
        'Shoulder-to-shoulder off screen',
        'Multiple options: curl, fade, reject',
        'Progress to live defense'
      ],
      duration: '15 minutes',
      equipment: ['Basketball', 'Half court']
    }
  ],
  
  assessmentQuestions: [
    {
      id: 'q9-1',
      question: 'What is the "give-and-go"?',
      options: [
        'A defensive strategy',
        'Pass to a teammate and cut to the basket for a return pass',
        'Giving the ball and going to the bench',
        'A type of zone defense'
      ],
      correctAnswer: 1,
      explanation: 'Give-and-go involves passing to a teammate then immediately cutting to receive a return pass.'
    },
    {
      id: 'q9-2',
      question: 'A key principle of "Tandem Defense"?',
      options: [
        'One player guards two opponents',
        'Defenders remain constantly active and vocal',
        'Only used in zone defense',
        'Players stand side by side'
      ],
      correctAnswer: 1,
      explanation: 'Tandem defense requires defenders to be active and communicate constantly when outnumbered.'
    },
    {
      id: 'q9-3',
      question: 'First objective of a fast break?',
      options: [
        'Slow down the game',
        'Set up half-court offense',
        'Create an easy, high-percentage shot (e.g., lay-up)',
        'Draw fouls'
      ],
      correctAnswer: 2,
      explanation: 'The primary fast break objective is to create an easy scoring opportunity before defense sets.'
    },
    {
      id: 'q9-4',
      question: 'A "screen" in basketball is when an offensive player...',
      options: [
        'Blocks a shot',
        'Becomes a stationary barrier to free a teammate',
        'Guards the basket',
        'Calls a timeout'
      ],
      correctAnswer: 1,
      explanation: 'A screen is a legal offensive play where a player sets a stationary block to free a teammate.'
    },
    {
      id: 'q9-5',
      question: 'Three types of screens mentioned?',
      options: [
        'High, Low, Middle',
        'Fast, Slow, Medium',
        'Up, Down, Cross; Single, Double, Staggered',
        'Inside, Outside, Baseline'
      ],
      correctAnswer: 2,
      explanation: 'Screens can be categorized by direction (up, down, cross) and number (single, double, staggered).'
    }
  ],
  
  resources: [
    {
      title: 'Basketball Plays Playbook',
      type: 'document',
      description: 'Illustrated guide to basic offensive plays',
      url: '/resources/plays-playbook.pdf'
    },
    {
      title: 'Defensive Strategies Guide',
      type: 'document',
      description: 'Comprehensive guide to defensive systems',
      url: '/resources/defense-guide.pdf'
    }
  ],
  
  assignments: [
    {
      title: 'Play Design Project',
      description: 'Design three original offensive plays for a youth team. Include diagrams, player movements, options, and counters if defense adjusts. Present in a playbook format.',
      type: 'project',
      dueWeeks: 2,
      rubric: {
        excellent: 'Creative plays, clear diagrams, multiple options, well-organized',
        good: 'Good plays, adequate diagrams, some options included',
        satisfactory: 'Basic plays, simple diagrams, limited options',
        needsImprovement: 'Unclear plays or poor presentation'
      }
    }
  ],
  
  moduleNotes: {
    instructorGuidelines: [
      'Use court diagrams and walk through plays',
      'Start with 0 defense, progress to live',
      'Emphasize spacing and timing',
      'Show game film examples'
    ],
    commonChallenges: [
      'Understanding when to use different strategies',
      'Timing of screens and cuts',
      'Transitioning between offense and defense',
      'Recognizing defensive schemes'
    ],
    tips: [
      'Use cones to mark positions initially',
      '5-on-0 walkthroughs before adding defense',
      'Film study of successful teams'
    ]
  }
};