import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useNavigation } from '../../contexts/NavigationContext';
import BrandLogo from '../BrandLogo';
import { BasketballButton } from '../interactions/BasketballMicroInteractions';
import BreadcrumbNavigation from './BreadcrumbNavigation';

export default function BasketballErrorPage({ 
  errorCode = 404,
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist",
  showNavigation = true
}) {
  const router = useRouter();
  const { navigateToModule, resetNavigation, canGoBack, goBack, getBasketballTheme } = useNavigation();
  const [animationPhase, setAnimationPhase] = useState(0);

  const basketballTheme = getBasketballTheme();

  // Animate elements on load
  useEffect(() => {
    const phases = [0, 1, 2, 3];
    let currentPhase = 0;
    
    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % phases.length;
      setAnimationPhase(currentPhase);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getErrorMetaphor = (code) => {
    const metaphors = {
      404: {
        title: "Shot Clock Violation!",
        subtitle: "The play you called doesn't exist",
        description: "Don't worry, even the best coaches call plays that aren't in the book sometimes. Let's get back to fundamentals.",
        action: "Back to the Huddle"
      },
      403: {
        title: "Technical Foul!",
        subtitle: "You don't have permission to access this content",
        description: "Looks like you're trying to access advanced plays before mastering the basics. Complete the prerequisite modules first.",
        action: "Return to Training"
      },
      500: {
        title: "Equipment Timeout!",
        subtitle: "Something went wrong with our system",
        description: "Our technical team is working on getting everything back on the court. Try again in a few minutes.",
        action: "Try Again"
      },
      503: {
        title: "Game Postponed!",
        subtitle: "The system is temporarily unavailable",
        description: "We're doing some maintenance to make your coaching experience even better. Please check back soon.",
        action: "Check Back Later"
      }
    };

    return metaphors[code] || metaphors[404];
  };

  const errorInfo = getErrorMetaphor(errorCode);

  const handleNavigation = (action) => {
    switch (action) {
      case 'home':
        router.push('/');
        break;
      case 'modules':
        router.push('/modules');
        break;
      case 'back':
        if (canGoBack) {
          goBack();
        } else {
          router.push('/');
        }
        break;
      case 'reset':
        resetNavigation();
        break;
      default:
        router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Breadcrumb Navigation */}
      {showNavigation && (
        <div className="container mx-auto px-4 py-4">
          <BreadcrumbNavigation />
        </div>
      )}

      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Animated Basketball Court Error Scene */}
        <div className="relative mb-12">
          {/* Court Background */}
          <div className="w-80 h-48 bg-gradient-to-b from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 rounded-lg border-4 border-white dark:border-gray-700 relative overflow-hidden">
            {/* Court Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 320 192">
              {/* Center circle */}
              <circle cx="160" cy="96" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
              {/* Free throw lines */}
              <rect x="40" y="66" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" />
              <rect x="220" y="66" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" />
              {/* Three point arcs */}
              <path d="M 100 10 Q 160 60 100 182" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 220 10 Q 160 60 220 182" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>

            {/* Animated Error Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Error Code Display */}
              <div className={`
                text-8xl font-bold text-[#031a39] dark:text-white opacity-20
                ${animationPhase === 0 ? 'animate-bounce' : ''}
                transition-all duration-500
              `}>
                {errorCode}
              </div>

              {/* Confused Basketball (alloui Logo) */}
              <div className={`
                absolute top-4 left-4
                ${animationPhase === 1 ? 'animate-spin' : ''}
                ${animationPhase === 2 ? 'animate-pulse' : ''}
                ${animationPhase === 3 ? 'animate-bounce' : ''}
                transition-all duration-500
              `}>
                <BrandLogo size="large" variant="basketball" />
              </div>

              {/* Whistles (Error Indicators) */}
              <div className={`
                absolute top-8 right-8 text-2xl
                ${animationPhase === 2 ? 'animate-pulse' : 'opacity-50'}
              `}>
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* alloui Logo Display */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className={`
              p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border-4 border-[#d4b24c]
              ${animationPhase === 3 ? 'scale-110' : 'scale-100'}
              transition-transform duration-300
            `}>
              <BrandLogo size="medium" variant="gold" />
            </div>
          </div>
        </div>

        {/* Error Information */}
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-[#031a39] dark:text-white mb-4">
            {errorInfo.title}
          </h1>
          
          <h2 className="text-xl text-[#d4b24c] font-semibold mb-6">
            {errorInfo.subtitle}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            {errorInfo.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <BasketballButton
              variant="primary"
              size="large"
              onClick={() => handleNavigation('home')}
            >
              Go Home
            </BasketballButton>

            <BasketballButton
              variant="secondary"
              size="large"
              onClick={() => handleNavigation('modules')}
            >
              Browse Modules
            </BasketballButton>

            {canGoBack && (
              <BasketballButton
                variant="outline"
                size="large"
                onClick={() => handleNavigation('back')}
              >
                Go Back
              </BasketballButton>
            )}
          </div>

          {/* Quick Navigation Links */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
              QUICK NAVIGATION
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigateToModule(1)}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#d4b24c] hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <BrandLogo size="mini" variant="default" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Fundamentals</span>
                </div>
              </button>

              <button
                onClick={() => navigateToModule(6)}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#d4b24c] hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <BrandLogo size="mini" variant="basketball" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Offense</span>
                </div>
              </button>

              <button
                onClick={() => navigateToModule(9)}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#d4b24c] hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <BrandLogo size="mini" variant="gold" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Advanced</span>
                </div>
              </button>

              <button
                onClick={() => navigateToModule(12)}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#d4b24c] hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <BrandLogo size="mini" variant="navy" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Certification</span>
                </div>
              </button>
            </div>
          </div>

          {/* Emergency Reset Option */}
          {errorCode === 500 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Still having issues?
              </p>
              <BasketballButton
                variant="ghost"
                size="small"
                onClick={() => handleNavigation('reset')}
              >
                Reset Navigation
              </BasketballButton>
            </div>
          )}
        </div>

        {/* Basketball-themed Footer */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <BrandLogo size="mini" variant="default" />
            <span>alloui Basketball Coaching Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Specific Error Page Components
export function NotFoundPage() {
  return <BasketballErrorPage errorCode={404} />;
}

export function ForbiddenPage() {
  return <BasketballErrorPage errorCode={403} />;
}

export function ServerErrorPage() {
  return <BasketballErrorPage errorCode={500} />;
}

export function ServiceUnavailablePage() {
  return <BasketballErrorPage errorCode={503} />;
}