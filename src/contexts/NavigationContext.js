import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';

// Create Navigation Context
const NavigationContext = createContext();

// Basketball-themed module configuration
const BASKETBALL_MODULES = {
  1: { title: 'Introduction to Coaching', court: 'backcourt', skill: 'fundamentals', theme: 'leadership' },
  2: { title: 'Player Development', court: 'backcourt', skill: 'fundamentals', theme: 'development' },
  3: { title: 'Game Rules & Regulations', court: 'backcourt', skill: 'fundamentals', theme: 'rules' },
  4: { title: 'Basic Skills Training', court: 'midcourt', skill: 'basic', theme: 'skills' },
  5: { title: 'Team Fundamentals', court: 'midcourt', skill: 'basic', theme: 'teamwork' },
  6: { title: 'Offensive Strategies', court: 'midcourt', skill: 'intermediate', theme: 'offense' },
  7: { title: 'Defensive Strategies', court: 'frontcourt', skill: 'intermediate', theme: 'defense' },
  8: { title: 'Advanced Tactics', court: 'frontcourt', skill: 'advanced', theme: 'tactics' },
  9: { title: 'Game Management', court: 'frontcourt', skill: 'advanced', theme: 'management' },
  10: { title: 'Player Psychology', court: 'key-area', skill: 'expert', theme: 'psychology' },
  11: { title: 'Advanced Coaching', court: 'key-area', skill: 'expert', theme: 'coaching' },
  12: { title: 'Certification & Assessment', court: 'key-area', skill: 'mastery', theme: 'certification' }
};

