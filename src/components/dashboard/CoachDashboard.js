import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AllouiIcon } from '../icons';
import Link from 'next/link';

// Module data with basketball-specific categorization
const modules = [
  {
    id: 1, title: 'Introduction to Coaching', category: 'fundamentals',
    icon: 'teacher', description: 'Learn the fundamental roles, styles, and philosophies of effective basketball coaching.',
    estimatedTime: '45 min', skills: ['Leadership', 'Philosophy', 'Team Building']
  },
  {
    id: 2, title: 'Rules & Player Positions', category: 'fundamentals',
    icon: 'rules', description: 'Master the official rules and understand the roles of each position on the court.',
    estimatedTime: '60 min', skills: ['Game Rules', 'Positioning', 'Strategy']
  },
  {
    id: 3, title: 'Violations', category: 'fundamentals',
    icon: 'violation', description: 'Understand basketball violations and how to teach players to avoid them.',
    estimatedTime: '40 min', skills: ['Rule Enforcement', 'Player Development', 'Game Flow']
  },
  {
    id: 4, title: 'Fouls & Official Signals', category: 'fundamentals',
    icon: 'hand-signal', description: 'Learn about different types of fouls and the official signals used by referees.',
    estimatedTime: '50 min', skills: ['Officiating', 'Communication', 'Game Management']
  },
  {
    id: 5, title: 'Equipment & Court', category: 'fundamentals',
    icon: 'basketball', description: 'Learn about basketball equipment, court dimensions, and optimal training environments.',
    estimatedTime: '35 min', skills: ['Facility Management', 'Safety', 'Equipment Care']
  },
  {
    id: 6, title: 'Basic Skills — Movement & Ball Handling', category: 'skills',
    icon: 'movement', description: 'Master the fundamental movement patterns and ball handling skills essential for basketball.',
    estimatedTime: '70 min', skills: ['Fundamentals', 'Skill Development', 'Technique']
  },
  {
    id: 7, title: 'Dribbling Skills', category: 'skills',
    icon: 'basketball', description: 'Develop effective dribbling techniques and learn how to teach ball control to players.',
    estimatedTime: '65 min', skills: ['Ball Control', 'Technique', 'Progressive Training']
  },
  {
    id: 8, title: 'Shooting & Rebounding', category: 'skills',
    icon: 'trophy', description: 'Master shooting mechanics and rebounding techniques to improve scoring efficiency.',
    estimatedTime: '80 min', skills: ['Shooting Form', 'Rebounding', 'Scoring']
  },
  {
    id: 9, title: 'Strategy & Tactics', category: 'advanced',
    icon: 'strategy', description: 'Learn offensive and defensive strategies to improve team performance on the court.',
    estimatedTime: '90 min', skills: ['Game Strategy', 'Tactics', 'Team Systems']
  },
  {
    id: 10, title: 'Coaching Communication & Ethics', category: 'advanced',
    icon: 'communication', description: 'Develop effective communication skills and understand ethical coaching practices.',
    estimatedTime: '55 min', skills: ['Communication', 'Ethics', 'Leadership']
  },
  {
    id: 11, title: 'Planning Training Schedules', category: 'advanced',
    icon: 'calendar', description: 'Create effective practice plans and training schedules for basketball teams.',
    estimatedTime: '75 min', skills: ['Practice Planning', 'Organization', 'Time Management']
  },
  {
    id: 12, title: 'Introduction to Sports Science', category: 'advanced',
    icon: 'science', description: 'Understand the scientific principles behind athletic performance and injury prevention.',
    estimatedTime: '85 min', skills: ['Sports Science', 'Injury Prevention', 'Performance']
  }
];

