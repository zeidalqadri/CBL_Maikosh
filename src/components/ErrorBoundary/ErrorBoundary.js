import React from 'react';
import logger from '../../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state to show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log the error with context
    logger.error('React Error Boundary caught error', error, {
      errorId,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.name || 'Unknown',
      userId: this.props.userId || 'anonymous',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString()
    });

    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Report to external error tracking service
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          component: 'ErrorBoundary',
          errorBoundary: this.props.name || 'Unknown'
        },
        extra: {
          errorId,
          componentStack: errorInfo.componentStack,
          userId: this.props.userId
        }
      });
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorId);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    });

    logger.audit('error_boundary_retry', this.props.userId || 'anonymous', {
      errorBoundary: this.props.name,
      errorId: this.state.errorId
    });
  };

  handleReport = () => {
    const { error, errorInfo, errorId } = this.state;
    const reportData = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    logger.audit('error_report_submitted', this.props.userId || 'anonymous', reportData);
    
    // You could send this to a support system or create a GitHub issue
    alert('Error report submitted. Thank you for helping us improve the platform!');
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI passed as prop
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error, 
          this.handleRetry, 
          this.state.errorId
        );
      }

      // Default fallback UI based on error level
      const isQuizError = this.props.name === 'QuizBoundary';
      const isModuleError = this.props.name === 'ModuleBoundary';
      const isGlobalError = this.props.name === 'GlobalBoundary';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isQuizError ? 'Quiz Error' :
               isModuleError ? 'Learning Module Error' :
               isGlobalError ? 'Application Error' :
               'Something went wrong'}
            </h2>

            {/* Error Message */}
            <p className="text-gray-600 mb-6">
              {isQuizError ? 
                "There was a problem with the quiz. Don't worry, your progress has been saved." :
               isModuleError ?
                "We encountered an issue loading this learning module. Your overall progress is safe." :
               isGlobalError ?
                "The application encountered an unexpected error. We're working to fix this." :
                "An unexpected error occurred. Please try again or contact support if the problem persists."
              }
            </p>

            {/* Error ID for support */}
            <p className="text-sm text-gray-500 mb-6">
              Error ID: <code className="bg-gray-100 px-2 py-1 rounded">{this.state.errorId}</code>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={this.handleRetry}
                className="bg-alloui-gold hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
              
              {!isGlobalError && (
                <button 
                  onClick={() => window.location.href = '/modules'}
                  className="bg-alloui-primary hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Return to Modules
                </button>
              )}

              <button 
                onClick={this.handleReport}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Report Issue
              </button>
            </div>

            {/* Development mode details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  Developer Details
                </summary>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Error:</h4>
                  <pre className="text-sm text-red-600 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                  
                  <h4 className="font-medium text-gray-900 mt-4 mb-2">Component Stack:</h4>
                  <pre className="text-sm text-gray-600 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;