// Minimal service worker (caching static assets) - register in main for PWA offline
const CACHE_NAME = 'syllabus-tracker-cache-v1'
const assetsToCache = ['/', '/index.html', '/src/main.jsx']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache)
    })
  )
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((resp) => {
      return resp || fetch(e.request)
    })
  )
})
