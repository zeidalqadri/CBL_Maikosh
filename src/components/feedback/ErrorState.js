import React from 'react';
import AccessibleButton from '../accessibility/AccessibleButton';

/**
 * Accessible Error State Components
 * Provides consistent error states with recovery guidance
 */

export const NetworkError = ({ 
  onRetry, 
  className = '',
  showRetryButton = true 
}) => (
  <div 
    className={`text-center py-8 ${className}`}
    role="alert"
    aria-live="polite"
  >
    <svg 
      className="mx-auto h-12 w-12 text-neutral-gray mb-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1} 
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
      />
    </svg>
    
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Connection Problem
    </h3>
    
    <p className="text-neutral-gray mb-6 max-w-md mx-auto">
      Unable to connect to our servers. Please check your internet connection and try again.
    </p>
    
    {showRetryButton && (
      <AccessibleButton
        onClick={onRetry}
        variant="primary"
        ariaLabel="Retry loading content"
      >
        Try Again
      </AccessibleButton>
    )}
  </div>
);

export const NotFoundError = ({ 
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  actionButton,
  className = '' 
}) => (
  <div 
    className={`text-center py-12 ${className}`}
    role="alert"
  >
    <div className="text-6xl font-bold text-neutral-gray mb-4">
      404
    </div>
    
    <h1 className="text-2xl font-bold text-gray-900 mb-4">
      {title}
    </h1>
    
    <p className="text-neutral-gray mb-8 max-w-md mx-auto">
      {message}
    </p>
    
    {actionButton || (
      <AccessibleButton
        onClick={() => window.history.back()}
        variant="primary"
        ariaLabel="Go back to previous page"
      >
        Go Back
      </AccessibleButton>
    )}
  </div>
);

export const ForbiddenError = ({ 
  message = "You don't have permission to access this resource.",
  className = '' 
}) => (
  <div 
    className={`text-center py-12 ${className}`}
    role="alert"
  >
    <svg 
      className="mx-auto h-16 w-16 text-team-red mb-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1} 
        d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a2 2 0 10-4 0v2m.5-.5h3a.5.5 0 01.5.5v4a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5z" 
      />
    </svg>
    
    <h2 className="text-xl font-bold text-gray-900 mb-4">
      Access Denied
    </h2>
    
    <p className="text-neutral-gray mb-6 max-w-md mx-auto">
      {message}
    </p>
    
    <AccessibleButton
      onClick={() => window.location.href = '/'}
      variant="primary"
      ariaLabel="Return to homepage"
    >
      Go Home
    </AccessibleButton>
  </div>
);

export const LoadingError = ({ 
  onRetry, 
  error,
  showDetails = false,
  className = '' 
}) => (
  <div 
    className={`text-center py-8 ${className}`}
    role="alert"
    aria-live="polite"
  >
    <svg 
      className="mx-auto h-12 w-12 text-team-red mb-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1} 
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
    
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Loading Error
    </h3>
    
    <p className="text-neutral-gray mb-6 max-w-md mx-auto">
      Something went wrong while loading this content. Please try again.
    </p>
    
    {showDetails && error && (
      <details className="text-left bg-gray-100 p-4 rounded-md mb-6 max-w-md mx-auto">
        <summary className="font-semibold cursor-pointer text-gray-700 mb-2">
          Error Details
        </summary>
        <p className="text-sm text-gray-600">
          {error.message || error.toString()}
        </p>
      </details>
    )}
    
    <AccessibleButton
      onClick={onRetry}
      variant="primary"
      ariaLabel="Retry loading content"
    >
      Try Again
    </AccessibleButton>
  </div>
);

export const EmptyState = ({ 
  title, 
  message, 
  actionButton,
  icon,
  className = '' 
}) => (
  <div className={`text-center py-12 ${className}`}>
    {icon && (
      <div className="mb-4" aria-hidden="true">
        {icon}
      </div>
    )}
    
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    
    {message && (
      <p className="text-neutral-gray mb-6 max-w-md mx-auto">
        {message}
      </p>
    )}
    
    {actionButton && actionButton}
  </div>
);

export const OfflineState = ({ 
  onRetry,
  className = '' 
}) => (
  <div 
    className={`text-center py-8 ${className}`}
    role="alert"
    aria-live="polite"
  >
    <svg 
      className="mx-auto h-12 w-12 text-neutral-gray mb-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1} 
        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Z" 
      />
    </svg>
    
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      You're Offline
    </h3>
    
    <p className="text-neutral-gray mb-6 max-w-md mx-auto">
      Check your internet connection and try again. Some features may be limited while offline.
    </p>
    
    <AccessibleButton
      onClick={onRetry}
      variant="primary"
      ariaLabel="Check connection and retry"
    >
      Retry
    </AccessibleButton>
  </div>
);

// Higher-order component for error handling
export const withErrorHandling = (WrappedComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, hasError: false };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
      console.error('Error caught by withErrorHandling:', error, errorInfo);
    }
    
    handleRetry = () => {
      this.setState({ error: null, hasError: false });
    }
    
    render() {
      if (this.state.hasError) {
        return (
          <LoadingError
            error={this.state.error}
            onRetry={this.handleRetry}
            showDetails={process.env.NODE_ENV === 'development'}
          />
        );
      }
      
      return <WrappedComponent {...this.props} />;
    }
  };
};