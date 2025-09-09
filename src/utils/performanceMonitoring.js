/**
 * Performance Monitoring and User Analytics
 * Tracks application performance, user behavior, and educational effectiveness
 */

import logger from './logger';
import errorTracker from './errorTracking';

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.userSessions = new Map();
    this.performanceObserver = null;
    
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Initialize Web Performance API observers
    this.initPerformanceObserver();
    
    // Initialize user session tracking
    this.initSessionTracking();
    
    // Initialize page visibility tracking
    this.initVisibilityTracking();
    
    // Initialize network status tracking
    this.initNetworkTracking();
    
    // Initialize educational progress tracking
    this.initEducationalTracking();
    
    try {
      logger.info('Performance monitoring initialized');
    } catch (error) {
      console.debug('Performance monitoring initialized');
    }
  }

  initPerformanceObserver() {
    if (!window.PerformanceObserver) return;

    try {
      // Track navigation timing
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      // Observe different types of performance entries
      const observeTypes = ['navigation', 'resource', 'paint', 'largest-contentful-paint', 'first-input'];
      
      observeTypes.forEach(type => {
        try {
          this.performanceObserver.observe({ entryTypes: [type] });
        } catch (e) {
          // Some entry types may not be supported
          console.debug(`Performance observer type '${type}' not supported`);
        }
      });

    } catch (error) {
      try {
        logger.error('Failed to initialize performance observer', error);
      } catch (logError) {
        console.error('Failed to initialize performance observer', error);
      }
    }
  }

  processPerformanceEntry(entry) {
    const metricData = {
      name: entry.name,
      type: entry.entryType,
      startTime: entry.startTime,
      duration: entry.duration,
      timestamp: new Date().toISOString()
    };

    switch (entry.entryType) {
      case 'navigation':
        this.trackNavigationTiming(entry);
        break;
        
      case 'resource':
        this.trackResourceTiming(entry);
        break;
        
      case 'paint':
        this.trackPaintTiming(entry);
        break;
        
      case 'largest-contentful-paint':
        this.trackLCP(entry);
        break;
        
      case 'first-input':
        this.trackFID(entry);
        break;
    }

    // Store metric for analysis
    this.storeMetric(entry.entryType, metricData);
  }

  trackNavigationTiming(entry) {
    const navigationMetrics = {
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      connection: entry.connectEnd - entry.connectStart,
      request: entry.responseStart - entry.requestStart,
      response: entry.responseEnd - entry.responseStart,
      domParsing: entry.domContentLoadedEventStart - entry.responseEnd,
      domReady: entry.domContentLoadedEventEnd - entry.navigationStart,
      pageLoad: entry.loadEventEnd - entry.navigationStart,
      ttfb: entry.responseStart - entry.navigationStart, // Time to First Byte
      fcp: this.getFirstContentfulPaint(), // First Contentful Paint
      lcp: this.getLargestContentfulPaint() // Largest Contentful Paint
    };

    // Track Core Web Vitals
    this.trackWebVitals(navigationMetrics);

    // Send to analytics
    errorTracker.trackPerformance('page_load', navigationMetrics.pageLoad, {
      page: window.location.pathname,
      ttfb: navigationMetrics.ttfb,
      fcp: navigationMetrics.fcp,
      lcp: navigationMetrics.lcp
    });

    try {
      logger.info('Navigation timing recorded', navigationMetrics);
    } catch (error) {
      console.debug('Navigation timing recorded', navigationMetrics);
    }
  }

  trackResourceTiming(entry) {
    // Only track critical resources to avoid noise
    const criticalResources = ['.js', '.css', '.woff', '.woff2', '/api/'];
    const isCritical = criticalResources.some(resource => entry.name.includes(resource));
    
    if (!isCritical) return;

    const resourceMetric = {
      url: entry.name,
      duration: entry.duration,
      size: entry.transferSize,
      cached: entry.transferSize === 0,
      type: this.getResourceType(entry.name)
    };

    // Track slow resources
    if (entry.duration > 1000) { // Resources taking more than 1 second
      errorTracker.trackEvent('slow_resource', {
        category: 'performance',
        resource: entry.name,
        duration: entry.duration,
        size: entry.transferSize
      });
    }

    this.storeMetric('resource', resourceMetric);
  }

  trackPaintTiming(entry) {
    const paintMetrics = {
      [entry.name]: entry.startTime
    };

    if (entry.name === 'first-contentful-paint') {
      // FCP should be under 1.8 seconds for good performance
      const performance = entry.startTime < 1800 ? 'good' : 
                         entry.startTime < 3000 ? 'needs-improvement' : 'poor';
      
      errorTracker.trackPerformance('first_contentful_paint', entry.startTime, {
        performance,
        threshold: performance === 'good' ? 'under_1.8s' : 
                  performance === 'needs-improvement' ? '1.8s_to_3s' : 'over_3s'
      });
    }

    this.storeMetric('paint', paintMetrics);
  }

  trackLCP(entry) {
    // LCP should be under 2.5 seconds for good performance
    const performance = entry.startTime < 2500 ? 'good' : 
                       entry.startTime < 4000 ? 'needs-improvement' : 'poor';
    
    errorTracker.trackPerformance('largest_contentful_paint', entry.startTime, {
      performance,
      element: entry.element?.tagName || 'unknown',
      url: entry.url || window.location.pathname
    });

    // Alert on poor LCP performance
    if (performance === 'poor') {
      try {
        logger.warn('Poor LCP performance detected', {
          lcp: entry.startTime,
          page: window.location.pathname,
          element: entry.element?.tagName
        });
      } catch (error) {
        console.warn('Poor LCP performance detected', {
          lcp: entry.startTime,
          page: window.location.pathname,
          element: entry.element?.tagName
        });
      }
    }
  }

  trackFID(entry) {
    // FID should be under 100ms for good performance
    const performance = entry.processingStart - entry.startTime < 100 ? 'good' : 
                       entry.processingStart - entry.startTime < 300 ? 'needs-improvement' : 'poor';
    
    const fid = entry.processingStart - entry.startTime;
    
    errorTracker.trackPerformance('first_input_delay', fid, {
      performance,
      inputType: entry.name
    });
  }

  // Core Web Vitals tracking
  trackWebVitals(metrics) {
    const webVitals = {
      lcp: metrics.lcp,
      fid: this.getFirstInputDelay(),
      cls: this.getCumulativeLayoutShift()
    };

    // Classify performance
    const lcpScore = webVitals.lcp < 2500 ? 'good' : webVitals.lcp < 4000 ? 'needs-improvement' : 'poor';
    const fidScore = webVitals.fid < 100 ? 'good' : webVitals.fid < 300 ? 'needs-improvement' : 'poor';
    const clsScore = webVitals.cls < 0.1 ? 'good' : webVitals.cls < 0.25 ? 'needs-improvement' : 'poor';

    errorTracker.trackEvent('web_vitals', {
      category: 'performance',
      lcp: webVitals.lcp,
      fid: webVitals.fid,
      cls: webVitals.cls,
      lcpScore,
      fidScore,
      clsScore,
      overallScore: [lcpScore, fidScore, clsScore].every(score => score === 'good') ? 'good' : 'needs-improvement'
    });
  }

  initSessionTracking() {
    const sessionId = this.generateSessionId();
    const sessionStart = Date.now();
    
    const sessionData = {
      sessionId,
      startTime: sessionStart,
      pageViews: 0,
      interactions: 0,
      errors: 0,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connection: this.getConnectionInfo()
    };

    this.userSessions.set(sessionId, sessionData);
    this.currentSessionId = sessionId;

    // Track session end on beforeunload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    });

    try {
      logger.info('User session started', { sessionId, sessionData });
    } catch (error) {
      console.debug('User session started', { sessionId, sessionData });
    }
  }

  initVisibilityTracking() {
    let visibilityStart = Date.now();
    let totalVisibleTime = 0;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        totalVisibleTime += Date.now() - visibilityStart;
        
        errorTracker.trackEvent('page_hidden', {
          category: 'engagement',
          visibleTime: totalVisibleTime,
          page: window.location.pathname
        });
      } else {
        visibilityStart = Date.now();
        
        errorTracker.trackEvent('page_visible', {
          category: 'engagement',
          page: window.location.pathname
        });
      }
    });

    // Track total engagement time when leaving
    window.addEventListener('beforeunload', () => {
      if (!document.hidden) {
        totalVisibleTime += Date.now() - visibilityStart;
      }
      
      errorTracker.trackEvent('page_engagement', {
        category: 'engagement',
        totalTime: totalVisibleTime,
        page: window.location.pathname,
        engaged: totalVisibleTime > 15000 // More than 15 seconds
      });
    });
  }

  initNetworkTracking() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      const networkInfo = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };

      errorTracker.trackEvent('network_info', {
        category: 'technical',
        ...networkInfo
      });

      // Monitor network changes
      connection.addEventListener('change', () => {
        errorTracker.trackEvent('network_change', {
          category: 'technical',
          newType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      });
    }
  }

  initEducationalTracking() {
    // Track learning interactions
    this.setupLearningEventListeners();
    
    // Track quiz interactions
    this.setupQuizEventListeners();
    
    // Track module progress
    this.setupProgressEventListeners();
  }

  setupLearningEventListeners() {
    // Track clicks on learning elements
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-learning-element]');
      if (target) {
        const elementType = target.dataset.learningElement;
        const elementId = target.dataset.elementId || 'unknown';
        
        this.trackLearningInteraction({
          type: 'click',
          element: elementType,
          elementId,
          timestamp: Date.now()
        });
      }
    });

    // Track scroll depth on learning content
    this.trackScrollDepth();
  }

  setupQuizEventListeners() {
    // These would be called by the quiz components
    window.addEventListener('quiz-started', (event) => {
      this.trackEducationalEvent('quiz_started', event.detail);
    });

    window.addEventListener('quiz-question-answered', (event) => {
      this.trackEducationalEvent('quiz_question_answered', event.detail);
    });

    window.addEventListener('quiz-completed', (event) => {
      this.trackEducationalEvent('quiz_completed', event.detail);
    });
  }

  setupProgressEventListeners() {
    window.addEventListener('module-started', (event) => {
      this.trackEducationalEvent('module_started', event.detail);
    });

    window.addEventListener('module-completed', (event) => {
      this.trackEducationalEvent('module_completed', event.detail);
    });

    window.addEventListener('learning-milestone', (event) => {
      this.trackEducationalEvent('learning_milestone', event.detail);
    });
  }

  trackLearningInteraction(interaction) {
    const session = this.userSessions.get(this.currentSessionId);
    if (session) {
      session.interactions++;
    }

    errorTracker.trackEducationalProgress('learning_interaction', {
      ...interaction,
      sessionId: this.currentSessionId,
      page: window.location.pathname
    });

    logger.debug('Learning interaction tracked', interaction);
  }

  trackEducationalEvent(eventType, data) {
    errorTracker.trackEducationalProgress(eventType, {
      ...data,
      sessionId: this.currentSessionId,
      timestamp: Date.now(),
      page: window.location.pathname
    });

    // Track educational effectiveness metrics
    if (eventType.includes('completed')) {
      this.trackCompletionMetrics(eventType, data);
    }

    if (eventType.includes('quiz')) {
      this.trackQuizMetrics(eventType, data);
    }
  }

  trackCompletionMetrics(eventType, data) {
    const completionData = {
      ...data,
      completionTime: Date.now() - (data.startTime || Date.now()),
      sessionId: this.currentSessionId
    };

    errorTracker.trackEvent('educational_completion', {
      category: 'education',
      type: eventType,
      ...completionData
    });
  }

  trackQuizMetrics(eventType, data) {
    if (eventType === 'quiz_completed') {
      const quizMetrics = {
        score: data.score,
        totalQuestions: data.totalQuestions,
        percentage: data.percentage,
        timeSpent: data.timeSpent,
        attempts: data.attempts || 1,
        moduleId: data.moduleId
      };

      errorTracker.trackEvent('quiz_performance', {
        category: 'education',
        ...quizMetrics,
        passed: quizMetrics.percentage >= 70,
        performance: quizMetrics.percentage >= 90 ? 'excellent' :
                    quizMetrics.percentage >= 80 ? 'good' :
                    quizMetrics.percentage >= 70 ? 'satisfactory' : 'needs_improvement'
      });
    }
  }

  trackScrollDepth() {
    let maxScrollPercent = 0;
    const milestones = [25, 50, 75, 100];
    const trackedMilestones = new Set();

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > maxScrollPercent) {
        maxScrollPercent = scrollPercent;
      }

      // Track milestone achievements
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          
          errorTracker.trackEvent('scroll_depth', {
            category: 'engagement',
            milestone,
            page: window.location.pathname
          });
        }
      });
    };

    window.addEventListener('scroll', this.throttle(trackScroll, 500));
  }

  // Utility methods
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt
      };
    }
    return null;
  }

  getResourceType(url) {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.webp')) return 'image';
    if (url.includes('.woff') || url.includes('.woff2')) return 'font';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  getFirstContentfulPaint() {
    const entries = performance.getEntriesByName('first-contentful-paint');
    return entries.length > 0 ? entries[0].startTime : null;
  }

  getLargestContentfulPaint() {
    const entries = performance.getEntriesByType('largest-contentful-paint');
    return entries.length > 0 ? entries[entries.length - 1].startTime : null;
  }

  getFirstInputDelay() {
    const entries = performance.getEntriesByType('first-input');
    return entries.length > 0 ? entries[0].processingStart - entries[0].startTime : null;
  }

  getCumulativeLayoutShift() {
    const entries = performance.getEntriesByType('layout-shift');
    return entries.reduce((cls, entry) => cls + entry.value, 0);
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
    }
  }

  storeMetric(type, data) {
    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }
    
    const typeMetrics = this.metrics.get(type);
    typeMetrics.push(data);
    
    // Keep only last 100 metrics of each type to prevent memory issues
    if (typeMetrics.length > 100) {
      typeMetrics.shift();
    }
  }

  endSession() {
    const session = this.userSessions.get(this.currentSessionId);
    if (session) {
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;
      
      errorTracker.trackEvent('session_ended', {
        category: 'engagement',
        sessionId: this.currentSessionId,
        duration: session.duration,
        pageViews: session.pageViews,
        interactions: session.interactions,
        errors: session.errors
      });
      
      logger.info('User session ended', session);
    }
  }

  pauseSession() {
    // Mark session as paused
  }

  resumeSession() {
    // Mark session as resumed
  }

  // Public API methods
  trackCustomEvent(eventName, data = {}) {
    errorTracker.trackEvent(eventName, {
      category: 'custom',
      ...data,
      sessionId: this.currentSessionId,
      timestamp: Date.now()
    });
  }

  trackUserAction(action, context = {}) {
    this.trackLearningInteraction({
      type: 'user_action',
      action,
      ...context
    });
  }

  getPerformanceMetrics() {
    return Object.fromEntries(this.metrics);
  }

  getSessionData() {
    return this.userSessions.get(this.currentSessionId);
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export for use throughout the application
export default performanceMonitor;

// Export convenience methods
export const {
  trackCustomEvent,
  trackUserAction,
  trackEducationalEvent,
  getPerformanceMetrics,
  getSessionData
} = performanceMonitor;