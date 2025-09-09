/**
 * Enhanced API Error Handling Middleware
 * Provides consistent error handling, logging, and user feedback across all API endpoints
 */

import logger from '../utils/logger';
import { classifyError, createErrorReport, getRecoveryStrategy } from '../components/ErrorBoundary/errorUtils';
import errorTracker from '../utils/errorTracking';

export function withErrorHandler(handler) {
  return async (req, res) => {
    const startTime = Date.now();
    
    try {
      // Set security headers
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      // Add request ID for tracking
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      req.requestId = requestId;
      res.setHeader('X-Request-ID', requestId);
      
      // Log request
      logger.info('API Request', {
        requestId,
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });
      
      // Execute the handler
      const result = await handler(req, res);
      
      // Log successful completion
      const duration = Date.now() - startTime;
      logger.info('API Request completed', {
        requestId,
        duration,
        statusCode: res.statusCode
      });
      
      return result;
      
    } catch (error) {
      return handleApiError(error, req, res, startTime);
    }
  };
}

function handleApiError(error, req, res, startTime) {
  const duration = Date.now() - startTime;
  const requestId = req.requestId;
  
  // Classify the error
  const errorClassification = classifyError(error, req.url);
  
  // Create error report
  const errorReport = createErrorReport(error, req.url, req.user?.sub, {
    method: req.method,
    requestId,
    duration,
    userAgent: req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
  });
  
  // Log error
  logger.error('API Error', error, {
    requestId,
    duration,
    classification: errorClassification,
    url: req.url,
    method: req.method,
    userId: req.user?.sub
  });
  
  // Report to monitoring services
  errorTracker.reportError(error, `API_${req.url}`, req.user?.sub, {
    method: req.method,
    requestId,
    duration
  });
  
  // Determine status code based on error type
  let statusCode = 500;
  
  if (error.name === 'ValidationError' || error.message.includes('validation')) {
    statusCode = 400;
  } else if (error.message.includes('unauthorized') || error.message.includes('auth')) {
    statusCode = 401;
  } else if (error.message.includes('forbidden') || error.message.includes('permission')) {
    statusCode = 403;
  } else if (error.message.includes('not found')) {
    statusCode = 404;
  } else if (error.message.includes('rate limit') || error.message.includes('too many')) {
    statusCode = 429;
  }
  
  // Create user-friendly error response
  const errorResponse = createErrorResponse(error, errorClassification, requestId, req);
  
  // Set error headers
  res.setHeader('Content-Type', 'application/json');
  
  // Add retry headers for retryable errors
  if (errorClassification.retryable) {
    res.setHeader('Retry-After', '5'); // 5 seconds
  }
  
  return res.status(statusCode).json(errorResponse);
}

function createErrorResponse(error, classification, requestId, req) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  const baseResponse = {
    error: true,
    message: classification.userMessage,
    category: classification.category,
    severity: classification.severity,
    retryable: classification.retryable,
    requestId,
    timestamp: new Date().toISOString()
  };
  
  // Add recovery suggestions
  const recoveryStrategy = getRecoveryStrategy(error, req.url);
  baseResponse.recovery = {
    strategy: recoveryStrategy,
    suggestions: getRecoverySuggestions(recoveryStrategy, req.url)
  };
  
  // Development mode: include more details
  if (isDevelopment) {
    baseResponse.debug = {
      originalMessage: error.message,
      name: error.name,
      stack: error.stack,
      url: req.url,
      method: req.method
    };
  }
  
  // Production mode: include minimal safe details
  if (isProduction) {
    // Only include error details for client errors (4xx), not server errors (5xx)
    if (error.status >= 400 && error.status < 500) {
      baseResponse.details = error.message;
    }
  }
  
  return baseResponse;
}

function getRecoverySuggestions(strategy, url) {
  switch (strategy) {
    case 'retry':
      return [
        'Please try again in a few moments',
        'Check your internet connection',
        'If the problem persists, contact support'
      ];
      
    case 'refresh':
      return [
        'Refresh the page and try again',
        'Clear your browser cache if the issue continues'
      ];
      
    case 'logout':
      return [
        'Please sign out and sign in again',
        'Your session may have expired'
      ];
      
    case 'redirect':
      return [
        'Navigate back to the main page',
        'Try accessing this feature from a different location'
      ];
      
    case 'contact_support':
      return [
        'Contact technical support',
        'Include the Request ID when reporting this issue',
        'This appears to be a system-level problem'
      ];
      
    default:
      return [
        'Please try again',
        'Contact support if the problem continues'
      ];
  }
}

// Middleware for handling async errors in Next.js API routes
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Validation error handler
export function handleValidationError(error, req, res) {
  const validationResponse = {
    error: true,
    message: 'Validation failed',
    category: 'validation',
    severity: 'low',
    retryable: true,
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    validation: {
      fields: extractValidationFields(error),
      summary: 'Please correct the highlighted fields and try again'
    }
  };
  
  logger.warn('Validation Error', {
    requestId: req.requestId,
    url: req.url,
    method: req.method,
    fields: validationResponse.validation.fields
  });
  
  return res.status(400).json(validationResponse);
}

function extractValidationFields(error) {
  // Handle different validation error formats
  if (error.details) {
    // Joi validation errors
    return error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context.value
    }));
  }
  
  if (error.errors) {
    // Mongoose validation errors
    return Object.keys(error.errors).map(field => ({
      field,
      message: error.errors[field].message,
      value: error.errors[field].value
    }));
  }
  
  // Generic validation error
  return [{
    field: 'unknown',
    message: error.message,
    value: null
  }];
}

// Rate limiting error handler
export function handleRateLimitError(req, res) {
  const rateLimitResponse = {
    error: true,
    message: 'Too many requests. Please slow down.',
    category: 'rate_limit',
    severity: 'medium',
    retryable: true,
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    rateLimit: {
      message: 'Request rate limit exceeded',
      retryAfter: 60, // seconds
      suggestion: 'Please wait before making additional requests'
    }
  };
  
  logger.security('Rate limit exceeded', {
    requestId: req.requestId,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    url: req.url,
    method: req.method
  });
  
  res.setHeader('Retry-After', '60');
  return res.status(429).json(rateLimitResponse);
}