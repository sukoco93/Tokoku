const CACHE_NAME = 'tokoku-v2.4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://unpkg.com/dexie@4.0.1/dist/dexie.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then((response) => {
        // Jika ada di cache, kembalikan
        if (response) return response;

        // Jika tidak, fetch dari network dan cache dinamis
        return fetch(e.request).then((res) => {
          // Hanya cache response yang valid
          if (!res || res.status !== 200 || res.type !== 'basic') {
            return res;
          }
          const responseToCache = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
          return res;
        }).catch(() => {
          // Fallback offline (opsional)
          return new Response('Offline – tidak ada koneksi', { status: 503 });
        });
      })
  );
});
