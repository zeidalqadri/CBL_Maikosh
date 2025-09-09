/**
 * Enhanced API Middleware Architecture
 * Provides reusable middleware for common API concerns
 */

import { getUserFromRequest } from '../../config/firebaseAdmin';
import logger from '../../utils/logger';
import { createErrorResponse, sendResponse } from './response';
import { validateRequest } from './validation';

/**
 * Compose multiple middleware functions
 * @param {...Function} middlewares - Middleware functions to compose
 * @returns {Function} Composed middleware
 */
export function compose(...middlewares) {
  return async (req, res, next) => {
    let index = 0;

    async function dispatch(i) {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;

      if (i === middlewares.length) {
        if (next) return next();
        return;
      }

      const fn = middlewares[i];
      if (!fn) return dispatch(i + 1);

      try {
        await fn(req, res, () => dispatch(i + 1));
      } catch (error) {
        throw error;
      }
    }

    return dispatch(0);
  };
}

/**
 * Request logging middleware
 * @param {Object} options - Logging options
 * @returns {Function} Middleware function
 */
export function requestLogger(options = {}) {
  const {
    level = 'info',
    includeBody = false,
    includeHeaders = false,
    excludePaths = ['/api/health', '/api/docs']
  } = options;

  return (req, res, next) => {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Attach request ID to request object
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);

    // Skip logging for excluded paths
    if (excludePaths.some(path => req.url?.startsWith(path))) {
      return next();
    }

    const logData = {
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      timestamp: new Date().toISOString()
    };

    // Include optional data
    if (includeHeaders) {
      logData.headers = req.headers;
    }
    if (includeBody && req.body) {
      logData.body = req.body;
    }

    logger[level]('API Request Started', logData);

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(...args) {
      const duration = Date.now() - startTime;
      
      logger[level]('API Request Completed', {
        requestId,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString()
      });

      originalEnd.apply(res, args);
    };

    next();
  };
}

/**
 * CORS middleware
 * @param {Object} options - CORS options
 * @returns {Function} Middleware function
 */
