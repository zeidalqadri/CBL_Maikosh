export const moduleData = {
  id: 10,
  title: 'Coaching Communication & Ethics',
  description: 'Develop effective communication skills and understand ethical coaching practices.',
  theme: 'communication',
  
  learningOutcomes: [
    'Differentiate between verbal and non-verbal communication.',
    'Learn techniques for instructions and correcting errors.',
    'Understand key principles of the Coaches\' Code of Conduct.',
    'Appreciate the importance of being a positive role model.'
  ],
  
  keyConcepts: [
    {
      title: 'Communication Types',
      description: 'Verbal and non-verbal communication methods',
      details: [
        'Verbal: Clear instructions, tone of voice matters',
        'Non-verbal: Body language, facial expressions, gestures',
        'Active listening: Full attention to speaker',
        'Written communication: Practice plans, emails to parents',
        '55% of communication is body language',
        '38% is tone of voice, only 7% is words'
      ]
    },
    {
      title: 'Providing Feedback',
      description: 'Effective methods for giving constructive feedback',
      details: [
        'Sandwich Method: Positive > Correction > Positive',
        'Be specific and actionable',
        'Focus on behavior, not personality',
        'Timely feedback is most effective',
        'Private correction, public praise',
        'Use "I" statements to reduce defensiveness'
      ]
    },
    {
      title: 'Coaches\' Code of Conduct',
      description: 'Ethical guidelines for coaching',
      details: [
        'First point: Treat each athlete as an individual',
        'Emphasize fair play and sportsmanship',
        'Respect officials and opponents',
        'Prioritize player safety and well-being',
        'Maintain professional boundaries',
        'Continue education and self-improvement'
      ]
    },
    {
      title: 'Role Model Responsibilities',
      description: 'Leading by example',
      details: [
        'Model the behavior you expect',
        'Control emotions during games',
        'Demonstrate respect for all',
        'Show commitment and preparation',
        'Maintain positive attitude',
        'Admit mistakes and learn from them'
      ]
    },
    {
      title: 'Communicating with Different Audiences',
      description: 'Adapting communication style',
      details: [
        'Players: Age-appropriate, encouraging',
        'Parents: Professional, informative',
        'Officials: Respectful, controlled',
        'Media: Prepared, positive representation',
        'Administration: Professional, organized',
        'Assistant coaches: Clear, collaborative'
      ]
    },
    {
      title: 'Conflict Resolution',
      description: 'Handling difficult situations',
      details: [
        'Stay calm and objective',
        'Listen to all perspectives',
        'Focus on solutions, not blame',
        'Document serious issues',
        'Follow proper channels',
        'Seek mediation when needed'
      ]
    }
  ],
  
  practicalDrills: [
    {
      name: '30-Second Demo',
      objective: 'Develop clear, concise instruction skills',
      description: 'Explain and demonstrate a simple skill within 30 seconds.',
      setup: 'Coach presents to group',
      keyPoints: [
        'Choose one simple skill',
        'Brief verbal explanation',
        'Clear demonstration',
        'Check for understanding',
        'Peer feedback on clarity'
      ],
      duration: '15 minutes',
      equipment: ['Timer', 'Basketball']
    },
    {
      name: 'Feedback Sandwich Practice',
      objective: 'Master constructive feedback technique',
      description: 'Practice delivering feedback using the sandwich model.',
      setup: 'Partners role-play coach and player',
      keyPoints: [
        'Observer watches skill attempt',
        'Identify positive aspect first',
        'Give specific correction',
        'End with encouragement',
        'Switch roles and repeat'
      ],
      duration: '20 minutes',
      equipment: ['Feedback scenario cards']
    }
  ],
  
  assessmentQuestions: [
    {
      id: 'q10-1',
      question: 'Which of these is a form of non-verbal communication?',
      options: [
        'Shouting instructions',
        'Facial Expressions and Body Language',
        'Writing practice plans',
        'Giving a speech'
      ],
      correctAnswer: 1,
      explanation: 'Non-verbal communication includes facial expressions, body language, and gestures.'
    },
    {
      id: 'q10-2',
      question: 'What is the first point in the Coaches\' Code of Conduct?',
      options: [
        'Win at all costs',
        'Treat each athlete as an individual',
        'Follow all rules',
        'Practice every day'
      ],
      correctAnswer: 1,
      explanation: 'The first principle is treating each athlete as an individual with unique needs and abilities.'
    },
    {
      id: 'q10-3',
      question: 'When correcting errors, recommended practice?',
      options: [
        'Yell to get attention',
        'Correct in front of everyone',
        'Use the "sandwich" method',
        'Wait until the next practice'
      ],
      correctAnswer: 2,
      explanation: 'The sandwich method (positive-correction-positive) is most effective for corrections.'
    },
    {
      id: 'q10-4',
      question: 'Which is NOT a listed way of "How Do I Put It Together?" for communication?',
      options: [
        'Explaining',
        'Demonstrating',
        'Writing a report',
        'Guided practice'
      ],
      correctAnswer: 2,
      explanation: 'Writing reports is not part of the standard instruction methods for on-court communication.'
    },
    {
      id: 'q10-5',
      question: 'Who else does a coach need to communicate with besides players?',
      options: [
        'Only assistant coaches',
        'Parents, Fans, and Game Officials',
        'Only parents',
        'No one else'
      ],
      correctAnswer: 1,
      explanation: 'Coaches must effectively communicate with parents, fans, officials, and others involved in the program.'
    }
  ],
  
  resources: [
    {
      title: 'Communication Skills Handbook',
      type: 'document',
      description: 'Comprehensive guide to coaching communication',
      url: '/resources/communication-handbook.pdf'
    },
    {
      title: 'Code of Conduct Template',
      type: 'document',
      description: 'Customizable code of conduct for your program',
      url: '/resources/code-of-conduct.pdf'
    }
  ],
  
  assignments: [
    {
      title: 'Communication Scenario Responses',
      description: 'Respond to 5 challenging communication scenarios (angry parent, frustrated player, questionable official call, etc.). Write appropriate responses demonstrating ethical coaching and effective communication.',
      type: 'written',
      dueWeeks: 1,
      rubric: {
        excellent: 'Professional responses, demonstrates empathy, follows code of conduct, creative solutions',
        good: 'Good responses, mostly professional, follows guidelines',
        satisfactory: 'Adequate responses, basic professionalism',
        needsImprovement: 'Inappropriate responses or lacks professionalism'
      }
    }
  ],
  
  moduleNotes: {
    instructorGuidelines: [
      'Use role-playing for practice',
      'Share real scenarios (anonymized)',
      'Emphasize cultural sensitivity',
      'Practice active listening exercises'
    ],
    commonChallenges: [
      'Managing emotions in heated moments',
      'Dealing with difficult parents',
      'Balancing honesty with encouragement',
      'Adapting communication to different ages'
    ],
    tips: [
      'Video review of coach-player interactions',
      'Practice scenarios in small groups',
      'Develop personal communication philosophy'
    ]
  }
};