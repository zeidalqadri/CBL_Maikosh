/**
 * Sample Basketball Play Diagrams for Module 1
 * These are example plays to demonstrate the AnimatedPlayDiagram component
 */

export const coachingStyleDemonstration = {
  title: "Coaching Styles in Action",
  description: "See how different coaching styles affect player behavior and team dynamics",
  steps: [
    {
      title: "Authoritarian Style",
      description: "Coach gives direct commands, players follow without question. Notice the rigid positioning and immediate response.",
      players: [
        { x: 0.1, y: 0.3, number: "1", team: "offense" },
        { x: 0.1, y: 0.7, number: "2", team: "offense" },
        { x: 0.3, y: 0.5, number: "3", team: "offense" },
        { x: 0.5, y: 0.3, number: "4", team: "offense" },
        { x: 0.5, y: 0.7, number: "5", team: "offense" }
      ],
      ball: { x: 0.1, y: 0.3 },
      keyPoints: [
        "Players move in unison to predetermined positions",
        "No individual creativity or decision-making",
        "Quick execution but limited adaptability"
      ]
    },
    {
      title: "Democratic Style", 
      description: "Coach involves players in decision-making. Players communicate and adjust positions based on game flow.",
      players: [
        { 
          x: 0.15, y: 0.35, number: "1", team: "offense",
          movement: { toX: 0.25, toY: 0.4 }
        },
        { 
          x: 0.1, y: 0.65, number: "2", team: "offense",
          movement: { toX: 0.2, toY: 0.6 }
        },
        { 
          x: 0.35, y: 0.5, number: "3", team: "offense",
          movement: { toX: 0.4, toY: 0.45 }
        },
        { 
          x: 0.5, y: 0.35, number: "4", team: "offense",
          movement: { toX: 0.45, toY: 0.3 }
        },
        { 
          x: 0.45, y: 0.65, number: "5", team: "offense",
          movement: { toX: 0.5, toY: 0.7 }
        }
      ],
      ball: { x: 0.15, y: 0.35 },
      keyPoints: [
        "Players communicate and read each other's movements",
        "Flexible positioning based on game situation",
        "Encourages basketball IQ development"
      ]
    },
    {
      title: "Nice-Guy Style",
      description: "Coach encourages players to express themselves. More creative movement and individual flair.",
      players: [
        { 
          x: 0.2, y: 0.4, number: "1", team: "offense",
          movement: { toX: 0.4, toY: 0.2 }
        },
        { 
          x: 0.15, y: 0.6, number: "2", team: "offense",
          movement: { toX: 0.3, toY: 0.8 }
        },
        { 
          x: 0.4, y: 0.55, number: "3", team: "offense",
          movement: { toX: 0.6, toY: 0.5 }
        },
        { 
          x: 0.55, y: 0.3, number: "4", team: "offense",
          movement: { toX: 0.35, toY: 0.35 }
        },
        { 
          x: 0.5, y: 0.75, number: "5", team: "offense",
          movement: { toX: 0.7, toY: 0.6 }
        }
      ],
      ball: { x: 0.2, y: 0.4 },
      keyPoints: [
        "Players have freedom to create and improvise",
        "Emphasis on individual expression and creativity",
        "May lead to less structured but more dynamic play"
      ]
    }
  ]
};

