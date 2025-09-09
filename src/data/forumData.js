/**
 * Community Forum Data
 * Basketball coaching community discussions and content
 */

export const forumCategories = [
  {
    id: 'fundamentals',
    name: 'Fundamentals & Basics',
    description: 'Shooting, dribbling, passing, and core basketball skills',
    icon: 'basketball',
    gradient: 'from-alloui-primary to-alloui-court-blue',
    topicCount: 156,
    postCount: 892,
    memberCount: 234,
    activeToday: 18,
    moderators: ['Coach_Ahmad', 'BasketballMY'],
    recentPosts: [
      {
        title: 'Best drills for teaching proper shooting form to beginners',
        author: 'CoachLee_KL',
        timeAgo: '2 hours ago'
      },
      {
        title: 'How to correct common dribbling mistakes',
        author: 'YouthCoachMsia',
        timeAgo: '4 hours ago'
      },
      {
        title: 'Teaching defensive stance to young players',
        author: 'BasketballAcademy',
        timeAgo: '6 hours ago'
      }
    ]
  },
  {
    id: 'youth-coaching',
    name: 'Youth & Junior Development',
    description: 'Coaching children and teenagers, age-appropriate methods',
    icon: 'growth',
    gradient: 'from-success-green to-basketball-orange',
    topicCount: 203,
    postCount: 1247,
    memberCount: 189,
    activeToday: 25,
    moderators: ['YouthCoachExpert', 'JuniorBasketball'],
    recentPosts: [
      {
        title: 'Managing different skill levels in U-12 teams',
        author: 'CoachSarah_JB',
        timeAgo: '1 hour ago'
      },
      {
        title: 'Fun drills that teach fundamentals without boring kids',
        author: 'KidsCoachMY',
        timeAgo: '3 hours ago'
      },
      {
        title: 'Parent expectations vs player development reality',
        author: 'CoachPengiran',
        timeAgo: '5 hours ago'
      }
    ]
  },
  {
    id: 'tactics-strategy',
    name: 'Tactics & Game Strategy',
    description: 'Offensive/defensive systems, game planning, advanced strategies',
    icon: 'strategy',
    gradient: 'from-basketball-orange to-alloui-gold',
    topicCount: 98,
    postCount: 654,
    memberCount: 156,
    activeToday: 12,
    moderators: ['TacticsGuru', 'StrategyCoach'],
    recentPosts: [
      {
        title: 'Effective zone defense against teams with good shooters',
        author: 'DefenseFirst',
        timeAgo: '30 minutes ago'
      },
      {
        title: 'Pick and roll variations for youth teams',
        author: 'OffenseCoach',
        timeAgo: '2 hours ago'
      },
      {
        title: 'Adjusting strategy mid-game based on opponent strengths',
        author: 'GamePlanner',
        timeAgo: '4 hours ago'
      }
    ]
  },
  {
    id: 'coaching-challenges',
    name: 'Coaching Challenges',
    description: 'Difficult situations, problem-solving, challenging players',
    icon: 'target',
    gradient: 'from-team-red to-basketball-orange',
    topicCount: 134,
    postCount: 789,
    memberCount: 167,
    activeToday: 22,
    moderators: ['ExperiencedCoach', 'MentorMY'],
    recentPosts: [
      {
        title: 'Dealing with a star player who disrupts team chemistry',
        author: 'TeamFirst',
        timeAgo: '45 minutes ago'
      },
      {
        title: 'How to handle parents who criticize your coaching decisions',
        author: 'CoachStruggles',
        timeAgo: '2 hours ago'
      },
      {
        title: 'Motivating players after a series of losses',
        author: 'NeverGiveUp',
        timeAgo: '3 hours ago'
      }
    ]
  },
  {
    id: 'malaysia-sea',
    name: 'Malaysia & SEA Basketball',
    description: 'Regional basketball scene, local tournaments, Malaysian coaches',
    icon: 'court',
    gradient: 'from-alloui-gold to-alloui-primary',
    topicCount: 87,
    postCount: 445,
    memberCount: 198,
    activeToday: 15,
    moderators: ['MalaysianBball', 'SEACoaches'],
    recentPosts: [
      {
        title: 'MABA Level 2 certification course - experiences and tips',
        author: 'CertifiedCoach',
        timeAgo: '1 hour ago'
      },
      {
        title: 'Best youth tournaments in Klang Valley',
        author: 'TournamentInfo',
        timeAgo: '3 hours ago'
      },
      {
        title: 'Finding quality referees for local competitions',
        author: 'OrganizeLocal',
        timeAgo: '5 hours ago'
      }
    ]
  },
  {
    id: 'resources-tools',
    name: 'Resources & Tools',
    description: 'Equipment recommendations, training tools, useful resources',
    icon: 'equipment',
    gradient: 'from-whistle-silver to-alloui-court-blue',
    topicCount: 76,
    postCount: 398,
    memberCount: 145,
    activeToday: 8,
    moderators: ['ResourceGuru', 'ToolsExpert'],
    recentPosts: [
      {
        title: 'Best basketball training apps for coaches in 2024',
        author: 'TechCoach',
        timeAgo: '2 hours ago'
      },
      {
        title: 'Budget-friendly equipment for starting a youth program',
        author: 'BudgetCoach',
        timeAgo: '4 hours ago'
      },
      {
        title: 'Recommended books for new basketball coaches',
        author: 'BookwormCoach',
        timeAgo: '6 hours ago'
      }
    ]
  }
];