export function cors(options = {}) {
  const {
    origin = ['http://localhost:3000', 'http://localhost:8411', 'https://cbl-maikosh.vercel.app'],
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials = true,
    maxAge = 86400 // 24 hours
  } = options;

  return (req, res, next) => {
    const requestOrigin = req.headers.origin;

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin || '*');
      res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
      res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
      res.setHeader('Access-Control-Max-Age', maxAge);
      
      if (credentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
      
      return res.status(204).end();
    }

    // Set CORS headers for actual requests
    if (requestOrigin && origin.includes(requestOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    } else if (origin.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    if (credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    next();
  };
}

/**
 * Security headers middleware
 * @param {Object} options - Security options
 * @returns {Function} Middleware function
 */
export function securityHeaders(options = {}) {
  const {
    contentSecurityPolicy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    xFrameOptions = 'DENY',
    xContentTypeOptions = 'nosniff',
    referrerPolicy = 'strict-origin-when-cross-origin',
    crossOriginEmbedderPolicy = 'require-corp',
    crossOriginOpenerPolicy = 'same-origin',
    crossOriginResourcePolicy = 'same-origin'
  } = options;

  return (req, res, next) => {
    // Security headers
    res.setHeader('Content-Security-Policy', contentSecurityPolicy);
    res.setHeader('X-Frame-Options', xFrameOptions);
    res.setHeader('X-Content-Type-Options', xContentTypeOptions);
    res.setHeader('Referrer-Policy', referrerPolicy);
    res.setHeader('Cross-Origin-Embedder-Policy', crossOriginEmbedderPolicy);
    res.setHeader('Cross-Origin-Opener-Policy', crossOriginOpenerPolicy);
    res.setHeader('Cross-Origin-Resource-Policy', crossOriginResourcePolicy);
    
    // Remove server information
    res.removeHeader('X-Powered-By');
    
    next();
  };
}

/**
 * Authentication middleware
 * @param {Object} options - Authentication options
 * @returns {Function} Middleware function
 */
export function requireAuth(options = {}) {
  const {
    optional = false,
    roles = [],
    permissions = []
  } = options;

  return async (req, res, next) => {
    try {
      let user = null;
      
      try {
        user = await getUserFromRequest(req);
      } catch (error) {
        // User not authenticated
        if (optional) {
          req.user = null;
          return next();
        }

        logger.security('Unauthorized API access attempt', {
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          url: req.url,
          requestId: req.requestId
        });

        const errorResponse = createErrorResponse('Authentication required', {
          statusCode: 401,
          code: 'AUTH_REQUIRED',
          suggestions: ['Please sign in to access this endpoint'],
          requestId: req.requestId
        });

        return sendResponse(res, errorResponse);
      }

      // Attach user to request
      req.user = user;

      // Check roles if specified
      if (roles.length > 0) {
        const userRoles = user.customClaims?.roles || [];
        const hasRequiredRole = roles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
          logger.security('Insufficient permissions', {
            userId: user.uid,
            requiredRoles: roles,
            userRoles,
            url: req.url,
            requestId: req.requestId
          });

          const errorResponse = createErrorResponse('Insufficient permissions', {
            statusCode: 403,
            code: 'INSUFFICIENT_PERMISSIONS',
            suggestions: ['Contact an administrator for access'],
            requestId: req.requestId
          });

          return sendResponse(res, errorResponse);
        }
      }

      // Check permissions if specified
      if (permissions.length > 0) {
        const userPermissions = user.customClaims?.permissions || [];
        const hasRequiredPermission = permissions.some(permission => 
          userPermissions.includes(permission)
        );

        if (!hasRequiredPermission) {
          logger.security('Insufficient permissions', {
            userId: user.uid,
            requiredPermissions: permissions,
            userPermissions,
            url: req.url,
            requestId: req.requestId
          });

          const errorResponse = createErrorResponse('Insufficient permissions', {
            statusCode: 403,
            code: 'INSUFFICIENT_PERMISSIONS',
            suggestions: ['Contact an administrator for access'],
            requestId: req.requestId
          });

          return sendResponse(res, errorResponse);
        }
      }

      next();
    } catch (error) {
      logger.error('Authentication middleware error', error, {
        url: req.url,
        requestId: req.requestId
      });

      const errorResponse = createErrorResponse('Authentication failed', {
        statusCode: 500,
        code: 'AUTH_ERROR',
        requestId: req.requestId
      });

      return sendResponse(res, errorResponse);
    }
  };
}

/**
 * Method validation middleware
 * @param {Array<string>} allowedMethods - Allowed HTTP methods
 * @returns {Function} Middleware function
 */
export function allowMethods(allowedMethods) {
  return (req, res, next) => {
    if (!allowedMethods.includes(req.method)) {
      res.setHeader('Allow', allowedMethods.join(', '));
      
      const errorResponse = createErrorResponse('Method not allowed', {
        statusCode: 405,
        code: 'METHOD_NOT_ALLOWED',
        details: { allowedMethods },
        suggestions: [`Use one of these methods: ${allowedMethods.join(', ')}`],
        requestId: req.requestId
      });

      return sendResponse(res, errorResponse);
    }

    next();
  };
}

/**
 * Request timeout middleware
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Function} Middleware function
 */
export function timeout(timeout = 30000) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        logger.warn('Request timeout', {
          url: req.url,
          method: req.method,
          timeout,
          requestId: req.requestId
        });

        const errorResponse = createErrorResponse('Request timeout', {
          statusCode: 408,
          code: 'TIMEOUT',
          suggestions: ['Please try again', 'Check your network connection'],
          requestId: req.requestId
        });

        sendResponse(res, errorResponse);
      }
    }, timeout);

    // Clear timeout when request completes
    const originalEnd = res.end;
    res.end = function(...args) {
      clearTimeout(timer);
      originalEnd.apply(res, args);
    };

    next();
  };
}

/**
 * Response caching middleware
 * @param {Object} options - Cache options
 * @returns {Function} Middleware function
 */
export function cache(options = {}) {
  const {
    ttl = 300, // 5 minutes
    private = false,
    revalidate = false,
    vary = ['Authorization']
  } = options;

  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheControl = [
      options.private ? 'private' : 'public',
      `max-age=${ttl}`,
      revalidate ? 'must-revalidate' : ''
    ].filter(Boolean).join(', ');

    res.setHeader('Cache-Control', cacheControl);
    
    if (vary.length > 0) {
      res.setHeader('Vary', vary.join(', '));
    }

    next();
  };
}

/**
 * Content compression middleware
 * @param {Object} options - Compression options
 * @returns {Function} Middleware function
 */
export function compress(options = {}) {
  const {
    threshold = 1024,
    level = 6,
    filter = () => true
  } = options;

  return (req, res, next) => {
    // Skip if already compressed
    if (res.getHeader('Content-Encoding')) {
      return next();
    }

    // Check accept-encoding
    const acceptEncoding = req.headers['accept-encoding'] || '';
    
    if (!acceptEncoding.includes('gzip')) {
      return next();
    }

    // Only compress if filter allows it
    if (!filter(req, res)) {
      return next();
    }

    // Set compression header
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Vary', 'Accept-Encoding');

    next();
  };
}

