/**
 * Standardized API Response Utilities
 * Provides consistent response patterns across all API endpoints
 */

/**
 * Standard API response statuses
 */
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Standard HTTP status codes with descriptions
 */
export const HTTP_STATUS = {
  OK: { code: 200, message: 'OK' },
  CREATED: { code: 201, message: 'Created' },
  ACCEPTED: { code: 202, message: 'Accepted' },
  NO_CONTENT: { code: 204, message: 'No Content' },
  BAD_REQUEST: { code: 400, message: 'Bad Request' },
  UNAUTHORIZED: { code: 401, message: 'Unauthorized' },
  FORBIDDEN: { code: 403, message: 'Forbidden' },
  NOT_FOUND: { code: 404, message: 'Not Found' },
  METHOD_NOT_ALLOWED: { code: 405, message: 'Method Not Allowed' },
  CONFLICT: { code: 409, message: 'Conflict' },
  UNPROCESSABLE_ENTITY: { code: 422, message: 'Unprocessable Entity' },
  TOO_MANY_REQUESTS: { code: 429, message: 'Too Many Requests' },
  INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal Server Error' },
  BAD_GATEWAY: { code: 502, message: 'Bad Gateway' },
  SERVICE_UNAVAILABLE: { code: 503, message: 'Service Unavailable' },
  GATEWAY_TIMEOUT: { code: 504, message: 'Gateway Timeout' }
};

/**
 * Create a standardized success response
 * @param {Object} data - The response data
 * @param {Object} options - Response options
 * @param {string} options.message - Custom success message
 * @param {Object} options.meta - Additional metadata
 * @param {number} options.statusCode - HTTP status code (default: 200)
 * @param {string} options.requestId - Request ID for tracking
 * @returns {Object} Standardized success response
 */
export function createSuccessResponse(data, options = {}) {
  const {
    message = 'Request completed successfully',
    meta = {},
    statusCode = 200,
    requestId
  } = options;

  const response = {
    status: API_STATUS.SUCCESS,
    statusCode,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0',
      ...meta
    }
  };

  if (requestId) {
    response.meta.requestId = requestId;
  }

  return response;
}

/**
 * Create a standardized error response
 * @param {string|Error} error - Error message or Error object
 * @param {Object} options - Response options
 * @param {number} options.statusCode - HTTP status code (default: 500)
 * @param {string} options.code - Error code for client handling
 * @param {Object} options.details - Additional error details
 * @param {Array<string>} options.suggestions - Recovery suggestions
 * @param {string} options.requestId - Request ID for tracking
 * @param {boolean} options.retryable - Whether the error is retryable
 * @returns {Object} Standardized error response
 */
