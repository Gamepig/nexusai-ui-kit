/**
 * Web API Showcase - UI Initialization
 * 初始化所有 Web API 演示區塊
 */

// ============================================
// Fetch API Showcase
// ============================================
class FetchAPIShowcase {
  constructor() {
    this.container = document.getElementById('web-apis-tab');
  }

  async init() {
    if (!this.container) return;

    const html = `
      <div class="api-demo-section">
        <h3>🌐 Fetch API - 模擬 API 調用</h3>
        <p>展示非同步數據獲取、進度顯示和錯誤處理</p>

        <div class="fetch-demo">
          <div class="fetch-controls">
            <button class="fetch-btn" id="fetch-users-btn">載入用戶列表</button>
            <button class="fetch-btn" id="fetch-transactions-btn">載入交易數據</button>
            <button class="fetch-btn" id="fetch-notifications-btn">載入通知</button>
            <select id="fetch-delay-select" style="padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border-default); background: var(--color-bg-secondary); color: var(--color-text-primary);">
              <option value="1000">延遲 1 秒</option>
              <option value="2000" selected>延遲 2 秒</option>
              <option value="3000">延遲 3 秒</option>
              <option value="5000">延遲 5 秒</option>
            </select>
          </div>

          <div class="progress-container">
            <div class="progress-label">
              <span>加載進度</span>
              <span id="fetch-progress-text">0%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" id="fetch-progress-fill"></div>
            </div>
          </div>

          <div id="fetch-result" class="fetch-result">
            <p style="color: var(--color-text-tertiary);">點擊上方按鈕以模擬 API 調用</p>
          </div>
        </div>
      </div>
    `;

    this.container.insertAdjacentHTML('beforeend', html);
    this.attachEventListeners();
  }

  attachEventListeners() {
    document.getElementById('fetch-users-btn')?.addEventListener('click', () => {
      this.fetchData('users');
    });
    document.getElementById('fetch-transactions-btn')?.addEventListener('click', () => {
      this.fetchData('transactions');
    });
    document.getElementById('fetch-notifications-btn')?.addEventListener('click', () => {
      this.fetchData('notifications');
    });
  }

  async fetchData(endpoint) {
    const delaySelect = document.getElementById('fetch-delay-select');
    const delay = parseInt(delaySelect?.value || 2000);
    const resultDiv = document.getElementById('fetch-result');
    const progressFill = document.getElementById('fetch-progress-fill');
    const progressText = document.getElementById('fetch-progress-text');

    // 禁用按鈕
    document.querySelectorAll('.fetch-btn').forEach(btn => btn.disabled = true);

    try {
      const result = await fetchManager.simulateAPICall(
        endpoint,
        delay,
        (progress) => {
          progressFill.style.width = progress + '%';
          progressText.textContent = Math.round(progress) + '%';
        }
      );

      const formatted = JSON.stringify(result, null, 2);
      resultDiv.innerHTML = `<pre>${formatted}</pre>`;
    } catch (error) {
      resultDiv.innerHTML = `<pre style="color: var(--color-red);">Error: ${error.message}</pre>`;
    } finally {
      document.querySelectorAll('.fetch-btn').forEach(btn => btn.disabled = false);
    }
  }
}

// ============================================
// Storage Showcase
// ============================================
class StorageShowcase {
  constructor() {
    this.container = document.getElementById('web-apis-tab');
  }

