import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const GlobalErrorFallback = (error, retry, errorId) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-court-blue to-basketball-orange flex items-center justify-center px-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-court-blue to-basketball-orange p-8 text-white text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white bg-opacity-20 mb-4">
          <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 2a10 10 0 0 0 0 20M12 2a10 10 0 0 1 0 20M2 12h20" fill="none" stroke="currentColor" strokeWidth="1"/>
            <path d="M8 6.5C10.5 4.5 13.5 4.5 16 6.5M8 17.5c2.5 2 5.5 2 8 0" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">CBL-MAIKOSH</h1>
        <p className="text-lg opacity-90">Basketball Coaching Excellence</p>
      </div>

      {/* Content */}
      <div className="p-8 text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Something Unexpected Happened
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            We encountered a technical issue with the basketball coaching platform. 
            Our team has been notified and is working to resolve this quickly.
          </p>
        </div>

        {/* Status Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            What's Protected
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Your learning progress is automatically saved</li>
            <li>• All quiz results and achievements are secure</li>
            <li>• Your coaching certifications remain valid</li>
            <li>• Course materials will be available when you return</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button 
            onClick={retry}
            className="bg-basketball-orange hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="bg-court-blue hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            Refresh Page
          </button>
          
          <button 
            onClick={() => window.open('https://status.cbl-maikosh.com', '_blank')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            System Status
          </button>
        </div>

        {/* Contact Information */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Need Immediate Help?</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Technical Support</h4>
              <p className="text-gray-600 mb-2">Available 24/7 for coaching professionals</p>
              <a 
                href="mailto:support@cbl-maikosh.com?subject=Platform Error&body=Error ID: ${errorId}"
                className="text-court-blue hover:text-blue-600 font-medium"
              >
                support@cbl-maikosh.com
              </a>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Emergency Access</h4>
              <p className="text-gray-600 mb-2">For urgent certification needs</p>
              <a 
                href="tel:+1-800-CBL-HELP"
                className="text-court-blue hover:text-blue-600 font-medium"
              >
                1-800-CBL-HELP
              </a>
            </div>
          </div>
        </div>

        {/* Error Reference */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-400">
            Reference ID: <code className="bg-gray-100 px-2 py-1 rounded">{errorId}</code>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Timestamp: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const GlobalErrorBoundary = ({ children }) => {
  const handleGlobalError = (error, errorInfo, errorId) => {
    // Critical error - notify all monitoring systems
    if (typeof window !== 'undefined') {
      // Google Analytics - Critical Error Event
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: true,
          error_id: errorId
        });
      }

      // Performance API - Mark critical error
      if (window.performance && window.performance.mark) {
        window.performance.mark(`critical-error-${errorId}`);
      }

      // Local storage backup for error reporting
      try {
        const errorLog = {
          errorId,
          timestamp: new Date().toISOString(),
          error: error.message,
          stack: error.stack,
          userAgent: navigator.userAgent,
          url: window.location.href
        };
        
        const existingErrors = JSON.parse(localStorage.getItem('cbl-error-log') || '[]');
        existingErrors.push(errorLog);
        
        // Keep only last 5 errors
        if (existingErrors.length > 5) {
          existingErrors.shift();
        }
        
        localStorage.setItem('cbl-error-log', JSON.stringify(existingErrors));
      } catch (e) {
        // Silent fail - don't let error logging break error handling
      }
    }
  };

  return (
    <ErrorBoundary 
      name="GlobalBoundary"
      fallback={GlobalErrorFallback}
      onError={handleGlobalError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default GlobalErrorBoundary;