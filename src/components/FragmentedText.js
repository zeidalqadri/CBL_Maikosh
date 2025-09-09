import { useEffect, useRef, useState, useMemo } from 'react';

/**
 * FragmentedText - Animated text component with staggered word reveals
 * Creates the sophisticated typography effect from ecrin.digital
 */
export default function FragmentedText({ 
  text, 
  className = '', 
  animateOnScroll = true,
  staggerDelay = 100,
  as = 'div',
  layout = 'default' // 'default', 'fragmented', 'stacked'
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(!animateOnScroll);
  
  // Split text into words for animation - using useMemo for consistent hydration
  const words = useMemo(() => text.split(' '), [text]);
  
  useEffect(() => {
    if (!animateOnScroll) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [animateOnScroll]);

  const getLayoutClasses = () => {
    switch (layout) {
      case 'fragmented':
        return 'flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 items-start';
      case 'stacked':
        return 'flex flex-col space-y-1';
      default:
        return 'inline';
    }
  };

  const getWordClasses = (index) => {
    const baseClasses = `
      inline-block 
      transition-all 
      duration-500 
      ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
    `;
    
    return `${baseClasses}`;
  };

  const getWordStyle = (index) => ({
    transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms',
  });

  // Create fragmented layout for hero text with consistent fragments for hydration
  const fragments = useMemo(() => {
    const result = [];
    let currentFragment = [];
    
    // Create deterministic fragments instead of random for hydration consistency
    words.forEach((word, index) => {
      currentFragment.push(word);
      
      // Use deterministic logic instead of Math.random()
      const fragmentLength = ((index + word.length) % 3) + 1;
      if (currentFragment.length >= fragmentLength || index === words.length - 1) {
        result.push([...currentFragment]);
        currentFragment = [];
      }
    });
    
    return result;
  }, [words]);

  const renderFragmentedLayout = () => {

    return fragments.map((fragment, fragmentIndex) => (
      <div 
        key={fragmentIndex}
        className={`
          ${fragmentIndex % 2 === 1 ? 'md:ml-8 lg:ml-16' : ''}
          ${fragmentIndex % 3 === 2 ? 'md:ml-4 lg:ml-8' : ''}
        `}
      >
        {fragment.map((word, wordIndex) => {
          const globalIndex = fragments.slice(0, fragmentIndex).flat().length + wordIndex;
          return (
            <span
              key={`${fragmentIndex}-${wordIndex}`}
              className={getWordClasses(globalIndex)}
              style={getWordStyle(globalIndex)}
              role="text"
              aria-label={word}
            >
              {word}{wordIndex < fragment.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    ));
  };

  // Create stacked layout
  const renderStackedLayout = () => {
    return words.map((word, index) => (
      <div
        key={index}
        className={getWordClasses(index)}
        style={getWordStyle(index)}
      >
        {word}
      </div>
    ));
  };

  // Create default inline layout
  const renderDefaultLayout = () => {
    return words.map((word, index) => (
      <span
        key={index}
        className={getWordClasses(index)}
        style={getWordStyle(index)}
      >
        {word}{index < words.length - 1 ? ' ' : ''}
      </span>
    ));
  };

  const Component = as;

  return (
    <Component 
      ref={containerRef}
      className={`fragment-text ${getLayoutClasses()} ${className}`}
    >
      {layout === 'fragmented' && renderFragmentedLayout()}
      {layout === 'stacked' && renderStackedLayout()}
      {layout === 'default' && renderDefaultLayout()}
    </Component>
  );
}

/**
 * Preset components for common use cases
 */
export function HeroText({ children, className = '' }) {
  return (
    <FragmentedText
      text={children}
      className={`text-hero font-bold text-gray-900 dark:text-white ${className}`}
      layout="fragmented"
      staggerDelay={150}
      as="h1"
    />
  );
}

export function SectionTitle({ children, className = '' }) {
  return (
    <FragmentedText
      text={children}
      className={`text-section font-semibold text-gray-900 dark:text-white ${className}`}
      layout="default"
      staggerDelay={100}
      as="h2"
    />
  );
}

export function StackedText({ children, className = '' }) {
  return (
    <FragmentedText
      text={children}
      className={`text-large font-medium text-gray-800 dark:text-gray-200 ${className}`}
      layout="stacked"
      staggerDelay={80}
      as="div"
    />
  );
}