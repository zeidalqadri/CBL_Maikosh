/**
 * Video Scenario Challenge Data
 * Interactive coaching scenarios with decision-making challenges
 */

export const videoScenarios = {
  // Beginner Level Scenarios
  playerMotivation: {
    id: 'player-motivation',
    title: 'Motivating a Struggling Player',
    description: 'Help a young player regain confidence after multiple missed shots',
    level: 'beginner',
    category: 'psychology',
    estimatedTime: '8 minutes',
    learningObjectives: [
      'Practice positive reinforcement techniques',
      'Learn when to intervene vs. when to let players work through challenges',
      'Understand the impact of coaching language on player confidence'
    ],
    segments: [
      {
        title: 'The Setup',
        description: 'Tommy has missed his last 4 shots and looks frustrated. His teammates are starting to lose confidence in him.',
        videoUrl: '/videos/scenarios/player-motivation-1.mp4',
        thumbnail: '/images/scenarios/player-motivation-thumb-1.jpg',
        pauseAt: 15,
        question: 'Tommy just missed another shot and slammed the ball down in frustration. What\'s your immediate response?',
        decisions: [
          {
            text: 'Call a timeout immediately',
            description: 'Stop the action and address the situation right away',
            points: 5,
            isCorrect: false,
            feedback: 'While addressing frustration is important, calling an immediate timeout might draw unwanted attention to Tommy and increase his pressure. Sometimes it\'s better to let the game flow and address it during a natural break.',
            nextAction: 'continue'
          },
          {
            text: 'Give him an encouraging gesture from the sideline',
            description: 'Make eye contact and give a thumbs up or clap',
            points: 10,
            isCorrect: true,
            feedback: 'Excellent! Non-verbal encouragement shows support without stopping the game flow. This helps Tommy know you still believe in him while keeping the momentum going.',
            nextAction: 'continue'
          },
          {
            text: 'Substitute him out immediately',
            description: 'Take him out to cool down and regroup',
            points: 2,
            isCorrect: false,
            feedback: 'This could damage Tommy\'s confidence even more. Unless he\'s completely losing control, it\'s usually better to show faith in your players and let them work through challenges.',
            nextAction: 'continue'
          },
          {
            text: 'Shout instructions about shot technique',
            description: 'Give him technical advice loudly from the sideline',
            points: 1,
            isCorrect: false,
            feedback: 'Technical coaching during emotional moments rarely helps. When a player is frustrated, they need emotional support first, technical adjustments second.',
            nextAction: 'continue'
          }
        ],
        coachingTip: 'Players need to feel supported when struggling. Your body language and immediate reactions teach them how to handle adversity.'
      },
      {
        title: 'Halftime Talk',
        description: 'It\'s halftime and Tommy approaches you, clearly still upset about his performance.',
        videoUrl: '/videos/scenarios/player-motivation-2.mp4',
        thumbnail: '/images/scenarios/player-motivation-thumb-2.jpg',
        pauseAt: 12,
        question: 'Tommy says "Coach, I can\'t make anything tonight. Maybe I should just sit on the bench." How do you respond?',
        decisions: [
          {
            text: 'Focus on what he\'s doing right',
            description: '"Your defense has been great, and you\'re making good decisions. The shots will start falling."',
            points: 10,
            isCorrect: true,
            feedback: 'Perfect! Highlighting what he\'s doing well rebuilds confidence while acknowledging that shooting is just one part of his game. This balanced approach helps players see their total contribution.',
            nextAction: 'continue'
          },
          {
            text: 'Give technical shooting advice',
            description: '"Your follow-through has been inconsistent. Try snapping your wrist more."',
            points: 3,
            isCorrect: false,
            feedback: 'Technical advice has its place, but when a player is emotionally down, they need confidence-building first. Save technical adjustments for practice or when they\'re in a better mental state.',
            nextAction: 'continue'
          },
          {
            text: 'Tell him to stop thinking about it',
            description: '"Just forget about the shots and play your game."',
            points: 5,
            isCorrect: false,
            feedback: 'While the intention is good, telling someone to "stop thinking" about something often makes them think about it more. Better to redirect their focus to positive actions.',
            nextAction: 'continue'
          },
          {
            text: 'Share a personal story',
            description: 'Tell him about a time you or another player overcame a similar struggle',
            points: 8,
            isCorrect: true,
            feedback: 'Great approach! Personal stories help players realize that everyone struggles sometimes and that it\'s part of growth. This builds perspective and resilience.',
            nextAction: 'continue'
          }
        ],
        coachingTip: 'Confidence is built by focusing on what players can control and celebrating their total contribution to the team, not just scoring.'
      },
      {
        title: 'The Resolution',
        description: 'Second half begins. Tommy looks more focused and ready to contribute.',
        videoUrl: '/videos/scenarios/player-motivation-3.mp4',
        thumbnail: '/images/scenarios/player-motivation-thumb-3.jpg',
        pauseAt: null, // Plays through to end
        coachingTip: 'Notice how your positive reinforcement and focus on his strengths helped Tommy regain composure. This is a foundational coaching skill that builds long-term player development.'
      }
    ]
  },

  parentCommunication: {
    id: 'parent-communication',
    title: 'Difficult Parent Conversation',
    description: 'Navigate a challenging conversation with a parent about their child\'s playing time',
    level: 'intermediate',
    category: 'communication',
    estimatedTime: '10 minutes',
    learningObjectives: [
      'Practice de-escalation techniques with upset parents',
      'Learn to communicate playing time decisions clearly and fairly',
      'Maintain professional boundaries while being empathetic'
    ],
    segments: [
      {
        title: 'The Approach',
        description: 'After the game, Sarah\'s parent approaches you, visibly upset about their daughter\'s limited playing time.',
        videoUrl: '/videos/scenarios/parent-communication-1.mp4',
        thumbnail: '/images/scenarios/parent-communication-thumb-1.jpg',
        pauseAt: 18,
        question: 'The parent says angrily: "Sarah barely played tonight! She\'s one of the best players and you\'re wasting her talent!" How do you respond?',
        decisions: [
          {
            text: 'Acknowledge their concern and suggest a private meeting',
            description: '"I understand you\'re concerned about Sarah. Can we schedule a time to talk privately about her development?"',
            points: 10,
            isCorrect: true,
            feedback: 'Excellent! Acknowledging their feelings while redirecting to a private setting shows professionalism and respect for both the parent and other families present.',
            nextAction: 'continue'
          },
          {
            text: 'Defend your decision immediately',
            description: '"I coach based on what\'s best for the team, and tonight that meant different rotations."',
            points: 3,
            isCorrect: false,
            feedback: 'While factually correct, defensive responses often escalate conflicts. It\'s better to acknowledge their concern first, then discuss reasoning in a calmer setting.',
            nextAction: 'continue'
          },
          {
            text: 'Point out other players\' contributions',
            description: '"Other players earned their time tonight by working hard in practice."',
            points: 2,
            isCorrect: false,
            feedback: 'This can sound like you\'re criticizing Sarah and might create tension between families. Focus on Sarah\'s development rather than comparisons.',
            nextAction: 'continue'
          },
          {
            text: 'Walk away from the confrontation',
            description: '"This isn\'t the right time or place for this conversation."',
            points: 4,
            isCorrect: false,
            feedback: 'While you\'re right about timing, walking away without acknowledgment can damage relationships. Better to briefly acknowledge and redirect.',
            nextAction: 'continue'
          }
        ],
        coachingTip: 'Always remember that parents\' emotions come from love for their children. Acknowledge this while maintaining professional boundaries.'
      },
      {
        title: 'The Private Meeting',
        description: 'You\'re now in your office with Sarah\'s parent, who has calmed down but still has concerns.',
        videoUrl: '/videos/scenarios/parent-communication-2.mp4',
        thumbnail: '/images/scenarios/parent-communication-thumb-2.jpg',
        pauseAt: 20,
        question: 'The parent asks more calmly: "Can you help me understand what Sarah needs to do to get more playing time?" How do you respond?',
        decisions: [
          {
            text: 'Give specific, actionable feedback',
            description: 'Discuss 2-3 specific areas where Sarah can improve, with examples from practice and games',
            points: 10,
            isCorrect: true,
            feedback: 'Perfect! Specific feedback gives Sarah clear goals to work toward and shows the parent you\'re paying attention to their child\'s development.',
            nextAction: 'continue'
          },
          {
            text: 'Keep it vague to avoid conflict',
            description: '"She just needs to keep working hard and her time will come."',
            points: 4,
            isCorrect: false,
            feedback: 'Vague feedback doesn\'t help players improve and can frustrate parents. Be specific and constructive while remaining supportive.',
            nextAction: 'continue'
          },
          {
            text: 'Focus only on team needs',
            description: '"Playing time depends on what the team needs in different situations."',
            points: 6,
            isCorrect: false,
            feedback: 'While team needs matter, parents want to know how their child can grow. Balance team perspective with individual development feedback.',
            nextAction: 'continue'
          },
          {
            text: 'Praise her strengths first, then areas for growth',
            description: 'Start with what Sarah does well, then transition to development opportunities',
            points: 9,
            isCorrect: true,
            feedback: 'Excellent approach! Starting with strengths shows you value Sarah as a player, making parents more receptive to constructive feedback.',
            nextAction: 'continue'
          }
        ],
        coachingTip: 'The "praise first, then develop" approach builds trust and shows you see the whole player, not just areas needing improvement.'
      },
      {
        title: 'Moving Forward',
        description: 'The conversation concludes with an understanding about Sarah\'s development plan.',
        videoUrl: '/videos/scenarios/parent-communication-3.mp4',
        thumbnail: '/images/scenarios/parent-communication-thumb-3.jpg',
        pauseAt: null,
        coachingTip: 'Clear communication about expectations and development helps parents become partners in their child\'s growth rather than adversaries to your coaching.'
      }
    ]
  },

  teamConflict: {
    id: 'team-conflict',
    title: 'Resolving Team Conflict',
    description: 'Address tension between two key players that\'s affecting team chemistry',
    level: 'advanced',
    category: 'leadership',
    estimatedTime: '12 minutes',
    learningObjectives: [
      'Learn conflict resolution strategies for team dynamics',
      'Practice facilitating difficult conversations between players',
      'Understand how to rebuild team unity after conflict'
    ],
    segments: [
      {
        title: 'The Tension',
        description: 'During practice, you notice Alex and Jamie aren\'t passing to each other and seem to be avoiding communication.',
        videoUrl: '/videos/scenarios/team-conflict-1.mp4',
        thumbnail: '/images/scenarios/team-conflict-thumb-1.jpg',
        pauseAt: 22,
        question: 'The tension is affecting the whole team\'s energy. What\'s your first step?',
        decisions: [
          {
            text: 'Address it immediately with both players',
            description: 'Call both players over during practice to discuss the issue',
            points: 6,
            isCorrect: false,
            feedback: 'While addressing it quickly is good, doing it in front of the team can be embarrassing and might not get to the real issues. Private conversations first are usually more effective.',
            nextAction: 'continue'
          },
          {
            text: 'Talk to each player separately first',
            description: 'Pull each player aside individually to understand their perspective',
            points: 10,
            isCorrect: true,
            feedback: 'Excellent! Getting both sides of the story privately helps you understand the full situation and shows each player you care about their perspective.',
            nextAction: 'continue'
          },
          {
            text: 'Ignore it and hope it resolves itself',
            description: 'Continue practice normally and see if they work it out on their own',
            points: 2,
            isCorrect: false,
            feedback: 'Ignoring team chemistry issues rarely works and often makes them worse. As a leader, you need to address conflicts that affect the team.',
            nextAction: 'continue'
          },
          {
            text: 'Make them run extra drills together',
            description: 'Force them to do partner drills until they cooperate',
            points: 4,
            isCorrect: false,
            feedback: 'Forced cooperation without addressing underlying issues can increase resentment. Understanding the conflict first is more important than quick fixes.',
            nextAction: 'continue'
          }
        ],
        coachingTip: 'Team conflicts require understanding before action. Getting both perspectives privately helps you see the full picture.'
      },
      {
        title: 'The Mediation',
        description: 'After talking to each player separately, you bring them together to work through their differences.',
        videoUrl: '/videos/scenarios/team-conflict-2.mp4',
        thumbnail: '/images/scenarios/team-conflict-thumb-2.jpg',
        pauseAt: 25,
        question: 'Both players have aired their grievances. How do you guide them toward resolution?',
        decisions: [
          {
            text: 'Focus on team goals and shared objectives',
            description: 'Remind them of what they both want to achieve as a team',
            points: 9,
            isCorrect: true,
            feedback: 'Great approach! Focusing on shared goals helps players see beyond personal conflicts to what really matters - team success.',
            nextAction: 'continue'
          },
          {
            text: 'Make them apologize to each other',
            description: 'Insist that both players apologize for their behavior',
            points: 5,
            isCorrect: false,
            feedback: 'Forced apologies often aren\'t genuine and don\'t solve underlying issues. Focus on understanding and moving forward rather than mandatory apologies.',
            nextAction: 'continue'
          },
          {
            text: 'Help them find common ground',
            description: 'Guide conversation to discover what they respect about each other',
            points: 10,
            isCorrect: true,
            feedback: 'Excellent! Finding mutual respect and common ground creates a foundation for rebuilding their relationship and team chemistry.',
            nextAction: 'continue'
          },
          {
            text: 'Set strict rules for their interaction',
            description: 'Create specific guidelines for how they must behave toward each other',
            points: 4,
            isCorrect: false,
            feedback: 'Rules without relationship repair often create superficial compliance. Better to help them genuinely resolve their differences.',
            nextAction: 'continue'
          }
        ],
        coachingTip: 'Effective mediation focuses on understanding, common ground, and shared goals rather than punishment or forced behaviors.'
      },
      {
        title: 'Rebuilding Chemistry',
        description: 'The players have worked through their differences. Now you need to rebuild team unity.',
        videoUrl: '/videos/scenarios/team-conflict-3.mp4',
        thumbnail: '/images/scenarios/team-conflict-thumb-3.jpg',
        pauseAt: null,
        coachingTip: 'Conflict resolution is just the first step. Rebuilding trust and chemistry takes time, consistency, and positive team experiences together.'
      }
    ]
  }
};

