import React, { memo } from 'react';
import { iconDefinitions } from './iconDefinitions';
import { basketballAnimations } from './basketballAnimations';

/**
 * Core AllouiIcon Component
 * Basketball-themed iconography system for the alloui platform
 * Replaces all emoticons and generic icons with branded elements
 */
const AllouiIcon = memo(({
  name,
  size = 'md',
  variant = 'primary',
  animated = false,
  interactive = false,
  className = '',
  ariaLabel,
  ariaHidden = false,
  decorative = false,
  onClick,
  onKeyDown,
  style = {},
  ...props
}) => {
  // Size definitions based on alloui design system
  const sizeMap = {
    xs: { width: 12, height: 12, strokeWidth: 2 },
    sm: { width: 16, height: 16, strokeWidth: 1.5 },
    md: { width: 24, height: 24, strokeWidth: 1.5 },
    lg: { width: 32, height: 32, strokeWidth: 1 },
    xl: { width: 48, height: 48, strokeWidth: 1 }
  };

  // Basketball-inspired color variants
  const variantMap = {
    primary: 'text-alloui-primary', // Navy #031a39
    secondary: 'text-gray-600 dark:text-gray-400',
    gold: 'text-alloui-gold', // Gold #d4b24c
    navy: 'text-alloui-navy',
    basketball: 'text-orange-600', // Basketball orange
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    white: 'text-white',
    court: 'text-green-700', // Court green
    rim: 'text-red-500' // Rim red
  };

  // Basketball-themed animations
  const animationMap = {
    bounce: 'animate-bounce', // Basketball dribble
    spin: 'animate-spin', // Ball rotation
    pulse: 'animate-pulse', // Heartbeat effect
    dribble: 'animate-basketball-dribble', // Custom dribble animation
    swish: 'animate-basketball-swish', // Shot success
    courtSlide: 'animate-court-slide', // Movement animation
    whistleBlow: 'animate-whistle-blow' // Referee whistle
  };

  const sizeConfig = sizeMap[size];
  const colorClass = variantMap[variant] || variantMap.primary;
  
  // Get icon definition
  const iconDef = iconDefinitions[name];
  if (!iconDef) {
    console.warn(`AllouiIcon: Icon "${name}" not found`);
    return null;
  }

  // Build class names
  const baseClasses = [
    'alloui-icon',
    colorClass,
    interactive && 'cursor-pointer hover:scale-110 transition-transform duration-200',
    animated && animationMap[animated],
    className
  ].filter(Boolean).join(' ');

  // Accessibility props
  const accessibilityProps = {
    role: decorative ? 'presentation' : 'img',
    'aria-label': decorative ? undefined : (ariaLabel || iconDef.ariaLabel || `${name} icon`),
    'aria-hidden': decorative || ariaHidden,
    focusable: interactive ? 'true' : 'false',
    tabIndex: interactive && onClick ? 0 : undefined
  };

  // Event handlers for interactive icons
  const handleKeyDown = (e) => {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e);
    }
    onKeyDown?.(e);
  };

  return (
    <svg
      className={baseClasses}
      width={sizeConfig.width}
      height={sizeConfig.height}
      viewBox={iconDef.viewBox || '0 0 24 24'}
      fill="none"
      stroke="currentColor"
      strokeWidth={sizeConfig.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      style={style}
      {...accessibilityProps}
      {...props}
    >
      {!decorative && (
        <title>{ariaLabel || iconDef.ariaLabel || `${name} icon`}</title>
      )}
      {typeof iconDef.path === 'string' ? (
        <path d={iconDef.path} fill={iconDef.fill || 'none'} />
      ) : (
        iconDef.path
      )}
    </svg>
  );
});

AllouiIcon.displayName = 'AllouiIcon';

// Helper component for interactive icons
export const InteractiveAllouiIcon = ({ onActivate, ...props }) => (
  <AllouiIcon
    {...props}
    interactive
    onClick={onActivate}
    className={`${props.className || ''} focus:outline-none focus:ring-2 focus:ring-alloui-gold focus:ring-opacity-50 rounded`}
  />
);

// Helper component for animated basketball icons
export const BasketballIcon = ({ animation = 'dribble', ...props }) => (
  <AllouiIcon
    {...props}
    variant="basketball"
    animated={animation}
    className={`${props.className || ''} basketball-icon`}
  />
);

export default AllouiIcon;