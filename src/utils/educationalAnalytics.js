/**
 * Educational Platform Effectiveness Tracking
 * Measures learning outcomes, engagement, and coaching effectiveness
 */

import logger from './logger';
import errorTracker from './errorTracking';
import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

class EducationalAnalytics {
  constructor() {
    this.learningMetrics = new Map();
    this.engagementMetrics = new Map();
    this.outcomeMetrics = new Map();
    
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Initialize learning path tracking
    this.initLearningPathTracking();
    
    // Initialize engagement measurement
    this.initEngagementMeasurement();
    
    // Initialize outcome tracking
    this.initOutcomeTracking();
    
    logger.info('Educational analytics initialized');
  }

  // Learning Path Analytics
  initLearningPathTracking() {
    this.learningPath = {
      currentModule: null,
      startTime: null,
      interactions: [],
      completions: [],
      struggles: [],
      strengths: []
    };

    // Track module transitions
    window.addEventListener('module-changed', (event) => {
      this.trackModuleTransition(event.detail);
    });

    // Track learning interactions
    window.addEventListener('learning-interaction', (event) => {
      this.trackLearningInteraction(event.detail);
    });
  }

  trackModuleTransition(moduleData) {
    const transition = {
      from: this.learningPath.currentModule,
      to: moduleData.moduleId,
      timestamp: Date.now(),
      timeSpent: this.learningPath.startTime ? Date.now() - this.learningPath.startTime : 0
    };

    this.learningPath.currentModule = moduleData.moduleId;
    this.learningPath.startTime = Date.now();

    // Analyze learning progression
    this.analyzeLearningProgression(transition);

    errorTracker.trackEducationalProgress('module_transition', {
      ...transition,
      userId: moduleData.userId,
      moduleTitle: moduleData.title
    });

    logger.info('Module transition tracked', transition);
  }

  analyzeLearningProgression(transition) {
    if (!transition.from) return; // First module

    const progressionData = {
      sequentialLearning: this.isSequentialProgression(transition.from, transition.to),
      timeSpent: transition.timeSpent,
      backtracking: this.isBacktracking(transition.from, transition.to),
      jumping: this.isJumping(transition.from, transition.to)
    };

    // Track learning patterns
    errorTracker.trackEvent('learning_progression', {
      category: 'education',
      ...progressionData,
      fromModule: transition.from,
      toModule: transition.to
    });

    // Identify potential issues
    if (transition.timeSpent < 300000) { // Less than 5 minutes
      this.flagPotentialRushBehavior(transition);
    }

    if (progressionData.backtracking) {
      this.trackBacktrackingBehavior(transition);
    }
  }

  // Engagement Measurement
  initEngagementMeasurement() {
    this.engagementMetrics = {
      totalTimeOnPlatform: 0,
      activeEngagementTime: 0,
      interactionCount: 0,
      deepEngagementEvents: 0,
      returnVisits: 0,
      completionRate: 0
    };

    // Track active engagement time
    this.trackActiveEngagement();
    
    // Track interaction quality
    this.trackInteractionQuality();
    
    // Track return behavior
    this.trackReturnBehavior();
  }

  trackActiveEngagement() {
    let lastActivity = Date.now();
    let totalActiveTime = 0;
    const INACTIVE_THRESHOLD = 30000; // 30 seconds

    const updateActiveTime = () => {
      const now = Date.now();
      const timeDiff = now - lastActivity;
      
      if (timeDiff < INACTIVE_THRESHOLD) {
        totalActiveTime += timeDiff;
      }
      
      lastActivity = now;
    };

    // Track various user interactions
    ['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
      document.addEventListener(event, this.throttle(updateActiveTime, 1000));
    });

