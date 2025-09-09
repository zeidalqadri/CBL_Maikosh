/**
 * Production Error Tracking and Monitoring
 * Integrates with Sentry and other monitoring services
 */

import logger from './logger';
import { createErrorReport, formatErrorForLogging, classifyError } from '../components/ErrorBoundary/errorUtils';

class ErrorTracker {
  constructor() {
    this.isInitialized = false;
    this.sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    this.environment = process.env.NODE_ENV || 'development';
    this.release = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
    
    this.init();
  }

  async init() {
    if (typeof window === 'undefined' || this.isInitialized) {
      return;
    }

    try {
      // Initialize Sentry for client-side error tracking
      if (this.sentryDsn) {
        const Sentry = await import('@sentry/nextjs');
        
        Sentry.init({
          dsn: this.sentryDsn,
          environment: this.environment,
          release: this.release,
          
          // Performance Monitoring
          tracesSampleRate: this.environment === 'production' ? 0.1 : 1.0,
          
          // Session Replay (optional)
          replaysSessionSampleRate: this.environment === 'production' ? 0.01 : 0.1,
          replaysOnErrorSampleRate: 1.0,
          
          // Filtering
          beforeSend(event, hint) {
            // Filter out non-critical errors in production
            if (this.environment === 'production') {
              const error = hint.originalException;
              const classification = classifyError(error);
              
              // Skip low severity errors
              if (classification.severity === 'low') {
                return null;
              }
              
              // Skip certain known errors
              if (error?.message?.includes('ResizeObserver loop limit exceeded')) {
                return null;
              }
              
              if (error?.message?.includes('Non-Error promise rejection captured')) {
                return null;
              }
            }
            
            return event;
          },

          integrations: [
            // User context and performance
            new Sentry.BrowserTracing({
              routingInstrumentation: Sentry.nextRouterInstrumentation,
            }),
            
            // Session replay for debugging
            new Sentry.Replay(),
          ],

          // Custom tags
          initialScope: {
            tags: {
              component: 'cbl-maikosh',
              platform: 'basketball-coaching'
            }
          }
        });

        // Set global reference
        window.Sentry = Sentry;
        
        logger.info('Sentry initialized successfully', { 
          environment: this.environment,
          release: this.release 
        });
        
        this.isInitialized = true;
      } else {
        logger.warn('Sentry DSN not configured - error tracking limited to logs');
      }

      // Initialize additional tracking services
      await this.initGoogleAnalytics();
      await this.initLogRocket();
      
    } catch (error) {
      logger.error('Failed to initialize error tracking', error);
    }
  }

  async initGoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    
    if (!gaId || typeof window === 'undefined') {
      return;
    }

