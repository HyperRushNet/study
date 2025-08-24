// sw.js

const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URLS = [
  './home.html',         
  './index.html',  
  './detail.html', 
  './pomodoro.html',  
  './add.html',
  './planner.html',
  './js/play16beepsound.js'
];

// Install: cache de belangrijke bestanden
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting(); // SW wordt direct actief
});

// Fetch: altijd eerst cache, geen netwerk
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || new Response(
        'Pagina niet beschikbaar offline.',
        { status: 503, statusText: 'Service Unavailable' }
      );
    })
  );
});

// Activate: oude caches opruimen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // SW neemt direct controle over pagina
});