    // Report engagement metrics periodically
    setInterval(() => {
      this.reportEngagementMetrics(totalActiveTime);
    }, 60000); // Every minute
  }

  trackInteractionQuality() {
    const qualityMetrics = {
      meaningfulClicks: 0,
      contentInteractions: 0,
      navigationUsage: 0,
      searchUsage: 0,
      resourceAccess: 0
    };

    document.addEventListener('click', (event) => {
      const element = event.target;
      
      // Categorize click quality
      if (element.matches('[data-content-interaction]')) {
        qualityMetrics.meaningfulClicks++;
        qualityMetrics.contentInteractions++;
      } else if (element.matches('nav *, .navigation *')) {
        qualityMetrics.navigationUsage++;
      } else if (element.matches('[data-resource]')) {
        qualityMetrics.resourceAccess++;
      }

      this.updateEngagementScore(qualityMetrics);
    });
  }

  trackReturnBehavior() {
    const visitData = this.getVisitData();
    
    if (visitData.returnVisit) {
      errorTracker.trackEvent('return_visit', {
        category: 'engagement',
        daysSinceLastVisit: visitData.daysSinceLastVisit,
        totalVisits: visitData.totalVisits,
        continuousLearning: visitData.daysSinceLastVisit <= 7
      });
    }

    this.saveVisitData();
  }

  // Outcome Tracking
  initOutcomeTracking() {
    this.outcomeMetrics = {
      knowledgeRetention: new Map(),
      skillDevelopment: new Map(),
      competencyProgress: new Map(),
      certificationProgress: new Map()
    };

    // Track quiz performance over time
    window.addEventListener('quiz-completed', (event) => {
      this.trackKnowledgeRetention(event.detail);
    });

    // Track skill demonstrations
    window.addEventListener('skill-demonstrated', (event) => {
      this.trackSkillDevelopment(event.detail);
    });

    // Track competency assessments
    window.addEventListener('competency-assessed', (event) => {
      this.trackCompetencyProgress(event.detail);
    });
  }

  async trackKnowledgeRetention(quizData) {
    const moduleId = quizData.moduleId;
    const userId = quizData.userId;
    const score = quizData.percentage;
    const timestamp = Date.now();

    // Get previous quiz attempts for this module
    const previousAttempts = await this.getPreviousQuizAttempts(userId, moduleId);
    
    const retentionData = {
      currentScore: score,
      improvement: previousAttempts.length > 0 ? 
        score - previousAttempts[previousAttempts.length - 1].score : 0,
      consistentPerformance: this.calculateConsistentPerformance(previousAttempts, score),
      learningCurve: this.calculateLearningCurve(previousAttempts, score),
      retentionStrength: await this.assessRetentionStrength(userId, moduleId, score)
    };

    // Store knowledge retention metrics
    await this.storeKnowledgeRetention(userId, moduleId, {
      score,
      timestamp,
      ...retentionData
    });

    errorTracker.trackEducationalProgress('knowledge_retention', {
      ...retentionData,
      moduleId,
      userId,
      attemptNumber: previousAttempts.length + 1
    });

    // Identify learning patterns
    this.identifyLearningPatterns(userId, moduleId, retentionData);
  }

  async trackSkillDevelopment(skillData) {
    const competencyMap = {
      'basketball-fundamentals': ['dribbling', 'shooting', 'passing', 'rebounding'],
      'team-strategy': ['offense', 'defense', 'transitions', 'set-plays'],
      'coaching-techniques': ['communication', 'motivation', 'game-planning', 'player-development'],
      'game-management': ['time-management', 'substitutions', 'timeout-usage', 'officiating']
    };

    const skillCategory = this.categorizeSkill(skillData.skill);
    const proficiencyLevel = this.assessProficiencyLevel(skillData);

    const developmentData = {
      skill: skillData.skill,
      category: skillCategory,
      proficiencyLevel,
      demonstrationQuality: skillData.quality || 'unknown',
      contextualApplication: skillData.context || 'practice',
      timestamp: Date.now()
    };

    await this.storeSkillDevelopment(skillData.userId, developmentData);

    errorTracker.trackEducationalProgress('skill_development', {
      ...developmentData,
      userId: skillData.userId,
      moduleId: skillData.moduleId
    });
  }

  async trackCompetencyProgress(competencyData) {
    const competencyLevels = {
      'novice': 1,
      'developing': 2,
      'proficient': 3,
      'advanced': 4,
      'expert': 5
    };

    const currentLevel = competencyLevels[competencyData.level] || 1;
    const previousLevel = await this.getPreviousCompetencyLevel(
      competencyData.userId, 
      competencyData.competency
    );

    const progressData = {
      competency: competencyData.competency,
      currentLevel,
      previousLevel,
      improvement: currentLevel - previousLevel,
      evidenceQuality: competencyData.evidence || 'self-assessment',
      assessmentMethod: competencyData.method || 'quiz',
      timestamp: Date.now()
    };

    await this.storeCompetencyProgress(competencyData.userId, progressData);

    errorTracker.trackEducationalProgress('competency_progress', {
      ...progressData,
      userId: competencyData.userId,
      significantProgress: progressData.improvement >= 1
    });

    // Check for certification readiness
    await this.checkCertificationReadiness(competencyData.userId);
  }

  // Learning Effectiveness Analysis
  async analyzeLearningEffectiveness(userId, timeframe = '30d') {
    try {
      const metrics = await this.gatherLearningMetrics(userId, timeframe);
      
      const effectiveness = {
        overallScore: this.calculateOverallEffectivenessScore(metrics),
        strengths: this.identifyLearningStrengths(metrics),
        improvementAreas: this.identifyImprovementAreas(metrics),
        recommendations: this.generateLearningRecommendations(metrics),
        trendAnalysis: this.analyzeLearningTrends(metrics)
      };

      // Store effectiveness analysis
      await this.storeLearningEffectiveness(userId, effectiveness);

      errorTracker.trackEvent('learning_effectiveness', {
        category: 'education',
        userId,
        timeframe,
        overallScore: effectiveness.overallScore,
        strengths: effectiveness.strengths.length,
        improvementAreas: effectiveness.improvementAreas.length
      });

      return effectiveness;
      
    } catch (error) {
      logger.error('Failed to analyze learning effectiveness', error, { userId });
      throw error;
    }
  }

  calculateOverallEffectivenessScore(metrics) {
    const weights = {
      knowledgeRetention: 0.3,
      engagementLevel: 0.2,
      progressConsistency: 0.2,
      skillDemonstration: 0.15,
      completionRate: 0.15
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([metric, weight]) => {
      if (metrics[metric] !== undefined) {
        totalScore += metrics[metric] * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
  }

  identifyLearningStrengths(metrics) {
    const strengths = [];
    
    if (metrics.knowledgeRetention >= 80) {
      strengths.push('excellent knowledge retention');
    }
    
    if (metrics.engagementLevel >= 85) {
      strengths.push('high engagement with learning materials');
    }
    
    if (metrics.progressConsistency >= 90) {
      strengths.push('consistent learning progress');
    }
    
    if (metrics.completionRate >= 95) {
      strengths.push('strong commitment to completing modules');
    }

    return strengths;
  }

  identifyImprovementAreas(metrics) {
    const areas = [];
    
    if (metrics.knowledgeRetention < 60) {
      areas.push('knowledge retention needs improvement');
    }
    
    if (metrics.engagementLevel < 50) {
      areas.push('increase engagement with learning content');
    }
    
    if (metrics.progressConsistency < 60) {
      areas.push('develop more consistent learning habits');
    }
    
    if (metrics.practicalApplication < 70) {
      areas.push('focus on practical skill application');
    }

    return areas;
  }

  generateLearningRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.knowledgeRetention < 70) {
      recommendations.push({
        area: 'Knowledge Retention',
        suggestion: 'Review completed modules regularly and take practice quizzes',
        priority: 'high'
      });
    }
    
    if (metrics.engagementLevel < 60) {
      recommendations.push({
        area: 'Engagement',
        suggestion: 'Set aside dedicated learning time and minimize distractions',
        priority: 'medium'
      });
    }
    
    if (metrics.practicalApplication < 70) {
      recommendations.push({
        area: 'Practical Skills',
        suggestion: 'Practice coaching techniques with real teams or scenarios',
        priority: 'high'
      });
    }

    return recommendations;
  }

  // Data persistence methods
  async storeKnowledgeRetention(userId, moduleId, data) {
    try {
      const docRef = doc(db, 'learningAnalytics', userId, 'knowledgeRetention', `${moduleId}_${Date.now()}`);
      await setDoc(docRef, data);
    } catch (error) {
      logger.error('Failed to store knowledge retention data', error);
    }
  }

  async storeSkillDevelopment(userId, data) {
    try {
      const docRef = doc(db, 'learningAnalytics', userId, 'skillDevelopment', `${data.skill}_${Date.now()}`);
      await setDoc(docRef, data);
    } catch (error) {
      logger.error('Failed to store skill development data', error);
    }
  }

  async storeCompetencyProgress(userId, data) {
    try {
      const docRef = doc(db, 'learningAnalytics', userId, 'competencyProgress', `${data.competency}_${Date.now()}`);
      await setDoc(docRef, data);
    } catch (error) {
      logger.error('Failed to store competency progress data', error);
    }
  }

  async storeLearningEffectiveness(userId, effectiveness) {
    try {
      const docRef = doc(db, 'learningAnalytics', userId, 'effectiveness', Date.now().toString());
      await setDoc(docRef, {
        ...effectiveness,
        timestamp: Date.now()
      });
    } catch (error) {
      logger.error('Failed to store learning effectiveness analysis', error);
    }
  }

  // Utility methods
  isSequentialProgression(fromModule, toModule) {
    const moduleNumbers = {
      'm1': 1, 'm2': 2, 'm3': 3, 'm4': 4, 'm5': 5, 'm6': 6,
      'm7': 7, 'm8': 8, 'm9': 9, 'm10': 10, 'm11': 11, 'm12': 12
    };
    
    const fromNum = moduleNumbers[fromModule];
    const toNum = moduleNumbers[toModule];
    
    return toNum === fromNum + 1;
  }

  isBacktracking(fromModule, toModule) {
    const moduleNumbers = {
      'm1': 1, 'm2': 2, 'm3': 3, 'm4': 4, 'm5': 5, 'm6': 6,
      'm7': 7, 'm8': 8, 'm9': 9, 'm10': 10, 'm11': 11, 'm12': 12
    };
    
    const fromNum = moduleNumbers[fromModule];
    const toNum = moduleNumbers[toModule];
    
    return toNum < fromNum;
  }

  isJumping(fromModule, toModule) {
    const moduleNumbers = {
      'm1': 1, 'm2': 2, 'm3': 3, 'm4': 4, 'm5': 5, 'm6': 6,
      'm7': 7, 'm8': 8, 'm9': 9, 'm10': 10, 'm11': 11, 'm12': 12
    };
    
    const fromNum = moduleNumbers[fromModule];
    const toNum = moduleNumbers[toModule];
    
    return toNum > fromNum + 1;
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Public API
  async generateLearningReport(userId, timeframe = '30d') {
    try {
      const effectiveness = await this.analyzeLearningEffectiveness(userId, timeframe);
      const metrics = await this.gatherLearningMetrics(userId, timeframe);
      
      return {
        userId,
        timeframe,
        generatedAt: new Date().toISOString(),
        effectiveness,
        metrics,
        summary: this.createLearningReportSummary(effectiveness, metrics)
      };
    } catch (error) {
      logger.error('Failed to generate learning report', error, { userId });
      throw error;
    }
  }

  createLearningReportSummary(effectiveness, metrics) {
    return {
      overallGrade: this.getGradeFromScore(effectiveness.overallScore),
      keyStrengths: effectiveness.strengths.slice(0, 3),
      primaryFocusAreas: effectiveness.improvementAreas.slice(0, 2),
      nextSteps: effectiveness.recommendations.filter(r => r.priority === 'high').slice(0, 2)
    };
  }

  getGradeFromScore(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

// Create singleton instance
const educationalAnalytics = new EducationalAnalytics();

export default educationalAnalytics;

// Export convenience methods
export const {
  trackModuleTransition,
  trackLearningInteraction,
  analyzeLearningEffectiveness,
  generateLearningReport
} = educationalAnalytics;