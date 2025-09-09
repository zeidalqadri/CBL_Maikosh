import { db } from '../../../config/firebase';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { quizSubmissionSchema } from '../../../lib/api/validation';
import { withMiddleware, middleware, allowMethods, requireAuth } from '../../../lib/api/middleware';
import { validateRequest } from '../../../lib/api/validation';
import { createSuccessResponse, createErrorResponse, sendResponse, EducationResponses } from '../../../lib/api/response';
import { userQuizRateLimit } from '../../../middleware/rateLimit';
import { csrfProtection } from '../../../middleware/csrf';
import logger from '../../../utils/logger';

async function quizSubmissionHandler(req, res) {
  // Extract validated data
  const { moduleId, quizType, score, answers, totalQuestions } = req.validated;
  const userId = req.user.sub;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Additional business logic validation
  if (percentage < 0 || percentage > 100) {
    logger.warn('Invalid percentage calculated', { 
      userId, 
      percentage, 
      score, 
      totalQuestions,
      requestId: req.requestId 
    });
    
    const errorResponse = createErrorResponse('Invalid score calculation', {
      statusCode: 400,
      code: 'INVALID_SCORE',
      details: { percentage, score, totalQuestions },
      suggestions: [
        'Ensure score is between 0 and total questions',
        'Verify quiz data integrity',
        'Contact support if the issue persists'
      ],
      requestId: req.requestId
    });
    
    return sendResponse(res, errorResponse);
  }

  try {
    // Save quiz submission
    const quizSubmission = {
      userId,
      moduleId,
      quizType,
      score,
      totalQuestions,
      percentage,
      answers,
      submittedAt: new Date().toISOString(),
      requestId: req.requestId
    };

    const quizRef = await addDoc(collection(db, 'quizSubmissions'), quizSubmission);

    // Update user progress
    const userProgressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(userProgressRef);
    
    let currentProgress = { modules: {} };
    if (progressDoc.exists()) {
      currentProgress = progressDoc.data();
    }

    const moduleProgress = {
      moduleId,
      ...currentProgress.modules?.[moduleId],
      quizzes: {
        ...currentProgress.modules?.[moduleId]?.quizzes,
        [quizType]: {
          score: percentage,
          attempts: (currentProgress.modules?.[moduleId]?.quizzes?.[quizType]?.attempts || 0) + 1,
          bestScore: Math.max(
            percentage, 
            currentProgress.modules?.[moduleId]?.quizzes?.[quizType]?.bestScore || 0
          ),
          lastAttempt: new Date().toISOString(),
          submissionId: quizRef.id
        }
      },
      completionPercentage: Math.min(
        (currentProgress.modules?.[moduleId]?.completionPercentage || 0) + 25,
        100
      ),
      lastAccessed: new Date().toISOString()
    };

    const updatedProgress = {
      ...currentProgress,
      userId,
      modules: {
        ...currentProgress.modules,
        [moduleId]: moduleProgress
      },
      updatedAt: new Date().toISOString()
    };

    await updateDoc(userProgressRef, updatedProgress);

    // Log successful submission
    logger.audit('quiz_submission', userId, {
      moduleId,
      quizType,
      score: percentage,
      submissionId: quizRef.id,
      requestId: req.requestId
    });

    // Create standardized response
    const responseData = {
      submissionId: quizRef.id,
      score: percentage,
      percentage,
      progress: moduleProgress,
      feedback: generateQuizFeedback(percentage, moduleProgress.quizzes[quizType].attempts)
    };

    const successResponse = EducationResponses.quizSubmission(responseData);
    return sendResponse(res, successResponse);

  } catch (error) {
    logger.error('Quiz submission failed', error, {
      userId,
      moduleId,
      quizType,
      requestId: req.requestId
    });

    const errorResponse = createErrorResponse('Failed to submit quiz', {
      statusCode: 500,
      code: 'SUBMISSION_FAILED',
      details: process.env.NODE_ENV === 'development' ? { error: error.message } : {},
      suggestions: [
        'Please try submitting again',
        'Check your internet connection',
        'Contact support if the problem persists'
      ],
      requestId: req.requestId,
      retryable: true
    });

    return sendResponse(res, errorResponse);
  }
}

/**
 * Generate personalized feedback based on quiz performance
 */
function generateQuizFeedback(percentage, attempts) {
  if (percentage >= 90) {
    return attempts === 1 
      ? 'Excellent! Perfect score on your first try!' 
      : 'Outstanding performance! You\'ve mastered this material.';
  } else if (percentage >= 80) {
    return attempts === 1 
      ? 'Great job! Strong understanding of the material.' 
      : 'Well done! Your understanding is improving.';
  } else if (percentage >= 70) {
    return attempts === 1 
      ? 'Good work! Consider reviewing the material to strengthen your understanding.' 
      : 'You\'re making progress! Keep practicing to improve your score.';
  } else if (percentage >= 60) {
    return 'You\'re on the right track. Review the module content and try again to improve your score.';
  } else {
    return 'This is a learning opportunity! Please review the module materials carefully and retake the quiz.';
  }
}

// Export with enhanced middleware stack
export default withMiddleware([
  allowMethods(['POST']),
  requireAuth(),
  userQuizRateLimit,
  csrfProtection,
  validateRequest(quizSubmissionSchema)
], quizSubmissionHandler);