import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../layouts/MainLayout';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AllouiIcon } from '../../components/icons';
import Footer from '../../components/Footer';

// Module data
const modules = [
  {
    id: 1,
    title: 'Introduction to Coaching',
    description: 'Learn the fundamental roles, styles, and philosophies of effective basketball coaching.',
    theme: 'leadership',
    primaryColor: 'var(--m1-primary)',
    secondaryColor: 'var(--m1-secondary)',
    accentColor: 'var(--m1-accent)',
    category: 'fundamentals',
    icon: 'teacher'
  },
  {
    id: 2,
    title: 'Rules & Player Positions',
    description: 'Master the official rules and understand the roles of each position on the court.',
    theme: 'rules',
    primaryColor: 'var(--m2-primary)',
    secondaryColor: 'var(--m2-secondary)',
    accentColor: 'var(--m2-accent)',
    category: 'fundamentals',
    icon: 'rules'
  },
  {
    id: 3,
    title: 'Violations',
    description: 'Understand basketball violations and how to teach players to avoid them.',
    theme: 'violations',
    primaryColor: 'var(--m3-primary)',
    secondaryColor: 'var(--m3-secondary)',
    accentColor: 'var(--m3-accent)',
    category: 'fundamentals',
    icon: 'violation'
  },
  {
    id: 4,
    title: 'Fouls & Official Signals',
    description: 'Learn about different types of fouls and the official signals used by referees.',
    theme: 'officiating',
    primaryColor: 'var(--m4-primary)',
    secondaryColor: 'var(--m4-secondary)',
    accentColor: 'var(--m4-accent)',
    category: 'fundamentals',
    icon: 'hand-signal'
  },
  {
    id: 5,
    title: 'Equipment & Court',
    description: 'Learn about basketball equipment, court dimensions, and optimal training environments.',
    theme: 'environment',
    primaryColor: 'var(--m5-primary)',
    secondaryColor: 'var(--m5-secondary)',
    accentColor: 'var(--m5-accent)',
    category: 'fundamentals',
    icon: 'basketball'
  },
  {
    id: 6,
    title: 'Basic Skills — Movement & Ball Handling',
    description: 'Master the fundamental movement patterns and ball handling skills essential for basketball.',
    theme: 'fundamentals',
    primaryColor: 'var(--m6-primary)',
    secondaryColor: 'var(--m6-secondary)',
    accentColor: 'var(--m6-accent)',
    category: 'skills',
    icon: 'movement'
  },
  {
    id: 7,
    title: 'Dribbling Skills',
    description: 'Develop effective dribbling techniques and learn how to teach ball control to players.',
    theme: 'control',
    primaryColor: 'var(--m7-primary)',
    secondaryColor: 'var(--m7-secondary)',
    accentColor: 'var(--m7-accent)',
    category: 'skills',
    icon: 'basketball'
  },
  {
    id: 8,
    title: 'Shooting & Rebounding',
    description: 'Master shooting mechanics and rebounding techniques to improve scoring efficiency.',
    theme: 'precision',
    primaryColor: 'var(--m8-primary)',
    secondaryColor: 'var(--m8-secondary)',
    accentColor: 'var(--m8-accent)',
    category: 'skills',
    icon: 'trophy'
  },
  {
    id: 9,
    title: 'Strategy & Tactics',
    description: 'Learn offensive and defensive strategies to improve team performance on the court.',
    theme: 'strategy',
    primaryColor: 'var(--m9-primary)',
    secondaryColor: 'var(--m9-secondary)',
    accentColor: 'var(--m9-accent)',
    category: 'advanced',
    icon: 'strategy'
  },
  {
    id: 10,
    title: 'Coaching Communication & Ethics',
    description: 'Develop effective communication skills and understand ethical coaching practices.',
    theme: 'communication',
    primaryColor: 'var(--m10-primary)',
    secondaryColor: 'var(--m10-secondary)',
    accentColor: 'var(--m10-accent)',
    category: 'advanced',
    icon: 'communication'
  },
  {
    id: 11,
    title: 'Planning Training Schedules',
    description: 'Create effective practice plans and training schedules for basketball teams.',
    theme: 'organization',
    primaryColor: 'var(--m11-primary)',
    secondaryColor: 'var(--m11-secondary)',
    accentColor: 'var(--m11-accent)',
    category: 'advanced',
    icon: 'calendar'
  },
  {
    id: 12,
    title: 'Introduction to Sports Science',
    description: 'Understand the scientific principles behind athletic performance and injury prevention.',
    theme: 'science',
    primaryColor: 'var(--m12-primary)',
    secondaryColor: 'var(--m12-secondary)',
    accentColor: 'var(--m12-accent)',
    category: 'advanced',
    icon: 'science'
  }
];

