const CACHE_NAME = 'offline-cache-v7';
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

// Install: cache belangrijke assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: oude caches verwijderen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, fallback naar offline pagina
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // Voor navigatie: fallback naar index.html
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }

      // Niet-gecachete assets: 503
      return new Response('Resource niet beschikbaar offline.', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    })
  );
});
