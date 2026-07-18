
const cacheName = 'janta-electricals-v1';
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
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assetsToCache)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)))));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
