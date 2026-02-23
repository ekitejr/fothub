const CACHE_NAME = 'fothub-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/search.html',
  '/league.html',
  '/video.html',
  '/style.css',
  '/search.css',
  '/video.css',
  '/league.css',
  '/script.js',
  '/search.js',
  '/video.js',
  '/league.js',
  '/highlights.json',
  '/images/fothub-logo.svg',
  // Add more files as needed (e.g. icons)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit  return cached response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone response to cache it
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

// Update cache when new version is available
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});