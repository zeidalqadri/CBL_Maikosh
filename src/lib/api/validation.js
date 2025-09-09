/**
 * Enhanced Validation System with OpenAPI Schema Generation
 * Provides comprehensive request/response validation with automatic documentation
 */

import * as yup from 'yup';
import { sanitizeText, sanitizeHtml } from '../../utils/validation';

/**
 * Enhanced validation schema with OpenAPI metadata
 */
class ValidationSchema {
  constructor(schema, metadata = {}) {
    this.schema = schema;
    this.metadata = {
      title: '',
      description: '',
      examples: [],
      tags: [],
      ...metadata
    };
    this.openApiSchema = null;
  }

  /**
   * Validate data against the schema
   */
  async validate(data, options = {}) {
    const defaultOptions = {
      abortEarly: false,
      stripUnknown: true
    };
    
    return await this.schema.validate(data, { ...defaultOptions, ...options });
  }

  /**
   * Generate OpenAPI schema from Yup schema
   */
  toOpenAPI() {
    if (this.openApiSchema) {
      return this.openApiSchema;
    }

    this.openApiSchema = this.convertYupToOpenAPI(this.schema);
    return this.openApiSchema;
  }

  /**
   * Convert Yup schema to OpenAPI schema
   */
  convertYupToOpenAPI(yupSchema) {
    const openApiSchema = {};

    // Handle different Yup schema types
    if (yupSchema._type === 'object') {
      openApiSchema.type = 'object';
      openApiSchema.properties = {};
      openApiSchema.required = [];

      // Process object fields
      if (yupSchema.fields) {
        Object.entries(yupSchema.fields).forEach(([key, fieldSchema]) => {
          openApiSchema.properties[key] = this.convertYupToOpenAPI(fieldSchema);
          
          // Check if field is required
          if (fieldSchema._exclusive && fieldSchema._exclusive.required) {
            openApiSchema.required.push(key);
          }
        });
      }

      // Remove empty required array
      if (openApiSchema.required.length === 0) {
        delete openApiSchema.required;
      }

    } else if (yupSchema._type === 'array') {
      openApiSchema.type = 'array';
      if (yupSchema.innerType) {
        openApiSchema.items = this.convertYupToOpenAPI(yupSchema.innerType);
      }

    } else if (yupSchema._type === 'string') {
      openApiSchema.type = 'string';
      
      // Add string constraints
      if (yupSchema._whitelist && yupSchema._whitelist.list) {
        openApiSchema.enum = [...yupSchema._whitelist.list];
      }
      
      // Add min/max length
      yupSchema.tests.forEach(test => {
        if (test.OPTIONS?.name === 'min') {
          openApiSchema.minLength = test.OPTIONS.params.min;
        }
        if (test.OPTIONS?.name === 'max') {
          openApiSchema.maxLength = test.OPTIONS.params.max;
        }
        if (test.OPTIONS?.name === 'matches') {
          openApiSchema.pattern = test.OPTIONS.params.regex.source;
        }
      });

    } else if (yupSchema._type === 'number') {
      openApiSchema.type = yupSchema._exclusive?.integer ? 'integer' : 'number';
      
      // Add number constraints
      yupSchema.tests.forEach(test => {
        if (test.OPTIONS?.name === 'min') {
          openApiSchema.minimum = test.OPTIONS.params.min;
        }
        if (test.OPTIONS?.name === 'max') {
          openApiSchema.maximum = test.OPTIONS.params.max;
        }
      });

    } else if (yupSchema._type === 'boolean') {
      openApiSchema.type = 'boolean';

    } else if (yupSchema._type === 'date') {
      openApiSchema.type = 'string';
      openApiSchema.format = 'date-time';

    } else {
      // Fallback for unknown types
      openApiSchema.type = 'string';
    }

    // Add description from schema meta or label
    if (yupSchema._label) {
      openApiSchema.description = yupSchema._label;
    }

    // Add examples from schema meta
    if (yupSchema._meta?.examples) {
      openApiSchema.examples = yupSchema._meta.examples;
    }

    return openApiSchema;
  }

  /**
   * Add metadata to the schema
   */
  withMetadata(metadata) {
    this.metadata = { ...this.metadata, ...metadata };
    return this;
  }

  /**
   * Add examples to the schema
   */
  withExamples(examples) {
    this.metadata.examples = [...this.metadata.examples, ...examples];
    return this;
  }
}

/**
 * Create enhanced validation schema
 */
export function createValidationSchema(yupSchema, metadata = {}) {
  return new ValidationSchema(yupSchema, metadata);
}

