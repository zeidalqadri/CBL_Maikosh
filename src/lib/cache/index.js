/**
 * Caching Strategy Implementation
 * Provides client-side caching for API responses and static content
 */

import { mutate } from 'swr';

// Cache configuration
const CACHE_CONFIG = {
  // Default cache times (in milliseconds)
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  LONG_TTL: 30 * 60 * 1000,   // 30 minutes
  SHORT_TTL: 1 * 60 * 1000,   // 1 minute
  
  // Cache keys
  KEYS: {
    USER_PROFILE: 'user_profile',
    MODULE_CONTENT: 'module_content',
    QUIZ_QUESTIONS: 'quiz_questions',
    PROGRESS: 'user_progress',
    RESOURCES: 'module_resources',
    API_HEALTH: 'api_health'
  }
};

// In-memory cache for non-SWR data
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  set(key, value, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set value
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });

    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);
    
    this.timers.set(key, timer);
  }

  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - cached.timestamp > cached.ttl;

    if (isExpired) {
      this.delete(key);
      return null;
    }

    return cached.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }

  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();
    
    return {
      totalEntries: entries.length,
      validEntries: entries.filter(([_, data]) => 
        now - data.timestamp <= data.ttl
      ).length,
      expiredEntries: entries.filter(([_, data]) => 
        now - data.timestamp > data.ttl
      ).length,
      memoryUsage: JSON.stringify(Array.from(this.cache.entries())).length
    };
  }
}

// Create singleton instance
const memoryCache = new MemoryCache();

// Browser storage utilities
const browserStorage = {
  // Local storage with expiration
  setLocal(key, value, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    if (typeof window === 'undefined') return;
    
    try {
      const data = {
        value,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to set local storage:', error);
    }
  },

  getLocal(key) {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const now = Date.now();
      
      if (now - data.timestamp > data.ttl) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.warn('Failed to get local storage:', error);
      return null;
    }
  },

  removeLocal(key) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  // Session storage with expiration
  setSession(key, value, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    if (typeof window === 'undefined') return;
    
    try {
      const data = {
        value,
        timestamp: Date.now(),
        ttl
      };
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to set session storage:', error);
    }
  },

  getSession(key) {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = sessionStorage.getItem(key);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const now = Date.now();
      
      if (now - data.timestamp > data.ttl) {
        sessionStorage.removeItem(key);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.warn('Failed to get session storage:', error);
      return null;
    }
  },

  removeSession(key) {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  }
};

// SWR cache configuration
export const swrConfig = {
  refreshInterval: 0, // Disable auto-refresh by default
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  
  // Custom cache provider
  provider: () => new Map(),
  
  // Global error handler
  onError: (error, key) => {
    console.error('SWR Error:', key, error);
    
    // Track errors for monitoring
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cache_error', {
        event_category: 'performance',
        event_label: key,
        description: error.message
      });
    }
  },

  // Global success handler
  onSuccess: (data, key) => {
    // Track cache hits
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cache_hit', {
        event_category: 'performance',
        event_label: key
      });
    }
  }
};

// Cache key generators
export const cacheKeys = {
  userProfile: (userId) => `${CACHE_CONFIG.KEYS.USER_PROFILE}_${userId}`,
  moduleContent: (moduleId) => `${CACHE_CONFIG.KEYS.MODULE_CONTENT}_${moduleId}`,
  quizQuestions: (moduleId) => `${CACHE_CONFIG.KEYS.QUIZ_QUESTIONS}_${moduleId}`,
  userProgress: (userId) => `${CACHE_CONFIG.KEYS.PROGRESS}_${userId}`,
  moduleResources: (moduleId) => `${CACHE_CONFIG.KEYS.RESOURCES}_${moduleId}`,
  apiHealth: () => CACHE_CONFIG.KEYS.API_HEALTH
};

// Cache invalidation utilities
export const invalidateCache = {
  // Clear specific cache entries
  userProfile: (userId) => {
    const key = cacheKeys.userProfile(userId);
    mutate(key, undefined, false);
    memoryCache.delete(key);
    browserStorage.removeLocal(key);
  },

  moduleContent: (moduleId) => {
    const key = cacheKeys.moduleContent(moduleId);
    mutate(key, undefined, false);
    memoryCache.delete(key);
    browserStorage.removeLocal(key);
  },

  userProgress: (userId) => {
    const key = cacheKeys.userProgress(userId);
    mutate(key, undefined, false);
    memoryCache.delete(key);
    browserStorage.removeLocal(key);
  },

  // Clear all caches
  all: () => {
    mutate(() => true, undefined, false);
    memoryCache.clear();
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
  }
};

// Cache preloading utilities
export const preloadCache = {
  // Preload user data
  userData: async (userId, fetcher) => {
    const key = cacheKeys.userProfile(userId);
    if (!memoryCache.has(key)) {
      try {
        const data = await fetcher(`/api/users/${userId}`);
        memoryCache.set(key, data, CACHE_CONFIG.LONG_TTL);
        browserStorage.setLocal(key, data, CACHE_CONFIG.LONG_TTL);
      } catch (error) {
        console.warn('Failed to preload user data:', error);
      }
    }
  },

  // Preload module content
  moduleContent: async (moduleId, fetcher) => {
    const key = cacheKeys.moduleContent(moduleId);
    if (!memoryCache.has(key)) {
      try {
        const data = await fetcher(`/api/modules/${moduleId}`);
        memoryCache.set(key, data, CACHE_CONFIG.LONG_TTL);
        browserStorage.setLocal(key, data, CACHE_CONFIG.LONG_TTL);
      } catch (error) {
        console.warn('Failed to preload module content:', error);
      }
    }
  }
};

// Performance monitoring
export const cacheMetrics = {
  getStats: () => ({
    memory: memoryCache.getStats(),
    swr: 0 // SWR doesn't expose cache size directly
  }),

  logStats: () => {
    const stats = cacheMetrics.getStats();
    console.log('Cache Statistics:', stats);
    
    // Track cache performance
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cache_stats', {
        event_category: 'performance',
        memory_entries: stats.memory.totalEntries,
        swr_entries: stats.swr
      });
    }
  }
};

// Export main cache instances
export { memoryCache, browserStorage, CACHE_CONFIG };

// Default export
export default {
  memory: memoryCache,
  storage: browserStorage,
  swr: swrConfig,
  keys: cacheKeys,
  invalidate: invalidateCache,
  preload: preloadCache,
  metrics: cacheMetrics,
  config: CACHE_CONFIG
};