export default function CoachDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('overview');

  // Gamification data
  const [gamificationData, setGamificationData] = useState({
    level: 3,
    currentXP: 1250,
    nextLevelXP: 2000,
    streak: 7,
    recentAchievements: [
      { id: 'fundamentals-master', title: 'Fundamentals Master', unlockedAt: '2 days ago' },
      { id: 'community-contributor', title: 'Community Contributor', unlockedAt: '1 week ago' }
    ]
  });

  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      
      try {
        const progressRef = collection(db, 'users', user.uid, 'progress');
        const progressSnapshot = await getDocs(progressRef);
        
        const progressData = {};
        progressSnapshot.forEach((doc) => {
          const moduleId = doc.id.replace('module', '');
          progressData[moduleId] = doc.data();
        });
        
        setUserProgress(progressData);
      } catch (error) {
        console.error('Error fetching user progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchUserProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const completedModules = Object.values(userProgress).filter(p => p.status === 'completed').length;
    return Math.round((completedModules / modules.length) * 100);
  };

  // Get next recommended module
  const getNextModule = () => {
    for (const module of modules) {
      const progress = userProgress[module.id];
      if (!progress || progress.status !== 'completed') {
        return module;
      }
    }
    return null;
  };

  // Coach's Toolkit items
  const toolkitItems = [
    { 
      name: 'Practice Plan Builder', 
      description: 'Design custom practice sessions with drag-and-drop tools',
      icon: 'calendar', 
      action: () => router.push('/tools/practice-builder'),
      category: 'planning'
    },
    { 
      name: 'Interactive Drill Builder', 
      description: 'Create custom basketball drills with drag-and-drop simplicity',
      icon: 'strategy', 
      action: () => router.push('/tools/drill-builder'),
      category: 'drills'
    },
    { 
      name: 'Player Evaluation Forms', 
      description: 'Track individual player development and progress',
      icon: 'teacher', 
      action: () => router.push('/tools/evaluation'),
      category: 'assessment'
    },
    { 
      name: 'Video Scenario Challenges', 
      description: 'Practice real coaching situations through interactive video scenarios',
      icon: 'video', 
      action: () => router.push('/scenarios'),
      category: 'development'
    }
  ];

  // Quick actions for common tasks
  const quickActions = [
    { 
      name: 'Continue Learning', 
      description: 'Resume your current module',
      icon: 'arrow-right', 
      action: () => {
        const nextModule = getNextModule();
        if (nextModule) router.push(`/modules/m${nextModule.id}`);
      },
      primary: true
    },
    { 
      name: 'Progress & Achievements', 
      description: 'Track your development and unlock badges',
      icon: 'growth', 
      action: () => router.push('/progress')
    },
    { 
      name: 'Create Practice Plan', 
      description: 'Build a new practice session',
      icon: 'calendar', 
      action: () => router.push('/tools/practice-builder')
    },
    { 
      name: 'Join Community', 
      description: 'Connect with fellow coaches',
      icon: 'communication', 
      action: () => router.push('/community')
    },
    { 
      name: 'View Certificates', 
      description: 'Access your achievements',
      icon: 'trophy', 
      action: () => router.push('/certificates')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin">
          <AllouiIcon name="basketball" size="xl" variant="gold" />
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();
  const nextModule = getNextModule();
  const completedModules = Object.values(userProgress).filter(p => p.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Welcome Section with Gamification */}
      <div className="bg-gradient-to-r from-alloui-primary-light to-basketball-orange-light dark:from-alloui-primary-dark dark:to-basketball-orange-dark text-white rounded-lg p-6">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, Coach!</h1>
                <p className="text-lg opacity-90">
                  {completedModules === 0 
                    ? "Ready to start your coaching journey?" 
                    : completedModules === modules.length 
                    ? "Congratulations! You've completed all modules. Keep practicing with the tools below."
                    : `You've completed ${completedModules} of ${modules.length} modules. Keep up the great work!`
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{overallProgress}%</div>
                <div className="text-sm opacity-75">Overall Progress</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Gamification Info */}
          <div className="lg:col-span-4 border-l border-white/20 pl-6">
            <div className="space-y-3">
              {/* Level & XP */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <AllouiIcon name="star" size="sm" className="text-white" />
                    <span className="text-sm opacity-75">Coach Level {gamificationData.level}</span>
                  </div>
                  <div className="text-lg font-bold">{gamificationData.currentXP} XP</div>
                </div>
                <button 
                  onClick={() => router.push('/progress')}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                >
                  View Progress
                </button>
              </div>

              {/* XP Progress */}
              <div>
                <div className="flex justify-between text-xs opacity-75 mb-1">
                  <span>Next Level</span>
                  <span>{gamificationData.nextLevelXP - gamificationData.currentXP} XP to go</span>
                </div>
                <div className="bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-white rounded-full h-1 transition-all duration-500"
                    style={{ width: `${(gamificationData.currentXP / gamificationData.nextLevelXP) * 100}%` }}
                  />
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center space-x-2">
                <AllouiIcon name="fire" size="sm" className="text-white" />
                <span className="text-sm">
                  <span className="font-bold">{gamificationData.streak}</span> day learning streak
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: 'teacher' },
          { id: 'modules', label: 'Learning Path', icon: 'rules' },
          { id: 'toolkit', label: 'Coach\'s Toolkit', icon: 'basketball' },
          { id: 'progress', label: 'Progress', icon: 'trophy' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
              currentView === tab.id
                ? 'bg-white dark:bg-gray-700 text-alloui-primary-light dark:text-alloui-primary-dark shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <AllouiIcon name={tab.icon} size="sm" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      {currentView === 'overview' && (
        <div className="space-y-6">
          {/* Recent Achievements */}
          {gamificationData.recentAchievements.length > 0 && (
            <div className="bg-gradient-to-r from-alloui-gold/10 to-basketball-orange/10 border border-alloui-gold/20 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <AllouiIcon name="trophy" size="md" className="text-alloui-gold" />
                <h3 className="font-bold text-gray-900 dark:text-white">Recent Achievements</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {gamificationData.recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 rounded-full px-3 py-1 text-sm">
                    <AllouiIcon name="star" size="sm" className="text-alloui-gold" />
                    <span className="font-medium text-gray-900 dark:text-white">{achievement.title}</span>
                    <span className="text-gray-500 dark:text-gray-400">• {achievement.unlockedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`p-4 rounded-lg text-left transition-all hover:shadow-md ${
                      action.primary
                        ? 'bg-basketball-orange-light dark:bg-basketball-orange-dark text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-basketball-orange-light dark:hover:border-basketball-orange-dark'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <AllouiIcon 
                        name={action.icon} 
                        size="md" 
                        variant={action.primary ? 'light' : 'gold'} 
                      />
                      <div>
                        <div className={`font-semibold ${action.primary ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          {action.name}
                        </div>
                        <div className={`text-sm ${action.primary ? 'text-white/80' : 'text-gray-600 dark:text-gray-300'}`}>
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Module Recommendation */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Continue Learning</h2>
              {nextModule ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AllouiIcon name={nextModule.icon} size="lg" variant="gold" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Module {nextModule.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {nextModule.estimatedTime}
                    </p>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {nextModule.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {nextModule.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {nextModule.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-basketball-orange-light/10 dark:bg-basketball-orange-dark/10 text-basketball-orange-light dark:text-basketball-orange-dark text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <Link 
                  href={`/modules/m${nextModule.id}`}
                  className="inline-flex items-center space-x-2 bg-basketball-orange-light dark:bg-basketball-orange-dark text-white px-4 py-2 rounded-md hover:bg-basketball-orange-dark dark:hover:bg-basketball-orange-light transition-colors"
                >
                  <span>Start Module</span>
                  <AllouiIcon name="arrow-right" size="sm" />
                </Link>
              </div>
            ) : (
              <div className="bg-success-green-light/10 dark:bg-success-green-dark/10 border border-success-green-light dark:border-success-green-dark rounded-lg p-6 text-center">
                <AllouiIcon name="trophy" size="xl" variant="gold" className="mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  All Modules Complete!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Congratulations on completing your Level I Basketball Coaching certification.
                </p>
                <Link 
                  href="/certificates"
                  className="inline-flex items-center space-x-2 bg-success-green-light dark:bg-success-green-dark text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  <span>View Certificate</span>
                  <AllouiIcon name="trophy" size="sm" />
                </Link>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {currentView === 'modules' && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Learning Path</h2>
          
          {/* Module Map Visualization */}
          <div className="space-y-4">
            {['fundamentals', 'skills', 'advanced'].map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white capitalize">
                  {category === 'fundamentals' ? 'Foundation' : category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules.filter(m => m.category === category).map((module) => {
                    const progress = userProgress[module.id];
                    const isCompleted = progress?.status === 'completed';
                    const isInProgress = progress?.status === 'in_progress';
                    const progressPercent = progress ? 
                      Math.round(((progress.completedSections?.length || 0) / 5) * 100) : 0;

                    return (
                      <Link key={module.id} href={`/modules/m${module.id}`}>
                        <div className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                          isCompleted 
                            ? 'border-success-green-light dark:border-success-green-dark bg-success-green-light/5 dark:bg-success-green-dark/5'
                            : isInProgress
                            ? 'border-basketball-orange-light dark:border-basketball-orange-dark bg-basketball-orange-light/5 dark:bg-basketball-orange-dark/5'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-basketball-orange-light dark:hover:border-basketball-orange-dark'
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <AllouiIcon 
                                name={module.icon} 
                                size="md" 
                                variant={isCompleted ? 'success' : isInProgress ? 'gold' : 'secondary'} 
                              />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  Module {module.id}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {module.estimatedTime}
                                </p>
                              </div>
                            </div>
                            {isCompleted && (
                              <AllouiIcon name="trophy" size="sm" variant="success" />
                            )}
                          </div>
                          
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            {module.title}
                          </h5>
                          
                          {progress && (
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{progressPercent}%</span>
                              </div>
                              <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                                <div 
                                  className={`h-1 rounded-full transition-all ${
                                    isCompleted 
                                      ? 'bg-success-green-light dark:bg-success-green-dark' 
                                      : 'bg-basketball-orange-light dark:bg-basketball-orange-dark'
                                  }`}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentView === 'toolkit' && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Coach's Toolkit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {toolkitItems.map((tool, index) => (
              <button
                key={index}
                onClick={tool.action}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-left hover:shadow-md hover:border-basketball-orange-light dark:hover:border-basketball-orange-dark transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-basketball-orange-light/10 dark:bg-basketball-orange-dark/10 p-3 rounded-lg">
                    <AllouiIcon name={tool.icon} size="lg" variant="gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {tool.description}
                    </p>
                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300">
                      {tool.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentView === 'progress' && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Progress</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Overview */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Module Completion</h3>
                <div className="space-y-3">
                  {modules.map((module) => {
                    const progress = userProgress[module.id];
                    const progressPercent = progress ? 
                      Math.round(((progress.completedSections?.length || 0) / 5) * 100) : 0;

                    return (
                      <div key={module.id} className="flex items-center space-x-4">
                        <div className="w-8 text-sm text-gray-500 dark:text-gray-400">
                          M{module.id}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {module.title}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {progressPercent}%
                            </span>
                          </div>
                          <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-basketball-orange-light dark:bg-basketball-orange-dark h-2 rounded-full transition-all"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Modules Completed</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {completedModules}/{modules.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Overall Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {overallProgress}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Learning Streak</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{gamificationData.streak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Coach Level</span>
                    <span className="font-semibold text-gray-900 dark:text-white">Level {gamificationData.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Experience Points</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{gamificationData.currentXP} XP</span>
                  </div>
                </div>
              </div>

              {overallProgress === 100 && (
                <div className="bg-success-green-light/10 dark:bg-success-green-dark/10 border border-success-green-light dark:border-success-green-dark rounded-lg p-6 text-center">
                  <AllouiIcon name="trophy" size="xl" variant="success" className="mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Certification Complete!
                  </h4>
                  <Link 
                    href="/certificates"
                    className="inline-block mt-2 text-success-green-light dark:text-success-green-dark hover:underline"
                  >
                    Download Certificate →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}