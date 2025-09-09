import React from 'react';
import { announceToScreenReader } from '../../utils/accessibility';
import AccessibleButton from '../accessibility/AccessibleButton';

/**
 * Accessible Error Boundary Component
 * Provides graceful error handling with accessibility considerations
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }
  
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Store error details in state
    this.setState({
      error,
      errorInfo
    });
    
    // Announce error to screen readers
    announceToScreenReader(
      'An error occurred. Please try refreshing the page or contact support if the problem persists.',
      'assertive'
    );
    
    // Optional: Send error to logging service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
    announceToScreenReader('Retrying...');
  };
  
  handleReload = () => {
    window.location.reload();
  };
  
  render() {
    if (this.state.hasError) {
      // Custom error UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }
      
      // Default error UI
      return (
        <div 
          className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <svg 
                className="mx-auto h-16 w-16 text-team-red" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
              
              <h1 className="mt-6 text-3xl font-bold text-gray-900">
                Oops! Something went wrong
              </h1>
              
              <p className="mt-4 text-gray-600 max-w-sm mx-auto">
                We encountered an unexpected error while loading this page. 
                This might be a temporary issue.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left bg-gray-100 p-4 rounded-md">
                  <summary className="font-semibold cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="space-y-4">
              <AccessibleButton
                onClick={this.handleRetry}
                variant="primary"
                size="large"
                className="w-full"
                ariaLabel="Retry loading the page"
              >
                Try Again
              </AccessibleButton>
              
              <AccessibleButton
                onClick={this.handleReload}
                variant="secondary"
                className="w-full"
                ariaLabel="Refresh the entire page"
              >
                Refresh Page
              </AccessibleButton>
              
              {this.props.supportLink && (
                <p className="text-sm text-gray-500">
                  If the problem continues,{' '}
                  <a 
                    href={this.props.supportLink}
                    className="text-basketball-orange hover:underline focus:outline-none focus:ring-2 focus:ring-basketball-orange focus:ring-offset-2"
                  >
                    contact support
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook for functional components
export const useErrorHandler = () => {
  return (error, errorInfo) => {
    console.error('Error caught:', error, errorInfo);
    announceToScreenReader(
      'An error occurred. Please check the page for error messages.',
      'assertive'
    );
  };
};