export const learningPhasesDemo = {
  title: "Learning Phases in Basketball Skills",
  description: "Watch how a player progresses through the three phases of learning when acquiring a new skill",
  steps: [
    {
      title: "Try It Phase (Cognitive)",
      description: "Player is thinking hard about every movement. Lots of hesitation and errors as they process instructions.",
      players: [
        { x: 0.3, y: 0.5, number: "P", team: "offense" }
      ],
      ball: { x: 0.3, y: 0.5, bouncing: false },
      keyPoints: [
        "Conscious thought required for every movement",
        "Slow execution due to mental processing",
        "Many errors as technique is still being learned",
        "Player needs constant coaching and feedback"
      ]
    },
    {
      title: "Mastering Phase (Associative)", 
      description: "Player starts to refine technique. Movements become smoother with fewer but still noticeable errors.",
      players: [
        { 
          x: 0.3, y: 0.5, number: "P", team: "offense",
          movement: { toX: 0.4, toY: 0.45 }
        }
      ],
      ball: { x: 0.3, y: 0.5, bouncing: true },
      keyPoints: [
        "Technique refinement and consistency building",
        "Fewer errors, smoother execution", 
        "Beginning to perform under game-like conditions",
        "Coach focuses on fine-tuning and corrections"
      ]
    },
    {
      title: "Automatic Phase (Autonomous)",
      description: "Skill becomes natural and fluid. Player can perform consistently while focusing on other aspects of the game.",
      players: [
        { 
          x: 0.3, y: 0.5, number: "P", team: "offense",
          movement: { toX: 0.6, toY: 0.3 }
        }
      ],
      ball: { x: 0.3, y: 0.5, bouncing: true },
      keyPoints: [
        "Skill performed naturally without conscious thought",
        "Consistent execution even under pressure",
        "Can focus on game strategy while performing skill",
        "Coach emphasizes application in game situations"
      ]
    }
  ]
};

export const coachRolesVisualization = {
  title: "Coach's Multiple Roles",
  description: "A visual representation of how a coach moves between different roles during practice and games",
  steps: [
    {
      title: "Teacher Role",
      description: "Coach demonstrates proper technique and explains fundamentals to the team.",
      players: [
        { x: 0.2, y: 0.3, number: "1", team: "offense" },
        { x: 0.2, y: 0.4, number: "2", team: "offense" },
        { x: 0.2, y: 0.5, number: "3", team: "offense" },
        { x: 0.2, y: 0.6, number: "4", team: "offense" },
        { x: 0.2, y: 0.7, number: "5", team: "offense" },
        { x: 0.4, y: 0.5, number: "C", team: "defense" } // Coach
      ],
      ball: { x: 0.4, y: 0.5 },
      keyPoints: [
        "Demonstrating proper techniques",
        "Explaining concepts and strategies", 
        "Breaking down complex skills into steps",
        "Ensuring understanding before moving forward"
      ]
    },
    {
      title: "Motivator Role",
      description: "Coach energizes the team, building confidence and inspiring peak performance.",
      players: [
        { 
          x: 0.3, y: 0.3, number: "1", team: "offense",
          movement: { toX: 0.4, toY: 0.2 }
        },
        { 
          x: 0.3, y: 0.7, number: "2", team: "offense",
          movement: { toX: 0.4, toY: 0.8 }
        },
        { 
          x: 0.5, y: 0.5, number: "3", team: "offense",
          movement: { toX: 0.6, toY: 0.5 }
        },
        { 
          x: 0.7, y: 0.3, number: "4", team: "offense",
          movement: { toX: 0.8, toY: 0.2 }
        },
        { 
          x: 0.7, y: 0.7, number: "5", team: "offense",
          movement: { toX: 0.8, toY: 0.8 }
        },
        { x: 0.1, y: 0.5, number: "C", team: "defense" } // Coach
      ],
      ball: { x: 0.5, y: 0.5 },
      keyPoints: [
        "Inspiring confidence and self-belief",
        "Creating positive energy and momentum",
        "Encouraging players to push their limits",
        "Building team chemistry and unity"
      ]
    },
    {
      title: "Organizer Role", 
      description: "Coach manages practice flow, coordinates drills, and ensures efficient use of time.",
      players: [
        { x: 0.15, y: 0.25, number: "1", team: "offense" },
        { x: 0.45, y: 0.25, number: "2", team: "offense" },
        { x: 0.75, y: 0.25, number: "3", team: "offense" },
        { x: 0.15, y: 0.75, number: "4", team: "offense" },
        { x: 0.45, y: 0.75, number: "5", team: "offense" },
        { x: 0.5, y: 0.5, number: "C", team: "defense" } // Coach
      ],
      ball: { x: 0.15, y: 0.25 },
      keyPoints: [
        "Planning and structuring practice sessions",
        "Managing time and transitions between drills",
        "Coordinating equipment and space usage",
        "Keeping everyone engaged and productive"
      ]
    }
  ]
};

// Export all play diagrams for easy access
export const moduleOnePlayDiagrams = {
  coachingStyleDemonstration,
  learningPhasesDemo, 
  coachRolesVisualization
};