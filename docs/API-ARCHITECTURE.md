# CBL-MAIKOSH API Architecture Documentation

## Overview

The CBL-MAIKOSH basketball coaching platform now features a comprehensive, enterprise-grade API architecture with standardized patterns, validation, documentation, and testing utilities.

## Key Features

### ✅ Standardized Response Patterns
- Consistent JSON response format across all endpoints
- Standardized error handling with recovery suggestions
- Proper HTTP status code usage
- Request ID tracking for debugging

### ✅ Comprehensive Validation
- Runtime request/response validation using Yup schemas
- Automatic sanitization of user input
- OpenAPI schema generation from validation rules
- Type-safe API contracts

### ✅ Interactive Documentation
- Auto-generated OpenAPI/Swagger specification
- Interactive API explorer at `/api-docs`
- Request/response examples with TypeScript types
- Authentication and authorization patterns

### ✅ Enhanced Middleware Architecture
- Composable middleware functions for common concerns
- Authentication and authorization middleware
- Rate limiting, CORS, and security headers
- Request logging and performance monitoring

### ✅ Production-Ready Security
- CSRF protection for state-changing operations
- Input sanitization and validation
- Rate limiting by IP and user
- Security headers and origin validation

## Architecture Components

### 1. Response Standardization (`/src/lib/api/response.js`)

All API responses follow a consistent format:

```javascript
// Success Response
{
  "status": "success",
  "statusCode": 200,
  "message": "Request completed successfully",
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "1.0",
    "requestId": "req_1642245000_abc123"
  }
}

// Error Response
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": { /* error details */ },
    "retryable": true,
    "suggestions": [
      "Please correct the highlighted fields and try again"
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "1.0",
    "requestId": "req_1642245000_abc123"
  }
}
```

### 2. Validation System (`/src/lib/api/validation.js`)

Enhanced validation with automatic OpenAPI generation:

```javascript
import { createValidationSchema, validateRequest } from '../../lib/api/validation';

const quizSchema = createValidationSchema(
  yup.object().shape({
    moduleId: yup.string().required().matches(/^[a-zA-Z0-9_-]+$/),
    score: yup.number().required().min(0).max(1000)
  }),
  {
    title: 'Quiz Submission',
    description: 'Schema for validating quiz submissions',
    tags: ['education', 'quiz']
  }
);

// Use in API handler
export default withMiddleware([
  validateRequest(quizSchema)
], async (req, res) => {
  // Access validated data via req.validated
  const { moduleId, score } = req.validated;
});
```

### 3. Middleware Architecture (`/src/lib/api/middleware.js`)

Composable middleware for common API concerns:

```javascript
import { withMiddleware, middleware, requireAuth } from '../../lib/api/middleware';

// Pre-configured stacks
export default withMiddleware(middleware.authenticated, async (req, res) => {
  // Handler with authentication, CORS, security headers, etc.
});

// Custom middleware composition
export default withMiddleware([
  requireAuth({ roles: ['admin'] }),
  validateRequest(schema),
  timeout(60000)
], async (req, res) => {
  // Custom middleware stack
});
```

Available middleware:
- `requireAuth(options)` - Authentication and authorization
- `allowMethods(methods)` - HTTP method validation
- `validateRequest(schema)` - Request validation
- `cors(options)` - CORS handling
- `securityHeaders()` - Security headers
- `requestLogger()` - Request/response logging
- `timeout(ms)` - Request timeout
- `cache(options)` - Response caching
- `limitSize(options)` - Request size limiting

### 4. API Documentation (`/api-docs`)

Interactive Swagger UI with:
- Auto-generated OpenAPI specification
- Live API testing interface
- Request/response examples
- Authentication flows
- Error code documentation

Access at: `http://localhost:8411/api-docs`

### 5. Testing Framework (`/src/lib/api/testing.js`)

Comprehensive testing utilities:

