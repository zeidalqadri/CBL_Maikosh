import React from 'react';
import { respectsReducedMotion } from '../../utils/accessibility';

/**
 * Accessible Skeleton Loader Component
 * Provides loading placeholders that respect reduced motion preferences
 */
const SkeletonLoader = ({
  variant = 'text',
  width = '100%',
  height,
  rows = 1,
  className = '',
  ariaLabel = 'Content loading'
}) => {
  const reduceMotion = respectsReducedMotion();
  
  const baseClasses = `
    bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
    ${reduceMotion ? '' : 'animate-pulse bg-[length:200%_100%]'}
    rounded
  `;
  
  const variants = {
    text: 'h-4',
    title: 'h-6',
    subtitle: 'h-5',
    button: 'h-10',
    avatar: 'w-10 h-10 rounded-full',
    card: 'h-32',
    image: 'h-48',
    rectangle: '',
    circle: 'rounded-full aspect-square'
  };
  
  const skeletonHeight = height || variants[variant];
  
  if (variant === 'text' && rows > 1) {
    return (
      <div 
        className="space-y-2"
        role="status"
        aria-label={ariaLabel}
      >
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${skeletonHeight} ${className}`}
            style={{ 
              width: index === rows - 1 ? '75%' : width 
            }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
  
  return (
    <div
      className={`${baseClasses} ${skeletonHeight} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

// Pre-built skeleton layouts for common use cases
export const ModuleCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-whistle-silver p-6">
    <div className="flex items-start space-x-4 mb-4">
      <SkeletonLoader variant="avatar" />
      <div className="flex-1">
        <SkeletonLoader variant="title" width="60%" className="mb-2" />
        <SkeletonLoader variant="text" width="40%" />
      </div>
    </div>
    <SkeletonLoader variant="text" rows={3} className="mb-4" />
    <div className="flex justify-between items-center">
      <SkeletonLoader variant="text" width="30%" />
      <SkeletonLoader variant="button" width="25%" />
    </div>
  </div>
);

export const QuizQuestionSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <SkeletonLoader variant="subtitle" width="80%" className="mb-6" />
    <div className="space-y-3">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <SkeletonLoader variant="circle" width="20px" height="20px" />
          <SkeletonLoader variant="text" width="70%" />
        </div>
      ))}
    </div>
  </div>
);

export const NavigationSkeleton = () => (
  <nav className="bg-white shadow-sm">
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <SkeletonLoader variant="text" width="150px" />
        <div className="hidden md:flex items-center space-x-8">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonLoader key={index} variant="text" width="80px" />
          ))}
        </div>
        <SkeletonLoader variant="button" width="100px" />
      </div>
    </div>
  </nav>
);

export default SkeletonLoader;