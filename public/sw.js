// OviNas — Service Worker（PWA，無推播）
// 快取策略：靜態資源快取優先、頁面導覽網路優先（失敗回 /shop/offline）

var CACHE = 'sheep-cache-v1';
var PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-96.png',
  '/apple-touch-icon.png',
  '/shop/offline',
];

// 安裝：預先快取關鍵靜態資源
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function(cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// 啟動：清除舊版快取
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keys) {
        return Promise.all(
          keys
            .filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
        );
      })
      .then(function() {
        return self.clients.claim();
      })
  );
});

// 請求
self.addEventListener('fetch', function(event) {
  var request = event.request;

  // 只處理同源 GET
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 靜態資源（js/css/png/jpg/svg/woff2）：快取優先，miss 才上網並寫入快取
  if (/\.(js|css|png|jpg|jpeg|gif|svg|webp|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        if (cached) return cached;
        return fetch(request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE).then(function(cache) { cache.put(request, clone); });
          }
          return response;
        });
      })
    );
    return;
  }

  // 頁面導覽：網路優先，失敗回 offline 頁
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(function() {
        return caches.match('/shop/offline') || caches.match('/');
      })
    );
    return;
  }

  // 其餘（API、外部資源）：一律只走網路
  event.respondWith(fetch(request));
});