const CACHE_NAME = 'tempelegend-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/vuetify@3.5.2/dist/vuetify.min.css',
  'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://cdn.jsdelivr.net/npm/vuetify@3.5.2/dist/vuetify.min.js',
  'https://unpkg.com/dexie@latest/dist/dexie.js'
];

// Install Service Worker & Simpan ke Cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Aktifkan & Hapus Cache Lama jika ada update
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { if(key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
});

// Ambil data dari Cache jika offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});
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