/**
 * Enhanced quiz submission validation with OpenAPI metadata
 */
export const quizSubmissionSchema = createValidationSchema(
  yup.object().shape({
    moduleId: yup.string()
      .required('Module ID is required')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid module ID format')
      .max(50, 'Module ID too long')
      .label('Module ID')
      .meta({ examples: ['module_1', 'basketball_basics', 'm1_fundamentals'] }),
    
    quizType: yup.string()
      .required('Quiz type is required')
      .oneOf(['knowledge', 'practical', 'video', 'assessment'], 'Invalid quiz type')
      .label('Quiz Type')
      .meta({ examples: ['knowledge', 'practical'] }),
    
    score: yup.number()
      .required('Score is required')
      .integer('Score must be an integer')
      .min(0, 'Score cannot be negative')
      .max(1000, 'Score too high')
      .label('Quiz Score')
      .meta({ examples: [75, 90, 85] }),
    
    totalQuestions: yup.number()
      .required('Total questions is required')
      .integer('Total questions must be an integer')
      .min(1, 'Must have at least 1 question')
      .max(100, 'Too many questions')
      .label('Total Questions')
      .meta({ examples: [10, 15, 20] }),
    
    answers: yup.array()
      .required('Answers are required')
      .of(yup.object().shape({
        questionId: yup.string()
          .required('Question ID is required')
          .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid question ID format')
          .label('Question ID'),
        
        selectedAnswer: yup.mixed()
          .required('Selected answer is required')
          .label('Selected Answer'),
        
        isCorrect: yup.boolean()
          .required('Correctness flag is required')
          .label('Is Correct'),
        
        timeSpent: yup.number()
          .min(0, 'Time spent cannot be negative')
          .max(600000, 'Time spent too high')
          .label('Time Spent (ms)')
      }))
      .min(1, 'At least one answer required')
      .max(100, 'Too many answers')
      .label('Quiz Answers')
  }),
  {
    title: 'Quiz Submission',
    description: 'Schema for validating quiz submissions',
    tags: ['education', 'quiz', 'assessment'],
    examples: [{
      moduleId: 'module_1',
      quizType: 'knowledge',
      score: 8,
      totalQuestions: 10,
      answers: [
        {
          questionId: 'q1',
          selectedAnswer: 'A',
          isCorrect: true,
          timeSpent: 15000
        }
      ]
    }]
  }
);

/**
 * Progress update validation
 */
export const progressUpdateSchema = createValidationSchema(
  yup.object().shape({
    moduleId: yup.string()
      .required('Module ID is required')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid module ID format')
      .max(50, 'Module ID too long')
      .label('Module ID'),
    
    progressData: yup.object().shape({
      completionPercentage: yup.number()
        .min(0, 'Completion percentage cannot be negative')
        .max(100, 'Completion percentage cannot exceed 100')
        .label('Completion Percentage'),
      
      sectionsCompleted: yup.array()
        .of(yup.string().matches(/^[a-zA-Z0-9_-]+$/, 'Invalid section ID'))
        .max(20, 'Too many sections')
        .label('Completed Sections'),
      
      timeSpent: yup.number()
        .min(0, 'Time spent cannot be negative')
        .max(86400000, 'Time spent too high')
        .label('Time Spent (ms)'),
      
      currentSection: yup.string()
        .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid section ID')
        .max(50, 'Section ID too long')
        .label('Current Section')
    }).required('Progress data is required')
  }),
  {
    title: 'Progress Update',
    description: 'Schema for updating user progress',
    tags: ['education', 'progress', 'tracking']
  }
);

/**
 * User ID validation
 */
export const userIdSchema = createValidationSchema(
  yup.string()
    .required('User ID is required')
    .matches(/^[a-zA-Z0-9|@._-]+$/, 'Invalid user ID format')
    .max(128, 'User ID too long')
    .label('User ID'),
  {
    title: 'User ID',
    description: 'Validation for Auth0 user IDs',
    tags: ['authentication', 'user']
  }
);

/**
 * Assignment submission validation
 */
