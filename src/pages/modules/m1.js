import { useState } from 'react';
import Head from 'next/head';
import ModuleLayout from '../../layouts/ModuleLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../hooks/useProgress';
import { AllouiIcon } from '../../components/icons';
import { getModuleTabConfig } from '../../utils/moduleIconMapping';
import { ProTip } from '../../components/interactions';

// Import curriculum components
import LearningOutcomes from '../../components/curriculum/LearningOutcomes';
import KeyConcepts from '../../components/curriculum/KeyConcepts';
import PracticalDrills from '../../components/curriculum/PracticalDrills';
import AssessmentQuiz from '../../components/curriculum/AssessmentQuiz';
import ModuleResources from '../../components/curriculum/ModuleResources';

// Import module data
import { moduleData } from '../../data/modules/m1-data';

export default function Module1() {
  const { user } = useAuth();
  const { progress, saveQuizScore, saveAssessmentSubmission } = useProgress(user?.uid, 1);
  const [activeSection, setActiveSection] = useState('overview');
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Handle quiz completion
  const handleQuizComplete = (score, totalQuestions) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Save score to database if user is logged in
    if (user) {
      saveQuizScore(1, 'knowledge-check', percentage);
    }
    
    setQuizCompleted(true);
  };

  // Handle file upload for assessment
  const handleFileUpload = async (event) => {
    // In a real implementation, this would upload to Google Cloud Storage
    // For now, we'll just simulate a successful upload
    if (user) {
      saveAssessmentSubmission(1, 'philosophy', 'https://storage.googleapis.com/example/file.pdf', 'Philosophy submission');
      alert('File uploaded successfully!');
    } else {
      alert('Please log in to submit assessments.');
    }
  };

  return (
    <ModuleLayout moduleNumber={1} moduleName="Introduction to Coaching" theme="leadership">
      <Head>
        <title>Module 1: Introduction to Coaching | alloui by CBL</title>
        <meta name="description" content="Learn the fundamental roles, styles, and philosophies of effective basketball coaching with alloui by CBL." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Module 1: Introduction to Coaching | alloui by CBL" />
        <meta property="og:description" content="Learn the fundamental roles, styles, and philosophies of effective basketball coaching with alloui by CBL." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Module 1: Introduction to Coaching - alloui by CBL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Module 1: Introduction to Coaching | alloui by CBL" />
        <meta name="twitter:description" content="Learn the fundamental roles, styles, and philosophies of effective basketball coaching with alloui by CBL." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="basketball coaching, introduction to coaching, coaching roles, coaching styles, basketball fundamentals, Malaysia, MABA, NSC, Level I certification" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />
      </Head>

      {/* Module Header */}
      <div className="mb-8">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 tracking-wider uppercase">
          01 / INTRODUCTION TO COACHING
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', iconName: 'overview' },
              { id: 'concepts', name: 'Key Concepts', iconName: 'insight' },
              { id: 'drills', name: 'Practical Drills', iconName: 'drill' },
              { id: 'quiz', name: 'Knowledge Check', iconName: 'knowledge-check' },
              { id: 'resources', name: 'Resources', iconName: 'resources' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeSection === tab.id
                    ? 'border-alloui-gold text-alloui-gold'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <AllouiIcon 
                  name={tab.iconName} 
                  size="sm" 
                  variant={activeSection === tab.id ? 'gold' : 'secondary'}
                  className="mr-2"
                />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <>
          <LearningOutcomes outcomes={moduleData.learningOutcomes} />
          
          {/* Module Overview with Visual Elements */}
          <div className="space-y-8 mb-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-alloui-primary to-alloui-court-blue text-white rounded-lg p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4 flex items-center">
                    <AllouiIcon name="whistle" size="lg" className="mr-3 text-alloui-gold" />
                    Welcome to Coaching
                  </h3>
                  <p className="text-lg leading-relaxed mb-4 opacity-90">
                    Your journey to becoming an effective basketball coach starts here. This foundational module 
                    covers the essential roles, styles, and philosophies that define great coaching.
                  </p>
                  <div className="flex items-center text-alloui-gold">
                    <AllouiIcon name="target" size="sm" className="mr-2" />
                    <span className="font-medium">Foundation • Leadership • Growth</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <AllouiIcon name="basketball" size="xl" className="text-alloui-gold/30" />
                </div>
              </div>
            </div>

            {/* Key Learning Areas */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md border border-whistle-silver">
                <div className="text-center">
                  <AllouiIcon name="user" size="lg" className="text-alloui-primary mx-auto mb-3" />
                  <h4 className="font-bold text-alloui-primary mb-2">Multiple Roles</h4>
                  <p className="text-gray-600 text-sm">
                    Teacher, motivator, organizer, and more - discover the many hats you'll wear as a coach.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md border border-whistle-silver">
                <div className="text-center">
                  <AllouiIcon name="strategy" size="lg" className="text-basketball-orange mx-auto mb-3" />
                  <h4 className="font-bold text-alloui-primary mb-2">Coaching Styles</h4>
                  <p className="text-gray-600 text-sm">
                    From authoritarian to collaborative - learn when and how to adapt your approach.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md border border-whistle-silver">
                <div className="text-center">
                  <AllouiIcon name="insight" size="lg" className="text-success-green mx-auto mb-3" />
                  <h4 className="font-bold text-alloui-primary mb-2">Your Philosophy</h4>
                  <p className="text-gray-600 text-sm">
                    Develop your personal coaching philosophy and authentic leadership voice.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Coach's Corner */}
            <ProTip coach="CBL Instructor">
              <p className="mb-3">
                <strong>Great coaches are made, not born.</strong> This module will give you the foundation 
                to begin your journey toward becoming an effective basketball coach.
              </p>
              <p>
                Remember: Every successful coach started exactly where you are now. The key is to remain 
                curious, stay authentic to your values, and never stop learning from your players and experiences.
              </p>
            </ProTip>

            {/* Interactive Learning Path */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-alloui-primary mb-4 flex items-center">
                <AllouiIcon name="growth" size="sm" className="mr-2 text-alloui-gold" />
                Your Learning Journey
              </h4>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { step: 1, title: "Understand Roles", icon: "user", completed: false },
                  { step: 2, title: "Explore Styles", icon: "strategy", completed: false },
                  { step: 3, title: "Develop Philosophy", icon: "insight", completed: false },
                  { step: 4, title: "Apply Knowledge", icon: "trophy", completed: false }
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      item.completed ? 'bg-success-green' : 'bg-gray-300'
                    }`}>
                      <AllouiIcon 
                        name={item.icon} 
                        size="sm" 
                        className={item.completed ? 'text-white' : 'text-gray-600'}
                      />
                    </div>
                    <div className="text-xs text-gray-600 font-medium">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'concepts' && (
        <KeyConcepts concepts={moduleData.keyConcepts} />
      )}

      {activeSection === 'drills' && (
        <PracticalDrills drills={moduleData.practicalDrills} />
      )}

      {activeSection === 'quiz' && (
        <AssessmentQuiz 
          questions={moduleData.assessmentQuestions} 
          onComplete={handleQuizComplete}
        />
      )}

      {activeSection === 'resources' && (
        <ModuleResources 
          resources={moduleData.resources}
          assignments={moduleData.assignments}
        />
      )}

      {/* Progress Tracking */}
      {user && (
        <div className="brand-card mt-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Progress</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-alloui-gold">
                {progress?.sectionsCompleted || 0}/5
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sections Completed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-alloui-gold">
                {progress?.quizScore || 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Quiz Score</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-alloui-gold">
                {progress?.assignmentsSubmitted || 0}/1
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Assignments</div>
            </div>
          </div>
        </div>
      )}

      {/* Next Module Navigation */}
      <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Previous Module</p>
          <p className="text-gray-400 dark:text-gray-500">None - This is the first module</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Next Module</p>
          <a 
            href="/modules/m2" 
            className="btn-alloui mt-2"
          >
            Rules & Player Positions
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </ModuleLayout>
  );
}