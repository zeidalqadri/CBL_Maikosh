import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from '../../layouts/MainLayout';
import ProgressTracker from '../../components/gamification/ProgressTracker';
import AchievementSystem from '../../components/gamification/AchievementSystem';
import Footer from '../../components/Footer';
import { AllouiIcon } from '../../components/icons';

export default function ProgressPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('progress');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/progress');
    }
  }, [user, loading, router]);

  // Sample user progress data
  const userProgressData = {
    level: 3,
    currentXP: 1250,
    nextLevelXP: 2000,
    skills: {
      fundamentals: { level: 3, progress: { current: 4, target: 8 } },
      tactics: { level: 2, progress: { current: 2, target: 6 } },
      communication: { level: 4, progress: { current: 1, target: 4 } },
      leadership: { level: 2, progress: { current: 5, target: 6 } },
      'player-development': { level: 3, progress: { current: 3, target: 8 } },
      'game-management': { level: 1, progress: { current: 3, target: 5 } }
    },
    currentStreak: 12,
    longestStreak: 18,
    activityData: generateActivityData(),
    milestones: [
      {
        title: 'First Module Complete',
        description: 'Successfully completed your first coaching module',
        icon: 'star',
        completed: true,
        completedAt: '2 weeks ago'
      },
      {
        title: 'Community Contributor',
        description: 'Made your first post in the community forum',
        icon: 'communication',
        completed: true,
        completedAt: '1 week ago'
      },
      {
        title: 'Drill Master',
        description: 'Create 5 custom drills using the drill builder',
        icon: 'basketball',
        current: true,
        progress: { current: 2, target: 5 }
      },
      {
        title: 'Learning Streak Champion',
        description: 'Maintain a 30-day learning streak',
        icon: 'fire',
        progress: { current: 12, target: 30 }
      },
      {
        title: 'Scenario Expert',
        description: 'Complete all video scenarios with perfect scores',
        icon: 'video',
        progress: { current: 0, target: 8 }
      }
    ]
  };

  // Sample achievement data
  const userAchievements = {
    'first-steps': { unlocked: true, unlockedAt: '2024-01-15' },
    'fundamentals-master': { unlocked: true, unlockedAt: '2024-01-22' },
    'community-contributor': { unlocked: true, unlockedAt: '2024-01-28' },
    'streak-warrior': { unlocked: false, progress: { current: 12, target: 30 } },
    'drill-architect': { unlocked: false, progress: { current: 2, target: 5 } },
    'scenario-champion': { unlocked: false, progress: { current: 0, target: 8 } },
    'mentor-coach': { unlocked: false, progress: { current: 0, target: 10 } },
    'legend-status': { unlocked: false, progress: { current: 3, target: 10 } }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-alloui-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your progress...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const tabs = [
    { id: 'progress', label: 'Progress Tracking', icon: 'growth' },
    { id: 'achievements', label: 'Achievements', icon: 'trophy' }
  ];

  return (
    <MainLayout>
      <Head>
        <title>Progress & Achievements | alloui by CBL</title>
        <meta name="description" content="Track your coaching development journey with detailed progress tracking and achievements." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Progress & Achievements | alloui by CBL" />
        <meta property="og:description" content="Track your coaching development with detailed progress and achievement system." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Progress & Achievements - alloui by CBL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Progress & Achievements | alloui by CBL" />
        <meta name="twitter:description" content="Track your coaching development journey." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="coaching progress, basketball coaching development, achievement system, skill tracking, learning progress" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header with Tabs */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-alloui-primary mb-4 flex items-center justify-center">
                <AllouiIcon name="trophy" size="xl" className="mr-4 text-alloui-gold" />
                Your Coaching Journey
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Monitor your progress, celebrate achievements, and track your development as a basketball coach. 
                Your dedication to learning is building the skills that will inspire your players.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-alloui-primary text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <AllouiIcon 
                      name={tab.icon} 
                      size="sm" 
                      className={activeTab === tab.id ? 'text-alloui-gold' : 'text-current'} 
                    />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'progress' && (
            <div className="animate-fadeIn">
              <ProgressTracker
                userLevel={userProgressData.level}
                currentXP={userProgressData.currentXP}
                nextLevelXP={userProgressData.nextLevelXP}
                userSkills={userProgressData.skills}
                currentStreak={userProgressData.currentStreak}
                longestStreak={userProgressData.longestStreak}
                activityData={userProgressData.activityData}
                milestones={userProgressData.milestones}
              />
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="animate-fadeIn">
              <AchievementSystem 
                userAchievements={userAchievements}
              />
            </div>
          )}

        </div>
      </div>
      
      <Footer />
    </MainLayout>
  );
}

// Helper function to generate sample activity data
function generateActivityData() {
  const data = {};
  const today = new Date();
  
  for (let i = 0; i < 84; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Generate random activity level (0-5) with higher probability for recent dates
    const recentBoost = i < 14 ? 0.3 : 0;
    const randomChance = Math.random() + recentBoost;
    
    if (randomChance > 0.7) {
      data[dateString] = Math.floor(Math.random() * 4) + 1; // 1-4 activities
    } else if (randomChance > 0.4) {
      data[dateString] = Math.floor(Math.random() * 2) + 1; // 1-2 activities
    } else {
      data[dateString] = 0; // No activity
    }
  }
  
  return data;
}