  init() {
    if (!this.container) return;

    const html = `
      <div class="api-demo-section">
        <h3>💾 Web Storage - 本地持久化存儲</h3>
        <p>展示 LocalStorage 和 SessionStorage 的使用</p>

        <div class="storage-demo">
          <div class="storage-form">
            <div class="form-group">
              <label class="form-label">鍵名</label>
              <input type="text" id="storage-key" class="form-input" placeholder="輸入鍵名">
            </div>
            <div class="form-group">
              <label class="form-label">值</label>
              <input type="text" id="storage-value" class="form-input" placeholder="輸入值">
            </div>
          </div>

          <div class="storage-controls">
            <button class="storage-btn" id="storage-save-local-btn">保存到 LocalStorage</button>
            <button class="storage-btn" id="storage-save-session-btn">保存到 SessionStorage</button>
            <button class="storage-btn danger" id="storage-clear-btn">清除所有數據</button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-6); margin-bottom: var(--spacing-6);">
            <div>
              <h4 style="margin-bottom: var(--spacing-3); color: var(--color-text-secondary);">LocalStorage 統計</h4>
              <div id="local-stats" class="storage-stats"></div>
            </div>
            <div>
              <h4 style="margin-bottom: var(--spacing-3); color: var(--color-text-secondary);">SessionStorage 統計</h4>
              <div id="session-stats" class="storage-stats"></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-6);">
            <div>
              <h4 style="margin-bottom: var(--spacing-3); color: var(--color-text-secondary);">LocalStorage 項目</h4>
              <div id="local-items" class="storage-items"></div>
            </div>
            <div>
              <h4 style="margin-bottom: var(--spacing-3); color: var(--color-text-secondary);">SessionStorage 項目</h4>
              <div id="session-items" class="storage-items"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.insertAdjacentHTML('beforeend', html);
    this.attachEventListeners();
    this.updateDisplay();
  }

  attachEventListeners() {
    document.getElementById('storage-save-local-btn')?.addEventListener('click', () => {
      this.saveToStorage(false);
    });
    document.getElementById('storage-save-session-btn')?.addEventListener('click', () => {
      this.saveToStorage(true);
    });
    document.getElementById('storage-clear-btn')?.addEventListener('click', () => {
      this.clearStorage();
    });
  }

  saveToStorage(useSession) {
    const keyInput = document.getElementById('storage-key');
    const valueInput = document.getElementById('storage-value');

    const key = keyInput?.value.trim();
    const value = valueInput?.value.trim();

    if (!key || !value) {
      alert('請輸入鍵名和值');
      return;
    }

    if (useSession) {
      storageManager.saveSession(key, value);
    } else {
      storageManager.saveLocal(key, value);
    }

    keyInput.value = '';
    valueInput.value = '';
    this.updateDisplay();
  }

  clearStorage() {
    if (confirm('確定要清除所有 NexusAI 數據嗎？')) {
      storageManager.clear(false);
      storageManager.clear(true);
      this.updateDisplay();
    }
  }

  updateDisplay() {
    // 更新 LocalStorage 統計
    const localStats = storageManager.getStorageStats(false);
    const localStatsDiv = document.getElementById('local-stats');
    if (localStatsDiv && localStats) {
      localStatsDiv.innerHTML = `
        <div class="stat-row">
          <span class="stat-label">項目數</span>
          <span class="stat-value">${localStats.itemCount}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">估計大小</span>
          <span class="stat-value">${localStats.estimatedSizeKB} KB</span>
        </div>
      `;
    }

    // 更新 SessionStorage 統計
    const sessionStats = storageManager.getStorageStats(true);
    const sessionStatsDiv = document.getElementById('session-stats');
    if (sessionStatsDiv && sessionStats) {
      sessionStatsDiv.innerHTML = `
        <div class="stat-row">
          <span class="stat-label">項目數</span>
          <span class="stat-value">${sessionStats.itemCount}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">估計大小</span>
          <span class="stat-value">${sessionStats.estimatedSizeKB} KB</span>
        </div>
      `;
    }

    // 更新 LocalStorage 項目列表
    const localItems = storageManager.getAll(false);
    const localItemsDiv = document.getElementById('local-items');
    if (localItemsDiv) {
      localItemsDiv.innerHTML = localItems.length ? localItems.map(item => `
        <div class="storage-item">
          <div class="storage-item-key">${item.key}</div>
          <div class="storage-item-value">${item.value}</div>
          <button class="storage-item-delete" onclick="storageManager.remove('${item.key}', false); document.querySelector('.storage-demo') && location.reload();">刪除</button>
        </div>
      `).join('') : '<p style="color: var(--color-text-tertiary);">無數據</p>';
    }

    // 更新 SessionStorage 項目列表
    const sessionItems = storageManager.getAll(true);
    const sessionItemsDiv = document.getElementById('session-items');
    if (sessionItemsDiv) {
      sessionItemsDiv.innerHTML = sessionItems.length ? sessionItems.map(item => `
        <div class="storage-item">
          <div class="storage-item-key">${item.key}</div>
          <div class="storage-item-value">${item.value}</div>
          <button class="storage-item-delete" onclick="storageManager.remove('${item.key}', true); document.querySelector('.storage-demo') && location.reload();">刪除</button>
        </div>
      `).join('') : '<p style="color: var(--color-text-tertiary);">無數據</p>';
    }
  }
}

// ============================================
// Geolocation Showcase
// ============================================
class GeolocationShowcase {
  constructor() {
    this.container = document.getElementById('web-apis-tab');
  }

  init() {
    if (!this.container) return;

    const html = `
      <div class="api-demo-section">
        <h3>📍 Geolocation API - 地理位置</h3>
        <p>獲取用戶位置並進行距離計算</p>

        <div class="geo-demo">
          <button class="fetch-btn" id="geo-request-btn">請求位置權限</button>

          <div id="geo-info" class="geo-info" style="display: none; margin-top: var(--spacing-6);">
            <div class="geo-item">
              <span class="geo-label">緯度</span>
              <span class="geo-value" id="geo-latitude">-</span>
            </div>
            <div class="geo-item">
              <span class="geo-label">經度</span>
              <span class="geo-value" id="geo-longitude">-</span>
            </div>
            <div class="geo-item">
              <span class="geo-label">精度 (米)</span>
              <span class="geo-value" id="geo-accuracy">-</span>
            </div>
            <div class="geo-item">
              <span class="geo-label">海拔高度 (米)</span>
              <span class="geo-value" id="geo-altitude">-</span>
            </div>
            <div class="geo-item">
              <span class="geo-label">時間戳</span>
              <span class="geo-value" id="geo-timestamp" style="font-size: var(--font-size-xs);">-</span>
            </div>
            <div class="geo-item">
              <span class="geo-label">到東京的距離</span>
              <span class="geo-value" id="geo-distance">計算中...</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.insertAdjacentHTML('beforeend', html);
    this.attachEventListeners();
  }

