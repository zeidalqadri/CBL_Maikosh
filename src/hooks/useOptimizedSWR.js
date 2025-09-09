/**
 * Optimized SWR Hooks for Performance
 * Provides cached data fetching with smart revalidation strategies
 */

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useMemo, useCallback, useRef, useEffect } from 'react';
import { cacheKeys, swrConfig, memoryCache, browserStorage } from '../lib/cache';
import logger from '../utils/logger';

// Default fetcher with error handling and caching
const defaultFetcher = async (url) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = new Error('Failed to fetch data');
    error.info = await response.json().catch(() => ({}));
    error.status = response.status;
    throw error;
  }

  return response.json();
};

// Base optimized SWR hook with performance tracking
export const useOptimizedSWR = (key, fetcher = defaultFetcher, options = {}) => {
  const startTimeRef = useRef(Date.now());
  
  const optimizedOptions = useMemo(() => ({
    ...swrConfig,
    ...options,
    onSuccess: (data, key, config) => {
      const loadTime = Date.now() - startTimeRef.current;
      
      // Track performance
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'data_loaded', {
          event_category: 'performance',
          event_label: key,
          value: Math.round(loadTime)
        });
      }
      
      // Call original onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, key, config);
      }
    },
    onError: (error, key) => {
      logger.error('SWR fetch error', error, { key });
      
      // Track errors
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'data_error', {
          event_category: 'performance',
          event_label: key,
          description: error.message
        });
      }
      
      // Call original onError if provided
      if (options.onError) {
        options.onError(error, key);
      }
    }
  }), [options]);

  const result = useSWR(key, fetcher, optimizedOptions);

  // Update start time when key changes
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [key]);

  return result;
};

// User profile hook with intelligent caching
export const useUserProfile = (userId, options = {}) => {
  const key = userId ? cacheKeys.userProfile(userId) : null;
  
  return useOptimizedSWR(
    key,
    () => defaultFetcher(`/api/users/${userId}`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
      ...options,
      fallback: () => {
        // Try to get from browser storage first
        const cached = browserStorage.getLocal(key);
        return cached;
      }
    }
  );
};

// Module content hook with aggressive caching
export const useModuleContent = (moduleId, options = {}) => {
  const key = moduleId ? cacheKeys.moduleContent(moduleId) : null;
  
  return useOptimizedSWR(
    key,
    () => defaultFetcher(`/api/modules/${moduleId}`),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes - module content doesn't change often
      ...options,
      fallback: () => {
        // Try browser storage, then memory cache
        return browserStorage.getLocal(key) || memoryCache.get(key);
      }
    }
  );
};

// Quiz questions with smart caching
export const useQuizQuestions = (moduleId, options = {}) => {
  const key = moduleId ? cacheKeys.quizQuestions(moduleId) : null;
  
  return useOptimizedSWR(
    key,
    () => defaultFetcher(`/api/assessments/quiz?moduleId=${moduleId}`),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 600000, // 10 minutes - quiz questions are static
      ...options,
      onSuccess: (data) => {
        // Store in memory cache for quick access
        if (key) {
          memoryCache.set(key, data, 600000);
        }
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      }
    }
  );
};

// User progress with frequent updates
export const useUserProgress = (userId, options = {}) => {
  const key = userId ? cacheKeys.userProgress(userId) : null;
  
  return useOptimizedSWR(
    key,
    () => defaultFetcher(`/api/progress/${userId}`),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      dedupingInterval: 10000, // 10 seconds
      ...options
    }
  );
};

// Module resources with medium caching
export const useModuleResources = (moduleId, options = {}) => {
  const key = moduleId ? cacheKeys.moduleResources(moduleId) : null;
  
  return useOptimizedSWR(
    key,
    () => defaultFetcher(`/api/modules/${moduleId}/resources`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000, // 2 minutes
      ...options,
      fallback: () => browserStorage.getLocal(key)
    }
  );
};