// Scenario categories for filtering
export const scenarioCategories = [
  { id: 'all', name: 'All Scenarios', icon: 'video' },
  { id: 'psychology', name: 'Player Psychology', icon: 'insight' },
  { id: 'communication', name: 'Communication', icon: 'communication' },
  { id: 'leadership', name: 'Team Leadership', icon: 'whistle' },
  { id: 'tactics', name: 'Game Tactics', icon: 'strategy' },
  { id: 'development', name: 'Player Development', icon: 'growth' }
];

// Difficulty levels
export const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', color: 'success-green', description: 'New coaches, basic situations' },
  { id: 'intermediate', name: 'Intermediate', color: 'basketball-orange', description: 'Some experience, complex situations' },
  { id: 'advanced', name: 'Advanced', color: 'team-red', description: 'Experienced coaches, challenging scenarios' }
];

// Get scenarios by category
export const getScenariosByCategory = (category) => {
  if (category === 'all') return Object.values(videoScenarios);
  return Object.values(videoScenarios).filter(scenario => scenario.category === category);
};

// Get scenarios by level
export const getScenariosByLevel = (level) => {
  return Object.values(videoScenarios).filter(scenario => scenario.level === level);
};

// Get scenario by ID
export const getScenarioById = (id) => {
  return videoScenarios[id] || null;
};