export const sampleTopics = {
  fundamentals: [
    {
      id: 'topic_001',
      title: 'Best drills for teaching proper shooting form to beginners',
      excerpt: 'Looking for effective drills to help young players develop correct shooting mechanics from the start...',
      author: 'CoachLee_KL',
      createdAt: '2 days ago',
      replyCount: 12,
      viewCount: 89,
      likeCount: 15,
      priority: 'hot',
      tags: ['shooting', 'fundamentals', 'youth'],
      lastActivity: {
        author: 'ShootingCoach',
        timeAgo: '2 hours ago'
      }
    },
    {
      id: 'topic_002',
      title: 'Teaching defensive stance and footwork fundamentals',
      excerpt: 'What are the most important points to emphasize when teaching basic defensive stance to new players?',
      author: 'DefenseFirst',
      createdAt: '1 day ago',
      replyCount: 8,
      viewCount: 56,
      likeCount: 11,
      priority: 'normal',
      tags: ['defense', 'footwork', 'basics'],
      lastActivity: {
        author: 'CoachAhmad',
        timeAgo: '5 hours ago'
      }
    },
    {
      id: 'topic_003',
      title: 'PINNED: Essential fundamentals every new player should master',
      excerpt: 'A comprehensive list of fundamental skills that should be prioritized when working with beginners...',
      author: 'BasketballMY',
      createdAt: '1 week ago',
      replyCount: 34,
      viewCount: 234,
      likeCount: 42,
      priority: 'pinned',
      tags: ['fundamentals', 'beginner', 'checklist'],
      lastActivity: {
        author: 'NewCoachMY',
        timeAgo: '1 day ago'
      }
    }
  ],
  'youth-coaching': [
    {
      id: 'topic_101',
      title: 'Managing different skill levels in U-12 teams',
      excerpt: 'How do you keep all players engaged when you have both beginners and advanced players on the same team?',
      author: 'CoachSarah_JB',
      createdAt: '3 hours ago',
      replyCount: 5,
      viewCount: 23,
      likeCount: 8,
      priority: 'hot',
      tags: ['youth', 'team-management', 'skill-levels'],
      lastActivity: {
        author: 'ExperiencedYouthCoach',
        timeAgo: '1 hour ago'
      }
    },
    {
      id: 'topic_102',
      title: 'Fun drills that teach fundamentals without boring kids',
      excerpt: 'Share your favorite drills that keep young players engaged while still teaching important skills...',
      author: 'KidsCoachMY',
      createdAt: '6 hours ago',
      replyCount: 18,
      viewCount: 67,
      likeCount: 22,
      priority: 'normal',
      tags: ['fun-drills', 'engagement', 'youth'],
      lastActivity: {
        author: 'PlayfulCoach',
        timeAgo: '3 hours ago'
      }
    }
  ],
  'coaching-challenges': [
    {
      id: 'topic_201',
      title: 'Dealing with a star player who disrupts team chemistry',
      excerpt: 'I have a very talented player who dominates the ball and doesn\'t pass to teammates. How can I address this?',
      author: 'TeamFirst',
      createdAt: '1 hour ago',
      replyCount: 3,
      viewCount: 15,
      likeCount: 2,
      priority: 'normal',
      tags: ['team-chemistry', 'difficult-players', 'leadership'],
      lastActivity: {
        author: 'VeteranCoach',
        timeAgo: '45 minutes ago'
      }
    },
    {
      id: 'topic_202',
      title: 'SOLVED: How to handle parents who criticize coaching decisions',
      excerpt: 'Had some difficult conversations with parents about playing time and strategy choices...',
      author: 'CoachStruggles',
      createdAt: '3 days ago',
      replyCount: 24,
      viewCount: 156,
      likeCount: 18,
      priority: 'solved',
      tags: ['parents', 'communication', 'conflict-resolution'],
      lastActivity: {
        author: 'MentorCoach',
        timeAgo: '1 day ago'
      }
    }
  ]
};

