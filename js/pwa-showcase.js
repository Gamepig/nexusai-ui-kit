/**
 * PWA / Service Worker 展示模組
 * Phase 6.2 - 純客戶端展示版本（無需實際 SW）
 */

// ============================================
// PWAShowcase - PWA 展示說明
// ============================================
class PWAShowcase {
  constructor() {
    this.isOnline = navigator.onLine;
  }

  // 網路狀態監聽
  setupNetworkMonitor(callbacks = {}) {
    window.addEventListener('online', () => {
      this.isOnline = true;
      callbacks.onOnline?.();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      callbacks.onOffline?.();
    });
  }

  // 取得儲存空間估算
  async getStorageEstimate() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          usage: estimate.usage || 0,
          quota: estimate.quota || 0,
          percent: estimate.quota ? ((estimate.usage / estimate.quota) * 100).toFixed(2) : 0
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // 檢查 PWA 相關 API 支援
  checkSupport() {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      cacheAPI: 'caches' in window,
      indexedDB: 'indexedDB' in window,
      storageAPI: 'storage' in navigator,
      notifications: 'Notification' in window,
      pushManager: 'PushManager' in window,
      backgroundSync: 'SyncManager' in window,
      periodicSync: 'PeriodicSyncManager' in window
    };
  }
}

// ============================================
// UI 渲染
// ============================================
function renderPWAShowcase(container) {
  container.innerHTML = `
    <div class="pwa-showcase">
      <div class="showcase-header">
        <h2>📱 PWA / Service Worker 說明</h2>
        <p>Progressive Web App 技術介紹與 API 支援檢測</p>
      </div>

      <!-- PWA 概念說明 -->
      <div class="showcase-section">
        <h3>💡 什麼是 PWA？</h3>
        <div class="pwa-intro">
          <p>Progressive Web App (PWA) 是一種網頁應用程式技術，結合了網頁和原生應用的優點：</p>
          <div class="feature-grid">
            <div class="feature-item">
              <span class="feature-icon">📴</span>
              <strong>離線可用</strong>
              <p>透過 Service Worker 快取資源</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <strong>快速載入</strong>
              <p>快取策略加速頁面載入</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📲</span>
              <strong>可安裝</strong>
              <p>加入主畫面，像原生 App</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔔</span>
              <strong>推送通知</strong>
              <p>即使關閉也能收到通知</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 網路狀態 -->
      <div class="showcase-section">
        <h3>🌐 網路狀態（即時）</h3>
        <div class="network-status-panel">
          <div class="network-indicator" id="network-indicator">
            <div class="indicator-dot"></div>
            <span id="network-status">檢查中...</span>
          </div>
          <div class="network-details">
            <div class="detail-item">
              <span>連線類型:</span>
              <span id="connection-type">-</span>
            </div>
            <div class="detail-item">
              <span>下載速度:</span>
              <span id="downlink">-</span>
            </div>
            <div class="detail-item">
              <span>延遲:</span>
              <span id="rtt">-</span>
            </div>
          </div>
        </div>
      </div>

      <!-- API 支援檢測 -->
      <div class="showcase-section">
        <h3>✅ API 支援檢測</h3>
        <div class="support-grid" id="support-grid">
          <!-- 由 JS 動態生成 -->
        </div>
      </div>

      <!-- 儲存空間 -->
      <div class="showcase-section">
        <h3>💽 儲存空間</h3>
        <div class="storage-info">
          <div class="storage-bar">
            <div class="storage-fill" id="storage-fill"></div>
          </div>
          <div class="storage-details">
            <span>已使用: <strong id="storage-usage">-</strong></span>
            <span>配額: <strong id="storage-quota">-</strong></span>
          </div>
        </div>
      </div>

      <!-- Service Worker 生命週期 -->
      <div class="showcase-section">
        <h3>🔄 Service Worker 生命週期</h3>
        <div class="lifecycle-diagram">
          <div class="lifecycle-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <strong>註冊 (Register)</strong>
              <p>瀏覽器下載並解析 SW 腳本</p>
            </div>
          </div>
          <div class="lifecycle-arrow">→</div>
          <div class="lifecycle-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <strong>安裝 (Install)</strong>
              <p>預快取靜態資源</p>
            </div>
          </div>
          <div class="lifecycle-arrow">→</div>
          <div class="lifecycle-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <strong>啟用 (Activate)</strong>
              <p>清理舊快取，接管頁面</p>
            </div>
          </div>
          <div class="lifecycle-arrow">→</div>
          <div class="lifecycle-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <strong>攔截 (Fetch)</strong>
              <p>處理網路請求，返回快取</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 快取策略 -->
      <div class="showcase-section">
        <h3>📦 常見快取策略</h3>
        <div class="strategy-list">
          <div class="strategy-item">
            <strong>Cache First</strong>
            <p>先檢查快取，沒有再請求網路。適合靜態資源。</p>
            <code>快取 → 網路（備用）</code>
          </div>
          <div class="strategy-item">
            <strong>Network First</strong>
            <p>先請求網路，失敗則使用快取。適合 API 資料。</p>
            <code>網路 → 快取（備用）</code>
          </div>
          <div class="strategy-item">
            <strong>Stale While Revalidate</strong>
            <p>立即返回快取，同時背景更新。平衡速度與新鮮度。</p>
            <code>快取（立即）+ 網路（更新）</code>
          </div>
          <div class="strategy-item">
            <strong>Network Only</strong>
            <p>只使用網路，不快取。適合即時資料。</p>
            <code>網路（僅）</code>
          </div>
        </div>
      </div>

      <!-- 程式碼範例 -->
      <div class="showcase-section">
        <h3>📝 程式碼範例</h3>
        <div class="code-example">
          <div class="code-header">註冊 Service Worker</div>
          <pre><code>// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW 已註冊'))
    .catch(err => console.log('SW 註冊失敗', err));
}</code></pre>
        </div>
        <div class="code-example">
          <div class="code-header">sw.js 基本結構</div>
          <pre><code>// 安裝事件 - 預快取
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('v1').then(cache =>
      cache.addAll(['/index.html', '/style.css'])
    )
  );
});

// 攔截請求
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
  );
});</code></pre>
        </div>
      </div>

      <!-- 注意事項 -->
      <div class="pwa-notice">
        <h4>⚠️ 開發注意事項</h4>
        <ul>
          <li>Service Worker 需要 <strong>HTTPS</strong> 或 <strong>localhost</strong> 環境</li>
          <li>本地檔案開啟（file://）無法使用 Service Worker</li>
          <li>建議使用本地伺服器測試：<code>python3 -m http.server 8000</code></li>
        </ul>
      </div>
    </div>
  `;
}

