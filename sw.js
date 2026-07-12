const CACHE = 'royal-proteins-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/logo.jpg',
  '/images/mutton.jpg',
  '/images/chops.jpg',
  '/images/boneless-mutton.jpg',
  '/images/chicken-skin.jpg',
  '/images/keema.jpg',
  '/images/watermelon.jpg',
  '/images/tent.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (e.request.url.startsWith(self.location.origin) && e.request.method === 'GET') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    })).catch(() => caches.match('/'))
  );
});