```javascript
import { testAPIEndpoint, createMockUser, scenarios } from '../../lib/api/testing';

// Test API endpoints
const result = await testAPIEndpoint(handler, {
  name: 'Quiz Submission Tests',
  scenarios: [
    scenarios.quizSubmission.validSubmission,
    scenarios.quizSubmission.unauthorizedAccess
  ]
});

// Performance testing
const perfResults = await performance.measureResponseTime(handler, request, 100);

// Security testing
const secResults = await security.testAuthBypass(handler, request);
```

## Current API Endpoints

### Authentication
- `GET /api/auth/[...auth0]` - Auth0 authentication flow
- `GET /api/csrf-token` - CSRF token generation

### Education
- `POST /api/assessments/quiz` - Submit quiz answers
- `POST /api/assessments/assignment` - Submit assignments with file uploads

### Progress Tracking
- `GET /api/progress/[userId]` - Get user progress data
- `POST /api/progress/[userId]` - Update user progress
- `PUT /api/progress/[userId]` - Replace user progress

### Health & Monitoring
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Comprehensive health status
- `GET /api/health/metrics` - Performance metrics

### Administration
- `GET /api/admin/dashboard` - Dashboard metrics (admin only)
- `GET /api/admin/alerts` - System alerts (admin only)

## Implementation Examples

### Creating a New API Endpoint

```javascript
// /pages/api/example.js
import { withMiddleware, middleware, validateRequest } from '../../lib/api/middleware';
import { createSuccessResponse, sendResponse } from '../../lib/api/response';
import { myValidationSchema } from '../../lib/api/validation';

async function exampleHandler(req, res) {
  const { data } = req.validated;
  
  // Your business logic here
  const result = await processData(data);
  
  const response = createSuccessResponse(result, {
    message: 'Data processed successfully',
    requestId: req.requestId
  });
  
  return sendResponse(res, response);
}

export default withMiddleware([
  middleware.authenticated,
  validateRequest(myValidationSchema)
], exampleHandler);
```

### Adding Custom Validation

```javascript
import { createValidationSchema } from '../../lib/api/validation';

export const customSchema = createValidationSchema(
  yup.object().shape({
    name: yup.string().required().max(100),
    email: yup.string().email().required(),
    age: yup.number().min(13).max(120)
  }),
  {
    title: 'User Registration',
    description: 'Schema for user registration data',
    tags: ['user', 'registration'],
    examples: [{
      name: 'John Doe',
      email: 'john@example.com',
      age: 25
    }]
  }
);
```

### Testing Your Endpoint

```javascript
// __tests__/my-endpoint.test.js
import { testAPIEndpoint, createMockUser } from '../../../lib/api/testing';
import handler from '../my-endpoint';

describe('My Endpoint', () => {
  it('should handle valid requests', async () => {
    const result = await testAPIEndpoint(handler, {
      name: 'My Endpoint Tests',
      scenarios: [{
        name: 'Valid Request',
        request: {
          method: 'POST',
          body: { name: 'Test', email: 'test@example.com' },
          user: createMockUser(),
          session: createMockSession()
        },
        expect: {
          statusCode: 200,
          body: {
            required: ['status', 'data'],
            exact: { status: 'success' }
          }
        }
      }]
    });
    
    expect(result.success).toBe(true);
  });
});
```

## Error Codes and Recovery

### Common Error Codes

| Code | Status | Description | Recovery |
|------|--------|-------------|----------|
| `VALIDATION_ERROR` | 400 | Request validation failed | Fix input data and retry |
| `AUTH_REQUIRED` | 401 | Authentication required | Sign in and retry |
| `ACCESS_DENIED` | 403 | Insufficient permissions | Contact administrator |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait and retry |
| `INTERNAL_ERROR` | 500 | Server error | Retry or contact support |

### Error Response Format

All errors include:
- **Human-readable message** for display to users
- **Error code** for programmatic handling
- **Recovery suggestions** to help users resolve the issue
- **Retryable flag** indicating if the request can be retried
- **Request ID** for support and debugging

## Development Guidelines

