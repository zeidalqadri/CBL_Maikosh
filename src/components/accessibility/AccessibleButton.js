import React, { forwardRef } from 'react';
import { ensureMinimumTouchTarget, generateAriaLabel } from '../../utils/accessibility';

/**
 * Accessible Button Component
 * WCAG 2.1 AA Compliant button with proper ARIA support
 */
const AccessibleButton = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  ariaPressed,
  ariaExpanded,
  onClick,
  onKeyDown,
  className = '',
  loadingText = 'Loading...',
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseClasses = 'btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basketball-orange focus-visible:ring-offset-2';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    tertiary: 'bg-transparent text-court-blue hover:bg-court-blue hover:bg-opacity-10 border-2 border-transparent',
    danger: 'bg-team-red text-white hover:bg-red-700 focus:ring-team-red',
    success: 'bg-success-green text-white hover:bg-green-700 focus:ring-success-green'
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'btn-large'
  };
  
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  
  const handleKeyDown = (e) => {
    // Enhanced keyboard support
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
    onKeyDown?.(e);
  };
  
  // Construct proper ARIA label
  const computedAriaLabel = ariaLabel || (typeof children === 'string' ? children : undefined);
  
  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${loading ? 'opacity-75 cursor-not-allowed' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={computedAriaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-busy={loading}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && (
          <span
            className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            aria-hidden="true"
          />
        )}
        {icon && iconPosition === 'left' && !loading && (
          <span aria-hidden="true">{icon}</span>
        )}
        {loading ? (
          <span className="sr-only">{loadingText}</span>
        ) : (
          <span>{children}</span>
        )}
        {icon && iconPosition === 'right' && !loading && (
          <span aria-hidden="true">{icon}</span>
        )}
      </span>
    </button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;