    try {
      // Load Google Analytics
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        page_title: 'CBL-MAIKOSH Basketball Coaching',
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: 'user_type',
          custom_parameter_2: 'coaching_level'
        }
      });

      // Enable enhanced error tracking
      window.gtag('config', gaId, {
        custom_parameter_1: 'basketball_coach',
        send_page_view: true
      });
      
      logger.info('Google Analytics initialized');
      
    } catch (error) {
      logger.error('Failed to initialize Google Analytics', error);
    }
  }

  async initLogRocket() {
    const logRocketId = process.env.NEXT_PUBLIC_LOGROCKET_ID;
    
    if (!logRocketId || typeof window === 'undefined' || this.environment !== 'production') {
      return;
    }

    try {
      const LogRocket = await import('logrocket');
      
      LogRocket.init(logRocketId, {
        release: this.release,
        console: {
          shouldAggregateConsoleErrors: true,
        },
        network: {
          requestSanitizer: request => {
            // Sanitize sensitive headers
            if (request.headers.authorization) {
              request.headers.authorization = '[REDACTED]';
            }
            return request;
          },
          responseSanitizer: response => {
            // Sanitize sensitive response data
            if (response.headers.authorization) {
              response.headers.authorization = '[REDACTED]';
            }
            return response;
          }
        }
      });

      // Identify user for better tracking
      LogRocket.identify = (userId, userTraits = {}) => {
        LogRocket.identify(userId, {
          name: userTraits.name,
          email: userTraits.email,
          coaching_level: userTraits.coachingLevel,
          subscription_type: userTraits.subscriptionType,
          // Don't include sensitive data
        });
      };
      
      window.LogRocket = LogRocket;
      logger.info('LogRocket initialized');
      
    } catch (error) {
      logger.error('Failed to initialize LogRocket', error);
    }
  }

  // Identify user for tracking
  identifyUser(userId, userData = {}) {
    if (typeof window === 'undefined') return;

    try {
      // Sentry user context
      if (window.Sentry) {
        window.Sentry.setUser({
          id: userId,
          email: userData.email,
          username: userData.name,
          coaching_level: userData.coachingLevel,
          subscription_type: userData.subscriptionType
        });
      }

      // Google Analytics user properties
      if (window.gtag) {
        window.gtag('set', {
          user_id: userId,
          custom_parameter_1: userData.coachingLevel || 'unknown',
          custom_parameter_2: userData.subscriptionType || 'free'
        });
      }

      // LogRocket user identification
      if (window.LogRocket && window.LogRocket.identify) {
        window.LogRocket.identify(userId, userData);
      }
      
      logger.audit('user_identified', userId, { 
        coachingLevel: userData.coachingLevel,
        subscriptionType: userData.subscriptionType 
      });
      
    } catch (error) {
      logger.error('Failed to identify user for tracking', error);
    }
  }

  // Track custom events
  trackEvent(eventName, properties = {}) {
    if (typeof window === 'undefined') return;

    try {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, {
          event_category: properties.category || 'user_interaction',
          event_label: properties.label,
          value: properties.value,
          custom_parameter_1: properties.coachingLevel,
          custom_parameter_2: properties.moduleId
        });
      }

      // Sentry breadcrumb
      if (window.Sentry) {
        window.Sentry.addBreadcrumb({
          category: properties.category || 'user_action',
          message: eventName,
          level: 'info',
          data: properties
        });
      }

      logger.audit(eventName, properties.userId || 'anonymous', properties);
      
    } catch (error) {
      logger.error('Failed to track event', error, { eventName, properties });
    }
  }

  // Track performance metrics
  trackPerformance(metric, value, context = {}) {
    if (typeof window === 'undefined') return;

    try {
      // Google Analytics custom metric
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: metric,
          value: Math.round(value),
          event_category: 'performance',
          event_label: context.page || window.location.pathname
        });
      }

      // Sentry performance transaction
      if (window.Sentry && context.transactionName) {
        const transaction = window.Sentry.startTransaction({
          name: context.transactionName,
          op: context.operation || 'custom'
        });
        
        transaction.setMeasurement(metric, value, 'millisecond');
        transaction.finish();
      }

      logger.info('Performance metric recorded', { 
        metric, 
        value: Math.round(value), 
        context 
      });
      
    } catch (error) {
      logger.error('Failed to track performance metric', error);
    }
  }

  // Track user journey and educational progress
  trackEducationalProgress(event, data = {}) {
    const eventData = {
      category: 'education',
      ...data,
      timestamp: new Date().toISOString()
    };

    this.trackEvent(event, eventData);
    
    // Special handling for completion events
    if (event.includes('completed') || event.includes('passed')) {
      this.trackEvent('learning_milestone', {
        ...eventData,
        milestone_type: event,
        success: true
      });
    }
  }

  // Report errors to monitoring services
  reportError(error, context = '', userId = null, additionalData = {}) {
    const errorReport = createErrorReport(error, context, userId, additionalData);
    const logEntry = formatErrorForLogging(errorReport);
    
    // Log locally
    logger.error(logEntry.message, error, logEntry);
    
    if (typeof window === 'undefined') return errorReport.errorId;

    try {
      // Sentry
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          tags: {
            context,
            category: errorReport.classification.category,
            severity: errorReport.classification.severity,
            errorId: errorReport.errorId
          },
          extra: additionalData,
          user: userId ? { id: userId } : undefined
        });
      }

      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: errorReport.classification.severity === 'critical',
          event_category: 'error',
          event_label: context,
          custom_parameter_1: errorReport.classification.category,
          custom_parameter_2: errorReport.errorId
        });
      }

      // Track error patterns
      this.trackEvent('error_occurred', {
        category: 'error',
        error_type: errorReport.classification.category,
        severity: errorReport.classification.severity,
        context,
        userId,
        errorId: errorReport.errorId
      });
      
    } catch (trackingError) {
      logger.error('Failed to report error to monitoring services', trackingError);
    }
    
    return errorReport.errorId;
  }

  // Health check for monitoring services
  healthCheck() {
    const status = {
      timestamp: new Date().toISOString(),
      services: {
        sentry: {
          initialized: this.isInitialized && !!window.Sentry,
          configured: !!this.sentryDsn
        },
        googleAnalytics: {
          initialized: !!window.gtag,
          configured: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
        },
        logRocket: {
          initialized: !!window.LogRocket,
          configured: !!process.env.NEXT_PUBLIC_LOGROCKET_ID
        }
      },
      environment: this.environment,
      release: this.release
    };

    logger.info('Error tracking health check', status);
    return status;
  }
}

// Create singleton instance
const errorTracker = new ErrorTracker();

// Export for use throughout the application
export default errorTracker;

// Export convenience methods
export const {
  identifyUser,
  trackEvent,
  trackPerformance,
  trackEducationalProgress,
  reportError,
  healthCheck
} = errorTracker;