// Navigation Provider Component
export function NavigationProvider({ children }) {
  const router = useRouter();
  const { user } = useAuth();

  // Core Navigation State
  const [navigationState, setNavigationState] = useState({
    // Current Position
    currentModule: null,
    currentSection: null,
    currentPage: null,
    
    // Navigation History
    navigationHistory: [],
    historyIndex: 0,
    
    // User Progress Context
    completedModules: [],
    unlockedModules: [1], // Always unlock Module 1
    currentProgress: 0,
    
    // Breadcrumb State
    breadcrumbs: [],
    
    // Basketball Context
    courtPosition: 'backcourt',
    skillLevel: 'fundamentals',
    
    // UI State
    navigationLoading: false,
    sidebarOpen: false,
    mobileMenuOpen: false
  });

  // Get current module number from URL
  const getCurrentModuleFromURL = useCallback(() => {
    const path = router.pathname;
    if (path.startsWith('/modules/m')) {
      const moduleMatch = path.match(/\/modules\/m(\d+)/);
      return moduleMatch ? parseInt(moduleMatch[1]) : null;
    }
    return null;
  }, [router.pathname]);

  // Update navigation state when route changes
  useEffect(() => {
    const updateNavigationFromRoute = () => {
      const currentModule = getCurrentModuleFromURL();
      const currentPage = router.pathname;
      
      // Generate breadcrumbs based on current page
      const breadcrumbs = generateBreadcrumbs(router.pathname);
      
      // Update basketball context based on current module
      let courtPosition = 'backcourt';
      let skillLevel = 'fundamentals';
      
      if (currentModule && BASKETBALL_MODULES[currentModule]) {
        courtPosition = BASKETBALL_MODULES[currentModule].court;
        skillLevel = BASKETBALL_MODULES[currentModule].skill;
      }

      setNavigationState(prev => ({
        ...prev,
        currentModule,
        currentPage,
        breadcrumbs,
        courtPosition,
        skillLevel
      }));

      // Add to navigation history if it's a new page
      addToNavigationHistory(currentPage, currentModule);
    };

    updateNavigationFromRoute();
  }, [router.pathname, router.asPath, getCurrentModuleFromURL]);

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = (pathname) => {
    const breadcrumbs = [{ title: 'Home', path: '/', logoVariant: 'default' }];

    if (pathname === '/') {
      return breadcrumbs;
    }

    if (pathname.startsWith('/modules')) {
      breadcrumbs.push({ title: 'Modules', path: '/modules', logoVariant: 'basketball' });
      
      const moduleMatch = pathname.match(/\/modules\/m(\d+)/);
      if (moduleMatch) {
        const moduleNum = parseInt(moduleMatch[1]);
        const moduleInfo = BASKETBALL_MODULES[moduleNum];
        if (moduleInfo) {
          breadcrumbs.push({
            title: `Module ${moduleNum}`,
            path: `/modules/m${moduleNum}`,
            logoVariant: getBasketballLogoVariant(moduleInfo.court),
            subtitle: moduleInfo.title
          });
        }
      }
    } else if (pathname.startsWith('/profile')) {
      breadcrumbs.push({ title: 'Profile', path: '/profile', logoVariant: 'navy' });
    } else if (pathname.startsWith('/auth')) {
      breadcrumbs.push({ title: 'Authentication', path: '/auth', logoVariant: 'gold' });
    } else {
      const pageTitle = getPageTitle(pathname);
      breadcrumbs.push({ title: pageTitle, path: pathname, logoVariant: 'default' });
    }

    return breadcrumbs;
  };

  // Get basketball-themed logo variant for court position
  const getBasketballLogoVariant = (courtPosition) => {
    const variants = {
      'backcourt': 'default', // Fundamentals
      'midcourt': 'basketball', // Skills development
      'frontcourt': 'gold', // Advanced strategies
      'key-area': 'navy'  // Mastery
    };
    return variants[courtPosition] || 'default';
  };

  // Get page title from pathname
  const getPageTitle = (pathname) => {
    const titles = {
      '/contact': 'Contact',
      '/support': 'Support',
      '/faq': 'FAQ',
      '/guides': 'Guides',
      '/resources': 'Resources',
      '/api-docs': 'API Documentation',
      '/offline': 'Offline Mode',
      '/certificates': 'Certificates'
    };
    return titles[pathname] || pathname.split('/').pop()?.replace('-', ' ') || 'Page';
  };

  // Add to navigation history
  const addToNavigationHistory = (path, moduleNumber = null) => {
    setNavigationState(prev => {
      const newEntry = {
        path,
        moduleNumber,
        timestamp: Date.now(),
        title: moduleNumber ? `Module ${moduleNumber}` : getPageTitle(path)
      };

      // Don't add duplicate entries
      if (prev.navigationHistory[prev.historyIndex]?.path === path) {
        return prev;
      }

      const newHistory = [...prev.navigationHistory.slice(0, prev.historyIndex + 1), newEntry];
      
      // Limit history to 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      return {
        ...prev,
        navigationHistory: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  };

  // Navigation Actions
  const navigateToModule = useCallback((moduleNumber) => {
    if (moduleNumber < 1 || moduleNumber > 12) return;
    
    setNavigationState(prev => ({ ...prev, navigationLoading: true }));
    router.push(`/modules/m${moduleNumber}`).finally(() => {
      setNavigationState(prev => ({ ...prev, navigationLoading: false }));
    });
  }, [router]);

  const navigateToSection = useCallback((sectionId) => {
    const currentPath = router.pathname;
    router.push(`${currentPath}#${sectionId}`);
  }, [router]);

  const goBack = useCallback(() => {
    setNavigationState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        const targetEntry = prev.navigationHistory[newIndex];
        router.push(targetEntry.path);
        return { ...prev, historyIndex: newIndex };
      }
      return prev;
    });
  }, [router]);

  const goForward = useCallback(() => {
    setNavigationState(prev => {
      if (prev.historyIndex < prev.navigationHistory.length - 1) {
        const newIndex = prev.historyIndex + 1;
        const targetEntry = prev.navigationHistory[newIndex];
        router.push(targetEntry.path);
        return { ...prev, historyIndex: newIndex };
      }
      return prev;
    });
  }, [router]);

  const resetNavigation = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      navigationHistory: [],
      historyIndex: 0,
      currentModule: null,
      currentSection: null,
      breadcrumbs: [{ title: 'Home', path: '/', logoVariant: 'basketball' }]
    }));
    router.push('/');
  }, [router]);

  // URL Management
  const updateURL = useCallback((path) => {
    router.push(path, undefined, { shallow: true });
  }, [router]);

  const restoreFromURL = useCallback(() => {
    // Already handled in the useEffect above
  }, []);

  // Basketball-themed navigation helpers
  const getCourtPosition = () => navigationState.courtPosition;
  const getSkillLevel = () => navigationState.skillLevel;
  const getBasketballTheme = () => {
    if (navigationState.currentModule) {
      return BASKETBALL_MODULES[navigationState.currentModule]?.theme || 'default';
    }
    return 'default';
  };

  // UI State Management
  const toggleSidebar = useCallback(() => {
    setNavigationState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setNavigationState(prev => ({ ...prev, mobileMenuOpen: !prev.mobileMenuOpen }));
  }, []);

  const closeSidebar = useCallback(() => {
    setNavigationState(prev => ({ ...prev, sidebarOpen: false }));
  }, []);

  const closeMobileMenu = useCallback(() => {
    setNavigationState(prev => ({ ...prev, mobileMenuOpen: false }));
  }, []);

  // Check navigation capabilities
  const canGoBack = navigationState.historyIndex > 0;
  const canGoForward = navigationState.historyIndex < navigationState.navigationHistory.length - 1;

  // Context value
  const contextValue = {
    // State
    ...navigationState,
    
    // Navigation capabilities
    canGoBack,
    canGoForward,
    
    // Navigation actions
    navigateToModule,
    navigateToSection,
    goBack,
    goForward,
    resetNavigation,
    
    // URL management
    updateURL,
    restoreFromURL,
    
    // Basketball context
    getCourtPosition,
    getSkillLevel,
    getBasketballTheme,
    
    // UI state management
    toggleSidebar,
    toggleMobileMenu,
    closeSidebar,
    closeMobileMenu,
    
    // Module information
    getModuleInfo: (moduleNumber) => BASKETBALL_MODULES[moduleNumber],
    getAllModules: () => BASKETBALL_MODULES
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

// Custom hook to use navigation context
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

export default NavigationContext;