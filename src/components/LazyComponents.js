/**
 * Lazy-loaded Components for Performance Optimization
 * Implements code splitting and dynamic imports for better bundle size
 */

import { lazy, Suspense } from 'react';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';

// Lazy load heavy components
const AssessmentQuizLazy = lazy(() => import('./curriculum/AssessmentQuiz'));
const SwaggerUILazy = lazy(() => import('swagger-ui-react'));
const ModuleResourcesLazy = lazy(() => import('./curriculum/ModuleResources'));
const PracticalDrillsLazy = lazy(() => import('./curriculum/PracticalDrills'));

// Higher-order component for lazy loading with error boundary and suspense
export const withLazyLoading = (LazyComponent, fallback = null) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary>
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );

  // Set display name for debugging
  WrappedComponent.displayName = `withLazyLoading(${LazyComponent.displayName || LazyComponent.name})`;

  return WrappedComponent;
};

// Custom loading fallbacks for different components
const QuizLoadingFallback = () => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="flex justify-between mt-6">
        <div className="h-10 bg-gray-200 rounded w-20"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const ResourcesLoadingFallback = () => (
  <div className="space-y-4">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DrillsLoadingFallback = () => (
  <div className="space-y-4">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Optimized lazy-loaded components with custom fallbacks
export const AssessmentQuiz = withLazyLoading(AssessmentQuizLazy, <QuizLoadingFallback />);
export const SwaggerUI = withLazyLoading(SwaggerUILazy, <LoadingSpinner />);
export const ModuleResources = withLazyLoading(ModuleResourcesLazy, <ResourcesLoadingFallback />);
export const PracticalDrills = withLazyLoading(PracticalDrillsLazy, <DrillsLoadingFallback />);

// Performance monitoring for lazy components
const trackComponentLoad = (componentName, loadTime) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'component_loaded', {
      event_category: 'performance',
      event_label: componentName,
      value: Math.round(loadTime)
    });
  }
};

// Enhanced lazy loading with performance tracking
export const withPerformanceTracking = (LazyComponent, componentName) => {
  const TrackedComponent = (props) => {
    const startTime = Date.now();
    
    return (
      <ErrorBoundary>
        <Suspense 
          fallback={<LoadingSpinner />}
        >
          <LazyComponent 
            {...props} 
            onComponentMount={() => {
              const loadTime = Date.now() - startTime;
              trackComponentLoad(componentName, loadTime);
            }}
          />
        </Suspense>
      </ErrorBoundary>
    );
  };

  TrackedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return TrackedComponent;
};

// Preload components for better UX
export const preloadComponent = (componentImport) => {
  if (typeof window !== 'undefined') {
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        componentImport();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        componentImport();
      }, 1);
    }
  }
};

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload assessment quiz since it's commonly used
  preloadComponent(() => import('./curriculum/AssessmentQuiz'));
  
  // Preload other commonly accessed components
  preloadComponent(() => import('./curriculum/ModuleResources'));
};

// Route-based code splitting utilities
export const getRouteComponent = (route) => {
  const routeComponents = {
    '/modules': () => import('../pages/modules'),
    '/api-docs': () => import('../pages/api-docs'),
    '/modules/m1': () => import('../pages/modules/m1'),
    // Add other module routes as they are created
  };

  return routeComponents[route] || null;
};

// Prefetch next likely routes
export const prefetchRoute = (route) => {
  const componentLoader = getRouteComponent(route);
  if (componentLoader) {
    preloadComponent(componentLoader);
  }
};