import crypto from 'crypto';
import { getUserFromRequest } from '../config/firebaseAdmin';

// CSRF token store (use Redis in production)
const csrfTokenStore = new Map();

// Generate CSRF token
export const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create CSRF token for session
export const createCSRFToken = (sessionId) => {
  const token = generateCSRFToken();
  const timestamp = Date.now();
  
  csrfTokenStore.set(sessionId, {
    token,
    timestamp,
    used: false
  });
  
  // Clean up old tokens (15 minute expiry)
  setTimeout(() => {
    csrfTokenStore.delete(sessionId);
  }, 15 * 60 * 1000);
  
  return token;
};

// Validate CSRF token
export const validateCSRFToken = (sessionId, token) => {
  const storedData = csrfTokenStore.get(sessionId);
  
  if (!storedData) {
    return false;
  }
  
  if (storedData.used) {
    return false;
  }
  
  // Check if token has expired (15 minutes)
  if (Date.now() - storedData.timestamp > 15 * 60 * 1000) {
    csrfTokenStore.delete(sessionId);
    return false;
  }
  
  if (storedData.token !== token) {
    return false;
  }
  
  // Mark token as used (one-time use)
  storedData.used = true;
  
  return true;
};

// CSRF protection middleware
export const csrfProtection = async (req, res, next) => {
  // Only protect state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    if (next) next();
    return;
  }
  
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const sessionId = user.uid;
    const csrfToken = req.headers['x-csrf-token'] || req.body.csrfToken;
    
    if (!csrfToken) {
      return res.status(403).json({ 
        error: 'CSRF token missing',
        message: 'CSRF token is required for this request'
      });
    }
    
    if (!validateCSRFToken(sessionId, csrfToken)) {
      return res.status(403).json({ 
        error: 'Invalid CSRF token',
        message: 'CSRF token is invalid or expired'
      });
    }
    
    if (next) next();
  } catch (error) {
    console.error('CSRF protection error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'CSRF validation failed'
    });
  }
};

// API endpoint to get CSRF token
export const getCSRFTokenHandler = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const sessionId = user.uid;
    const token = createCSRFToken(sessionId);
    
    res.status(200).json({ csrfToken: token });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    res.status(500).json({ error: 'Failed to generate CSRF token' });
  }
};

// Origin validation middleware
export const originValidation = (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8411',
    'https://cbl-maikosh.vercel.app',
    process.env.AUTH0_BASE_URL,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`
  ].filter(Boolean);
  
  // Skip origin check for GET requests and preflight OPTIONS
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    if (next) next();
    return;
  }
  
  if (!origin) {
    return res.status(403).json({ 
      error: 'Origin header missing',
      message: 'Origin validation failed'
    });
  }
  
  const isValidOrigin = allowedOrigins.some(allowed => {
    if (allowed.endsWith('*')) {
      const baseOrigin = allowed.slice(0, -1);
      return origin.startsWith(baseOrigin);
    }
    return origin === allowed;
  });
  
  if (!isValidOrigin) {
    return res.status(403).json({ 
      error: 'Invalid origin',
      message: 'Request origin not allowed'
    });
  }
  
  if (next) next();
};