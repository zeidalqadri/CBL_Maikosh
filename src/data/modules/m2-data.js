export const moduleData = {
  id: 2,
  title: 'Rules & Player Positions',
  description: 'Master the official rules and understand the roles of each position on the court.',
  theme: 'rules',
  
  learningOutcomes: [
    'State the number of players on the court and on a team roster.',
    'Identify the 5 primary basketball positions and their characteristics.',
    'Describe the main offensive and defensive responsibilities for each position.',
    'Understand the basic scoring system (1, 2, and 3 points).',
    'Recognize the importance of player height in position determination.'
  ],
  
  keyConcepts: [
    {
      title: 'Number of Players',
      description: 'Team composition and court presence according to MABA rules',
      details: [
        'A full team consists of 12 players total on the roster',
        'Only 5 players are on the court at any time during competition',
        '5 players sit on the bench available for substitution during the game period',
        'Unlimited substitutions allowed during dead balls',
        'Teams can be mixed with boys and girls for recreational play'
      ]
    },
    {
      title: 'Player Positions',
      description: 'The five primary basketball positions and their roles',
      details: [
        'Positions are usually determined by height and skill set',
        'Modern basketball increasingly values versatility',
        'Players may play multiple positions (position-less basketball)',
        'Each position has unique offensive and defensive responsibilities'
      ]
    },
    {
      title: 'Position Breakdown',
      description: 'Detailed responsibilities for each position based on MABA curriculum',
      details: [
        'Point Guard (#1): Runs offense, watches backcourt, extension of coach on floor - must have instinctive game knowledge',
        'Shooting Guard (#2/Off-Guard): Generally the better shooter of the two guards, creates scoring opportunities',
        'Small Forward (#3): Most gifted player, must be versatile - can score from anywhere, good defense',
        'Power Forward (#4): Does "dirty work", solid rebounder, gutsy dribbler, known as "enforcer"',
        'Center (#5): Along with point guard, most important player - tallest, aggressive rebounder, defensive leader'
      ]
    },
    {
      title: 'Scoring System',
      description: 'Point values for different shots according to MABA rules',
      details: [
        '3 points: Player successfully shoots from outside the 3-point line',
        '2 points: All other field goals made from inside the 3-point line',
        '1 point: Free throws awarded after fouls (from free throw line)',
        'Player scores when they manage to put the ball into the basket from above',
        'Scoring a basket increases the team score by 1, 2, or 3 points'
      ]
    }
  ],
  
  practicalDrills: [
    {
      name: 'Position Hotspots',
      objective: 'Build court awareness and position recognition',
      description: 'Players sprint to cones at each position on the coach\'s call to build court awareness.',
      setup: 'Place 5 cones at typical position spots on the court',
      keyPoints: [
        'Call out positions randomly',
        'Players must reach correct spot quickly',
        'Add defensive stance when they arrive',
        'Progress to calling offensive plays'
      ],
      duration: '10 minutes',
      equipment: ['5 cones', 'Full court']
    },
    {
      name: 'Role Responsibilities Shout-Out',
      objective: 'Reinforce position-specific responsibilities',
      description: 'Players rapidly name responsibilities for a called position—offense or defense.',
      setup: 'Players in a circle or line',
      keyPoints: [
        'Coach calls position and "offense" or "defense"',
        'Player must name 3 responsibilities quickly',
        'Other players verify accuracy',
        'Rotate through all positions'
      ],
      duration: '15 minutes',
      equipment: ['None required']
    }
  ],
  
  assessmentQuestions: [
    {
      id: 'q2-1',
      question: 'According to MABA rules, how many players from each team are on the court during competition?',
      options: [
        '4 players on court, 8 on bench',
        '5 players on court, 5 on bench',
        '5 players on court, 7 on bench',
        '6 players on court, 6 on bench'
      ],
      correctAnswer: 1,
      explanation: 'MABA rules state that 5 players from each team play on the court with 5 players sitting on the bench for substitution, making a full team of 12 players.'
    },
    {
      id: 'q2-2',
      question: 'According to MABA curriculum, the Point Guard is described as what?',
      options: [
        'The tallest player who protects the basket',
        'An extension of the coach on the floor who runs the offense',
        'The best shooter who creates scoring opportunities',
        'The enforcer who does the dirty work'
      ],
      correctAnswer: 1,
      explanation: 'MABA describes the Point Guard as running the offense and watching the backcourt, being really an extension of the coach on the floor.'
    },
    {
      id: 'q2-3',
      question: 'A successful shot from outside the three-point line is worth how many points?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctAnswer: 2,
      explanation: 'Shots made from beyond the three-point line are worth 3 points.'
    },
    {
      id: 'q2-4',
      question: 'Which position is generally the tallest player on the team?',
      options: [
        'Point Guard',
        'Shooting Guard',
        'Small Forward',
        'Center'
      ],
      correctAnswer: 3,
      explanation: 'The Center is typically the tallest player, positioned near the basket for rebounds and interior scoring.'
    },
    {
      id: 'q2-5',
      question: 'Which player is also referred to as the #2 guard?',
      options: [
        'Point Guard',
        'Shooting Guard (Off-Guard)',
        'Small Forward',
        'Power Forward'
      ],
      correctAnswer: 1,
      explanation: 'The Shooting Guard is also known as the Off-Guard or #2 position.'
    }
  ],
  
  resources: [
    {
      title: 'Basketball Positions Guide',
      type: 'document',
      description: 'Comprehensive guide to all five basketball positions',
      url: '/resources/positions-guide.pdf'
    },
    {
      title: 'Court Diagram with Positions',
      type: 'diagram',
      description: 'Visual representation of typical position placement',
      url: '/resources/court-positions.pdf'
    }
  ],
  
  assignments: [
    {
      title: 'MABA Position Analysis Report',
      description: 'Watch a basketball game and track one player\'s movement and responsibilities according to MABA position definitions. Write a 300-word analysis of how they fulfilled their position role.',
      type: 'observation',
      dueWeeks: 1,
      rubric: {
        excellent: 'Detailed observations, clear understanding of position roles, specific examples',
        good: 'Good observations, understands main responsibilities, some examples',
        satisfactory: 'Basic observations, general understanding of position',
        needsImprovement: 'Limited observations or unclear understanding'
      }
    }
  ],
  
  moduleNotes: {
    instructorGuidelines: [
      'Use video examples showing MABA position characteristics',
      'Emphasize the specific qualities MABA defines for each position',
      'Connect positions to team strategy and height considerations',
      'Reference Malaysian basketball examples when possible',
      'Explain how positions are usually determined by height'
    ],
    commonChallenges: [
      'Students may have outdated views of rigid positions',
      'Understanding defensive responsibilities can be complex',
      'Height isn\'t always the determining factor for positions'
    ],
    tips: [
      'Start with traditional positions then discuss modern variations',
      'Use position-specific drills to reinforce learning',
      'Create position cards for quick reference'
    ]
  }
};