  attachEventListeners() {
    document.getElementById('geo-request-btn')?.addEventListener('click', () => {
      this.requestLocation();
    });
  }

  async requestLocation() {
    const btn = document.getElementById('geo-request-btn');
    if (!btn) return;

    btn.disabled = true;
    btn.textContent = '正在請求位置...';

    try {
      if (!geolocationManager.isSupported()) {
        alert('您的瀏覽器不支持 Geolocation API');
        return;
      }

      const position = await geolocationManager.getCurrentPosition();

      // 更新 UI
      const infoDiv = document.getElementById('geo-info');
      if (infoDiv) {
        infoDiv.style.display = 'block';
        document.getElementById('geo-latitude').textContent = position.latitude.toFixed(4);
        document.getElementById('geo-longitude').textContent = position.longitude.toFixed(4);
        document.getElementById('geo-accuracy').textContent = position.accuracy.toFixed(0);
        document.getElementById('geo-altitude').textContent = position.altitude ? position.altitude.toFixed(0) : 'N/A';
        document.getElementById('geo-timestamp').textContent = new Date(position.timestamp).toLocaleString();

        // 計算到東京的距離
        const tokyoLat = 35.6762;
        const tokyoLon = 139.6503;
        const distance = geolocationManager.calculateDistance(
          position.latitude,
          position.longitude,
          tokyoLat,
          tokyoLon
        );
        document.getElementById('geo-distance').textContent = distance.toFixed(2) + ' 公里';
      }

      btn.textContent = '重新請求位置';
    } catch (error) {
      alert('獲取位置失敗：' + (error.message || error.code));
      btn.textContent = '請求位置權限';
    } finally {
      btn.disabled = false;
    }
  }
}

// ============================================
// Notification Showcase
// ============================================
class NotificationShowcase {
  constructor() {
    this.container = document.getElementById('web-apis-tab');
  }

  init() {
    if (!this.container) return;

    const html = `
      <div class="api-demo-section">
        <h3>🔔 Notification API - 系統通知</h3>
        <p>請求通知權限並發送系統通知</p>

        <div class="notification-demo">
          <div style="margin-bottom: var(--spacing-6);">
            <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-4);">
              權限狀態：<span id="notification-permission" style="color: var(--color-orange); font-weight: bold;">未請求</span>
            </p>
            <button class="fetch-btn" id="notification-request-btn">請求通知權限</button>
          </div>

          <h4 style="color: var(--color-text-secondary); margin-bottom: var(--spacing-4);">通知示例</h4>
          <div class="notification-grid">
            <button class="notification-btn" id="notify-success">✅ 成功通知</button>
            <button class="notification-btn" id="notify-warning">⚠️ 警告通知</button>
            <button class="notification-btn" id="notify-error">❌ 錯誤通知</button>
            <button class="notification-btn" id="notify-info">ℹ️ 信息通知</button>
          </div>
        </div>
      </div>
    `;

    this.container.insertAdjacentHTML('beforeend', html);
    this.attachEventListeners();
    this.updatePermissionStatus();
  }

