export const moduleData = {
  id: 1,
  title: 'Introduction to Coaching',
  description: 'Learn the fundamental roles, styles, and philosophies of effective basketball coaching.',
  theme: 'leadership',
  
  learningOutcomes: [
    'Identify the multiple roles a coach must perform.',
    'Understand different coaching styles and their impact.',
    'Define and begin to formulate a personal coaching philosophy.',
    'Recognize the three phases of skill acquisition for beginners.'
  ],
  
  keyConcepts: [
    {
      title: "The Coach's Roles",
      description: 'A coach is a teacher, motivator, disciplinarian, organizer, public relations officer, fund raiser, advisor, friend, scientist, and student.',
      details: [
        'Teacher: Instructing players on skills and strategies',
        'Motivator: Inspiring players to perform their best',
        'Disciplinarian: Maintaining team structure and rules',
        'Organizer: Planning practices and managing team logistics',
        'Public Relations Officer: Representing the team to the community',
        'Fund Raiser: Securing resources for the team',
        'Advisor: Providing guidance on and off the court',
        'Friend: Building trust and rapport with players',
        'Scientist: Analyzing performance and applying sports science',
        'Student: Continuously learning and improving coaching methods'
      ]
    },
    {
      title: 'Coaching Styles',
      description: "Styles range from 'Authoritarian' (strict, command-style) to 'Nice-Guy' (co-operative). A successful coach often blends these styles.",
      details: [
        'Authoritarian: Strict, disciplined approach with clear commands',
        'Democratic: Collaborative decision-making with player input',
        'Nice-Guy: Cooperative and friendly approach',
        'Business-Like: Professional, goal-oriented style',
        'Effective coaches adapt their style based on situation and player needs'
      ]
    },
    {
      title: 'Coaching Philosophy',
      description: 'What a coach genuinely believes is important for success; the foundation for actions and decisions.',
      details: [
        'General Philosophy: Values, relationships, and approach to coaching',
        'Technical Philosophy: System of play and strategic preferences',
        'Must be authentic and aligned with personal values',
        'Guides decision-making in challenging situations',
        'Should be written and regularly reviewed'
      ]
    },
    {
      title: 'Phases of Learning',
      description: 'Beginners learn in three phases that coaches must understand.',
      details: [
        'Try It Phase (Cognitive): Conscious thought required, many errors',
        'Mastering Phase (Associative): Refining technique, fewer errors',
        'Automatic Phase (Autonomous): Skill becomes natural and fluid'
      ]
    },
    {
      title: 'COACH Acronym',
      description: 'Key qualities of an effective coach.',
      details: [
        'C - Comprehensive: Broad knowledge and skills',
        'O - Outlook: Positive attitude and vision',
        'A - Affection: Care for players as individuals',
        'C - Character: Strong moral principles',
        'H - Humor: Ability to maintain perspective and enjoyment'
      ]
    }
  ],
  
  practicalDrills: [
    {
      name: 'Coaching Style Role-Play',
      objective: 'Experience and identify different coaching styles',
      description: 'Coach acts out a style while explaining a drill; players identify the style from communication cues.',
      setup: 'Group setting with coach demonstrating different approaches',
      keyPoints: [
        'Demonstrate each style clearly',
        'Discuss pros and cons of each approach',
        'Help players understand when each style is appropriate'
      ],
      duration: '15 minutes',
      equipment: ['Whiteboard for notes', 'Basic basketball equipment']
    },
    {
      name: 'Personal Philosophy Builder',
      objective: 'Develop your own coaching philosophy',
      description: 'Guided prompts to write a personal coaching philosophy—purpose, definition of success, and player treatment.',
      setup: 'Individual writing exercise with group discussion',
      keyPoints: [
        'What is your purpose as a coach?',
        'How do you define success?',
        'What are your core values?',
        'How will you treat players?',
        'What is your approach to competition?'
      ],
      duration: '30 minutes',
      equipment: ['Philosophy worksheet template', 'Writing materials']
    }
  ],
  
  assessmentQuestions: [
    {
      id: 'q1-1',
      question: 'According to the manual, what is a primary role of a coach?',
      options: [
        'Only to win games',
        'A teacher, motivator, and disciplinarian',
        'Just a friend to players',
        'Only to organize practices'
      ],
      correctAnswer: 1,
      explanation: 'A coach wears many hats, including teacher, motivator, and disciplinarian, among others.'
    },
    {
      id: 'q1-2',
      question: 'What are the three phases of learning a physical skill for a beginner coach to know?',
      options: [
        'Practice, game, review',
        'Try it, mastering, automatic',
        'Watch, copy, perform',
        'Learn, teach, assess'
      ],
      correctAnswer: 1,
      explanation: 'The three phases are: Try it (cognitive), Mastering (associative), and Automatic (autonomous).'
    },
    {
      id: 'q1-3',
      question: "A coach's philosophy is primarily about what?",
      options: [
        'Winning at all costs',
        'What the coach genuinely believes is important to coaching success',
        'Following league rules',
        'Copying successful coaches'
      ],
      correctAnswer: 1,
      explanation: 'A coaching philosophy represents what a coach genuinely believes is important for success and guides their actions.'
    },
    {
      id: 'q1-4',
      question: "Which coaching style is described as 'strict, disciplined, punishes frequently'?",
      options: [
        'Democratic Coach',
        'Nice-Guy Coach',
        'Authoritarian Coach',
        'Business-Like Coach'
      ],
      correctAnswer: 2,
      explanation: "The Authoritarian coaching style is characterized by strict discipline and frequent punishment."
    },
    {
      id: 'q1-5',
      question: 'The acronym COACH stands for Comprehensive, Outlook, Affection, Character, and...?',
      options: [
        'Honor',
        'Humor',
        'Honesty',
        'Hard work'
      ],
      correctAnswer: 1,
      explanation: 'COACH stands for Comprehensive, Outlook, Affection, Character, and Humor.'
    }
  ],
  
  resources: [
    {
      title: 'Coaching Philosophy Template',
      type: 'document',
      description: 'A structured template to help develop your personal coaching philosophy',
      url: '/resources/philosophy-template.pdf'
    },
    {
      title: 'Learning Phases Reference Guide',
      type: 'guide',
      description: 'Detailed guide on the three phases of skill acquisition',
      url: '/resources/learning-phases.pdf'
    }
  ],
  
  assignments: [
    {
      title: 'Personal Coaching Philosophy Statement',
      description: 'Write a 500-word personal coaching philosophy statement covering your values, approach to player development, and definition of success.',
      type: 'written',
      dueWeeks: 1,
      rubric: {
        excellent: 'Clear values, comprehensive approach, specific examples, well-organized',
        good: 'Most elements present, generally clear, some examples',
        satisfactory: 'Basic philosophy stated, lacks detail or clarity',
        needsImprovement: 'Incomplete or unclear philosophy'
      }
    }
  ],
  
  moduleNotes: {
    instructorGuidelines: [
      'Emphasize that coaching is more than just teaching basketball skills',
      'Encourage self-reflection throughout the module',
      'Use real-world examples from various coaching styles',
      'Create a safe space for discussing different approaches'
    ],
    commonChallenges: [
      'Students may struggle to articulate their philosophy initially',
      'Some may default to copying famous coaches rather than developing their own style',
      'Balance between different coaching styles can be difficult to understand'
    ],
    tips: [
      'Start with personal values before moving to basketball-specific elements',
      'Use video examples of different coaching styles if available',
      'Encourage peer feedback on philosophy statements'
    ]
  }
};