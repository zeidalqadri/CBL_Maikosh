import { useState } from 'react';
import Head from 'next/head';
import ModuleLayout from '../../layouts/ModuleLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../hooks/useProgress';
import { AllouiIcon } from '../../components/icons';
// Import curriculum components
import LearningOutcomes from '../../components/curriculum/LearningOutcomes';
import KeyConcepts from '../../components/curriculum/KeyConcepts';
import PracticalDrills from '../../components/curriculum/PracticalDrills';
import AssessmentQuiz from '../../components/curriculum/AssessmentQuiz';
import ModuleResources from '../../components/curriculum/ModuleResources';

// Import module data
import { moduleData } from '../../data/modules/m12-data';

export default function Module12() {
  const { user } = useAuth();
  const { progress, saveQuizScore, saveAssessmentSubmission } = useProgress(user?.uid, 12);
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
    <ModuleLayout moduleNumber={12} moduleName="Risk Management & First Aid" theme="safety">
      <Head>
        <title>Module 12: Risk Management & First Aid | alloui by CBL</title>
        <meta name="description" content="Understand the scientific principles behind athletic performance and injury prevention with alloui by CBL." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Module 12: Risk Management & First Aid | alloui by CBL" />
        <meta property="og:description" content="Understand the scientific principles behind athletic performance and injury prevention with alloui by CBL." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Module 12: Risk Management & First Aid - alloui by CBL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Module 12: Risk Management & First Aid | alloui by CBL" />
        <meta name="twitter:description" content="Understand the scientific principles behind athletic performance and injury prevention with alloui by CBL." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="risk management, first aid, sports safety, injury prevention, basketball safety, coaching safety, Malaysia, MABA, NSC, Level I certification" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />
      </Head>

      {/* Module Header */}
      <div className="mb-8">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 tracking-wider uppercase">
          12 / RISK MANAGEMENT & FIRST AID
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: 'overview' },
              { id: 'concepts', name: 'Key Concepts', icon: 'insight' },
              { id: 'drills', name: 'Practical Drills', icon: 'basketball' },
              { id: 'quiz', name: 'Knowledge Check', icon: 'knowledge-check' },
              { id: 'resources', name: 'Resources', icon: 'resources' }
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
                <AllouiIcon name={tab.icon} size="sm" variant={activeSection === tab.id ? "gold" : "secondary"} className="mr-2" />
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
          
          {/* Module Overview */}
          <div className="brand-card mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Module Overview</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Welcome to Module 12: Risk Management & First Aid! This module will teach you essential 
              safety protocols, injury prevention strategies, and basic first aid techniques crucial 
              for basketball coaching.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Understand how to create safe training environments, identify potential risks, and respond 
              appropriately to injuries. This knowledge helps coaches protect players and maintain 
              effective, safe training programs.
            </p>
            <div className="bg-alloui-gold bg-opacity-10 border-l-4 border-alloui-gold p-4 rounded">
              <p className="text-alloui-primary dark:text-alloui-gold">
                <strong>Safety Focus:</strong> Effective risk management and first aid knowledge are 
                essential skills for responsible coaching and player protection.
              </p>
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
          <a 
              href="/modules/m11" 
              className="btn-alloui mt-2"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Training Design & Planning
            </a>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Next Module</p>
          <p className="text-gray-400">None - This is the final module</p>
        </div>
      </div>
    </ModuleLayout>
  );
}