// ============================================
// 輔助函數
// ============================================
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============================================
// 初始化
// ============================================
let pwaShowcase = null;

function initPWAShowcase() {
  const container = document.getElementById('pwa-tab');
  if (!container) {
    console.warn('找不到 pwa-tab 容器');
    return;
  }

  // 渲染 UI
  renderPWAShowcase(container);

  // 初始化
  pwaShowcase = new PWAShowcase();

  // 更新網路狀態
  updateNetworkStatus();

  // 網路監聽
  pwaShowcase.setupNetworkMonitor({
    onOnline: updateNetworkStatus,
    onOffline: updateNetworkStatus
  });

  // 更新 API 支援
  updateSupportGrid();

  // 更新儲存空間
  updateStorageInfo();

  console.log('✅ PWA 展示初始化完成');
}

function updateNetworkStatus() {
  const indicator = document.getElementById('network-indicator');
  const statusEl = document.getElementById('network-status');
  const typeEl = document.getElementById('connection-type');
  const downlinkEl = document.getElementById('downlink');
  const rttEl = document.getElementById('rtt');

  const online = navigator.onLine;

  if (indicator) indicator.classList.toggle('offline', !online);
  if (statusEl) statusEl.textContent = online ? '已連線' : '離線';

  const conn = navigator.connection;
  if (typeEl) typeEl.textContent = conn?.effectiveType || '-';
  if (downlinkEl) downlinkEl.textContent = conn?.downlink ? `${conn.downlink} Mbps` : '-';
  if (rttEl) rttEl.textContent = conn?.rtt ? `${conn.rtt} ms` : '-';
}

function updateSupportGrid() {
  const grid = document.getElementById('support-grid');
  if (!grid || !pwaShowcase) return;

  const support = pwaShowcase.checkSupport();
  const items = [
    { key: 'serviceWorker', name: 'Service Worker' },
    { key: 'cacheAPI', name: 'Cache API' },
    { key: 'indexedDB', name: 'IndexedDB' },
    { key: 'storageAPI', name: 'Storage API' },
    { key: 'notifications', name: 'Notifications' },
    { key: 'pushManager', name: 'Push API' },
    { key: 'backgroundSync', name: 'Background Sync' },
    { key: 'periodicSync', name: 'Periodic Sync' }
  ];

  grid.innerHTML = items.map(item => `
    <div class="support-item ${support[item.key] ? 'supported' : 'unsupported'}">
      <span class="support-icon">${support[item.key] ? '✅' : '❌'}</span>
      <span class="support-name">${item.name}</span>
    </div>
  `).join('');
}

async function updateStorageInfo() {
  const fillEl = document.getElementById('storage-fill');
  const usageEl = document.getElementById('storage-usage');
  const quotaEl = document.getElementById('storage-quota');

  const estimate = await pwaShowcase?.getStorageEstimate();

  if (estimate) {
    if (fillEl) fillEl.style.width = `${Math.min(estimate.percent, 100)}%`;
    if (usageEl) usageEl.textContent = formatBytes(estimate.usage);
    if (quotaEl) quotaEl.textContent = formatBytes(estimate.quota);
  } else {
    if (usageEl) usageEl.textContent = '不支援';
    if (quotaEl) quotaEl.textContent = '-';
  }
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PWAShowcase, initPWAShowcase };
}
