/**
 * Service Worker
 * Phase 6.2 - PWA 核心
 */

const CACHE_NAME = 'nexusai-demo-v1';
const STATIC_CACHE = 'nexusai-static-v1';
const DYNAMIC_CACHE = 'nexusai-dynamic-v1';

// 要快取的靜態資源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/pages/dashboard.html',
  '/offline.html',
  '/css/design-tokens.css',
  '/css/components.css',
  '/css/layout.css',
  '/js/main.js'
];

// 安裝事件
self.addEventListener('install', (event) => {
  console.log('[SW] 安裝中...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] 快取靜態資源');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 啟用事件
self.addEventListener('activate', (event) => {
  console.log('[SW] 啟用中...');

  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => {
              console.log('[SW] 刪除舊快取:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 攔截請求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只處理同源請求
  if (url.origin !== location.origin) {
    return;
  }

  // 根據請求類型選擇策略
  if (request.mode === 'navigate') {
    // HTML 頁面：Network First
    event.respondWith(networkFirst(request));
  } else if (request.destination === 'image') {
    // 圖片：Cache First
    event.respondWith(cacheFirst(request));
  } else {
    // 其他：Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

// ============================================
// 快取策略
// ============================================

// Network First（網路優先）
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // 回傳離線頁面
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }

    throw error;
  }
}

// Cache First（快取優先）
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    // 可以回傳預設圖片
    throw error;
  }
}

// Stale While Revalidate（背景更新）
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request)
    .then(response => {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, response.clone()));
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

// ============================================
// 訊息處理
// ============================================
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ size });
      });
      break;

    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    case 'GET_CACHED_URLS':
      getCachedUrls().then(urls => {
        event.ports[0].postMessage({ urls });
      });
      break;
  }
});

// 取得快取大小
async function getCacheSize() {
  const keys = await caches.keys();
  let totalSize = 0;

  for (const key of keys) {
    const cache = await caches.open(key);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.clone().blob();
        totalSize += blob.size;
      }
    }
  }

  return totalSize;
}

// 取得已快取的 URL
async function getCachedUrls() {
  const keys = await caches.keys();
  const urls = [];

  for (const key of keys) {
    const cache = await caches.open(key);
    const requests = await cache.keys();
    urls.push(...requests.map(r => r.url));
  }

  return urls;
}

// 清除所有快取
async function clearAllCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.map(key => caches.delete(key)));
}
