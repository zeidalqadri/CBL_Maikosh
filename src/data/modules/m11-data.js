export const moduleData = {
  id: 11,
  title: 'Planning Training Schedules',
  description: 'Create effective practice plans and training schedules for basketball teams.',
  theme: 'planning',
  
  learningOutcomes: [
    'Identify the key components of a well-structured practice plan.',
    'Understand the purpose of each component (warm-up, scrimmage, etc.).',
    'Grasp "Planning Progression".',
    'Create a simple daily practice plan.'
  ],
  
  keyConcepts: [
    {
      title: 'Practice Components',
      description: 'Essential elements of every effective practice',
      details: [
        'Warm-up: Prepare body and mind for activity',
        'Review: Reinforce previously learned skills',
        'New Skills: Introduce and teach new concepts',
        'Scrimmage: Apply skills in game-like situations',
        'Team Circle: Team building and communication',
        'Evaluation: Assess progress and plan next steps'
      ]
    },
    {
      title: 'Warm-up Purpose and Structure',
      description: 'Starting practice safely and effectively',
      details: [
        'Prepare body physically for activity',
        'Reduce injury risk through gradual activation',
        'Mental preparation and focus',
        'Build team unity and energy',
        'Light cardiovascular activity',
        'Dynamic stretching and movement prep'
      ]
    },
    {
      title: 'Teaching New Skills',
      description: 'Effective instruction methodology',
      details: [
        'Keep instruction to a minimum initially',
        'Show, don\'t just tell (demonstration)',
        'Break complex skills into parts',
        'Provide immediate feedback',
        'Allow adequate practice time',
        'Check for understanding before moving on'
      ]
    },
    {
      title: 'Scrimmage Integration',
      description: 'Applying skills in game contexts',
      details: [
        'Apply drill skills in controlled game settings',
        'Small-sided games for more touches',
        'Specific objectives for each scrimmage',
        'Stop play to teach when necessary',
        'Mix competition levels appropriately',
        'Monitor playing time equity'
      ]
    },
    {
      title: 'Planning Progression',
      description: 'Systematic skill and difficulty advancement',
      details: [
        'Progress at speed suitable to players\' ability',
        'Build on previously mastered skills',
        'Increase complexity gradually',
        'Assess readiness before advancing',
        'Individual vs. group progression',
        'Long-term development perspective'
      ]
    },
    {
      title: 'Season Planning',
      description: 'Organizing the complete season',
      details: [
        'Preseason Planning: Program structure before season begins',
        'Early season: Fundamental skill focus',
        'Mid-season: Advanced tactics and conditioning',
        'Late season: Game preparation and peaking',
        'Post-season: Evaluation and improvement',
        'Off-season: Skill development and rest'
      ]
    }
  ],
  
  practicalDrills: [
    {
      name: '20-Minute Mini-Practice Plan',
      objective: 'Design a complete, balanced practice',
      description: 'Design a balanced, timed practice on paper.',
      setup: 'Individual planning exercise',
      keyPoints: [
        'Include all six components',
        'Appropriate time allocation',
        'Age-appropriate activities',
        'Clear objectives for each segment',
        'Equipment and space requirements'
      ],
      duration: '30 minutes',
      equipment: ['Practice plan template', 'Writing materials']
    },
    {
      name: 'Constraint-Led Game Design',
      objective: 'Create purposeful game modifications',
      description: 'Create a small-sided game with a rule tweak to solve a team problem (e.g., encourage passing).',
      setup: 'Small groups design games',
      keyPoints: [
        'Identify specific team weakness',
        'Design rule to address it',
        'Keep game fun and engaging',
        'Test with group if possible',
        'Explain coaching rationale'
      ],
      duration: '20 minutes',
      equipment: ['Game design worksheet']
    }
  ],
  
  assessmentQuestions: [
    {
      id: 'q11-1',
      question: 'Six key components of a well-planned practice?',
      options: [
        'Run, jump, shoot, pass, dribble, defend',
        'Warm-up, Review, New Skills, Scrimmage, Team Circle, Evaluation',
        'Offense, defense, conditioning, skills, strategy, games',
        'Beginning, middle, end, rest, water, equipment'
      ],
      correctAnswer: 1,
      explanation: 'The six components are: Warm-up, Review, New Skills, Scrimmage, Team Circle, and Evaluation.'
    },
    {
      id: 'q11-2',
      question: 'Main purpose of a warm-up?',
      options: [
        'Tire out the players',
        'Prepare the body and reduce injury risk',
        'Practice game skills',
        'Punish late players'
      ],
      correctAnswer: 1,
      explanation: 'Warm-up prepares the body physically and mentally while reducing injury risk.'
    },
    {
      id: 'q11-3',
      question: 'Teaching new skills should...',
      options: [
        'Take most of the practice time',
        'Keep instruction to a minimum',
        'Only be done by head coach',
        'Wait until players are perfect at basics'
      ],
      correctAnswer: 1,
      explanation: 'When teaching new skills, keep instruction brief and focus on demonstration and practice.'
    },
    {
      id: 'q11-4',
      question: '"Planning Progression" means coaches should...',
      options: [
        'Plan every practice the same way',
        'Always teach advanced skills',
        'Progress at a speed suitable to players\' ability',
        'Never change the plan'
      ],
      correctAnswer: 2,
      explanation: 'Planning progression means advancing at a pace appropriate for players\' current ability level.'
    },
    {
      id: 'q11-5',
      question: 'What is "Preseason Planning"?',
      options: [
        'Planning games before they happen',
        'Planning the program before the season begins',
        'Planning to win the championship',
        'Planning player positions'
      ],
      correctAnswer: 1,
      explanation: 'Preseason planning involves organizing the entire program structure before the season starts.'
    }
  ],
  
  resources: [
    {
      title: 'Practice Plan Template',
      type: 'document',
      description: 'Customizable practice plan template',
      url: '/resources/practice-plan-template.pdf'
    },
    {
      title: 'Season Planning Guide',
      type: 'document',
      description: 'Comprehensive season organization guide',
      url: '/resources/season-planning-guide.pdf'
    }
  ],
  
  assignments: [
    {
      title: 'Complete Practice Plan',
      description: 'Design a full 90-minute practice plan for a specific age group. Include objectives, activities, timing, equipment needs, and safety considerations. Explain your rationale for each component.',
      type: 'practical',
      dueWeeks: 1,
      rubric: {
        excellent: 'Comprehensive plan, appropriate activities, clear rationale, professional presentation',
        good: 'Good plan, mostly appropriate, adequate rationale',
        satisfactory: 'Basic plan, some appropriate elements, limited rationale',
        needsImprovement: 'Incomplete plan or inappropriate activities'
      }
    }
  ],
  
  moduleNotes: {
    instructorGuidelines: [
      'Use real practice plans as examples',
      'Discuss age-appropriate modifications',
      'Emphasize flexibility in planning',
      'Connect plans to learning outcomes'
    ],
    commonChallenges: [
      'Time management within practice',
      'Balancing fun with skill development',
      'Adapting plans for different skill levels',
      'Managing equipment and space limitations'
    ],
    tips: [
      'Start with shorter practices and build up',
      'Keep backup activities ready',
      'Use assistant coaches effectively in plans'
    ]
  }
};