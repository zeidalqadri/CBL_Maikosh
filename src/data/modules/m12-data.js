export const moduleData = {
  id: 12,
  title: 'Introduction to Sports Science',
  description: 'Understand the scientific principles behind athletic performance and injury prevention.',
  theme: 'science',
  
  learningOutcomes: [
    'Identify the main components of physical fitness.',
    'Understand the three energy systems used in basketball.',
    'Learn basic principles of training (Progression, Overload).',
    'Know the R.I.C.E. protocol for minor injuries.'
  ],
  
  keyConcepts: [
    {
      title: 'Components of Physical Fitness',
      description: 'Key elements that contribute to athletic performance',
      details: [
        'Cardiovascular Endurance: Heart and lung efficiency',
        'Muscular Strength: Maximum force muscles can produce',
        'Flexibility: Range of motion in joints',
        'Body Composition: Ratio of muscle, fat, and bone',
        'Speed: Rate of movement',
        'Agility: Ability to change direction quickly',
        'Power: Strength × Speed',
        'Balance: Maintaining equilibrium',
        'Coordination: Smooth, efficient movement'
      ]
    },
    {
      title: 'Energy Systems in Basketball',
      description: 'How the body produces energy for different activities',
      details: [
        'Anaerobic/ATP-PC (0-10 seconds): Explosive bursts like jumps and sprints',
        'Anaerobic Glycolysis (10 seconds - 3 minutes): Sustained high-intensity efforts',
        'Aerobic (>3 minutes): Longer, lower-intensity activity and recovery',
        'Basketball uses all three systems',
        'Training should target appropriate systems',
        'Recovery depends on aerobic system'
      ]
    },
    {
      title: 'Training Principles',
      description: 'Scientific principles for effective training',
      details: [
        'Progression: Gradually increase training load step by step',
        'Overload: Stress body beyond normal capacity to improve',
        'Specificity: Train movements and energy systems used in sport',
        'Reversibility: "Use it or lose it" - fitness declines without training',
        'Individual Differences: Everyone responds differently',
        'Recovery: Rest is when adaptation occurs'
      ]
    },
    {
      title: 'R.I.C.E. Protocol',
      description: 'Immediate treatment for minor injuries',
      details: [
        'Rest: Stop activity, avoid further damage',
        'Ice: Apply cold to reduce swelling and pain (15-20 minutes)',
        'Compress: Elastic bandage to limit swelling',
        'Elevate: Raise injured area above heart level',
        'Use within first 24-48 hours',
        'Seek medical attention for serious injuries'
      ]
    },
    {
      title: 'Injury Prevention',
      description: 'Strategies to minimize injury risk',
      details: [
        'Proper warm-up before activity',
        'Cool-down and stretching after activity',
        'Adequate hydration and nutrition',
        'Appropriate equipment and facilities',
        'Progressive training loads',
        'Adequate rest and recovery',
        'Listen to body\'s warning signs'
      ]
    },
    {
      title: 'Recovery and Adaptation',
      description: 'How the body improves from training',
      details: [
        'Stress + Recovery = Adaptation',
        'Sleep is crucial for recovery',
        'Nutrition supports adaptation',
        'Active recovery vs. passive rest',
        'Overtraining leads to decreased performance',
        'Individual recovery needs vary'
      ]
    }
  ],
  
  practicalDrills: [
    {
      name: 'Lead a Dynamic Warm-up',
      objective: 'Apply sports science to practice preparation',
      description: 'Guide a series of movements to prepare the body.',
      setup: 'Coach leads group through warm-up sequence',
      keyPoints: [
        'Progress from light to moderate intensity',
        'Include all major muscle groups',
        'Sport-specific movements',
        'Explain the purpose of each exercise',
        '10-15 minute duration'
      ],
      duration: '15 minutes',
      equipment: ['Open space', 'Optional: cones, agility ladder']
    },
    {
      name: 'R.I.C.E. Injury Scenario',
      objective: 'Practice proper injury response',
      description: 'Role-play explaining and applying R.I.C.E. to a simulated injury.',
      setup: 'Partner simulation with observer',
      keyPoints: [
        'One person acts as injured player',
        'Coach applies R.I.C.E. protocol',
        'Explain each step while doing it',
        'Observer evaluates technique',
        'Discuss when to seek medical help'
      ],
      duration: '20 minutes',
      equipment: ['Ice packs', 'Elastic bandages', 'Pillows for elevation']
    }
  ],
  
  assessmentQuestions: [
    {
      id: 'q12-1',
      question: 'Components of physical fitness listed?',
      options: [
        'Only strength and speed',
        'Cardiovascular endurance, Muscular strength, Flexibility, Body composition, Speed, Agility',
        'Just cardiovascular and flexibility',
        'Only basketball skills'
      ],
      correctAnswer: 1,
      explanation: 'Physical fitness includes cardiovascular endurance, muscular strength, flexibility, body composition, speed, and agility.'
    },
    {
      id: 'q12-2',
      question: 'R.I.C.E. stands for...',
      options: [
        'Run, Ice, Cool, Eat',
        'Rest, Ice, Compress, Elevate',
        'Relax, Ice, Call, Emergency',
        'Rest, Injury, Care, Emergency'
      ],
      correctAnswer: 1,
      explanation: 'R.I.C.E. protocol stands for Rest, Ice, Compress, and Elevate.'
    },
    {
      id: 'q12-3',
      question: '"Progression" principle means...',
      options: [
        'Getting better at skills',
        'Advancing toward a goal step by step',
        'Playing more games',
        'Training harder every day'
      ],
      correctAnswer: 1,
      explanation: 'Progression means gradually increasing training demands in a systematic, step-by-step manner.'
    },
    {
      id: 'q12-4',
      question: 'Primary energy system for a 0-10 s explosive move (e.g., lay-up)?',
      options: [
        'Aerobic',
        'Anaerobic/ATP-PC',
        'Anaerobic Glycolysis',
        'All systems equally'
      ],
      correctAnswer: 1,
      explanation: 'The ATP-PC system provides immediate energy for explosive movements lasting 0-10 seconds.'
    },
    {
      id: 'q12-5',
      question: '"Overload" states...',
      options: [
        'Train until exhausted every day',
        'The body must be stressed beyond normal capacity to improve',
        'Always train at maximum intensity',
        'Never rest between workouts'
      ],
      correctAnswer: 1,
      explanation: 'The overload principle states that to improve, the body must be stressed beyond its normal capacity.'
    }
  ],
  
  resources: [
    {
      title: 'Sports Science Basics Guide',
      type: 'document',
      description: 'Fundamental sports science principles for coaches',
      url: '/resources/sports-science-guide.pdf'
    },
    {
      title: 'Injury Prevention Checklist',
      type: 'document',
      description: 'Comprehensive injury prevention strategies',
      url: '/resources/injury-prevention.pdf'
    }
  ],
  
  assignments: [
    {
      title: 'Fitness Assessment Design',
      description: 'Create a basketball-specific fitness assessment that tests all major components of fitness. Include instructions, scoring criteria, and interpretation guidelines. Explain the scientific rationale for each test.',
      type: 'project',
      dueWeeks: 2,
      rubric: {
        excellent: 'Comprehensive assessment, scientific rationale, clear instructions, appropriate tests',
        good: 'Good assessment, adequate rationale, clear instructions',
        satisfactory: 'Basic assessment, limited rationale, acceptable instructions',
        needsImprovement: 'Incomplete assessment or poor scientific understanding'
      }
    }
  ],
  
  moduleNotes: {
    instructorGuidelines: [
      'Use practical examples relevant to basketball',
      'Demonstrate energy systems with court activities',
      'Practice R.I.C.E. with realistic scenarios',
      'Connect science to actual coaching situations'
    ],
    commonChallenges: [
      'Understanding energy system concepts',
      'Applying science to practical coaching',
      'Remembering R.I.C.E. steps under pressure',
      'Designing sport-specific training'
    ],
    tips: [
      'Use heart rate monitors if available',
      'Create energy system activity stations',
      'Practice R.I.C.E. regularly in different scenarios'
    ]
  }
};