export function createErrorResponse(error, options = {}) {
  const {
    statusCode = 500,
    code,
    details = {},
    suggestions = [],
    requestId,
    retryable = false
  } = options;

  let message = 'An unexpected error occurred';
  let errorDetails = details;

  if (error instanceof Error) {
    message = error.message;
    if (process.env.NODE_ENV === 'development') {
      errorDetails = {
        ...details,
        name: error.name,
        stack: error.stack
      };
    }
  } else if (typeof error === 'string') {
    message = error;
  }

  const response = {
    status: API_STATUS.ERROR,
    statusCode,
    message,
    error: {
      code: code || `E${statusCode}`,
      details: errorDetails,
      retryable,
      ...(suggestions.length > 0 && { suggestions })
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
  };

  if (requestId) {
    response.meta.requestId = requestId;
  }

  return response;
}

/**
 * Create a standardized validation error response
 * @param {Object|Array} validationErrors - Validation errors
 * @param {Object} options - Response options
 * @param {string} options.message - Custom validation message
 * @param {string} options.requestId - Request ID for tracking
 * @returns {Object} Standardized validation error response
 */
export function createValidationErrorResponse(validationErrors, options = {}) {
  const {
    message = 'Validation failed',
    requestId
  } = options;

  let errors = [];

  if (Array.isArray(validationErrors)) {
    errors = validationErrors;
  } else if (validationErrors && typeof validationErrors === 'object') {
    // Handle different validation error formats
    if (validationErrors.errors) {
      // Yup validation errors
      errors = validationErrors.errors;
    } else {
      // Convert object to array
      errors = Object.entries(validationErrors).map(([field, error]) => ({
        field,
        message: error,
        code: 'VALIDATION_FAILED'
      }));
    }
  }

  return createErrorResponse(message, {
    statusCode: 400,
    code: 'VALIDATION_ERROR',
    details: {
      validation: {
        errors,
        summary: `${errors.length} validation error${errors.length !== 1 ? 's' : ''} occurred`
      }
    },
    suggestions: [
      'Please correct the highlighted fields and try again',
      'Ensure all required fields are properly filled',
      'Check the format of your input data'
    ],
    requestId,
    retryable: true
  });
}

/**
 * Create a paginated response
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination information
 * @param {number} pagination.page - Current page number
 * @param {number} pagination.limit - Items per page
 * @param {number} pagination.total - Total number of items
 * @param {Object} options - Additional options
 * @returns {Object} Standardized paginated response
 */
export function createPaginatedResponse(data, pagination, options = {}) {
  const { page, limit, total } = pagination;
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  const paginationMeta = {
    pagination: {
      currentPage: page,
      perPage: limit,
      totalItems: total,
      totalPages,
      hasNext,
      hasPrevious,
      ...(hasNext && { nextPage: page + 1 }),
      ...(hasPrevious && { previousPage: page - 1 })
    }
  };

  return createSuccessResponse(data, {
    ...options,
    meta: {
      ...paginationMeta,
      ...(options.meta || {})
    }
  });
}

/**
 * Create a response with multiple items and metadata
 * @param {Array} items - Array of items
 * @param {Object} options - Response options
 * @param {Object} options.stats - Statistics about the items
 * @param {Object} options.filters - Applied filters
 * @param {Object} options.sorting - Applied sorting
 * @returns {Object} Standardized collection response
 */
export function createCollectionResponse(items, options = {}) {
  const {
    stats = {},
    filters = {},
    sorting = {}
  } = options;

  const collectionMeta = {
    collection: {
      count: items.length,
      ...(Object.keys(stats).length > 0 && { stats }),
      ...(Object.keys(filters).length > 0 && { filters }),
      ...(Object.keys(sorting).length > 0 && { sorting })
    }
  };

  return createSuccessResponse(items, {
    ...options,
    meta: {
      ...collectionMeta,
      ...(options.meta || {})
    }
  });
}

/**
 * Handle async operations with standardized responses
 * @param {Function} asyncOperation - The async operation to execute
 * @param {Object} options - Options for response handling
 * @returns {Object} Standardized response
 */
export async function handleAsyncOperation(asyncOperation, options = {}) {
  const {
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed',
    requestId
  } = options;

  try {
    const result = await asyncOperation();
    return createSuccessResponse(result, {
      message: successMessage,
      requestId
    });
  } catch (error) {
    return createErrorResponse(error, {
      statusCode: error.statusCode || 500,
      requestId,
      retryable: shouldRetry(error)
    });
  }
}

/**
 * Send standardized JSON response
 * @param {Object} res - Next.js response object
 * @param {Object} responseData - Response data from create* functions
 */
export function sendResponse(res, responseData) {
  const { statusCode, ...body } = responseData;
  
  // Set standard headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  return res.status(statusCode).json(body);
}

/**
 * Wrapper for API handlers that provides standardized response handling
 * @param {Function} handler - The API handler function
 * @returns {Function} Wrapped handler with response standardization
 */
export function withStandardResponse(handler) {
  return async (req, res) => {
    const requestId = req.requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    req.requestId = requestId;

    try {
      // Execute the handler
      const result = await handler(req, res);
      
      // If the handler didn't send a response, send the result
      if (!res.headersSent) {
        if (result && typeof result === 'object') {
          // If result looks like a standardized response, use it directly
          if (result.status && result.statusCode) {
            return sendResponse(res, result);
          } else {
            // Otherwise, wrap it in a success response
            return sendResponse(res, createSuccessResponse(result, { requestId }));
          }
        } else {
          // For primitive results
          return sendResponse(res, createSuccessResponse(result, { requestId }));
        }
      }
    } catch (error) {
      // If response wasn't sent, send standardized error
      if (!res.headersSent) {
        const errorResponse = createErrorResponse(error, {
          statusCode: error.statusCode || 500,
          requestId,
          retryable: shouldRetry(error)
        });
        return sendResponse(res, errorResponse);
      }
    }
  };
}

/**
 * Check if an error should be retryable
 * @param {Error} error - The error to check
 * @returns {boolean} Whether the error is retryable
 */
function shouldRetry(error) {
  const retryableErrors = [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'EAI_AGAIN',
    'SERVICE_UNAVAILABLE',
    'RATE_LIMIT'
  ];

  const retryableStatusCodes = [408, 429, 500, 502, 503, 504];

  return retryableErrors.some(code => error.code === code || error.message.includes(code)) ||
         retryableStatusCodes.includes(error.statusCode) ||
         retryableStatusCodes.includes(error.status);
}

/**
 * Educational platform specific response helpers
 */
export const EducationResponses = {
  /**
   * Quiz submission response
   */
  quizSubmission: (submissionData) => createSuccessResponse(submissionData, {
    message: 'Quiz submitted successfully',
    meta: {
      submissionType: 'quiz',
      processed: true
    }
  }),

  /**
   * Progress update response
   */
  progressUpdate: (progressData) => createSuccessResponse(progressData, {
    message: 'Progress updated successfully',
    meta: {
      updateType: 'progress',
      calculated: true
    }
  }),

  /**
   * Assignment submission response
   */
  assignmentSubmission: (assignmentData) => createSuccessResponse(assignmentData, {
    message: 'Assignment submitted successfully',
    meta: {
      submissionType: 'assignment',
      fileProcessed: !!assignmentData.fileUrl
    }
  }),

  /**
   * User achievement response
   */
  achievement: (achievementData) => createSuccessResponse(achievementData, {
    message: 'Achievement unlocked!',
    meta: {
      type: 'achievement',
      category: achievementData.category
    }
  })
};