export const moduleData = {
  id: 3,
  title: 'Violations',
  description: 'Understand basketball violations and how to teach players to avoid them.',
  theme: 'violations',
  
  learningOutcomes: [
    'Define what a violation is in basketball according to MABA rules.',
    'Differentiate between key violations like Traveling, Double Dribble, and Carrying.',
    'Understand time-based restrictions and court violations.',
    'Know the penalty for violations (awarding ball to opponents).',
    'Recognize goaltending and backcourt violations.'
  ],
  
  keyConcepts: [
    {
      title: 'Violation Definition',
      description: 'Understanding what constitutes a violation per MABA rules',
      details: [
        'A violation occurs when a player infracts the rules of basketball',
        'Does not involve illegal physical contact (unlike fouls)',
        'Results in awarding the ball to the opponents',
        'The penalty is a throw-in for the opposing team',
        'Different from fouls which involve physical contact between players'
      ]
    },
    {
      title: 'Ball Handling Violations',
      description: 'Common violations related to ball handling from MABA curriculum',
      details: [
        'Walking/Traveling: Taking more than "a step and a half" without dribbling, or moving pivot foot after stopping',
        'Double Dribble: Dribbling with both hands simultaneously OR picking up dribble and dribbling again',
        'Carrying/Palming: Dribbling with hand too far to side or under the ball',
        'Held Ball: When opposing players gain possession simultaneously (resolved by alternating possession)'
      ]
    },
    {
      title: 'Time Restrictions',
      description: 'Time-based violations according to MABA rules',
      details: [
        '5-Second Inbound Rule: Player passing ball inbounds has 5 seconds to pass',
        '5-Second Closely Guarded Rule: Player cannot hold ball more than 5 seconds when closely guarded',
        'Shot Clock Restrictions: In some levels, teams must attempt shot within given time frame',
        'Failure to meet time restrictions results in ball awarded to other team'
      ]
    },
    {
      title: 'Court and Special Violations',
      description: 'Additional important violations from MABA curriculum',
      details: [
        'Goaltending: Defensive player interfering with shot on downward flight or after touching backboard',
        'Backcourt Violation: After bringing ball across mid-court line, cannot return it across during possession',
        'Out of Bounds: Ball or player with ball touches outside the court boundaries',
        'Offensive Goaltending: Results in violation and ball awarded to opposing team for throw-in'
      ]
    }
  ],
  
  practicalDrills: [
    {
      name: 'Pivot Perfection',
      objective: 'Master legal pivoting technique',
      description: 'After a jump stop, practice proper pivoting with a firmly planted pivot foot.',
      setup: 'Players spread out with adequate space',
      keyPoints: [
        'Emphasize keeping pivot foot planted',
        'Practice both forward and reverse pivots',
        'Add defensive pressure gradually',
        'Call out violations when they occur'
      ],
      duration: '15 minutes',
      equipment: ['Basketballs for each player']
    },
    {
      name: 'Dribble, Stop, Pass',
      objective: 'Avoid traveling and double dribble violations',
      description: 'Legal stop > pivot > pass to avoid traveling or double dribble.',
      setup: 'Partners facing each other, 10 feet apart',
      keyPoints: [
        'Focus on proper footwork when stopping',
        'Establish pivot foot immediately',
        'Make crisp passes after pivoting',
        'Increase speed as technique improves'
      ],
      duration: '10 minutes',
      equipment: ['One basketball per pair']
    }
  ],
  
  assessmentQuestions: [
    {
      id: 'q3-1',
      question: 'According to MABA rules, what constitutes a "double dribble" violation?',
      options: [
        'Dribbling with two hands simultaneously',
        'Dribbling twice in a row',
        'Dribbling with both hands on the ball at the same time OR picking up the dribble and dribbling again',
        'Only dribbling with two hands'
      ],
      correctAnswer: 2,
      explanation: 'MABA defines double dribble as either dribbling with both hands on the ball at the same time OR picking up the dribble and then dribbling again.'
    },
    {
      id: 'q3-2',
      question: 'According to MABA curriculum, "walking/traveling" is defined as what?',
      options: [
        'Moving the pivot foot after stopping dribbling',
        'Taking more than "a step and a half" without dribbling',
        'Both A and B',
        'Only moving the pivot foot'
      ],
      correctAnswer: 2,
      explanation: 'MABA defines walking/traveling as taking more than "a step and a half" without dribbling the ball OR moving your pivot foot once you\'ve stopped dribbling.'
    },
    {
      id: 'q3-3',
      question: 'What is a "backcourt violation"?',
      options: [
        'Taking too long to cross half court',
        'Illegally returning the ball to backcourt',
        'Both A and B',
        'Staying in the backcourt too long'
      ],
      correctAnswer: 2,
      explanation: 'Backcourt violation includes both taking too long (8 seconds) to cross half court and illegally returning the ball to the backcourt after establishing frontcourt position.'
    },
    {
      id: 'q3-4',
      question: 'A player carrying the ball inbounds has how many seconds to pass the ball?',
      options: [
        '3 seconds',
        '5 seconds',
        '8 seconds',
        '10 seconds'
      ],
      correctAnswer: 1,
      explanation: 'Players have 5 seconds to inbound the ball when taking it out of bounds.'
    },
    {
      id: 'q3-5',
      question: '"Carrying" or "palming" is a violation where a player\'s hand...',
      options: [
        'Touches the ball twice',
        'Goes under the ball, causing it to pause',
        'Pushes the ball too hard',
        'Holds the ball too long'
      ],
      correctAnswer: 1,
      explanation: 'Carrying occurs when the hand goes under the ball during dribbling, causing the ball to come to rest momentarily.'
    }
  ],
  
  resources: [
    {
      title: 'Violations Reference Chart',
      type: 'document',
      description: 'Quick reference guide for all basketball violations',
      url: '/resources/violations-chart.pdf'
    },
    {
      title: 'Video: Common Violations Explained',
      type: 'video',
      description: 'Visual examples of each violation type',
      url: '/resources/violations-video'
    }
  ],
  
  assignments: [
    {
      title: 'MABA Violation Identification Exercise',
      description: 'Watch provided game footage and identify 10 violations according to MABA rules. Explain each violation and the correct call based on MABA curriculum.',
      type: 'analysis',
      dueWeeks: 1,
      rubric: {
        excellent: 'All violations correctly identified with clear explanations',
        good: 'Most violations identified, good explanations',
        satisfactory: 'Some violations identified, basic explanations',
        needsImprovement: 'Few violations identified or incorrect calls'
      }
    }
  ],
  
  moduleNotes: {
    instructorGuidelines: [
      'Use slow-motion video to show violations clearly per MABA definitions',
      'Practice calling violations during scrimmages using MABA rules',
      'Emphasize that violations result in awarding ball to opponents',
      'Connect violations to game flow and distinguish from fouls',
      'Reference MABA-specific time restrictions and court violations'
    ],
    commonChallenges: [
      'Traveling is often the hardest violation to master',
      'Players struggle with time awareness (3-second rule)',
      'Differentiating between similar violations'
    ],
    tips: [
      'Use whistle and hand signals when teaching',
      'Create violation stations for practice',
      'Regular reinforcement during all drills'
    ]
  }
};