import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import MainLayout from '../../layouts/MainLayout';
import ScenarioLibrary from '../../components/scenarios/ScenarioLibrary';
import VideoScenarioPlayer from '../../components/scenarios/VideoScenarioPlayer';
import Footer from '../../components/Footer';
import { AllouiIcon } from '../../components/icons';

export default function ScenariosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [completedScenarios, setCompletedScenarios] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/scenarios');
    }
  }, [user, loading, router]);

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleScenarioComplete = (result) => {
    // Save completion result
    const completion = {
      scenarioId: selectedScenario.id,
      score: result.score,
      maxScore: result.maxScore,
      percentage: Math.round((result.score / result.maxScore) * 100),
      completedAt: result.completedAt
    };

    setCompletedScenarios(prev => [...prev, completion]);
    
    // In a real app, this would save to the database
    if (user) {
      // saveScenarioCompletion(user.uid, completion);
    }

    // Show completion screen for 3 seconds, then return to library
    setTimeout(() => {
      setSelectedScenario(null);
    }, 3000);
  };

  const handleBackToLibrary = () => {
    setSelectedScenario(null);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-alloui-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading video scenarios...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <MainLayout>
      <Head>
        <title>Video Scenario Challenges | alloui by CBL</title>
        <meta name="description" content="Practice real coaching situations through interactive video scenarios. Make decisions, receive feedback, and build your coaching confidence." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Video Scenario Challenges | alloui by CBL" />
        <meta property="og:description" content="Practice real coaching situations through interactive video scenarios and build your coaching confidence." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Video Scenario Challenges - alloui by CBL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Video Scenario Challenges | alloui by CBL" />
        <meta name="twitter:description" content="Practice real coaching situations through interactive video scenarios." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="basketball coaching scenarios, coaching simulation, video training, decision making, coaching practice, basketball training, Malaysia basketball" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          
          {!selectedScenario ? (
            <>
              {/* Progress Overview */}
              {completedScenarios.length > 0 && (
                <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-alloui-primary mb-4 flex items-center">
                    <AllouiIcon name="trophy" size="sm" className="mr-2 text-alloui-gold" />
                    Your Progress
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-alloui-gold">
                        {completedScenarios.length}
                      </div>
                      <div className="text-sm text-gray-600">Scenarios Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-alloui-gold">
                        {completedScenarios.length > 0 
                          ? Math.round(completedScenarios.reduce((acc, c) => acc + c.percentage, 0) / completedScenarios.length)
                          : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-alloui-gold">
                        {new Set(completedScenarios.map(c => c.scenarioId.split('-')[0])).size}
                      </div>
                      <div className="text-sm text-gray-600">Categories Explored</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario Library */}
              <ScenarioLibrary onScenarioSelect={handleScenarioSelect} />
            </>
          ) : (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={handleBackToLibrary}
                className="flex items-center text-alloui-primary hover:text-alloui-gold transition-colors"
              >
                <AllouiIcon name="arrow-left" size="sm" className="mr-2" />
                Back to Scenario Library
              </button>
              
              {/* Video Scenario Player */}
              <VideoScenarioPlayer
                scenario={selectedScenario}
                onComplete={handleScenarioComplete}
              />
            </div>
          )}

        </div>
      </div>
      
      <Footer />
    </MainLayout>
  );
}