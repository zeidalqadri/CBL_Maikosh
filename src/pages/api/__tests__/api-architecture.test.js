/**
 * Comprehensive API Architecture Tests
 * Tests for the standardized API patterns and validation system
 */

import { 
  testAPIEndpoint, 
  createMockUser, 
  createMockSession, 
  scenarios, 
  performance, 
  security,
  generateTestReport 
} from '../../../lib/api/testing';
import quizHandler from '../assessments/quiz';
import progressHandler from '../progress/[userId]';

describe('API Architecture Integration Tests', () => {
  let testResults = [];

  afterAll(() => {
    const report = generateTestReport(testResults);
    console.log('\n📋 Final Test Report:');
    console.log('====================');
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Success Rate: ${report.summary.successRate}%`);
    console.log(`Total Duration: ${report.summary.duration}ms`);
    
    if (!report.summary.success) {
      console.error('\n❌ Some tests failed. Check the details above.');
    } else {
      console.log('\n✅ All tests passed!');
    }
  });

  describe('Quiz Submission API', () => {
    it('should handle valid quiz submissions with standardized responses', async () => {
      const result = await testAPIEndpoint(quizHandler, {
        name: 'Quiz Submission Tests',
        scenarios: [
          scenarios.quizSubmission.validSubmission,
          scenarios.quizSubmission.invalidScore,
          scenarios.quizSubmission.unauthorizedAccess,
          {
            name: 'Missing Required Fields',
            request: {
              method: 'POST',
              body: {
                moduleId: 'module_1'
                // Missing required fields
              },
              user: createMockUser(),
              session: createMockSession()
            },
            expect: {
              statusCode: 400,
              body: {
                exact: { status: 'error' },
                required: ['error']
              }
            }
          },
          {
            name: 'Method Not Allowed',
            request: {
              method: 'GET',
              user: createMockUser(),
              session: createMockSession()
            },
            expect: {
              statusCode: 405,
              headers: {
                'Allow': 'POST'
              }
            }
          }
        ]
      });

      testResults.push(result);
      expect(result.success).toBe(true);
    });

    it('should provide personalized feedback based on score', async () => {
      const testCases = [
        { score: 10, totalQuestions: 10, expectedFeedbackPattern: /excellent/i },
        { score: 8, totalQuestions: 10, expectedFeedbackPattern: /great job/i },
        { score: 7, totalQuestions: 10, expectedFeedbackPattern: /good work/i },
        { score: 5, totalQuestions: 10, expectedFeedbackPattern: /review/i }
      ];

      for (const testCase of testCases) {
        const result = await testAPIEndpoint(quizHandler, {
          name: `Feedback Test - ${testCase.score}/${testCase.totalQuestions}`,
          scenarios: [{
            name: `Score ${testCase.score}/${testCase.totalQuestions}`,
            request: {
              method: 'POST',
              body: {
                moduleId: 'module_1',
                quizType: 'knowledge',
                score: testCase.score,
                totalQuestions: testCase.totalQuestions,
                answers: Array.from({ length: testCase.totalQuestions }, (_, i) => ({
                  questionId: `q${i + 1}`,
                  selectedAnswer: 'A',
                  isCorrect: i < testCase.score,
                  timeSpent: 10000
                }))
              },
              user: createMockUser(),
              session: createMockSession()
            },
            expect: {
              statusCode: 200,
              custom: (response) => {
                const feedback = response.body.data?.feedback;
                if (!feedback || !testCase.expectedFeedbackPattern.test(feedback)) {
                  throw new Error(`Expected feedback to match pattern ${testCase.expectedFeedbackPattern}, got: ${feedback}`);
                }
              }
            }
          }]
        });
        
        testResults.push(result);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Progress Tracking API', () => {
    it('should handle progress operations with proper authorization', async () => {
      const result = await testAPIEndpoint(progressHandler, {
        name: 'Progress Tracking Tests',
        scenarios: [
          scenarios.progressTracking.getProgress,
          scenarios.progressTracking.updateProgress,
          {
            name: 'Unauthorized Access to Different User',
            request: {
              method: 'GET',
              query: { userId: 'auth0|different_user' },
              user: createMockUser({ sub: 'auth0|test_user_123' }),
              session: createMockSession({ 
                user: createMockUser({ sub: 'auth0|test_user_123' })
              })
            },
            expect: {
              statusCode: 403,
              body: {
                exact: { status: 'error' }
              }
            }
          },
          {
            name: 'Invalid User ID Format',
            request: {
              method: 'GET',
              query: { userId: 'invalid-user-id' },
              user: createMockUser({ sub: 'invalid-user-id' }),
              session: createMockSession({ 
                user: createMockUser({ sub: 'invalid-user-id' })
              })
            },
            expect: {
              statusCode: 400
            }
          }
        ]
      });

      testResults.push(result);
      expect(result.success).toBe(true);
    });

    it('should calculate progress statistics correctly', async () => {
      const result = await testAPIEndpoint(progressHandler, {
        name: 'Progress Statistics Tests',
        scenarios: [{
          name: 'Progress with Stats Calculation',
          request: {
            method: 'POST',
            query: { userId: 'auth0|test_user_123' },
            body: {
              moduleId: 'module_1',
              progressData: {
                completionPercentage: 100,
                sectionsCompleted: ['section_1', 'section_2', 'section_3'],
                timeSpent: 7200000
              }
            },
            user: createMockUser({ sub: 'auth0|test_user_123' }),
            session: createMockSession({ 
              user: createMockUser({ sub: 'auth0|test_user_123' })
            })
          },
          expect: {
            statusCode: 200,
            custom: (response) => {
              const data = response.body.data;
              if (!data.stats) {
                throw new Error('Response should include stats');
              }
              
              const expectedStats = ['totalModules', 'completedModules', 'completionRate'];
              for (const stat of expectedStats) {
                if (!(stat in data.stats)) {
                  throw new Error(`Missing stat: ${stat}`);
                }
              }
            }
          }
        }]
      });

      testResults.push(result);
      expect(result.success).toBe(true);
    });
  });

  describe('Response Format Validation', () => {
    it('should return consistent response formats', async () => {
      const endpoints = [
        {
          handler: quizHandler,
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
          }
        }
      ];

      for (const { handler, request } of endpoints) {
        const result = await testAPIEndpoint(handler, {
          name: 'Response Format Validation',
          scenarios: [{
            name: 'Standard Response Format',
            request,
            expect: {
              statusCode: 200,
              body: {
                required: ['status', 'statusCode', 'message', 'data', 'meta'],
                exact: { 
                  status: 'success',
                  statusCode: 200
                },
                types: {
                  status: 'string',
                  statusCode: 'number',
                  message: 'string',
                  data: 'object',
                  meta: 'object'
                }
              },
              custom: (response) => {
                const meta = response.body.meta;
                if (!meta.timestamp || !meta.version) {
                  throw new Error('Meta should include timestamp and version');
                }
                
                // Validate timestamp format
                if (isNaN(Date.parse(meta.timestamp))) {
                  throw new Error('Invalid timestamp format');
                }
              }
            }
          }]
        });
        
        testResults.push(result);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Performance Tests', () => {
    it('should meet performance requirements', async () => {
      const performanceResults = await performance.measureResponseTime(
        quizHandler,
        {
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
        50 // iterations
      );

      console.log('\n⚡ Performance Results:');
      console.log(`Average: ${performanceResults.avg}ms`);
      console.log(`95th percentile: ${performanceResults.p95}ms`);
      console.log(`99th percentile: ${performanceResults.p99}ms`);

      // Performance assertions
      expect(performanceResults.avg).toBeLessThan(100); // Average under 100ms
      expect(performanceResults.p95).toBeLessThan(200); // 95th percentile under 200ms
      expect(performanceResults.p99).toBeLessThan(500); // 99th percentile under 500ms
    });
  });

  describe('Security Tests', () => {
    it('should properly block unauthorized access attempts', async () => {
      const authBypassResults = await security.testAuthBypass(
        quizHandler,
        {
          method: 'POST',
          body: {
            moduleId: 'module_1',
            quizType: 'knowledge',
            score: 8,
            totalQuestions: 10,
            answers: []
          }
        }
      );

      console.log('\n🔒 Security Test Results:');
      authBypassResults.forEach(result => {
        console.log(`  ${result.attempt}: ${result.blocked ? '✅ Blocked' : '❌ Allowed'}`);
      });

      // All bypass attempts should be blocked
      authBypassResults.forEach(result => {
        expect(result.blocked).toBe(true);
      });
    });

    it('should validate and sanitize input properly', async () => {
      const validationResults = await security.testInputValidation(
        quizHandler,
        {
          method: 'POST',
          body: {
            moduleId: 'module_1',
            quizType: 'knowledge',
            score: 8,
            totalQuestions: 10,
            answers: []
          },
          user: createMockUser(),
          session: createMockSession()
        }
      );

      console.log('\n🛡️ Input Validation Results:');
      validationResults.forEach(result => {
        console.log(`  ${result.payload}: ${result.rejected ? '✅ Rejected' : '❌ Accepted'}`);
      });

      // All malicious payloads should be rejected
      validationResults.forEach(result => {
        expect(result.rejected).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    it('should provide helpful error messages and recovery suggestions', async () => {
      const result = await testAPIEndpoint(quizHandler, {
        name: 'Error Handling Tests',
        scenarios: [{
          name: 'Validation Error with Suggestions',
          request: {
            method: 'POST',
            body: {
              moduleId: 'invalid-module-id-with-special-chars!',
              quizType: 'invalid_type',
              score: -5,
              totalQuestions: 0,
              answers: []
            },
            user: createMockUser(),
            session: createMockSession()
          },
          expect: {
            statusCode: 400,
            custom: (response) => {
              const error = response.body.error;
              if (!error) {
                throw new Error('Error response should include error object');
              }
              
              if (!error.suggestions || !Array.isArray(error.suggestions)) {
                throw new Error('Error should include recovery suggestions');
              }
              
              if (!error.code || typeof error.code !== 'string') {
                throw new Error('Error should include error code');
              }
              
              if (typeof error.retryable !== 'boolean') {
                throw new Error('Error should indicate if it is retryable');
              }
            }
          }
        }]
      });

      testResults.push(result);
      expect(result.success).toBe(true);
    });
  });
});