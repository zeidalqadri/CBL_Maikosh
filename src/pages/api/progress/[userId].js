import { db } from '../../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { progressUpdateSchema, userIdSchema } from '../../../lib/api/validation';
import { withMiddleware, allowMethods, requireAuth } from '../../../lib/api/middleware';
import { validateRequest } from '../../../lib/api/validation';
import { createSuccessResponse, createErrorResponse, sendResponse, EducationResponses } from '../../../lib/api/response';
import { userProgressRateLimit } from '../../../middleware/rateLimit';
import { csrfProtection } from '../../../middleware/csrf';
import logger from '../../../utils/logger';

async function progressHandler(req, res) {
  const { userId } = req.query;

  // Validate user ID format
  try {
    await userIdSchema.validate(userId);
  } catch (validationError) {
    logger.warn('Invalid user ID format', { 
      userId, 
      error: validationError.message,
      requestId: req.requestId 
    });
    
    const errorResponse = createErrorResponse('Invalid user ID format', {
      statusCode: 400,
      code: 'INVALID_USER_ID',
      details: { userId, errors: validationError.errors || [validationError.message] },
      suggestions: ['Provide a valid Auth0 user ID'],
      requestId: req.requestId
    });
    
    return sendResponse(res, errorResponse);
  }

  // Check if user is authorized to access this progress data
  if (req.user.sub !== userId) {
    logger.security('Unauthorized progress access attempt', { 
      sessionUserId: req.user.sub,
      requestedUserId: userId,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      requestId: req.requestId
    });
    
    const errorResponse = createErrorResponse('Access denied', {
      statusCode: 403,
      code: 'ACCESS_DENIED',
      suggestions: ['You can only access your own progress data'],
      requestId: req.requestId
    });
    
    return sendResponse(res, errorResponse);
  }

  const userProgressRef = doc(db, 'userProgress', userId);

  try {
    if (req.method === 'GET') {
      return await handleGetProgress(userProgressRef, userId, req, res);
    } else if (req.method === 'POST' || req.method === 'PUT') {
      return await handleUpdateProgress(userProgressRef, userId, req, res);
    }
  } catch (error) {
    logger.error('Progress API error', error, {
      method: req.method,
      userId,
      requestId: req.requestId
    });

    const errorResponse = createErrorResponse('Failed to process progress request', {
      statusCode: 500,
      code: 'PROGRESS_ERROR',
      details: process.env.NODE_ENV === 'development' ? { error: error.message } : {},
      suggestions: [
        'Please try again',
        'Contact support if the issue persists'
      ],
      requestId: req.requestId,
      retryable: true
    });

    return sendResponse(res, errorResponse);
  }
}