### 1. Response Patterns
- Always use standardized response utilities
- Include appropriate error codes and suggestions
- Use consistent HTTP status codes
- Provide meaningful success messages

### 2. Validation
- Define schemas for all request/response data
- Include examples and metadata for documentation
- Sanitize user input to prevent XSS/injection
- Validate both structure and business rules

### 3. Error Handling
- Provide helpful error messages
- Include recovery suggestions
- Log errors with appropriate context
- Never expose internal implementation details

### 4. Security
- Require authentication for protected endpoints
- Validate user permissions for sensitive operations
- Apply rate limiting to prevent abuse
- Use CSRF protection for state-changing operations

### 5. Testing
- Test all happy path scenarios
- Test error conditions and edge cases
- Include performance and security tests
- Mock external dependencies

## Performance Considerations

### Response Times
- **Target**: < 100ms average response time
- **P95**: < 200ms for most endpoints
- **P99**: < 500ms maximum acceptable

### Caching
- Use appropriate cache headers for static data
- Implement Redis caching for expensive operations
- Cache user sessions and authentication tokens

### Database Optimization
- Use efficient Firestore queries
- Implement pagination for large datasets
- Cache frequently accessed data

### Monitoring
- Request ID tracking for debugging
- Performance metrics collection
- Error rate monitoring
- Health check endpoints

## Security Best Practices

### Authentication & Authorization
- OAuth2 with Auth0 for user authentication
- Role-based access control (RBAC)
- JWT token validation
- Session management

### Input Security
- Request validation and sanitization
- SQL injection prevention
- XSS protection through sanitization
- File upload security

### Network Security
- HTTPS enforcement
- CORS policy enforcement
- Security headers (HSTS, CSP, etc.)
- Rate limiting and DDoS protection

### Data Protection
- Personal data encryption
- Secure session storage
- Audit logging for sensitive operations
- GDPR compliance measures

## Migration Guide

### From Old API Pattern

**Before:**
```javascript
export default async function handler(req, res) {
  try {
    // Manual validation
    if (!req.body.moduleId) {
      return res.status(400).json({ error: 'Missing moduleId' });
    }
    
    // Business logic
    const result = await processData(req.body);
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
```

**After:**
```javascript
import { withMiddleware, middleware, validateRequest } from '../../lib/api/middleware';
import { createSuccessResponse, sendResponse } from '../../lib/api/response';
import { mySchema } from '../../lib/api/validation';

async function handler(req, res) {
  const result = await processData(req.validated);
  
  const response = createSuccessResponse(result, {
    message: 'Data processed successfully',
    requestId: req.requestId
  });
  
  return sendResponse(res, response);
}

export default withMiddleware([
  middleware.authenticated,
  validateRequest(mySchema)
], handler);
```

## Deployment Considerations

### Environment Configuration
- Set appropriate rate limits for production
- Configure CORS origins for your domain
- Enable comprehensive logging
- Set up monitoring and alerting

### Performance Monitoring
- Response time tracking
- Error rate monitoring
- Database performance metrics
- Memory and CPU usage

### Security Configuration
- Review and update CORS settings
- Configure rate limiting thresholds
- Enable security headers
- Regular security audits

## Support and Maintenance

### Logging
- Structured logging with request IDs
- Security event logging
- Performance metrics logging
- Error tracking and alerting

### Debugging
- Request ID correlation across services
- Comprehensive error context
- Performance profiling tools
- Health check endpoints

### Documentation Maintenance
- Keep OpenAPI spec up to date
- Update examples and test cases
- Document breaking changes
- Maintain migration guides

## Conclusion

This API architecture provides a solid foundation for the CBL-MAIKOSH platform with:

- **Developer Experience**: Consistent patterns and comprehensive documentation
- **Production Readiness**: Security, monitoring, and error handling
- **Scalability**: Modular middleware and caching strategies
- **Maintainability**: Comprehensive testing and validation

The architecture supports the platform's educational focus while providing enterprise-grade reliability and security for basketball coaching professionals.