  attachEventListeners() {
    document.getElementById('notification-request-btn')?.addEventListener('click', () => {
      this.requestPermission();
    });

    document.getElementById('notify-success')?.addEventListener('click', () => {
      notificationManager.sendNotification('成功！', {
        body: '操作已成功完成',
        tag: 'success-notification',
      });
    });

    document.getElementById('notify-warning')?.addEventListener('click', () => {
      notificationManager.sendNotification('警告', {
        body: '請檢查您的設定',
        tag: 'warning-notification',
      });
    });

    document.getElementById('notify-error')?.addEventListener('click', () => {
      notificationManager.sendNotification('錯誤', {
        body: '發生了一個錯誤，請重試',
        tag: 'error-notification',
      });
    });

    document.getElementById('notify-info')?.addEventListener('click', () => {
      notificationManager.sendNotification('信息', {
        body: '這是一個信息通知',
        tag: 'info-notification',
      });
    });
  }

  async requestPermission() {
    const btn = document.getElementById('notification-request-btn');
    if (!btn) return;

    if (!notificationManager.isSupported()) {
      alert('您的瀏覽器不支持 Notification API');
      return;
    }

    const result = await notificationManager.requestPermission();

    if (result.success) {
      alert('通知權限已授予！');
      this.updatePermissionStatus();
    } else {
      alert('通知權限被拒絕或未授予');
    }
  }

  updatePermissionStatus() {
    const permissionSpan = document.getElementById('notification-permission');
    if (permissionSpan) {
      const permission = notificationManager.permission;
      const statusMap = {
        'granted': '✅ 已授予',
        'denied': '❌ 已拒絕',
        'default': '⏳ 未請求',
      };
      permissionSpan.textContent = statusMap[permission] || permission;
      permissionSpan.style.color =
        permission === 'granted' ? 'var(--color-green)' :
        permission === 'denied' ? 'var(--color-red)' :
        'var(--color-orange)';
    }
  }
}

// ============================================
// Canvas Showcase (Web API Version)
// ============================================
class CanvasAPIShowcase {
  constructor() {
    this.container = document.getElementById('web-apis-tab');
    this.canvas = null;
    this.canvasTools = null;
  }

  init() {
    if (!this.container) return;

    const html = `
      <div class="api-demo-section">
        <h3>🎨 Canvas API - 2D 繪圖</h3>
        <p>簡單繪圖工具和圖表生成</p>

        <div class="canvas-demo">
          <div class="canvas-tools">
            <button class="canvas-tool-btn active" id="canvas-draw-btn">✏️ 繪圖</button>
            <button class="canvas-tool-btn" id="canvas-erase-btn">🧹 橡皮擦</button>
            <button class="canvas-tool-btn" id="canvas-clear-btn">🗑️ 清除</button>
            <input type="color" id="canvas-color" value="#00D9FF" style="width: 50px; height: 40px; border-radius: var(--radius-md); border: none; cursor: pointer;">
          </div>

          <canvas id="demo-canvas" class="canvas-container"></canvas>

          <div style="margin-top: var(--spacing-6);">
            <h4 style="color: var(--color-text-secondary); margin-bottom: var(--spacing-3);">圖表演示</h4>
            <button class="fetch-btn" id="canvas-bar-chart-btn">柱狀圖</button>
            <button class="fetch-btn" id="canvas-line-chart-btn">折線圖</button>
          </div>
        </div>
      </div>
    `;

    this.container.insertAdjacentHTML('beforeend', html);

    // 初始化 Canvas
    setTimeout(() => {
      this.canvas = document.getElementById('demo-canvas');
      if (this.canvas) {
        this.canvasTools = new CanvasTools(this.canvas);
        this.attachEventListeners();
      }
    }, 100);
  }

  attachEventListeners() {
    document.getElementById('canvas-draw-btn')?.addEventListener('click', (e) => {
      this.setDrawMode('draw', e.target);
    });

    document.getElementById('canvas-erase-btn')?.addEventListener('click', (e) => {
      this.setDrawMode('erase', e.target);
    });

    document.getElementById('canvas-clear-btn')?.addEventListener('click', () => {
      if (this.canvasTools) this.canvasTools.clear();
    });

    document.getElementById('canvas-color')?.addEventListener('change', (e) => {
      if (this.canvasTools) this.canvasTools.setColor(e.target.value);
    });

    document.getElementById('canvas-bar-chart-btn')?.addEventListener('click', () => {
      this.drawSampleChart('bar');
    });

    document.getElementById('canvas-line-chart-btn')?.addEventListener('click', () => {
      this.drawSampleChart('line');
    });
  }

