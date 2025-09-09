import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useRouter } from 'next/router';
import { ThemeProvider } from '../contexts/ThemeContext';
import AccessibilityPanel from '../components/accessibility/AccessibilityPanel';
import AccessibleButton from '../components/accessibility/AccessibleButton';
import { useSkipLinks } from '../hooks/useKeyboardNavigation';
import ErrorBoundary from '../components/feedback/ErrorBoundary';
import BrandLogo from '../components/BrandLogo';
import BreadcrumbNavigation from '../components/navigation/BreadcrumbNavigation';
import DashboardNavigation from '../components/navigation/DashboardNavigation';
import { BasketballButton } from '../components/interactions/BasketballMicroInteractions';
import { AllouiIcon, ArrowLeftIcon, ArrowRightIcon, MenuIcon, CloseIcon } from '../components/icons';

function MainLayoutContent({ children, title = 'CBL_alloui' }) {
  const { user, loading, logout } = useAuth();
  const { 
    breadcrumbs, 
    canGoBack, 
    canGoForward, 
    goBack, 
    goForward,
    getBasketballTheme,
    navigationLoading
  } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessibilityPanelOpen, setAccessibilityPanelOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const router = useRouter();
  const { registerSkipLink } = useSkipLinks();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleAccessibilityPanel = () => {
    setAccessibilityPanelOpen(!accessibilityPanelOpen);
  };

  // Theme toggle functionality
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Update document attributes and classes
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Sound toggle functionality
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // TODO: Implement actual sound functionality when needed
  };

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = savedTheme || systemTheme;
      
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
      
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);
  
  // Header scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // Register skip links
  registerSkipLink('skip-to-main', 'Skip to main content', 'main-content');
  registerSkipLink('skip-to-navigation', 'Skip to navigation', 'main-navigation');
  
  const isActive = (path) => {
    return router.pathname === path ? 'active-link' : '';
  };

  return (
    <>
      <Head>
        <title>{`${title} | MABA/NSC Basketball Coaching Level I`}</title>
        <meta name="description" content="Basketball Coaching Level I web application with 12 interactive learning modules" />
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        <header className={`
          fixed top-0 left-0 right-0 z-50
          bg-black/5 dark:bg-black/80 backdrop-blur-xl 
          border-b border-white/10 dark:border-gray-800/50
          transition-all duration-300 ease-out
          ${
            headerVisible 
              ? 'translate-y-0 opacity-100' 
              : '-translate-y-full opacity-0'
          }
        `}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <BrandLogo size="hero" variant="default" />
              </div>
              
              
              {/* Dashboard Navigation - Only show for authenticated users */}
              {user && (
                <div className="hidden md:flex items-center space-x-4">
                  <DashboardNavigation variant="header" currentPath={router.pathname} />
                </div>
              )}
              
              {/* Back/Forward Navigation - Show for non-authenticated or as fallback */}
              {!user && (
                <div className="hidden md:flex items-center space-x-4">
                  {/* Back/Forward Navigation */}
                  <div className="flex items-center space-x-2">
                    <BasketballButton
                      size="small"
                      variant="ghost"
                      disabled={!canGoBack}
                      onClick={goBack}
                      title="Go back"
                    >
                      <ArrowLeftIcon size="sm" />
                    </BasketballButton>
                    <BasketballButton
                      size="small"
                      variant="ghost"
                      disabled={!canGoForward}
                      onClick={goForward}
                      title="Go forward"
                    >
                      <ArrowRightIcon size="sm" />
                    </BasketballButton>
                  </div>
                </div>
              )}

              <div className="hidden md:flex items-center space-x-6">
                {/* Theme and Sound toggles */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button
                      onClick={toggleTheme}
                      className={`
                        group relative w-10 h-10 bg-transparent border border-gray-300 dark:border-gray-600
                        rounded-full transition-all duration-300 ease-out hover:border-accent hover:bg-accent/5
                        overflow-hidden
                      `}
                      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    >
                      {/* Sun icon (light mode) */}
                      <AllouiIcon 
                        name="insight"
                        size="sm"
                        variant="secondary"
                        className={`absolute inset-0 m-auto transition-opacity duration-300 ${
                          theme === 'light' ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      {/* Moon icon (dark mode) */}
                      <AllouiIcon 
                        name="basketball"
                        size="sm"
                        variant="basketball"
                        className={`absolute inset-0 m-auto transition-opacity duration-300 ${
                          theme === 'dark' ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      onClick={toggleSound}
                      className={`
                        group relative w-10 h-10 bg-transparent border border-gray-300 dark:border-gray-600
                        rounded-full transition-all duration-300 ease-out hover:border-accent hover:bg-accent/5
                        overflow-hidden
                      `}
                      aria-label={`${soundEnabled ? 'Disable' : 'Enable'} sound`}
                    >
                      {/* Sound on icon */}
                      <AllouiIcon 
                        name="whistle"
                        size="sm"
                        variant="secondary"
                        className={`absolute inset-0 m-auto transition-opacity duration-300 ${
                          soundEnabled ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      {/* Sound off icon */}
                      <AllouiIcon 
                        name="timeout-pause"
                        size="sm"
                        variant="secondary"
                        className={`absolute inset-0 m-auto transition-opacity duration-300 ${
                          !soundEnabled ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                {/* Auth section */}
                {!loading && (
                  <>
                    {user ? (
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {user.name || user.email}
                        </span>
                        <BasketballButton 
                          onClick={() => logout().then(() => router.push('/'))}
                          variant="secondary"
                          size="small"
                        >
                          Log Out
                        </BasketballButton>
                      </div>
                    ) : (
                        <BasketballButton 
                          variant="primary" 
                          size="small"
                          onClick={() => router.push('/auth/login')}
                        >
                          Log In
                        </BasketballButton>
                    )}
                  </>
                )}
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  type="button"
                  className="text-gray-900 dark:text-white hover:text-alloui-gold-light dark:hover:text-alloui-gold-dark focus:outline-none transition-colors"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <CloseIcon size="md" />
                  ) : (
                    <MenuIcon size="md" />
                  )}
                </button>
              </div>
            </div>
            
          </div>
        </header>

        {/* Mobile Navigation - Only show for authenticated users */}
        {user && (
          <div className="md:hidden">
            <DashboardNavigation variant="mobile" currentPath={router.pathname} />
          </div>
        )}

        <main className={`pt-20 ${user ? 'pb-16 md:pb-0' : ''}`}>
          {/* Breadcrumb Navigation */}
          {breadcrumbs && breadcrumbs.length > 1 && (
            <div className="container mx-auto px-4 py-4">
              <BreadcrumbNavigation showProgress={true} />
            </div>
          )}
          
          {/* Navigation Loading Indicator */}
          {navigationLoading && (
            <div className="fixed top-20 left-0 right-0 z-40">
              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
                <div className="h-full bg-alloui-gold-light dark:bg-alloui-gold-dark animate-pulse"></div>
              </div>
            </div>
          )}
          
          {children}
        </main>
        
        {/* Accessibility Panel */}
        <AccessibilityPanel 
          isOpen={accessibilityPanelOpen} 
          onClose={() => setAccessibilityPanelOpen(false)} 
        />
      </div>
    </>
  );
}

// Main layout with theme provider and error boundary
export default function MainLayout(props) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MainLayoutContent {...props} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}