export default function ModulesPage() {
  const { user, loading: userLoading } = useAuth();
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Fetch user progress data
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user || !user.uid) {
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
  
  // Filter modules based on selected category
  const filteredModules = filter === 'all' 
    ? modules 
    : modules.filter(module => module.category === filter);
  
  // Calculate module progress percentage
  const getModuleProgress = (moduleId) => {
    const progress = userProgress[moduleId];
    if (!progress) return 0;
    
    // Each module has 5 sections
    const totalSections = 5;
    const completedSections = progress.completedSections?.length || 0;
    
    return Math.round((completedSections / totalSections) * 100);
  };
  
  // Get module status
  const getModuleStatus = (moduleId) => {
    const progress = userProgress[moduleId];
    if (!progress) return 'not_started';
    return progress.status || 'in_progress';
  };

  return (
    <MainLayout>
      <Head>
        <title>Training Modules | alloui by CBL</title>
        <meta name="description" content="Master basketball coaching through 12 comprehensive modules designed for MABA/NSC Level I certification." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Training Modules | alloui by CBL" />
        <meta property="og:description" content="Master basketball coaching through 12 comprehensive modules designed for MABA/NSC Level I certification." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="alloui by CBL - Basketball coaching certification modules" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Training Modules | alloui by CBL" />
        <meta name="twitter:description" content="Master basketball coaching through 12 comprehensive modules designed for MABA/NSC Level I certification." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="basketball coaching modules, Malaysia, MABA, NSC, coaching certification, Level I, training modules, basketball skills, coaching course" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />
      </Head>

      <div className="bg-gradient-to-r from-basketball-orange-light dark:from-basketball-orange-dark to-alloui-primary-light dark:to-alloui-primary-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 mb-4">
            <AllouiIcon name="teacher" size="xl" variant="light" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Learning Journey</h1>
              <p className="text-xl opacity-90">
                Master basketball coaching through 12 progressive modules
              </p>
            </div>
          </div>
          
          {user && !loading && (
            <div className="mt-6 bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="opacity-75">Your Progress: </span>
                  <span className="font-semibold">
                    {Object.values(userProgress).filter(p => p.status === 'completed').length} of {modules.length} modules completed
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {Math.round((Object.values(userProgress).filter(p => p.status === 'completed').length / modules.length) * 100)}%
                  </div>
                  <div className="text-xs opacity-75">Complete</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'all'
                  ? 'bg-court-blue-light dark:bg-court-blue-dark text-white'
                  : 'bg-whistle-silver-light dark:bg-gray-700 text-coach-black-light dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Modules
            </button>
            <button
              onClick={() => setFilter('fundamentals')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'fundamentals'
                  ? 'bg-court-blue-light dark:bg-court-blue-dark text-white'
                  : 'bg-whistle-silver-light dark:bg-gray-700 text-coach-black-light dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Fundamentals
            </button>
            <button
              onClick={() => setFilter('skills')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'skills'
                  ? 'bg-court-blue-light dark:bg-court-blue-dark text-white'
                  : 'bg-whistle-silver-light dark:bg-gray-700 text-coach-black-light dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setFilter('advanced')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'advanced'
                  ? 'bg-court-blue-light dark:bg-court-blue-dark text-white'
                  : 'bg-whistle-silver-light dark:bg-gray-700 text-coach-black-light dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const moduleProgress = getModuleProgress(module.id);
            const moduleStatus = getModuleStatus(module.id);
            
            return (
              <div 
                key={module.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-whistle-silver dark:border-gray-600 hover:shadow-lg transition-shadow"
              >
                <div className="h-3" style={{ backgroundColor: module.primaryColor }}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <AllouiIcon 
                        name={module.icon} 
                        size="lg" 
                        variant="gold" 
                        className="mr-3" 
                      />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Module {module.id}: {module.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-neutral-gray-light dark:text-neutral-gray-dark mb-6">
                    {module.description}
                  </p>
                  
                  {user && !loading && (
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{moduleProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${moduleProgress}%`,
                            backgroundColor: moduleProgress === 100 ? 'var(--success-green)' : module.primaryColor
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {moduleStatus === 'completed' && (
                        <span className="bg-success-green-light dark:bg-success-green-dark bg-opacity-10 text-success-green-light dark:text-success-green-dark text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Completed
                        </span>
                      )}
                      {moduleStatus === 'in_progress' && (
                        <span className="bg-basketball-orange-light dark:bg-basketball-orange-dark bg-opacity-10 text-basketball-orange-light dark:text-basketball-orange-dark text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                      {moduleStatus === 'not_started' && user && (
                        <span className="bg-neutral-gray-light dark:bg-neutral-gray-dark bg-opacity-10 text-neutral-gray-light dark:text-neutral-gray-dark text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Not Started
                        </span>
                      )}
                    </div>
                    
                    <Link 
                      href={`/modules/m${module.id}`}
                      className="text-basketball-orange-light dark:text-basketball-orange-dark font-semibold inline-flex items-center hover:text-basketball-orange-dark dark:hover:text-basketball-orange-light transition-colors"
                    >
                      {moduleStatus === 'completed' ? 'Review Module' : 'Start Module'}
                      <AllouiIcon name="arrow-right" size="xs" className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* No modules message */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No modules found</h3>
            <p className="text-neutral-gray-light dark:text-neutral-gray-dark">
              No modules match your current filter. Please try a different category.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </MainLayout>
  );
}