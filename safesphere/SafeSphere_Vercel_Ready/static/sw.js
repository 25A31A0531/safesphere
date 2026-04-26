// PWA Service Worker (V7 Offline Logic)
const CACHE_NAME = 'safesphere-v7';
const URLS_TO_CACHE = [
  '/',
  '/static/style.css',
  '/static/app.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', event => {
    // Only cache GET requests bypassing API layer
    if(event.request.method === 'GET' && !event.request.url.includes('/api/')) {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
    }
});