export const samplePosts = {
  topic_001: [
    {
      id: 'post_001_01',
      author: 'CoachLee_KL',
      authorBadge: null,
      postNumber: 1,
      createdAt: '2 days ago',
      content: `I'm working with a group of 10-12 year olds who are just starting to learn basketball. Many of them have developed bad shooting habits from just "chucking" the ball at the basket during recess.

I'm looking for specific drills that can help them unlearn these bad habits and develop proper shooting form from the ground up. What has worked well for you when teaching shooting fundamentals to beginners?

Key issues I'm seeing:
- Poor hand placement on the ball
- No follow-through
- Shooting from the chest instead of above the head
- Inconsistent stance and balance

Any recommendations for progressive drills would be greatly appreciated!`,
      likeCount: 5,
      isLiked: false,
      tags: ['shooting-form', 'beginners'],
      edited: false
    },
    {
      id: 'post_001_02',
      author: 'ShootingCoach',
      authorBadge: 'expert',
      postNumber: 2,
      createdAt: '2 days ago',
      content: `Great question! Here's my go-to progression for teaching shooting form:

**1. Wall Shooting (no ball)**
- Players face a wall arm's length away
- Practice proper shooting motion against the wall
- Focus on hand placement, elbow alignment, follow-through

**2. Partner Form Shooting**
- Players sit 3 feet apart
- One-handed shots to their partner
- Emphasize arc and rotation

**3. Close-Range Shooting**
- Start right under the basket
- Focus on form over distance
- Only move back when form is consistent

The key is LOTS of repetition with proper form before worrying about making shots. I spend 2-3 weeks just on form before we even think about shooting from normal distances.`,
      likeCount: 12,
      isLiked: true,
      tags: ['shooting-drills'],
      edited: false
    },
    {
      id: 'post_001_03',
      author: 'CoachAhmad',
      authorBadge: 'moderator',
      postNumber: 3,
      createdAt: '1 day ago',
      content: `@ShootingCoach has excellent suggestions! I'd add the "BEEF" teaching method:

**B**alance - proper stance and body position
**E**yes - on target (back of rim)
**E**lbow - under the ball, pointing to target
**F**ollow-through - snap the wrist, "wave goodbye"

I make it fun by having players say "BEEF" as they shoot. Kids remember acronyms better than long explanations.

Also, consider using smaller/lighter basketballs for younger players. Regular basketballs can be too heavy and force them into bad shooting form.`,
      likeCount: 8,
      isLiked: false,
      tags: ['teaching-methods'],
      edited: false
    }
  ]
};

export const getCategoriesWithTopics = () => {
  return forumCategories.map(category => ({
    ...category,
    topics: sampleTopics[category.id] || []
  }));
};

export const getTopicWithPosts = (topicId) => {
  // Find topic across all categories
  let topic = null;
  for (const categoryTopics of Object.values(sampleTopics)) {
    topic = categoryTopics.find(t => t.id === topicId);
    if (topic) break;
  }
  
  if (!topic) return null;
  
  return {
    topic,
    posts: samplePosts[topicId] || []
  };
};

export const getCategoryById = (categoryId) => {
  return forumCategories.find(cat => cat.id === categoryId);
};