/**
 * Optimized Loading Spinner Component
 * Provides consistent loading states across the application
 */

import React, { memo } from 'react';

const LoadingSpinner = memo(({ 
  size = 'medium', 
  color = 'alloui-gold', 
  message = 'Loading...', 
  className = '',
  showMessage = true,
  inline = false 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorClasses = {
    'alloui-primary': 'border-alloui-primary',
    'alloui-gold': 'border-alloui-gold',
    'basketball-orange': 'border-basketball-orange',
    'court-blue': 'border-court-blue',
    'success-green': 'border-success-green',
    'team-red': 'border-team-red',
    'whistle-silver': 'border-whistle-silver',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  const spinnerClass = `
    ${sizeClasses[size]} 
    border-2 
    ${colorClasses[color]} 
    border-t-transparent 
    rounded-full 
    animate-spin
  `.trim();

  const containerClass = inline 
    ? `inline-flex items-center space-x-2 ${className}` 
    : `flex flex-col items-center justify-center space-y-2 ${className}`;

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className={spinnerClass} aria-hidden="true"></div>
      {showMessage && (
        <span className={`text-sm ${inline ? 'ml-2' : 'mt-2'} text-gray-600`}>
          {message}
        </span>
      )}
      <span className="sr-only">{message}</span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Specialized loading spinners for different contexts
export const QuizLoadingSpinner = memo(() => (
  <LoadingSpinner 
    size="large" 
    color="alloui-gold"
    message="Loading quiz questions..."
    className="py-8"
  />
));

export const ModuleLoadingSpinner = memo(() => (
  <LoadingSpinner 
    size="medium" 
    color="alloui-primary"
    message="Loading module content..."
    className="py-6"
  />
));

export const APILoadingSpinner = memo(() => (
  <LoadingSpinner 
    size="small" 
    color="whistle-silver"
    message="Processing..."
    inline
  />
));

export const FullPageLoadingSpinner = memo(() => (
  <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <LoadingSpinner 
      size="xlarge" 
      color="alloui-gold"
      message="Loading application..."
    />
  </div>
));

// Button loading state
export const ButtonSpinner = memo(({ size = 'small', color = 'white' }) => (
  <LoadingSpinner 
    size={size} 
    color={color}
    showMessage={false}
    inline
    className="mr-2"
  />
));

QuizLoadingSpinner.displayName = 'QuizLoadingSpinner';
ModuleLoadingSpinner.displayName = 'ModuleLoadingSpinner';
APILoadingSpinner.displayName = 'APILoadingSpinner';
FullPageLoadingSpinner.displayName = 'FullPageLoadingSpinner';
ButtonSpinner.displayName = 'ButtonSpinner';

export default LoadingSpinner;