export const assignmentSubmissionSchema = createValidationSchema(
  yup.object().shape({
    moduleId: yup.string()
      .required('Module ID is required')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid module ID format')
      .max(50, 'Module ID too long')
      .label('Module ID'),
    
    assignmentType: yup.string()
      .required('Assignment type is required')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid assignment type format')
      .max(50, 'Assignment type too long')
      .label('Assignment Type'),
    
    description: yup.string()
      .max(2000, 'Description too long')
      .label('Description')
      .transform(sanitizeText),
    
    file: yup.mixed()
      .test('fileSize', 'File too large', (value) => {
        if (!value) return true;
        return value.size <= 10 * 1024 * 1024; // 10MB
      })
      .test('fileType', 'Invalid file type', (value) => {
        if (!value) return true;
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'image/jpeg',
          'image/png',
          'image/gif'
        ];
        return allowedTypes.includes(value.type);
      })
      .label('File')
  }),
  {
    title: 'Assignment Submission',
    description: 'Schema for validating assignment submissions',
    tags: ['education', 'assignment', 'file-upload']
  }
);

/**
 * Pagination parameters validation
 */
export const paginationSchema = createValidationSchema(
  yup.object().shape({
    page: yup.number()
      .integer('Page must be an integer')
      .min(1, 'Page must be at least 1')
      .default(1)
      .label('Page Number'),
    
    limit: yup.number()
      .integer('Limit must be an integer')
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit cannot exceed 100')
      .default(20)
      .label('Items per Page'),
    
    sort: yup.string()
      .matches(/^[a-zA-Z0-9_]+:(asc|desc)$/, 'Invalid sort format')
      .label('Sort Order')
  }),
  {
    title: 'Pagination Parameters',
    description: 'Common pagination query parameters',
    tags: ['pagination', 'query']
  }
);

/**
 * Health check query parameters
 */
export const healthCheckSchema = createValidationSchema(
  yup.object().shape({
    detailed: yup.boolean()
      .default(false)
      .label('Detailed Check'),
    
    checks: yup.string()
      .matches(/^[a-zA-Z0-9_,]+$/, 'Invalid checks format')
      .label('Specific Checks')
  }),
  {
    title: 'Health Check Parameters',
    description: 'Parameters for health check endpoints',
    tags: ['monitoring', 'health']
  }
);

/**
 * Dashboard query parameters
 */
export const dashboardQuerySchema = createValidationSchema(
  yup.object().shape({
    timeframe: yup.string()
      .oneOf(['1h', '24h', '7d', '30d'], 'Invalid timeframe')
      .default('24h')
      .label('Timeframe'),
    
    metrics: yup.string()
      .matches(/^(all|[a-zA-Z0-9_,]+)$/, 'Invalid metrics format')
      .default('all')
      .label('Metrics Filter')
  }),
  {
    title: 'Dashboard Query Parameters',
    description: 'Parameters for dashboard data requests',
    tags: ['admin', 'dashboard', 'metrics']
  }
);

/**
 * Generic validation middleware with enhanced error handling
 */
export const validateRequest = (schema, options = {}) => {
  return async (req, res, next) => {
    const {
      validateBody = true,
      validateQuery = true,
      validateParams = true,
      sanitize = true
    } = options;

    try {
      let dataToValidate = {};

      // Collect data from different sources
      if (validateBody && req.body) {
        dataToValidate = { ...dataToValidate, ...req.body };
      }
      if (validateQuery && req.query) {
        dataToValidate = { ...dataToValidate, ...req.query };
      }
      if (validateParams && req.params) {
        dataToValidate = { ...dataToValidate, ...req.params };
      }

      // Sanitize data if enabled
      if (sanitize) {
        dataToValidate = sanitizeRequestData(dataToValidate);
      }

      // Validate against schema
      const validatedData = await schema.validate(dataToValidate);

      // Attach validated data to request
      req.validated = validatedData;

      if (next) next();
    } catch (error) {
      // Convert validation error to standardized format
      const validationErrors = error.errors || [error.message];
      
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Validation failed',
        error: {
          code: 'VALIDATION_ERROR',
          details: {
            validation: {
              errors: validationErrors.map(err => ({
                field: error.path || 'unknown',
                message: err,
                code: 'VALIDATION_FAILED'
              })),
              summary: `${validationErrors.length} validation error${validationErrors.length !== 1 ? 's' : ''} occurred`
            }
          },
          retryable: true,
          suggestions: [
            'Please correct the highlighted fields and try again',
            'Ensure all required fields are properly filled',
            'Check the format of your input data'
          ]
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0',
          requestId: req.requestId
        }
      });
    }
  };
};

/**
 * Sanitize request data recursively
 */
export const sanitizeRequestData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeText(item) : 
        typeof item === 'object' ? sanitizeRequestData(item) : item
      );
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeRequestData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Response validation (for testing and documentation)
 */
export const validateResponse = (schema) => {
  return (data) => {
    try {
      return schema.validate(data);
    } catch (error) {
      console.error('Response validation failed:', error);
      // In production, you might want to report this to monitoring
      return data; // Return original data to not break the response
    }
  };
};

