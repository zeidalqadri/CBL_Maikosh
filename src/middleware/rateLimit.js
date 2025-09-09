import { getClientIP } from '../utils/network';

// In-memory rate limit store (use Redis in production)
class RateLimitStore {
  constructor() {
    this.store = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }

  get(key) {
    return this.store.get(key);
  }

  set(key, value) {
    this.store.set(key, value);
  }

  delete(key) {
    this.store.delete(key);
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.store.entries()) {
      if (now - data.resetTime > data.windowMs) {
        this.store.delete(key);
      }
    }
  }
}

const rateLimitStore = new RateLimitStore();

// Rate limiting configurations
export const RATE_LIMITS = {
  API_DEFAULT: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  API_STRICT: { maxRequests: 10, windowMs: 15 * 60 * 1000 },   // 10 requests per 15 minutes (sensitive endpoints)
  QUIZ_SUBMISSION: { maxRequests: 20, windowMs: 60 * 60 * 1000 }, // 20 quiz submissions per hour
  PROGRESS_UPDATE: { maxRequests: 50, windowMs: 15 * 60 * 1000 }, // 50 progress updates per 15 minutes
  LOGIN_ATTEMPT: { maxRequests: 5, windowMs: 15 * 60 * 1000 },    // 5 login attempts per 15 minutes
};

// Rate limit middleware factory
export const createRateLimit = (config = RATE_LIMITS.API_DEFAULT) => {
  return async (req, res, next) => {
    try {
      const identifier = getClientIP(req) || 'unknown';
      const key = `${identifier}_${req.url || 'unknown'}`;
      
      const now = Date.now();
      const windowStart = Math.floor(now / config.windowMs) * config.windowMs;
      
      let rateLimitData = rateLimitStore.get(key);
      
      // Initialize or reset if new window
      if (!rateLimitData || rateLimitData.resetTime <= now - config.windowMs) {
        rateLimitData = {
          count: 0,
          resetTime: windowStart + config.windowMs,
          windowMs: config.windowMs
        };
      }
      
      // Check if limit exceeded
      if (rateLimitData.count >= config.maxRequests) {
        const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000);
        
        res.setHeader('X-RateLimit-Limit', config.maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', rateLimitData.resetTime);
        res.setHeader('Retry-After', retryAfter);
        
        return res.status(429).json({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter
        });
      }
      
      // Increment counter
      rateLimitData.count++;
      rateLimitStore.set(key, rateLimitData);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', config.maxRequests - rateLimitData.count);
      res.setHeader('X-RateLimit-Reset', rateLimitData.resetTime);
      
      if (next) next();
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      // Don't block the request if rate limiting fails
      if (next) next();
    }
  };
};

// Specific rate limiters for different endpoints
export const apiRateLimit = createRateLimit(RATE_LIMITS.API_DEFAULT);
export const strictApiRateLimit = createRateLimit(RATE_LIMITS.API_STRICT);
export const quizRateLimit = createRateLimit(RATE_LIMITS.QUIZ_SUBMISSION);
export const progressRateLimit = createRateLimit(RATE_LIMITS.PROGRESS_UPDATE);
export const loginRateLimit = createRateLimit(RATE_LIMITS.LOGIN_ATTEMPT);

// User-based rate limiting (requires authentication)
export const createUserRateLimit = (config = RATE_LIMITS.API_DEFAULT) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated
      const session = req.session || req.user;
      if (!session || !session.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const identifier = session.user.sub || session.user.id;
      const key = `user_${identifier}_${req.url || 'unknown'}`;
      
      const now = Date.now();
      const windowStart = Math.floor(now / config.windowMs) * config.windowMs;
      
      let rateLimitData = rateLimitStore.get(key);
      
      // Initialize or reset if new window
      if (!rateLimitData || rateLimitData.resetTime <= now - config.windowMs) {
        rateLimitData = {
          count: 0,
          resetTime: windowStart + config.windowMs,
          windowMs: config.windowMs
        };
      }
      
      // Check if limit exceeded
      if (rateLimitData.count >= config.maxRequests) {
        const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000);
        
        res.setHeader('X-RateLimit-Limit', config.maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', rateLimitData.resetTime);
        res.setHeader('Retry-After', retryAfter);
        
        return res.status(429).json({
          error: 'Too many requests',
          message: `User rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter
        });
      }
      
      // Increment counter
      rateLimitData.count++;
      rateLimitStore.set(key, rateLimitData);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', config.maxRequests - rateLimitData.count);
      res.setHeader('X-RateLimit-Reset', rateLimitData.resetTime);
      
      if (next) next();
    } catch (error) {
      console.error('User rate limit middleware error:', error);
      // Don't block the request if rate limiting fails
      if (next) next();
    }
  };
};

// Export user rate limiters
export const userQuizRateLimit = createUserRateLimit(RATE_LIMITS.QUIZ_SUBMISSION);
export const userProgressRateLimit = createUserRateLimit(RATE_LIMITS.PROGRESS_UPDATE);