/**
 * Core Web Vitals Monitoring and Optimization
 * Tracks and optimizes LCP, INP, CLS, and other performance metrics
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';
import errorTracker from './errorTracking';
import logger from './logger';

class WebVitalsMonitor {
  constructor() {
    this.metrics = new Map();
    this.thresholds = {
      LCP: { good: 2500, needsImprovement: 4000 },
      INP: { good: 200, needsImprovement: 500 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FCP: { good: 1800, needsImprovement: 3000 },
      TTFB: { good: 800, needsImprovement: 1800 }
    };
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Initialize web vitals monitoring
    this.initWebVitals();
    
    // Monitor navigation timing
    this.initNavigationTiming();
    
    // Monitor resource timing
    this.initResourceTiming();
    
    // Monitor layout shifts
    this.initLayoutShiftMonitoring();
    
    // Monitor long tasks
    this.initLongTaskMonitoring();
    
    logger.info('Web Vitals monitoring initialized');
  }

  initWebVitals() {
    // Largest Contentful Paint
    onLCP((metric) => {
      this.recordMetric('LCP', metric);
      this.trackWebVital('LCP', metric.value, metric);
    });

    // Interaction to Next Paint (replaces FID in web-vitals v5+)
    onINP((metric) => {
      this.recordMetric('INP', metric);
      this.trackWebVital('INP', metric.value, metric);
    });

    // Cumulative Layout Shift
    onCLS((metric) => {
      this.recordMetric('CLS', metric);
      this.trackWebVital('CLS', metric.value, metric);
    });

    // First Contentful Paint
    onFCP((metric) => {
      this.recordMetric('FCP', metric);
      this.trackWebVital('FCP', metric.value, metric);
    });

    // Time to First Byte
    onTTFB((metric) => {
      this.recordMetric('TTFB', metric);
      this.trackWebVital('TTFB', metric.value, metric);
    });
  }

  initNavigationTiming() {
    if (!window.performance || !window.performance.getEntriesByType) return;

    window.addEventListener('load', () => {
      // Wait for navigation entry to be available
      setTimeout(() => {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
          this.processNavigationTiming(navEntries[0]);
        }
      }, 0);
    });
  }

  processNavigationTiming(entry) {
    const timings = {
      dnsLookup: entry.domainLookupEnd - entry.domainLookupStart,
      tcpConnection: entry.connectEnd - entry.connectStart,
      tlsHandshake: entry.secureConnectionStart > 0 ? 
        entry.connectEnd - entry.secureConnectionStart : 0,
      request: entry.responseStart - entry.requestStart,
      response: entry.responseEnd - entry.responseStart,
      domParsing: entry.domContentLoadedEventStart - entry.responseEnd,
      resourceLoading: entry.loadEventStart - entry.domContentLoadedEventEnd,
      totalTime: entry.loadEventEnd - entry.navigationStart
    };

    // Track navigation performance
    errorTracker.trackEvent('navigation_timing', {
      category: 'performance',
      ...timings,
      page: window.location.pathname
    });

    // Alert on slow navigation
    if (timings.totalTime > 5000) { // More than 5 seconds
      logger.warn('Slow page load detected', {
        totalTime: timings.totalTime,
        page: window.location.pathname,
        timings
      });
    }

    this.recordMetric('navigation', timings);
  }

  initResourceTiming() {
    if (!window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.processResourceTiming(entry);
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  processResourceTiming(entry) {
    const resourceTiming = {
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize || entry.encodedBodySize,
      cached: entry.transferSize === 0 && entry.encodedBodySize > 0,
      type: this.getResourceType(entry.name),
      initiatorType: entry.initiatorType
    };

    // Track slow resources
    if (entry.duration > 1000) { // More than 1 second
      errorTracker.trackEvent('slow_resource', {
        category: 'performance',
        ...resourceTiming,
        page: window.location.pathname
      });
    }

    // Track large resources
    if (resourceTiming.size > 500000) { // More than 500KB
      logger.warn('Large resource detected', resourceTiming);
      
      errorTracker.trackEvent('large_resource', {
        category: 'performance',
        ...resourceTiming,
        page: window.location.pathname
      });
    }

    this.recordMetric('resource', resourceTiming);
  }

  initLayoutShiftMonitoring() {
    if (!window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          this.processLayoutShift(entry);
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  processLayoutShift(entry) {
    const shiftData = {
      value: entry.value,
      sources: entry.sources?.map(source => ({
        element: source.node?.tagName || 'unknown',
        id: source.node?.id,
        className: source.node?.className
      })) || []
    };

    // Track significant layout shifts
    if (entry.value > 0.1) { // Above "good" threshold
      logger.warn('Significant layout shift detected', shiftData);
      
      errorTracker.trackEvent('layout_shift', {
        category: 'performance',
        ...shiftData,
        page: window.location.pathname
      });
    }
  }

  initLongTaskMonitoring() {
    if (!window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.processLongTask(entry);
      }
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task API not supported
      console.debug('Long task monitoring not supported');
    }
  }

  processLongTask(entry) {
    const taskData = {
      duration: entry.duration,
      startTime: entry.startTime,
      attribution: entry.attribution?.map(attr => ({
        name: attr.name,
        type: attr.entryType,
        startTime: attr.startTime,
        duration: attr.duration
      })) || []
    };

    logger.warn('Long task detected', taskData);

    errorTracker.trackEvent('long_task', {
      category: 'performance',
      ...taskData,
      page: window.location.pathname
    });
  }

  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push({
      value,
      timestamp: Date.now(),
      page: window.location.pathname
    });

    // Keep only last 100 entries
    const entries = this.metrics.get(name);
    if (entries.length > 100) {
      entries.shift();
    }
  }

  trackWebVital(name, value, metric) {
    const threshold = this.thresholds[name];
    if (!threshold) return;

    const rating = value <= threshold.good ? 'good' : 
                   value <= threshold.needsImprovement ? 'needs-improvement' : 'poor';

    // Track with Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        custom_parameter_1: rating,
        custom_parameter_2: window.location.pathname
      });
    }

    // Track with error tracker
    errorTracker.trackEvent('web_vital', {
      category: 'performance',
      metric: name,
      value: value,
      rating: rating,
      id: metric.id,
      page: window.location.pathname,
      navigationType: metric.navigationType || 'unknown'
    });

    // Log poor performance
    if (rating === 'poor') {
      logger.warn(`Poor ${name} performance`, {
        metric: name,
        value: value,
        threshold: threshold.needsImprovement,
        page: window.location.pathname
      });
    }
  }

  getResourceType(url) {
    if (!url) return 'unknown';
    
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || 
        url.includes('.webp') || url.includes('.avif') || url.includes('.gif')) return 'image';
    if (url.includes('.woff') || url.includes('.woff2') || url.includes('.ttf')) return 'font';
    if (url.includes('/api/')) return 'api';
    if (url.includes('.json')) return 'json';
    return 'other';
  }

  // Public API methods
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  getWebVitalsScore() {
    const scores = {};
    for (const [name, entries] of this.metrics.entries()) {
      if (['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].includes(name) && entries.length > 0) {
        const latestEntry = entries[entries.length - 1];
        const threshold = this.thresholds[name];
        if (threshold) {
          const value = latestEntry.value.value || latestEntry.value;
          scores[name] = {
            value,
            rating: value <= threshold.good ? 'good' : 
                   value <= threshold.needsImprovement ? 'needs-improvement' : 'poor'
          };
        }
      }
    }
    return scores;
  }

  generateReport() {
    const metrics = this.getMetrics();
    const webVitals = this.getWebVitalsScore();
    
    const report = {
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      webVitals,
      performance: {
        navigation: metrics.navigation?.[metrics.navigation.length - 1],
        resources: metrics.resource?.slice(-10), // Last 10 resources
        totalMetrics: Object.keys(metrics).reduce((total, key) => total + metrics[key].length, 0)
      }
    };

    logger.info('Performance report generated', report);
    return report;
  }

  // Performance optimization suggestions
  getOptimizationSuggestions() {
    const scores = this.getWebVitalsScore();
    const suggestions = [];

    if (scores.LCP && scores.LCP.rating !== 'good') {
      suggestions.push({
        metric: 'LCP',
        issue: 'Largest Contentful Paint is slow',
        suggestions: [
          'Optimize images with better compression and formats (WebP, AVIF)',
          'Use preload for critical resources',
          'Implement proper image lazy loading',
          'Optimize server response times',
          'Use a CDN for static assets'
        ]
      });
    }

    if (scores.INP && scores.INP.rating !== 'good') {
      suggestions.push({
        metric: 'INP',
        issue: 'Interaction to Next Paint is high',
        suggestions: [
          'Break up long JavaScript tasks',
          'Remove unused JavaScript',
          'Implement code splitting',
          'Use web workers for heavy computations',
          'Defer non-critical JavaScript',
          'Optimize event handlers and interactions'
        ]
      });
    }

    if (scores.CLS && scores.CLS.rating !== 'good') {
      suggestions.push({
        metric: 'CLS',
        issue: 'Cumulative Layout Shift is high',
        suggestions: [
          'Set dimensions for images and videos',
          'Reserve space for dynamic content',
          'Avoid inserting content above existing content',
          'Use CSS transforms instead of changing layout properties',
          'Preload fonts to prevent FOIT/FOUT'
        ]
      });
    }

    return suggestions;
  }
}

// Create singleton instance
const webVitalsMonitor = new WebVitalsMonitor();

// Export convenience functions
export const trackWebVital = (name, value, metric) => {
  webVitalsMonitor.trackWebVital(name, value, metric);
};

export const getPerformanceReport = () => {
  return webVitalsMonitor.generateReport();
};

export const getOptimizationSuggestions = () => {
  return webVitalsMonitor.getOptimizationSuggestions();
};

export const getWebVitalsScore = () => {
  return webVitalsMonitor.getWebVitalsScore();
};

// Export for Next.js _app.js
export default webVitalsMonitor;

// For debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.webVitalsMonitor = webVitalsMonitor;
}