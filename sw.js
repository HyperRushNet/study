const CACHE_NAME = 'offline-cache-v11';
const OFFLINE_URLS = [
  '/index.html',
  '/home.html',
  '/detail.html',
  '/pomodoro.html',
  '/add.html',
  '/planner.html',
  '/js/play16beepsound.js',
  '/sw.js',
  '/sw-register.js'
];

// Install: cache alle belangrijke bestanden
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: oude caches opruimen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first + navigatie fallback, query params negeren
self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);
  const pathname = requestURL.pathname; // strip query parameters

  event.respondWith(
    caches.match(pathname).then(cached => {
      if (cached) return cached;

      // Navigatie fallback
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }

      // Andere requests
      return fetch(event.request).catch(() =>
        new Response('Resource niet beschikbaar offline.', {
          status: 503,
          statusText: 'Service Unavailable'
        })
      );
    })
  );
});
