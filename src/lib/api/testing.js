/**
 * API Testing Utilities and Validation Helpers
 * Comprehensive testing tools for API endpoints
 */

import { createMocks } from 'node-mocks-http';
import { validateResponse } from './validation';

/**
 * Mock request factory for testing API endpoints
 * @param {Object} options - Request options
 * @returns {Object} Mock request and response objects
 */
export function createMockRequest(options = {}) {
  const {
    method = 'GET',
    url = '/api/test',
    body = {},
    query = {},
    headers = {},
    user = null,
    session = null
  } = options;

  const { req, res } = createMocks({
    method,
    url,
    body,
    query,
    headers: {
      'content-type': 'application/json',
      ...headers
    }
  });

  // Attach user and session if provided
  if (user) {
    req.user = user;
  }
  if (session) {
    req.session = session;
  }

  // Add request ID for testing
  req.requestId = `test_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return { req, res };
}

/**
 * Test API endpoint with various scenarios
 * @param {Function} handler - API handler function
 * @param {Object} testSuite - Test suite configuration
 */
export async function testAPIEndpoint(handler, testSuite) {
  const {
    name = 'API Endpoint Test',
    scenarios = [],
    setup = () => {},
    teardown = () => {}
  } = testSuite;

  const results = {
    name,
    passed: 0,
    failed: 0,
    total: scenarios.length,
    results: [],
    startTime: Date.now()
  };

  console.log(`\n🧪 Running ${name}...`);

  // Setup
  await setup();

  for (const scenario of scenarios) {
    const scenarioResult = await runTestScenario(handler, scenario);
    results.results.push(scenarioResult);
    
    if (scenarioResult.passed) {
      results.passed++;
      console.log(`  ✅ ${scenarioResult.name}`);
    } else {
      results.failed++;
      console.log(`  ❌ ${scenarioResult.name}`);
      console.log(`     Error: ${scenarioResult.error}`);
    }
  }

  // Teardown
  await teardown();

  results.duration = Date.now() - results.startTime;
  results.success = results.failed === 0;

  console.log(`\n📊 Results: ${results.passed}/${results.total} passed (${results.duration}ms)`);
  
  return results;
}

/**
 * Run individual test scenario
 * @param {Function} handler - API handler function
 * @param {Object} scenario - Test scenario configuration
 */
async function runTestScenario(handler, scenario) {
  const {
    name = 'Test Scenario',
    request = {},
    expect = {},
    before = () => {},
    after = () => {}
  } = scenario;

  const result = {
    name,
    passed: false,
    error: null,
    response: null,
    startTime: Date.now()
  };

  try {
    // Setup scenario
    await before();

    // Create mock request
    const { req, res } = createMockRequest(request);

    // Execute handler
    await handler(req, res);

    // Parse response
    const responseData = JSON.parse(res._getData() || '{}');
    result.response = {
      statusCode: res._getStatusCode(),
      headers: res._getHeaders(),
      body: responseData
    };

    // Validate expectations
    await validateExpectations(result.response, expect);

    result.passed = true;
  } catch (error) {
    result.error = error.message;
    result.passed = false;
  }

  // Cleanup scenario
  await scenario.after?.();

  result.duration = Date.now() - result.startTime;
  return result;
}

/**
 * Validate test expectations
 * @param {Object} response - Actual response
 * @param {Object} expectations - Expected response characteristics
 */
async function validateExpectations(response, expectations) {
  const {
    statusCode,
    body,
    headers,
    schema,
    custom
  } = expectations;

  // Validate status code
  if (statusCode !== undefined && response.statusCode !== statusCode) {
    throw new Error(`Expected status code ${statusCode}, got ${response.statusCode}`);
  }

  // Validate response body properties
  if (body) {
    validateResponseBody(response.body, body);
  }

  // Validate headers
  if (headers) {
    validateResponseHeaders(response.headers, headers);
  }

  // Validate against schema
  if (schema) {
    await validateResponse(schema)(response.body);
  }

  // Custom validation function
  if (custom) {
    await custom(response);
  }
}

/**
 * Validate response body
 * @param {Object} actual - Actual response body
 * @param {Object} expected - Expected body characteristics
 */
function validateResponseBody(actual, expected) {
  // Check required properties
  if (expected.required) {
    for (const prop of expected.required) {
      if (!(prop in actual)) {
        throw new Error(`Missing required property: ${prop}`);
      }
    }
  }

  // Check exact matches
  if (expected.exact) {
    for (const [key, value] of Object.entries(expected.exact)) {
      if (actual[key] !== value) {
        throw new Error(`Property ${key} expected ${value}, got ${actual[key]}`);
      }
    }
  }

  // Check patterns
  if (expected.patterns) {
    for (const [key, pattern] of Object.entries(expected.patterns)) {
      if (!pattern.test(actual[key])) {
        throw new Error(`Property ${key} does not match pattern ${pattern}`);
      }
    }
  }

  // Check types
  if (expected.types) {
    for (const [key, type] of Object.entries(expected.types)) {
      if (typeof actual[key] !== type) {
        throw new Error(`Property ${key} expected type ${type}, got ${typeof actual[key]}`);
      }
    }
  }
}

/**
 * Validate response headers
 * @param {Object} actual - Actual headers
 * @param {Object} expected - Expected headers
 */
function validateResponseHeaders(actual, expected) {
  for (const [header, value] of Object.entries(expected)) {
    const actualValue = actual[header.toLowerCase()];
    if (actualValue !== value) {
      throw new Error(`Header ${header} expected ${value}, got ${actualValue}`);
    }
  }
}

/**
 * Create test data factory
 * @param {Object} template - Data template
 * @param {Object} overrides - Property overrides
 * @returns {Object} Generated test data
 */
export function createTestData(template, overrides = {}) {
  const data = { ...template };
  
  // Apply overrides
  for (const [key, value] of Object.entries(overrides)) {
    if (typeof value === 'function') {
      data[key] = value(data[key]);
    } else {
      data[key] = value;
    }
  }

  return data;
}

/**
 * Mock user factory for authentication testing
 * @param {Object} userOptions - User configuration
 * @returns {Object} Mock user object
 */
export function createMockUser(userOptions = {}) {
  const {
    sub = 'auth0|test_user_123',
    name = 'Test User',
    email = 'test@example.com',
    roles = [],
    permissions = []
  } = userOptions;

  return {
    sub,
    name,
    email,
    'https://cbl-maikosh.com/roles': roles,
    'https://cbl-maikosh.com/permissions': permissions
  };
}

/**
 * Mock session factory
 * @param {Object} sessionOptions - Session configuration
 * @returns {Object} Mock session object
 */
export function createMockSession(sessionOptions = {}) {
  const { user, ...sessionProps } = sessionOptions;
  
  return {
    user: user || createMockUser(),
    accessToken: 'mock_access_token',
    idToken: 'mock_id_token',
    ...sessionProps
  };
}

/**
 * Performance testing utilities
 */
export const performance = {
  /**
   * Measure endpoint response time
   * @param {Function} handler - API handler
   * @param {Object} request - Request configuration
   * @param {number} iterations - Number of iterations to run
   * @returns {Object} Performance metrics
   */
  async measureResponseTime(handler, request, iterations = 100) {
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      
      const { req, res } = createMockRequest(request);
      await handler(req, res);
      
      const endTime = Date.now();
      times.push(endTime - startTime);
    }

    return {
      min: Math.min(...times),
      max: Math.max(...times),
      avg: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length),
      median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)],
      p95: times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)],
      p99: times.sort((a, b) => a - b)[Math.floor(times.length * 0.99)],
      iterations,
      samples: times
    };
  },

  /**
   * Load testing simulation
   * @param {Function} handler - API handler
   * @param {Object} options - Load test options
   */
  async loadTest(handler, options = {}) {
    const {
      requests = [],
      concurrency = 10,
      duration = 30000, // 30 seconds
      rampUp = 5000 // 5 seconds
    } = options;

    const results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      requestsPerSecond: 0,
      errors: [],
      startTime: Date.now()
    };

    const workers = [];
    const requestQueue = [];

    // Prepare request queue
    const endTime = Date.now() + duration;
    while (Date.now() < endTime) {
      for (const request of requests) {
        requestQueue.push({ ...request, timestamp: Date.now() });
      }
    }

    // Start workers
    for (let i = 0; i < concurrency; i++) {
      workers.push(loadTestWorker(handler, requestQueue, results));
    }

    // Wait for all workers to complete
    await Promise.all(workers);

    // Calculate final metrics
    const totalDuration = (Date.now() - results.startTime) / 1000;
    results.requestsPerSecond = Math.round(results.totalRequests / totalDuration);

    return results;
  }
};

/**
 * Load test worker
 * @param {Function} handler - API handler
 * @param {Array} requestQueue - Queue of requests to process
 * @param {Object} results - Shared results object
 */
async function loadTestWorker(handler, requestQueue, results) {
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (!request) break;

    const startTime = Date.now();
    
    try {
      const { req, res } = createMockRequest(request);
      await handler(req, res);
      
      results.successfulRequests++;
      results.averageResponseTime = 
        (results.averageResponseTime * (results.totalRequests - 1) + (Date.now() - startTime)) / 
        results.totalRequests;
    } catch (error) {
      results.failedRequests++;
      results.errors.push({
        error: error.message,
        request: request.url,
        timestamp: Date.now()
      });
    }
    
    results.totalRequests++;
  }
}

/**
 * Security testing utilities
 */
export const security = {
  /**
   * Test authentication bypass attempts
   * @param {Function} handler - API handler that requires auth
   * @param {Object} baseRequest - Base request configuration
   */
  async testAuthBypass(handler, baseRequest) {
    const bypassAttempts = [
      // No authentication
      { ...baseRequest, user: null, session: null },
      
      // Invalid user
      { ...baseRequest, user: null, session: { user: null } },
      
      // Expired token simulation
      { 
        ...baseRequest, 
        session: createMockSession({ 
          accessToken: 'expired_token',
          user: createMockUser()
        })
      }
    ];

    const results = [];
    
    for (const attempt of bypassAttempts) {
      try {
        const { req, res } = createMockRequest(attempt);
        await handler(req, res);
        
        const statusCode = res._getStatusCode();
        results.push({
          attempt: attempt.description || 'Anonymous attempt',
          statusCode,
          blocked: statusCode === 401 || statusCode === 403,
          response: JSON.parse(res._getData() || '{}')
        });
      } catch (error) {
        results.push({
          attempt: attempt.description || 'Anonymous attempt',
          error: error.message,
          blocked: true
        });
      }
    }

    return results;
  },

  /**
   * Test input validation and injection attempts
   * @param {Function} handler - API handler
   * @param {Object} baseRequest - Base request configuration
   */
  async testInputValidation(handler, baseRequest) {
    const maliciousPayloads = [
      // XSS attempts
      { ...baseRequest, body: { ...baseRequest.body, title: '<script>alert("xss")</script>' } },
      
      // SQL injection attempts
      { ...baseRequest, body: { ...baseRequest.body, id: "1'; DROP TABLE users; --" } },
      
      // Command injection
      { ...baseRequest, body: { ...baseRequest.body, filename: '; rm -rf /' } },
      
      // Oversized payload
      { ...baseRequest, body: { ...baseRequest.body, data: 'x'.repeat(10000000) } },
      
      // Null bytes
      { ...baseRequest, body: { ...baseRequest.body, path: 'file.txt\x00.exe' } }
    ];

    const results = [];
    
    for (const payload of maliciousPayloads) {
      try {
        const { req, res } = createMockRequest(payload);
        await handler(req, res);
        
        const statusCode = res._getStatusCode();
        const response = JSON.parse(res._getData() || '{}');
        
        results.push({
          payload: payload.description || 'Malicious payload',
          statusCode,
          rejected: statusCode >= 400,
          response
        });
      } catch (error) {
        results.push({
          payload: payload.description || 'Malicious payload',
          error: error.message,
          rejected: true
        });
      }
    }

    return results;
  }
};

/**
 * Predefined test scenarios for common educational platform endpoints
 */
export const scenarios = {
  /**
   * Quiz submission test scenarios
   */
  quizSubmission: {
    validSubmission: {
      name: 'Valid Quiz Submission',
      request: {
        method: 'POST',
        body: {
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
        },
        user: createMockUser(),
        session: createMockSession()
      },
      expect: {
        statusCode: 200,
        body: {
          required: ['status', 'data', 'meta'],
          exact: { status: 'success' },
          types: {
            status: 'string',
            data: 'object'
          }
        }
      }
    },
    
    invalidScore: {
      name: 'Invalid Score Submission',
      request: {
        method: 'POST',
        body: {
          moduleId: 'module_1',
          quizType: 'knowledge',
          score: 15, // Invalid - exceeds total questions
          totalQuestions: 10,
          answers: []
        },
        user: createMockUser(),
        session: createMockSession()
      },
      expect: {
        statusCode: 400,
        body: {
          required: ['status', 'error'],
          exact: { status: 'error' }
        }
      }
    },
    
    unauthorizedAccess: {
      name: 'Unauthorized Quiz Submission',
      request: {
        method: 'POST',
        body: {
          moduleId: 'module_1',
          quizType: 'knowledge',
          score: 8,
          totalQuestions: 10,
          answers: []
        }
        // No user or session
      },
      expect: {
        statusCode: 401,
        body: {
          exact: { status: 'error' }
        }
      }
    }
  },

  /**
   * Progress tracking test scenarios
   */
  progressTracking: {
    getProgress: {
      name: 'Get User Progress',
      request: {
        method: 'GET',
        query: { userId: 'auth0|test_user_123' },
        user: createMockUser({ sub: 'auth0|test_user_123' }),
        session: createMockSession({ 
          user: createMockUser({ sub: 'auth0|test_user_123' })
        })
      },
      expect: {
        statusCode: 200,
        body: {
          required: ['status', 'data'],
          exact: { status: 'success' }
        }
      }
    },
    
    updateProgress: {
      name: 'Update User Progress',
      request: {
        method: 'POST',
        query: { userId: 'auth0|test_user_123' },
        body: {
          moduleId: 'module_1',
          progressData: {
            completionPercentage: 75,
            sectionsCompleted: ['section_1', 'section_2'],
            timeSpent: 3600000
          }
        },
        user: createMockUser({ sub: 'auth0|test_user_123' }),
        session: createMockSession({ 
          user: createMockUser({ sub: 'auth0|test_user_123' })
        })
      },
      expect: {
        statusCode: 200,
        body: {
          required: ['status', 'data'],
          exact: { status: 'success' }
        }
      }
    }
  }
};

/**
 * Generate comprehensive test report
 * @param {Array} testResults - Array of test results
 * @returns {Object} Formatted test report
 */
export function generateTestReport(testResults) {
  const totalTests = testResults.reduce((sum, result) => sum + result.total, 0);
  const totalPassed = testResults.reduce((sum, result) => sum + result.passed, 0);
  const totalFailed = testResults.reduce((sum, result) => sum + result.failed, 0);
  const totalDuration = testResults.reduce((sum, result) => sum + result.duration, 0);

  return {
    summary: {
      total: totalTests,
      passed: totalPassed,
      failed: totalFailed,
      success: totalFailed === 0,
      duration: totalDuration,
      successRate: Math.round((totalPassed / totalTests) * 100)
    },
    details: testResults,
    timestamp: new Date().toISOString()
  };
}