async function handleGetProgress(userProgressRef, userId, req, res) {
  try {
    const progressDoc = await getDoc(userProgressRef);
    
    if (progressDoc.exists()) {
      const progressData = progressDoc.data();
      
      // Enrich progress data with computed metrics
      const enrichedProgress = enrichProgressData(progressData);
      
      logger.audit('progress_retrieved', userId, {
        overallProgress: enrichedProgress.overallProgress,
        totalModules: Object.keys(enrichedProgress.modules).length,
        requestId: req.requestId
      });

      const successResponse = createSuccessResponse(enrichedProgress, {
        message: 'Progress retrieved successfully',
        requestId: req.requestId,
        meta: {
          lastUpdated: progressData.updatedAt,
          totalModules: Object.keys(enrichedProgress.modules).length
        }
      });

      return sendResponse(res, successResponse);
    } else {
      // Initialize empty progress if none exists
      const initialProgress = {
        userId,
        modules: {},
        overallProgress: 0,
        achievements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(userProgressRef, initialProgress);
      
      logger.audit('progress_initialized', userId, {
        requestId: req.requestId
      });

      const successResponse = createSuccessResponse(initialProgress, {
        message: 'Progress initialized successfully',
        requestId: req.requestId,
        meta: {
          initialized: true
        }
      });

      return sendResponse(res, successResponse);
    }
  } catch (error) {
    throw new Error(`Failed to retrieve progress: ${error.message}`);
  }
}

async function handleUpdateProgress(userProgressRef, userId, req, res) {
  const { moduleId, progressData } = req.validated;

  try {
    const progressDoc = await getDoc(userProgressRef);
    let currentProgress = {
      userId,
      modules: {},
      overallProgress: 0,
      achievements: [],
      createdAt: new Date().toISOString()
    };

    if (progressDoc.exists()) {
      currentProgress = progressDoc.data();
    }

    // Update module progress
    const updatedModuleProgress = {
      moduleId,
      ...currentProgress.modules?.[moduleId],
      ...progressData,
      lastAccessed: new Date().toISOString()
    };

    const updatedProgress = {
      ...currentProgress,
      userId,
      modules: {
        ...currentProgress.modules,
        [moduleId]: updatedModuleProgress
      },
      updatedAt: new Date().toISOString()
    };

    // Calculate overall progress
    const moduleIds = Object.keys(updatedProgress.modules);
    const totalProgress = moduleIds.reduce((sum, id) => {
      return sum + (updatedProgress.modules[id].completionPercentage || 0);
    }, 0);
    updatedProgress.overallProgress = moduleIds.length > 0 ? 
      Math.round(totalProgress / moduleIds.length) : 0;

    // Check for new achievements
    const newAchievements = checkForAchievements(updatedProgress, currentProgress);
    if (newAchievements.length > 0) {
      updatedProgress.achievements = [
        ...(currentProgress.achievements || []),
        ...newAchievements
      ];
    }

    await setDoc(userProgressRef, updatedProgress);
    
    // Log successful progress update
    logger.audit('progress_updated', userId, {
      moduleId,
      completionPercentage: progressData.completionPercentage,
      overallProgress: updatedProgress.overallProgress,
      newAchievements: newAchievements.length,
      requestId: req.requestId
    });

    // Enrich the response data
    const enrichedProgress = enrichProgressData(updatedProgress);
    
    const successResponse = EducationResponses.progressUpdate(enrichedProgress);
    successResponse.meta.requestId = req.requestId;
    successResponse.meta.newAchievements = newAchievements;

    return sendResponse(res, successResponse);

  } catch (error) {
    throw new Error(`Failed to update progress: ${error.message}`);
  }
}

/**
 * Enrich progress data with computed metrics and insights
 */
function enrichProgressData(progressData) {
  const modules = progressData.modules || {};
  const moduleIds = Object.keys(modules);
  
  // Calculate completion statistics
  const completedModules = moduleIds.filter(id => 
    modules[id].completionPercentage === 100
  ).length;
  
  const inProgressModules = moduleIds.filter(id => 
    modules[id].completionPercentage > 0 && modules[id].completionPercentage < 100
  ).length;

  // Calculate quiz statistics
  let totalQuizzes = 0;
  let completedQuizzes = 0;
  let avgQuizScore = 0;
  let totalQuizAttempts = 0;

  moduleIds.forEach(moduleId => {
    const moduleData = modules[moduleId];
    if (moduleData.quizzes) {
      const quizTypes = Object.keys(moduleData.quizzes);
      totalQuizzes += quizTypes.length;
      
      quizTypes.forEach(quizType => {
        const quiz = moduleData.quizzes[quizType];
        if (quiz.score > 0) {
          completedQuizzes++;
          avgQuizScore += quiz.bestScore;
          totalQuizAttempts += quiz.attempts;
        }
      });
    }
  });

  avgQuizScore = completedQuizzes > 0 ? Math.round(avgQuizScore / completedQuizzes) : 0;

  return {
    ...progressData,
    stats: {
      totalModules: moduleIds.length,
      completedModules,
      inProgressModules,
      totalQuizzes,
      completedQuizzes,
      avgQuizScore,
      totalQuizAttempts,
      completionRate: moduleIds.length > 0 ? 
        Math.round((completedModules / moduleIds.length) * 100) : 0
    }
  };
}

/**
 * Check for new achievements based on progress updates
 */
function checkForAchievements(updatedProgress, previousProgress) {
  const achievements = [];
  const currentAchievementIds = (previousProgress.achievements || []).map(a => a.id);

  // First quiz completion
  const hasCompletedFirstQuiz = Object.values(updatedProgress.modules).some(module => 
    module.quizzes && Object.values(module.quizzes).some(quiz => quiz.score > 0)
  );
  
  if (hasCompletedFirstQuiz && !currentAchievementIds.includes('first_quiz_completed')) {
    achievements.push({
      id: 'first_quiz_completed',
      title: 'Quiz Rookie',
      description: 'Completed your first quiz',
      category: 'education',
      unlockedAt: new Date().toISOString()
    });
  }

  // First module completion
  const hasCompletedFirstModule = Object.values(updatedProgress.modules).some(module => 
    module.completionPercentage === 100
  );
  
  if (hasCompletedFirstModule && !currentAchievementIds.includes('first_module_completed')) {
    achievements.push({
      id: 'first_module_completed',
      title: 'Module Master',
      description: 'Completed your first module',
      category: 'education',
      unlockedAt: new Date().toISOString()
    });
  }

  // High achiever (90%+ average on all completed quizzes)
  const completedQuizzes = [];
  Object.values(updatedProgress.modules).forEach(module => {
    if (module.quizzes) {
      Object.values(module.quizzes).forEach(quiz => {
        if (quiz.score > 0) completedQuizzes.push(quiz.bestScore);
      });
    }
  });

  const avgScore = completedQuizzes.length > 0 ? 
    completedQuizzes.reduce((sum, score) => sum + score, 0) / completedQuizzes.length : 0;

  if (avgScore >= 90 && completedQuizzes.length >= 3 && !currentAchievementIds.includes('high_achiever')) {
    achievements.push({
      id: 'high_achiever',
      title: 'High Achiever',
      description: 'Maintained 90%+ average across multiple quizzes',
      category: 'performance',
      unlockedAt: new Date().toISOString()
    });
  }

  return achievements;
}

// Create middleware stacks for different methods
const getProgressMiddleware = [
  allowMethods(['GET']),
  requireAuth()
];

const updateProgressMiddleware = [
  allowMethods(['POST', 'PUT']),
  requireAuth(),
  userProgressRateLimit,
  csrfProtection,
  validateRequest(progressUpdateSchema)
];

// Export with conditional middleware based on method
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return withMiddleware(getProgressMiddleware, progressHandler)(req, res);
  } else {
    return withMiddleware(updateProgressMiddleware, progressHandler)(req, res);
  }
}