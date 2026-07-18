
const cacheName = 'janta-electricals-v4';
const assetsToCache = [
  './',
  './index.html',
  './about.html',
  './residential.html',
  './industrial.html',
  './solar.html',
  './projects.html',
  './gallery.html',
  './contact.html',
  './css/styles.css',
  './js/main.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(assetsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseCopy = response.clone();
          caches.open(cacheName).then(cache => cache.put(event.request, responseCopy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
  }
});