  setDrawMode(mode, button) {
    if (!this.canvasTools) return;

    document.querySelectorAll('.canvas-tool-btn').forEach(btn => btn.classList.remove('active'));
    button?.classList.add('active');

    if (mode === 'draw') {
      this.canvasTools.setColor(document.getElementById('canvas-color')?.value || '#00D9FF');
      this.canvasTools.setBrushSize(3);
    } else if (mode === 'erase') {
      this.canvasTools.setColor(getComputedStyle(document.documentElement).getPropertyValue('--color-bg-secondary').trim());
      this.canvasTools.setBrushSize(10);
    }
  }

  drawSampleChart(type) {
    if (!this.canvasTools) return;

    const sampleData = [
      { label: '1月', value: 120 },
      { label: '2月', value: 190 },
      { label: '3月', value: 150 },
      { label: '4月', value: 220 },
      { label: '5月', value: 180 },
      { label: '6月', value: 250 },
    ];

    this.canvasTools.drawChart(sampleData, type);
  }
}

// ============================================
// Observer Showcase
// ============================================
class ObserverShowcase {
  constructor() {
    this.container = document.getElementById('web-apis-tab');
  }

  init() {
    if (!this.container) return;

    const html = `
      <div class="api-demo-section">
        <h3>👁️ Observer API - 元素監聽</h3>
        <p>使用 Intersection Observer 和 Resize Observer</p>

        <div class="observer-demo">
          <h4 style="color: var(--color-text-secondary); margin-bottom: var(--spacing-3);">Intersection Observer - 滾動觸發動畫</h4>
          <div class="scroll-trigger-area">
            <div class="scroll-item">項目 1 - 向下滾動以觸發動畫</div>
            <div class="scroll-item">項目 2</div>
            <div class="scroll-item">項目 3</div>
            <div class="scroll-item">項目 4</div>
            <div class="scroll-item">項目 5 - 底部項目</div>
          </div>

          <h4 style="color: var(--color-text-secondary); margin: var(--spacing-6) 0 var(--spacing-3) 0;">Resize Observer - 容器尺寸監聽</h4>
          <p style="color: var(--color-text-tertiary); margin-bottom: var(--spacing-3); font-size: var(--font-size-sm);">拖動右下角以改變大小，觀察尺寸變化</p>
          <div class="resize-demo">
            <div class="resize-info">
              寬度：<span id="resize-width">-</span>px | 高度：<span id="resize-height">-</span>px
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.insertAdjacentHTML('beforeend', html);
    this.setupObservers();
  }

  setupObservers() {
    // Intersection Observer 設置
    const scrollItems = document.querySelectorAll('.scroll-item');
    observerManager.observeIntersection(scrollItems, (element, isIntersecting) => {
      if (isIntersecting) {
        element.classList.add('visible');
      }
    });

    // Resize Observer 設置
    const resizeDemo = document.querySelector('.resize-demo');
    if (resizeDemo) {
      observerManager.observeResize([resizeDemo], (element, width, height) => {
        document.getElementById('resize-width').textContent = Math.round(width);
        document.getElementById('resize-height').textContent = Math.round(height);
      });
    }
  }
}

// ============================================
// 全局初始化函數
// ============================================
function initWebAPIShowcases() {
  const fetchShowcase = new FetchAPIShowcase();
  fetchShowcase.init();

  const storageShowcase = new StorageShowcase();
  storageShowcase.init();

  const geoShowcase = new GeolocationShowcase();
  geoShowcase.init();

  const notificationShowcase = new NotificationShowcase();
  notificationShowcase.init();

  const canvasShowcase = new CanvasAPIShowcase();
  canvasShowcase.init();

  const observerShowcase = new ObserverShowcase();
  observerShowcase.init();
}

// 當頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
  // 如果 web-apis-tab 已經是 active，立即初始化
  const webApisTab = document.getElementById('web-apis-tab');
  if (webApisTab && webApisTab.classList.contains('active')) {
    initWebAPIShowcases();
  }
});

// 導出供外部使用
window.initWebAPIShowcases = initWebAPIShowcases;
