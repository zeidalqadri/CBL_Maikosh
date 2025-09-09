import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNavigation } from '../../contexts/NavigationContext';
import BrandLogo from '../BrandLogo';
import { AllouiIcon, ArrowRightIcon } from '../icons';

// Basketball-themed breadcrumb component
export default function BreadcrumbNavigation({ className = '', showProgress = false }) {
  const { breadcrumbs, currentModule, currentProgress, getBasketballTheme } = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  // Animate breadcrumbs on load
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [breadcrumbs]);

  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }

  const basketballTheme = getBasketballTheme();

  return (
    <nav 
      className={`
        breadcrumb-navigation
        ${className}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        transition-all duration-300 ease-out
      `}
      aria-label="Breadcrumb navigation"
    >
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isActive = isLast;

          return (
            <div key={crumb.path} className="flex items-center space-x-2">
              {/* Breadcrumb Item */}
              <div className={`
                breadcrumb-item
                ${isActive ? 'breadcrumb-active' : 'breadcrumb-inactive'}
                flex items-center space-x-1
                transition-all duration-200
              `}>
                {/* alloui Logo as breadcrumb icon */}
                <div className={`
                  breadcrumb-icon w-4 h-4
                  ${isActive 
                    ? 'filter drop-shadow-sm' 
                    : 'opacity-70 hover:opacity-100'
                  }
                  transition-all duration-200
                `}>
                  <BrandLogo 
                    size="mini" 
                    variant={isActive ? 'gold' : 'navy'} 
                  />
                </div>
                
                {/* Breadcrumb Link */}
                {isLast ? (
                  <div className="breadcrumb-text">
                    <span className={`
                      font-medium text-alloui-gold
                      ${basketballTheme === 'certification' ? 'animate-pulse' : ''}
                    `}>
                      {crumb.title}
                    </span>
                    {crumb.subtitle && (
                      <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {crumb.subtitle}
                      </span>
                    )}
                  </div>
                ) : (
                  <Link 
                    href={crumb.path}
                    className={`
                      breadcrumb-link
                      text-gray-600 dark:text-gray-300
                      hover:text-alloui-gold hover:underline
                      focus:text-alloui-gold focus:outline-none
                      transition-colors duration-200
                      ${crumb.subtitle ? 'flex flex-col' : ''}
                    `}
                  >
                    <span>{crumb.title}</span>
                    {crumb.subtitle && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {crumb.subtitle}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              {/* Basketball-themed Separator */}
              {!isLast && (
                <div className="breadcrumb-separator">
                  <ArrowRightIcon 
                    size="sm"
                    variant="secondary"
                    className={`
                      ${basketballTheme === 'offense' ? 'animate-bounce' : ''}
                      transition-transform duration-200 hover:scale-110
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Indicator for Module Pages */}
      {showProgress && currentModule && currentProgress > 0 && (
        <div className="mt-3">
          <ModuleProgressIndicator 
            progress={currentProgress}
            moduleNumber={currentModule}
            theme={basketballTheme}
          />
        </div>
      )}
    </nav>
  );
}

// Module Progress Indicator Component
function ModuleProgressIndicator({ progress, moduleNumber, theme }) {
  const courtPositions = {
    1: 'backcourt', 2: 'backcourt', 3: 'backcourt',
    4: 'midcourt', 5: 'midcourt', 6: 'midcourt',
    7: 'frontcourt', 8: 'frontcourt', 9: 'frontcourt',
    10: 'key-area', 11: 'key-area', 12: 'key-area'
  };

  const courtPosition = courtPositions[moduleNumber] || 'backcourt';
  
  const getProgressColor = () => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getCourtLogoVariant = () => {
    const positions = {
      'backcourt': 'default',
      'midcourt': 'basketball',
      'frontcourt': 'gold',
      'key-area': 'navy'
    };
    return positions[courtPosition] || 'default';
  };

  return (
    <div className="module-progress-indicator">
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
        <span className="flex items-center space-x-1">
          <div className="w-4 h-4">
            <BrandLogo size="mini" variant={getCourtLogoVariant()} />
          </div>
          <span>Module {moduleNumber} Progress</span>
        </span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      
      {/* Basketball Court Progress Bar */}
      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Basketball Court Lines Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>
        
        {/* Progress Fill */}
        <div 
          className={`
            h-full rounded-full transition-all duration-500 ease-out
            ${getProgressColor()}
            ${theme === 'certification' ? 'animate-pulse' : ''}
          `}
          style={{ width: `${progress}%` }}
        >
          {/* Basketball Animation for Active Progress */}
          {progress > 0 && progress < 100 && (
            <div className="absolute right-0 top-0 h-full w-2 bg-white rounded-full opacity-60 animate-pulse"></div>
          )}
        </div>
        
        {/* Court Position Markers */}
        <div className="absolute inset-0 flex justify-between items-center px-1">
          <div className="w-px h-full bg-white opacity-20"></div>
          <div className="w-px h-full bg-white opacity-20"></div>
          <div className="w-px h-full bg-white opacity-20"></div>
        </div>
      </div>
    </div>
  );
}

// Export additional breadcrumb utilities
export function createBreadcrumb(title, path, logoVariant = 'default', subtitle = null) {
  return { title, path, logoVariant, subtitle };
}

export function createModuleBreadcrumb(moduleNumber, moduleTitle) {
  const courtLogoVariants = {
    'backcourt': 'basketball',
    'midcourt': 'gold',
    'frontcourt': 'navy',
    'key-area': 'primary'
  };

  const courtPositions = {
    1: 'backcourt', 2: 'backcourt', 3: 'backcourt',
    4: 'midcourt', 5: 'midcourt', 6: 'midcourt',
    7: 'frontcourt', 8: 'frontcourt', 9: 'frontcourt',
    10: 'key-area', 11: 'key-area', 12: 'key-area'
  };

  const courtPosition = courtPositions[moduleNumber] || 'backcourt';
  
  return {
    title: `Module ${moduleNumber}`,
    path: `/modules/m${moduleNumber}`,
    logoVariant: courtLogoVariants[courtPosition],
    subtitle: moduleTitle
  };
}