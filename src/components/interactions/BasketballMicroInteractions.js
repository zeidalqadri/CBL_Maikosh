import { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import BrandLogo from '../BrandLogo';

// Interactive Basketball Button Component
export default function BasketballButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  basketball = true,
  disabled = false,
  loading = false,
  ...props 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [ripples, setRipples] = useState([]);
  const { getBasketballTheme } = useNavigation();

  const theme = getBasketballTheme();

  // Handle click with basketball bounce effect
  const handleClick = (event) => {
    if (disabled || loading) return;

    setIsClicked(true);
    
    // Create ripple effect
    if (basketball) {
      createRipple(event);
    }

    // Basketball bounce animation
    setTimeout(() => setIsClicked(false), 300);
    
    if (onClick) {
      onClick(event);
    }
  };

  // Create ripple effect on click
  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
    xlarge: 'px-8 py-4 text-xl'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#d4b24c] to-[#f4d47c]
      hover:from-[#f4d47c] hover:to-[#d4b24c]
      text-[#031a39] font-semibold
      border-2 border-[#d4b24c]
      shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-[#031a39] hover:bg-[#0a2547]
      text-[#d4b24c] font-medium
      border-2 border-[#031a39] hover:border-[#0a2547]
    `,
    outline: `
      bg-transparent hover:bg-[#d4b24c]/10
      text-[#d4b24c] border-2 border-[#d4b24c]
      hover:text-[#031a39] hover:bg-[#d4b24c]
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800
      text-gray-700 dark:text-gray-200
      border-2 border-transparent
    `
  };

  return (
    <button
      className={`
        alloui-button relative overflow-hidden
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isClicked ? 'animate-bounce scale-95' : ''}
        ${isHovered ? 'scale-105' : 'scale-100'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${loading ? 'animate-pulse' : ''}
        rounded-lg transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-[#d4b24c] focus:ring-opacity-50
        active:scale-95
        ${theme === 'offense' ? 'hover:animate-pulse' : ''}
        ${theme === 'defense' ? 'hover:shadow-2xl' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {/* Ripple Effects */}
      {basketball && ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white opacity-30 rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {/* alloui Logo Hover Effect */}
      {basketball && isHovered && (
        <div className="absolute -top-1 -right-1 w-4 h-4">
          <BrandLogo size="mini" variant="gold" />
        </div>
      )}

      {/* Button Content */}
      <div className={`
        relative z-10 flex items-center justify-center space-x-2
        ${loading ? 'opacity-0' : 'opacity-100'}
        transition-opacity duration-200
      `}>
        {children}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
}

// Interactive Navigation Card
function BasketballNavCard({ 
  title, 
  subtitle, 
  logoVariant = 'default', 
  onClick, 
  disabled = false,
  completed = false,
  locked = false,
  progress = 0 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={`
        alloui-nav-card group relative
        ${disabled || locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${isHovered ? 'scale-105 -translate-y-1' : 'scale-100'}
        ${isPressed ? 'scale-95' : ''}
        transition-all duration-300 ease-out
      `}
      onMouseEnter={() => !disabled && !locked && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => !disabled && !locked && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={() => !disabled && !locked && onClick && onClick()}
    >
      {/* Card Background */}
      <div className={`
        relative p-6 rounded-xl border-2
        ${completed 
          ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-400' 
          : locked
          ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-[#d4b24c]'
        }
        shadow-lg hover:shadow-xl
        transition-all duration-300
      `}>
        {/* Hover Glow Effect */}
        {isHovered && !disabled && !locked && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#d4b24c]/10 to-[#f4d47c]/10 rounded-xl"></div>
        )}

        {/* Lock Overlay */}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-xl">
            <div className="text-2xl text-gray-400">LOCKED</div>
          </div>
        )}

        {/* Card Content */}
        <div className="relative z-10">
          {/* Logo and Status */}
          <div className="flex items-start justify-between mb-4">
            <div className={`
              ${isHovered ? 'animate-bounce' : ''}
              transition-transform duration-200
            `}>
              <BrandLogo size="small" variant={logoVariant} />
            </div>
            
            {/* Status Indicators */}
            <div className="flex space-x-1">
              {completed && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="mb-4">
            <h3 className={`
              text-lg font-semibold text-gray-900 dark:text-white
              ${isHovered ? 'text-[#d4b24c]' : ''}
              transition-colors duration-200
            `}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`
                    h-2 rounded-full transition-all duration-500 ease-out
                    ${completed ? 'bg-green-500' : 'bg-[#d4b24c]'}
                    ${isHovered ? 'animate-pulse' : ''}
                  `}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Hover Arrow */}
        {isHovered && !disabled && !locked && (
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <svg 
              className="w-6 h-6 text-[#d4b24c] animate-bounce" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// Hover Sound Effect Hook
function useBasketballSounds(enabled = true) {
  const playBounce = () => {
    if (!enabled) return;
    // In a real implementation, you would play actual sound files
    console.log('Basketball bounce sound');
  };

  const playSwish = () => {
    if (!enabled) return;
    console.log('Basketball swish sound');
  };

  const playWhistle = () => {
    if (!enabled) return;
    console.log('Referee whistle sound');
  };

  const playCheer = () => {
    if (!enabled) return;
    console.log('Crowd cheer sound');
  };

  return {
    playBounce,
    playSwish,
    playWhistle,
    playCheer
  };
}

// Interactive Basketball Icon using alloui design
function InteractiveBasketballIcon({ 
  size = 'medium', 
  animated = true,
  clickable = true,
  onBounce 
}) {
  const [isBouncing, setIsBouncing] = useState(false);
  const { playBounce } = useBasketballSounds();

  const handleClick = () => {
    if (!clickable) return;
    
    setIsBouncing(true);
    playBounce();
    
    if (onBounce) onBounce();
    
    setTimeout(() => setIsBouncing(false), 600);
  };

  return (
    <div 
      className={`
        ${clickable ? 'cursor-pointer' : ''}
        ${isBouncing ? 'animate-bounce' : ''}
        ${animated ? 'hover:scale-110' : ''}
        transition-transform duration-200 ease-out
        flex items-center justify-center
      `}
      onClick={handleClick}
    >
      <BrandLogo 
        size={size} 
        variant="basketball" 
        className={`
          ${animated ? 'hover:shadow-xl' : ''}
          transition-shadow duration-200
        `}
      />
    </div>
  );
}

// alloui-themed Input Field
function BasketballInput({ 
  label, 
  type = 'text', 
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="alloui-input-group">
      {label && (
        <label className={`
          block text-sm font-medium mb-2
          ${error ? 'text-red-600 dark:text-red-400' : ''}
          ${success ? 'text-green-600 dark:text-green-400' : ''}
          text-gray-700 dark:text-gray-300
          transition-colors duration-200
        `}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
              : success
              ? 'border-green-400 focus:border-green-500 focus:ring-green-500/20'
              : 'border-gray-300 dark:border-gray-600 focus:border-[#d4b24c] focus:ring-[#d4b24c]/20'
            }
            ${disabled 
              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' 
              : 'bg-white dark:bg-gray-900'
            }
            focus:outline-none focus:ring-4
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            ${isFocused ? 'scale-105' : 'scale-100'}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* alloui Logo Focus Indicator */}
        {isFocused && (
          <div className="absolute -top-1 -right-1 w-4 h-4">
            <BrandLogo size="mini" variant="gold" />
          </div>
        )}
      </div>
      
      {/* Error/Success Messages */}
      {(error || success) && (
        <p className={`
          text-sm mt-1 flex items-center space-x-1
          ${error ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}
        `}>
          <span className="w-4 h-4">
            {error ? (
              <svg className="w-full h-full text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </span>
          <span>{error || success}</span>
        </p>
      )}
    </div>
  );
}

export {
  BasketballButton,
  BasketballNavCard,
  useBasketballSounds,
  InteractiveBasketballIcon,
  BasketballInput
};