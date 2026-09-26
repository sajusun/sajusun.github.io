// SAKHAWAT HOSSAIN PORTFOLIO - SERVICE WORKER (PWA & OFFLINE CACHING)
const CACHE_NAME = 'sakhawat-portfolio-v1.1';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './services.html',
  './projects.html',
  './articles.html',
  './resume.html',
  './contact.html',
  './404.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './assets/images/favicon.svg',
  './assets/images/favicon.png',
  './assets/images/apple-touch-icon.png',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/images/og-preview.png',
  './assets/images/sakhawat-hossain-as-saju-sun.jpg'
];

// Install Event: Precaching critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Using addAll with catch to prevent single asset failure from breaking service worker installation
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[ServiceWorker] Precache failed for:', url, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-First with Cache Fallback for HTML, Cache-First for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests and http/https schemes
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // Google Apps Script or external analytics: ignore service worker caching
  if (request.url.includes('script.google.com') || request.url.includes('google-analytics')) {
    return;
  }

  // HTML navigation requests: Network first, fallback to cached HTML
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to offline index or 404
          return caches.match('/index.html');
        })
    );
    return;
  }

  // Static Assets (CSS, JS, Fonts, Images): Cache First with background revalidation
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate)
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
