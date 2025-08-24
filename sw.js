// sw.js - versie 6

const CACHE_NAME = 'offline-cache-v6';
const OFFLINE_URLS = [
  '/home.html',
  '/index.html',
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
  );
  self.skipWaiting(); // Direct actief
});

// Fetch: navigatie fallback + cache-first voor assets
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Navigatie requests
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || caches.match('/index.html');
      }).catch(() => new Response('Pagina niet beschikbaar offline.', {
        status: 503,
        statusText: 'Service Unavailable'
      }))
    );
  } else {
    // Andere requests (CSS, JS, afbeeldingen)
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || new Response('Resource niet beschikbaar offline.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
  }
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
  self.clients.claim(); // Direct controle over pagina
});
