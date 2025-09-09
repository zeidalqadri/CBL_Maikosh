import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * MagneticButton - Interactive button with magnetic hover effect
 * Inspired by ecrin.digital's sophisticated micro-interactions
 */
export default function MagneticButton({ 
  children, 
  href, 
  onClick, 
  className = '', 
  variant = 'primary',
  disabled = false,
  external = false,
  ...props 
}) {
  const buttonRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || typeof window === 'undefined') return;

    let animationFrameId = null;

    const handleMouseMove = (e) => {
      if (disabled) return;
      
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Enhanced magnetic effect - ecrin.digital style
      const magneticStrength = 0.4;
      const maxDistance = 120;
      
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      
      if (distance < maxDistance) {
        const pullX = deltaX * magneticStrength;
        const pullY = deltaY * magneticStrength;
        
        animationFrameId = requestAnimationFrame(() => {
          button.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
          button.style.willChange = 'transform';
        });
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      animationFrameId = requestAnimationFrame(() => {
        button.style.transform = 'translate3d(0px, 0px, 0)';
        button.style.willChange = 'auto';
      });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    // Add event listeners
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [disabled]);

  const baseClasses = `
    magnetic-button 
    inline-block 
    relative 
    overflow-hidden 
    transition-all 
    duration-300 
    ease-out
    font-medium
    min-h-touch
    px-6 py-3
    md:px-4 md:py-2
    ${disabled ? 'opacity-50 pointer-events-none' : ''}
    ${className}
  `;

  const variantClasses = {
    primary: `
      bg-accent 
      text-white 
      hover:bg-accent-hover 
      hover:shadow-lg 
      hover:shadow-accent/30
    `,
    secondary: `
      bg-transparent 
      text-accent 
      border-2 
      border-accent 
      hover:bg-accent 
      hover:text-white
    `,
    ghost: `
      bg-transparent 
      text-gray-300 
      hover:text-accent 
      hover:bg-accent/10
    `
  };

  const buttonElement = (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-label={typeof children === 'string' ? children : 'Button'}
      role="button"
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      
      {/* Enhanced shimmer effect */}
      <div 
        className={`
          absolute inset-0 
          -translate-x-full 
          bg-gradient-to-r 
          from-transparent 
          via-white/20 
          to-transparent 
          transition-transform 
          duration-500 
          ease-out
          ${isHovering ? 'translate-x-full' : ''}
        `}
        style={{
          transform: isHovering ? 'translateX(100%)' : 'translateX(-100%)',
          willChange: isHovering ? 'transform' : 'auto'
        }}
      />
      
      {/* Enhanced magnetic ripple effect */}
      <div 
        className={`
          absolute inset-0 
          bg-white/8 
          transition-all
          duration-300 
          ease-out
          ${isHovering ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        style={{
          borderRadius: 'inherit',
          willChange: isHovering ? 'transform, opacity' : 'auto'
        }}
      />
    </button>
  );

  // If href is provided, wrap in Link or anchor
  if (href) {
    if (external || href.startsWith('http')) {
      return (
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block cursor-none"
        >
          {buttonElement}
        </a>
      );
    } else {
      return (
        <Link href={href} className="inline-block cursor-none">
          {buttonElement}
        </Link>
      );
    }
  }

  return buttonElement;
}