// API health check with short cache
export const useAPIHealth = (options = {}) => {
  const key = cacheKeys.apiHealth();
  
  return useOptimizedSWR(
    key,
    () => defaultFetcher('/api/health'),
    {
      refreshInterval: 60000, // Check every minute
      dedupingInterval: 30000, // 30 seconds
      ...options
    }
  );
};

// Mutation hook for optimistic updates
export const useOptimizedMutation = (key, mutationFn, options = {}) => {
  return useSWRMutation(
    key,
    mutationFn,
    {
      throwOnError: false,
      ...options,
      onSuccess: (data, key, config) => {
        // Track successful mutations
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'mutation_success', {
            event_category: 'api',
            event_label: key
          });
        }
        
        if (options.onSuccess) {
          options.onSuccess(data, key, config);
        }
      },
      onError: (error, key) => {
        logger.error('Mutation error', error, { key });
        
        // Track mutation errors
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'mutation_error', {
            event_category: 'api',
            event_label: key,
            description: error.message
          });
        }
        
        if (options.onError) {
          options.onError(error, key);
        }
      }
    }
  );
};

// Progress update mutation
export const useUpdateProgress = (userId) => {
  const key = cacheKeys.userProgress(userId);
  
  return useOptimizedMutation(
    key,
    async (url, { arg }) => {
      const response = await fetch(`/api/progress/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(arg),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      
      return response.json();
    },
    {
      populateCache: true,
      revalidate: true,
      optimisticData: (current, { arg }) => {
        // Optimistically update the cache
        return { ...current, ...arg };
      }
    }
  );
};

// Quiz submission mutation
export const useSubmitQuiz = (moduleId, userId) => {
  return useOptimizedMutation(
    `quiz_submit_${moduleId}_${userId}`,
    async (url, { arg }) => {
      const response = await fetch('/api/assessments/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          moduleId,
          userId,
          ...arg
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }
      
      return response.json();
    },
    {
      onSuccess: () => {
        // Invalidate progress cache after successful quiz submission
        const progressKey = cacheKeys.userProgress(userId);
        // Re-fetch progress data
        mutate(progressKey);
      }
    }
  );
};

// Preload data hook
export const usePreloadData = () => {
  const preload = useCallback((key, fetcher, options = {}) => {
    // Use requestIdleCallback for better performance
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Preload if not already in cache
        if (!memoryCache.has(key)) {
          mutate(key, fetcher(), { revalidate: false, ...options });
        }
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        if (!memoryCache.has(key)) {
          mutate(key, fetcher(), { revalidate: false, ...options });
        }
      }, 1);
    }
  }, []);

  const preloadModule = useCallback((moduleId) => {
    preload(
      cacheKeys.moduleContent(moduleId),
      () => defaultFetcher(`/api/modules/${moduleId}`)
    );
    preload(
      cacheKeys.moduleResources(moduleId),
      () => defaultFetcher(`/api/modules/${moduleId}/resources`)
    );
  }, [preload]);

  return { preload, preloadModule };
};

// Cache management hook
export const useCacheManagement = () => {
  const clearUserCache = useCallback((userId) => {
    const keys = [
      cacheKeys.userProfile(userId),
      cacheKeys.userProgress(userId)
    ];
    
    keys.forEach(key => {
      mutate(key, undefined, { revalidate: false });
      memoryCache.delete(key);
      browserStorage.removeLocal(key);
    });
  }, []);

  const clearModuleCache = useCallback((moduleId) => {
    const keys = [
      cacheKeys.moduleContent(moduleId),
      cacheKeys.moduleResources(moduleId),
      cacheKeys.quizQuestions(moduleId)
    ];
    
    keys.forEach(key => {
      mutate(key, undefined, { revalidate: false });
      memoryCache.delete(key);
      browserStorage.removeLocal(key);
    });
  }, []);

  return { clearUserCache, clearModuleCache };
};

export default {
  useOptimizedSWR,
  useUserProfile,
  useModuleContent,
  useQuizQuestions,
  useUserProgress,
  useModuleResources,
  useAPIHealth,
  useOptimizedMutation,
  useUpdateProgress,
  useSubmitQuiz,
  usePreloadData,
  useCacheManagement
};