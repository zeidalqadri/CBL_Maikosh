import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

// Custom hook for CSRF token management
export const useCSRF = () => {
  const [csrfToken, setCsrfToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isLoading } = useUser();

  // Fetch CSRF token from server
  const fetchCSRFToken = async () => {
    if (!user || isLoading) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }

      const data = await response.json();
      setCsrfToken(data.csrfToken);
    } catch (err) {
      setError(err.message);
      console.error('CSRF token fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch token when user is available
  useEffect(() => {
    if (user && !isLoading && !csrfToken) {
      fetchCSRFToken();
    }
  }, [user, isLoading, csrfToken]);

  // Create headers with CSRF token
  const getCSRFHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    return headers;
  };

  // Make authenticated request with CSRF protection
  const makeSecureRequest = async (url, options = {}) => {
    if (!csrfToken) {
      await fetchCSRFToken();
    }

    const secureOptions = {
      ...options,
      headers: {
        ...getCSRFHeaders(),
        ...(options.headers || {})
      },
      credentials: 'include'
    };

    // Add CSRF token to body for form submissions
    if (options.method === 'POST' && options.body && typeof options.body === 'object') {
      if (options.body instanceof FormData) {
        options.body.append('csrfToken', csrfToken);
      } else {
        options.body = JSON.stringify({
          ...JSON.parse(options.body),
          csrfToken
        });
      }
      secureOptions.body = options.body;
    }

    try {
      const response = await fetch(url, secureOptions);
      
      // If CSRF token is invalid, try refreshing it once
      if (response.status === 403 && response.statusText === 'Forbidden') {
        await fetchCSRFToken();
        
        // Retry with new token
        secureOptions.headers['X-CSRF-Token'] = csrfToken;
        return fetch(url, secureOptions);
      }
      
      return response;
    } catch (error) {
      console.error('Secure request error:', error);
      throw error;
    }
  };

  // Refresh CSRF token manually
  const refreshToken = () => {
    setCsrfToken(null);
    return fetchCSRFToken();
  };

  return {
    csrfToken,
    loading,
    error,
    getCSRFHeaders,
    makeSecureRequest,
    refreshToken,
    isReady: !!csrfToken && !loading
  };
};