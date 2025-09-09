/**
 * Service Worker for CBL-MAIKOSH Basketball Coaching Platform
 * Provides offline support for educational content and improves accessibility
 */

const CACHE_NAME = 'cbl-maikosh-v1';
const OFFLINE_PAGE = '/offline';

// Critical resources to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/modules',
  '/offline',
  '/_next/static/css/',
  '/_next/static/js/',
  '/manifest.json'
];

// Educational content that should be available offline
const EDUCATIONAL_CONTENT_PATTERNS = [
  /\/modules\/m\d+/,
  /\/api\/modules\/\d+/,
  /\/data\/modules\//,
  /\/components\/curriculum\//
];

// Images and media that can be cached
const MEDIA_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.mp4'];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static resources...');
        return cache.addAll(STATIC_CACHE_URLS.filter(url => 
          !url.includes('_next') // Let Next.js handle its own caching
        ));
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Strategy 1: Network First for API calls and dynamic content
    if (pathname.startsWith('/api/') || pathname.includes('auth')) {
      return await networkFirst(request);
    }
    
    // Strategy 2: Cache First for static assets
    if (isStaticAsset(pathname)) {
      return await cacheFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate for educational content
    if (isEducationalContent(pathname)) {
      return await staleWhileRevalidate(request);
    }
    
    // Strategy 4: Network First with offline fallback for pages
    return await networkFirstWithOfflineFallback(request);
    
  } catch (error) {
    console.error('Request handling error:', error);
    return await getOfflineFallback(request);
  }
}

// Network First strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Cache First strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Network request failed:', error);
    throw error;
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(error => {
    console.error('Background fetch failed:', error);
    return cachedResponse;
  });
  
  // Return cached version immediately, update in background
  return cachedResponse || await fetchPromise;
}

// Network First with Offline Fallback
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful page responses
    if (networkResponse.ok && networkResponse.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match(OFFLINE_PAGE);
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Get appropriate offline fallback
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match(OFFLINE_PAGE);
    if (offlineResponse) {
      return offlineResponse;
    }
  }
  
  // Return placeholder for images
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14" fill="#6b7280">Image unavailable offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  // Return error response for other requests
  return new Response(
    JSON.stringify({ error: 'Offline - content not available' }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Helper functions
function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/static/') ||
    MEDIA_EXTENSIONS.some(ext => pathname.endsWith(ext)) ||
    pathname.includes('.css') ||
    pathname.includes('.js')
  );
}

function isEducationalContent(pathname) {
  return EDUCATIONAL_CONTENT_PATTERNS.some(pattern => pattern.test(pathname));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  try {
    // Get stored offline progress data
    const progressData = await getStoredProgress();
    
    if (progressData && progressData.length > 0) {
      // Send progress updates to server
      for (const progress of progressData) {
        try {
          await fetch('/api/progress/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(progress)
          });
        } catch (error) {
          console.error('Failed to sync progress:', error);
        }
      }
      
      // Clear stored progress after successful sync
      await clearStoredProgress();
    }
  } catch (error) {
    console.error('Progress sync failed:', error);
  }
}

async function getStoredProgress() {
  try {
    const db = await openProgressDB();
    const transaction = db.transaction(['progress'], 'readonly');
    const store = transaction.objectStore('progress');
    return await store.getAll();
  } catch (error) {
    console.error('Failed to get stored progress:', error);
    return [];
  }
}

async function clearStoredProgress() {
  try {
    const db = await openProgressDB();
    const transaction = db.transaction(['progress'], 'readwrite');
    const store = transaction.objectStore('progress');
    await store.clear();
  } catch (error) {
    console.error('Failed to clear stored progress:', error);
  }
}

function openProgressDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CBL_Progress', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('progress')) {
        const store = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('moduleId', 'moduleId', { unique: false });
      }
    };
  });
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_EDUCATIONAL_CONTENT') {
    event.waitUntil(cacheEducationalContent(event.data.urls));
  }
});

async function cacheEducationalContent(urls) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(urls);
    console.log('Educational content cached for offline access');
  } catch (error) {
    console.error('Failed to cache educational content:', error);
  }
}