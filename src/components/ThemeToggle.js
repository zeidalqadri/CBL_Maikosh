import { useState, useEffect } from 'react';

/**
 * ThemeToggle - Sophisticated theme switching component
 * Inspired by ecrin.digital's minimalist control design
 */
export default function ThemeToggle({ 
  className = '',
  position = 'fixed' // 'fixed' | 'relative'
}) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    // Update CSS class for theme
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Update document attributes and classes
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const positionClasses = position === 'fixed' 
    ? 'fixed top-6 right-6 z-50' 
    : 'relative';

  return (
    <div className={`${positionClasses} ${className}`}>
      <button
        onClick={toggleTheme}
        className={`
          group
          relative
          w-12
          h-12
          bg-transparent
          border
          border-gray-600
          dark:border-gray-400
          rounded-full
          transition-all
          duration-300
          ease-out
          hover:border-alloui-gold
          hover:bg-alloui-gold/5
          overflow-hidden
        `}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {/* Sun icon */}
        <div 
          className={`
            absolute
            inset-0
            flex
            items-center
            justify-center
            transition-all
            duration-500
            ${theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'}
          `}
        >
          <svg 
            className="w-5 h-5 text-gray-400 dark:text-gray-300 group-hover:text-alloui-gold" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        </div>

        {/* Moon icon */}
        <div 
          className={`
            absolute
            inset-0
            flex
            items-center
            justify-center
            transition-all
            duration-500
            ${theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}
          `}
        >
          <svg 
            className="w-5 h-5 text-gray-400 dark:text-gray-300 group-hover:text-alloui-gold" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
        </div>

        {/* Hover ripple effect */}
        <div 
          className={`
            absolute
            inset-0
            bg-alloui-gold/10
            rounded-full
            transition-transform
            duration-300
            scale-0
            group-hover:scale-100
          `}
        />

        {/* Theme transition overlay */}
        <div 
          className={`
            absolute
            inset-0
            bg-white
            dark:bg-black
            rounded-full
            transition-transform
            duration-700
            ${theme === 'dark' ? 'scale-0' : 'scale-0'}
          `}
          style={{
            animation: theme !== 'dark' ? 'themeTransition 0.7s ease-out' : 'none'
          }}
        />
      </button>
    </div>
  );
}

/**
 * Inline theme toggle for embedding in content
 */
export function InlineThemeToggle({ className = '' }) {
  return (
    <ThemeToggle 
      position="relative"
      className={`inline-block ${className}`}
    />
  );
}