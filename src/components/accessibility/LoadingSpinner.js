import React from 'react';
import { respectsReducedMotion } from '../../utils/accessibility';

/**
 * Accessible Loading Spinner Component
 * Respects prefers-reduced-motion and provides proper screen reader announcements
 */
const LoadingSpinner = ({ 
  size = 'medium',
  text = 'Loading...',
  variant = 'primary',
  className = '',
  showText = false,
  inline = false
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6', 
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12'
  };
  
  const variants = {
    primary: 'border-basketball-orange border-t-transparent',
    secondary: 'border-court-blue border-t-transparent',
    neutral: 'border-neutral-gray border-t-transparent',
    white: 'border-white border-t-transparent'
  };
  
  const reduceMotion = respectsReducedMotion();
  
  const spinnerClasses = `
    ${sizes[size]}
    border-2
    ${variants[variant]}
    rounded-full
    ${reduceMotion ? '' : 'animate-spin'}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  const containerClasses = inline 
    ? 'inline-flex items-center gap-2'
    : 'flex flex-col items-center justify-center gap-2';
  
  return (
    <div 
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div 
        className={spinnerClasses}
        aria-hidden="true"
      />
      {showText && (
        <span className="text-sm text-neutral-gray">
          {text}
        </span>
      )}
      <span className="sr-only">{text}</span>
    </div>
  );
};

export default LoadingSpinner;