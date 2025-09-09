import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../hooks/useProgress';
import BrandLogo from '../components/BrandLogo';

export default function ModuleLayout({ 
  children, 
  moduleNumber, 
  moduleName, 
  theme = 'leadership' 
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { progress, updateProgress } = useProgress(user?.uid, moduleNumber);
  
  // Sections for the module
  const sections = [
    { id: 'learning-objectives', name: 'Learning Objectives' },
    { id: 'core-content', name: 'Core Content' },
    { id: 'interactive-elements', name: 'Interactive Elements' },
    { id: 'assessment-tools', name: 'Assessment' },
    { id: 'instructor-guidelines', name: 'Instructor Guidelines' }
  ];
  
  // Calculate progress percentage
  const progressPercentage = progress ? progress.completedSections / sections.length * 100 : 0;
  
  // Check if a section is active
  const isActive = (sectionId) => {
    return router.asPath.includes(`#${sectionId}`) || 
           (!router.asPath.includes('#') && sectionId === 'learning-objectives');
  };
  
  // Check if a section is completed
  const isCompleted = (sectionId) => {
    return progress?.completedSections?.includes(sectionId) || false;
  };
  
  // Mark section as viewed when scrolled to
  useEffect(() => {
    if (!user) return;
    
    const handleScroll = () => {
      const currentSection = sections.find(section => {
        const element = document.getElementById(section.id);
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      
      if (currentSection && !isCompleted(currentSection.id)) {
        updateProgress(moduleNumber, currentSection.id);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, moduleNumber, sections, progress]);
  
  return (
    <>
      <Head>
        <title>{`Module ${moduleNumber}: ${moduleName} | CBL_alloui`}</title>
      </Head>
      
      <div className={`module-${moduleNumber}-theme min-h-screen`}>
        {/* Module Hero */}
        <div className="bg-gradient-to-r from-[var(--module-primary)] to-[var(--module-primary)] bg-opacity-90 text-white py-12 relative">
          {/* Logo Home Button */}
          <div className="absolute top-4 left-4 z-50">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-opacity-100 transition-all duration-200">
              <BrandLogo size="small" variant="dark" showText={false} />
            </div>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start">
              <span className="inline-block bg-[var(--module-secondary)] text-[var(--module-primary)] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Module {moduleNumber}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{moduleName}</h1>
              <p className="text-lg md:text-xl text-white text-opacity-90 max-w-2xl">
                Master the essential concepts and skills related to {moduleName.toLowerCase()}.
              </p>
            </div>
          </div>
        </div>
        
        {/* Module Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-8">
                {/* Progress Circle */}
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative h-24 w-24">
                    <svg className="h-24 w-24" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#E6E6E6"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="var(--module-primary)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * progressPercentage) / 100}
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="55"
                        textAnchor="middle"
                        fontSize="20"
                        fontWeight="bold"
                        fill="var(--module-primary)"
                      >
                        {Math.round(progressPercentage)}%
                      </text>
                    </svg>
                  </div>
                  <p className="mt-2 text-sm text-neutral-gray dark:text-gray-400">Module Progress</p>
                </div>
                
                {/* Navigation */}
                <nav className="mb-8">
                  <ul className="space-y-1">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <Link
                          href={`#${section.id}`}
                          className={`
                            flex items-center px-4 py-2 rounded-md transition-colors
                            ${isActive(section.id) 
                              ? 'bg-[var(--module-accent)] text-[var(--module-primary)] font-semibold' 
                              : 'text-coach-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                          `}
                        >
                          <span className={`
                            w-5 h-5 mr-3 rounded-full flex items-center justify-center text-xs
                            ${isCompleted(section.id) 
                              ? 'bg-success-green text-white' 
                              : isActive(section.id)
                                ? 'bg-[var(--module-primary)] text-white'
                                : 'border border-neutral-gray text-neutral-gray'}
                          `}>
                            {isCompleted(section.id) ? '✓' : ''}
                          </span>
                          {section.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                {/* Resources */}
                <div className="border-t border-whistle-silver pt-6">
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="flex items-center text-sm text-coach-black hover:text-basketball-orange">
                        <span className="w-6 h-6 bg-whistle-silver rounded flex items-center justify-center mr-2 text-xs">
                          PDF
                        </span>
                        Module {moduleNumber} Guide
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center text-sm text-coach-black hover:text-basketball-orange">
                        <span className="w-6 h-6 bg-whistle-silver rounded flex items-center justify-center mr-2 text-xs">
                          VID
                        </span>
                        Instructional Video
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center text-sm text-coach-black hover:text-basketball-orange">
                        <span className="w-6 h-6 bg-whistle-silver rounded flex items-center justify-center mr-2 text-xs">
                          DOC
                        </span>
                        Practice Plan Template
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
            
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden mb-6">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-2 border border-whistle-silver rounded-md bg-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="font-medium">Module Navigation</span>
                <svg
                  className={`h-5 w-5 transform ${sidebarOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {/* Mobile Sidebar */}
              {sidebarOpen && (
                <div className="mt-2 border border-whistle-silver rounded-md bg-white p-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative h-16 w-16 mr-4">
                      <svg className="h-16 w-16" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#E6E6E6"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="var(--module-primary)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * progressPercentage) / 100}
                          transform="rotate(-90 50 50)"
                        />
                        <text
                          x="50"
                          y="55"
                          textAnchor="middle"
                          fontSize="20"
                          fontWeight="bold"
                          fill="var(--module-primary)"
                        >
                          {Math.round(progressPercentage)}%
                        </text>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Module Progress</p>
                      <p className="text-sm text-neutral-gray">
                        {Math.round(progressPercentage)}% complete
                      </p>
                    </div>
                  </div>
                  
                  <nav>
                    <ul className="space-y-1">
                      {sections.map((section) => (
                        <li key={section.id}>
                          <Link
                            href={`#${section.id}`}
                            className={`
                              flex items-center px-4 py-2 rounded-md transition-colors
                              ${isActive(section.id) 
                                ? 'bg-[var(--module-accent)] text-[var(--module-primary)] font-semibold' 
                                : 'text-coach-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                            `}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className={`
                              w-5 h-5 mr-3 rounded-full flex items-center justify-center text-xs
                              ${isCompleted(section.id) 
                                ? 'bg-success-green text-white' 
                                : isActive(section.id)
                                  ? 'bg-[var(--module-primary)] text-white'
                                  : 'border border-neutral-gray text-neutral-gray'}
                            `}>
                              {isCompleted(section.id) ? '✓' : ''}
                            </span>
                            {section.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
            
            {/* Main Content */}
            <main className="flex-grow">
              {children}
              
              {/* Module Navigation */}
              <div className="mt-12 pt-8 border-t border-whistle-silver flex justify-between">
                {moduleNumber > 1 ? (
                  <Link href={`/modules/m${moduleNumber - 1}`} className="btn btn-secondary">
                    ← Previous Module
                  </Link>
                ) : (
                  <div></div>
                )}
                
                {moduleNumber < 12 ? (
                  <Link href={`/modules/m${moduleNumber + 1}`} className="btn btn-primary">
                    Next Module →
                  </Link>
                ) : (
                  <Link href="/modules/completion" className="btn btn-primary">
                    Complete Course →
                  </Link>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}