/**
 * Request size limiting middleware
 * @param {Object} options - Size limit options
 * @returns {Function} Middleware function
 */
export function limitSize(options = {}) {
  const {
    max = 10 * 1024 * 1024, // 10MB
    message = 'Request entity too large'
  } = options;

  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');

    if (contentLength > max) {
      logger.warn('Request size exceeded', {
        contentLength,
        max,
        url: req.url,
        requestId: req.requestId
      });

      const errorResponse = createErrorResponse(message, {
        statusCode: 413,
        code: 'PAYLOAD_TOO_LARGE',
        details: { maxSize: max, actualSize: contentLength },
        suggestions: ['Reduce the size of your request payload'],
        requestId: req.requestId
      });

      return sendResponse(res, errorResponse);
    }

    next();
  };
}

/**
 * API version middleware
 * @param {Object} options - Version options
 * @returns {Function} Middleware function
 */
export function apiVersion(options = {}) {
  const {
    current = '1.0',
    supported = ['1.0'],
    header = 'API-Version',
    default: defaultVersion = current
  } = options;

  return (req, res, next) => {
    const requestedVersion = req.headers[header.toLowerCase()] || defaultVersion;

    if (!supported.includes(requestedVersion)) {
      const errorResponse = createErrorResponse('Unsupported API version', {
        statusCode: 400,
        code: 'UNSUPPORTED_VERSION',
        details: { 
          requested: requestedVersion, 
          supported: supported 
        },
        suggestions: [`Use one of these versions: ${supported.join(', ')}`],
        requestId: req.requestId
      });

      return sendResponse(res, errorResponse);
    }

    // Set version headers
    res.setHeader('API-Version', requestedVersion);
    res.setHeader('Supported-Versions', supported.join(', '));

    req.apiVersion = requestedVersion;
    next();
  };
}

/**
 * Pre-configured middleware stacks for common use cases
 */
export const middleware = {
  /**
   * Basic API middleware stack
   */
  basic: compose(
    requestLogger(),
    cors(),
    securityHeaders(),
    timeout(30000)
  ),

  /**
   * Authenticated API middleware stack
   */
  authenticated: compose(
    requestLogger(),
    cors(),
    securityHeaders(),
    timeout(30000),
    requireAuth()
  ),

  /**
   * Admin API middleware stack
   */
  admin: compose(
    requestLogger({ includeBody: true }),
    cors(),
    securityHeaders(),
    timeout(60000),
    requireAuth({ roles: ['admin', 'super_admin'] })
  ),

  /**
   * Public API middleware stack
   */
  public: compose(
    requestLogger(),
    cors(),
    securityHeaders(),
    cache({ ttl: 300 }),
    timeout(15000)
  ),

  /**
   * File upload middleware stack
   */
  upload: compose(
    requestLogger(),
    cors(),
    securityHeaders(),
    limitSize({ max: 50 * 1024 * 1024 }), // 50MB for file uploads
    timeout(120000), // 2 minutes for uploads
    requireAuth()
  )
};

/**
 * Create API handler with middleware
 * @param {Function|Array} middlewareOrHandler - Middleware or handler function
 * @param {Function} handler - Handler function if middleware is provided
 * @returns {Function} Next.js API handler
 */
export function withMiddleware(middlewareOrHandler, handler) {
  // If only handler is provided, use basic middleware
  if (typeof middlewareOrHandler === 'function' && !handler) {
    return async (req, res) => {
      try {
        await middleware.basic(req, res, async () => {
          await middlewareOrHandler(req, res);
        });
      } catch (error) {
        logger.error('API handler error', error, {
          url: req.url,
          method: req.method,
          requestId: req.requestId
        });

        if (!res.headersSent) {
          const errorResponse = createErrorResponse('Internal server error', {
            statusCode: 500,
            code: 'INTERNAL_ERROR',
            requestId: req.requestId
          });

          sendResponse(res, errorResponse);
        }
      }
    };
  }

  // If middleware and handler are provided
  return async (req, res) => {
    try {
      const middlewareStack = Array.isArray(middlewareOrHandler) 
        ? compose(...middlewareOrHandler) 
        : middlewareOrHandler;

      await middlewareStack(req, res, async () => {
        await handler(req, res);
      });
    } catch (error) {
      logger.error('API handler error', error, {
        url: req.url,
        method: req.method,
        requestId: req.requestId
      });

      if (!res.headersSent) {
        const errorResponse = createErrorResponse('Internal server error', {
          statusCode: 500,
          code: 'INTERNAL_ERROR',
          requestId: req.requestId
        });

        sendResponse(res, errorResponse);
      }
    }
  };
}