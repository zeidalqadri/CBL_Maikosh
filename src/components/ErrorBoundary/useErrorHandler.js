import { useCallback } from 'react';
import logger from '../../utils/logger';

/**
 * Custom hook for handling errors in functional components
 * Provides consistent error reporting and user feedback
 */
const useErrorHandler = (context = 'Unknown', userId = null) => {
  
  const reportError = useCallback((error, additionalData = {}) => {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log error with context
    logger.error(`Error in ${context}`, error, {
      errorId,
      context,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      ...additionalData
    });

    // Report to external monitoring services
    if (typeof window !== 'undefined') {
      // Sentry
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          tags: { context, userId },
          extra: { errorId, ...additionalData }
        });
      }

      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: false,
          context,
          error_id: errorId
        });
      }
    }

    return errorId;
  }, [context, userId]);

  const handleAsyncError = useCallback(async (asyncOperation, fallbackValue = null) => {
    try {
      return await asyncOperation();
    } catch (error) {
      const errorId = reportError(error, { 
        operation: 'async',
        fallbackProvided: fallbackValue !== null 
      });
      
      // Return fallback value or null
      return fallbackValue;
    }
  }, [reportError]);

  const handleError = useCallback((error, showUserMessage = true) => {
    const errorId = reportError(error);
    
    if (showUserMessage && typeof window !== 'undefined') {
      // You could integrate with a toast library here
      console.warn(`Error occurred (${errorId}): ${error.message}`);
    }
    
    return errorId;
  }, [reportError]);

  const createErrorHandler = useCallback((errorType, customMessage) => {
    return (error) => {
      const errorId = reportError(error, { errorType, customMessage });
      
      if (typeof window !== 'undefined') {
        console.warn(customMessage || `${errorType} error occurred (${errorId})`);
      }
      
      return errorId;
    };
  }, [reportError]);

  return {
    reportError,
    handleError,
    handleAsyncError,
    createErrorHandler
  };
};

export default useErrorHandler;