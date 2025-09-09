import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/**
 * CustomCursor - Sophisticated custom cursor with interactive states
 * Replicates the premium cursor experience from ecrin.digital
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [cursorState, setCursorState] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device supports hover (desktop) - avoid window access on server
    if (typeof window === 'undefined') return;
    
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    setIsVisible(true);

    let animationFrameId = null;

    const updateCursorPosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
      // Smooth cursor movement using RAF
      animationFrameId = requestAnimationFrame(() => {
        updateCursorPosition(e);
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Enhanced hover detection for different elements
    const handleElementHover = (e) => {
      const target = e.target;
      
      // Check for interactive elements
      if (target.matches('a, button, [role="button"], input, textarea, select')) {
        setCursorState('hover');
      }
      // Check for text elements
      else if (target.matches('h1, h2, h3, h4, h5, h6, p, span, div[contenteditable]')) {
        setCursorState('text');
      }
      // Check for images or media
      else if (target.matches('img, video, canvas, svg')) {
        setCursorState('media');
      }
      // Check for magnetic buttons
      else if (target.closest('.magnetic-button')) {
        setCursorState('magnetic');
      }
      // Default state
      else {
        setCursorState('default');
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleElementHover);

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.body.classList.add('cursor-none');

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementHover);
      
      // Restore default cursor
      document.body.style.cursor = '';
      document.body.classList.remove('cursor-none');
    };
  }, []);

  // Don't render on mobile or if not visible
  if (!isVisible) return null;

  const getCursorClasses = () => {
    const baseClasses = `
      fixed 
      pointer-events-none 
      z-[9999] 
      transition-all 
      duration-200 
      ease-out
      mix-blend-mode-difference
    `;

    switch (cursorState) {
      case 'hover':
        return `${baseClasses} w-12 h-12 bg-alloui-gold/30 border-2 border-alloui-gold rounded-full`;
      
      case 'text':
        return `${baseClasses} w-1 h-6 bg-alloui-gold`;
      
      case 'media':
        return `${baseClasses} w-16 h-16 bg-alloui-gold/20 border border-alloui-gold rounded-full`;
      
      case 'magnetic':
        return `${baseClasses} w-20 h-20 bg-alloui-gold/10 border-2 border-alloui-gold rounded-full`;
      
      default:
        return `${baseClasses} w-8 h-8 rounded-full overflow-hidden`;
    }
  };

  const getCursorContent = () => {
    switch (cursorState) {
      case 'hover':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-alloui-gold rounded-full" />
          </div>
        );
      
      case 'magnetic':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-alloui-gold rounded-full" />
          </div>
        );
      
      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/icons/logomark.svg"
              alt="alloui by CBL"
              width={24}
              height={24}
              className="w-full h-full object-contain filter invert"
            />
          </div>
        );
    }
  };

  return (
    <div
      ref={cursorRef}
      className={getCursorClasses()}
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {getCursorContent()}
    </div>
  );
}