/**
 * Generate OpenAPI specification from validation schemas
 */
export class OpenAPIGenerator {
  constructor(info = {}) {
    this.spec = {
      openapi: '3.0.3',
      info: {
        title: 'CBL-MAIKOSH Basketball Coaching API',
        version: '1.0.0',
        description: 'REST API for the CBL-MAIKOSH basketball coaching platform',
        contact: {
          name: 'CBL-MAIKOSH Support',
          email: 'support@cbl-maikosh.com',
          url: 'https://cbl-maikosh.com/support'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        },
        ...info
      },
      servers: [
        {
          url: 'http://localhost:8411/api',
          description: 'Development server'
        },
        {
          url: 'https://cbl-maikosh.vercel.app/api',
          description: 'Production server'
        }
      ],
      tags: [
        {
          name: 'authentication',
          description: 'Authentication and authorization endpoints'
        },
        {
          name: 'education',
          description: 'Educational content and assessment endpoints'
        },
        {
          name: 'progress',
          description: 'User progress tracking endpoints'
        },
        {
          name: 'admin',
          description: 'Administrative endpoints'
        },
        {
          name: 'monitoring',
          description: 'Health and monitoring endpoints'
        }
      ],
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {
          Auth0: {
            type: 'oauth2',
            flows: {
              authorizationCode: {
                authorizationUrl: 'https://your-auth0-domain/authorize',
                tokenUrl: 'https://your-auth0-domain/oauth/token',
                scopes: {
                  'read:profile': 'Read user profile',
                  'write:progress': 'Update user progress',
                  'read:admin': 'Access admin features'
                }
              }
            }
          },
          CSRF: {
            type: 'apiKey',
            in: 'header',
            name: 'X-CSRF-Token',
            description: 'CSRF protection token'
          }
        }
      }
    };
  }

  /**
   * Add a path to the OpenAPI specification
   */
  addPath(path, method, operation, requestSchema, responseSchema) {
    if (!this.spec.paths[path]) {
      this.spec.paths[path] = {};
    }

    const openApiOperation = {
      summary: operation.summary || '',
      description: operation.description || '',
      tags: operation.tags || [],
      security: operation.security || [{ Auth0: [] }, { CSRF: [] }],
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: responseSchema ? responseSchema.toOpenAPI() : {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'success' },
                  data: { type: 'object' }
                }
              }
            }
          }
        },
        '400': {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        '500': {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    };

    // Add request body for POST/PUT/PATCH
    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && requestSchema) {
      openApiOperation.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: requestSchema.toOpenAPI()
          }
        }
      };
    }

    // Add query parameters for GET requests
    if (method.toLowerCase() === 'get' && requestSchema) {
      const querySchema = requestSchema.toOpenAPI();
      if (querySchema.properties) {
        openApiOperation.parameters = Object.entries(querySchema.properties).map(([name, schema]) => ({
          name,
          in: 'query',
          required: querySchema.required?.includes(name) || false,
          schema,
          description: schema.description
        }));
      }
    }

    this.spec.paths[path][method.toLowerCase()] = openApiOperation;
  }

  /**
   * Add a schema to the components section
   */
  addSchema(name, schema) {
    this.spec.components.schemas[name] = schema.toOpenAPI ? schema.toOpenAPI() : schema;
  }

  /**
   * Generate complete OpenAPI specification
   */
  generate() {
    // Add common error response schemas
    this.addSchema('ErrorResponse', {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        statusCode: { type: 'integer', example: 400 },
        message: { type: 'string', example: 'An error occurred' },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'VALIDATION_ERROR' },
            details: { type: 'object' },
            retryable: { type: 'boolean', example: false },
            suggestions: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        meta: {
          type: 'object',
          properties: {
            timestamp: { type: 'string', format: 'date-time' },
            version: { type: 'string', example: '1.0' },
            requestId: { type: 'string', example: 'req_123456789' }
          }
        }
      }
    });

    return this.spec;
  }
}

/**
 * Pre-configured OpenAPI generator instance
 */
export const openApiGenerator = new OpenAPIGenerator();

// Add common schemas to the generator
openApiGenerator.addSchema('QuizSubmission', quizSubmissionSchema);
openApiGenerator.addSchema('ProgressUpdate', progressUpdateSchema);
openApiGenerator.addSchema('AssignmentSubmission', assignmentSubmissionSchema);
openApiGenerator.addSchema('Pagination', paginationSchema);