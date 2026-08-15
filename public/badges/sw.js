// 羊-集章 — Service Worker（PWA，無推播）
// Scope: /badges/（由 sw.js 位置決定）
// 快取策略：badges 頁面與靜態資源快取優先、stamps 圖 NetworkFirst

var CACHE = 'sheep-badges-v1';
var PRECACHE_URLS = [
  '/badges/',
  '/badges/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
];

// 安裝：預先快取關鍵靜態資源
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

// 啟動：清除舊版快取
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k !== CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

// 抓取：stamps 圖走 NetworkFirst，其餘同源請求快取優先（stale-while-revalidate）
self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // 印章圖：網路優先，離線時回快取
  if (url.pathname.startsWith('/stamps/')) {
    event.respondWith(
      fetch(event.request)
        .then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(event.request, copy);
            });
          }
          return res;
        })
        .catch(function () {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 其餘（badges 頁面、JS/CSS）：快取優先，同時更新快取
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var fetched = fetch(event.request)
        .then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(event.request, copy);
            });
          }
          return res;
        })
        .catch(function () {
          return cached;
        });
      return cached || fetched;
    })
  );
});