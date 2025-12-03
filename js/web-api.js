/**
 * Web API Showcase - Core Module
 * 展示現代 Web API 的功能與實際應用
 */

// ============================================
// Fetch API Manager
// ============================================
class FetchManager {
  constructor() {
    this.isLoading = false;
    this.mockData = {
      users: [
        { id: 1, name: "Alex Johnson", email: "alex@nexusai.com", role: "Product Manager", avatar: "👨‍💼", status: "active" },
        { id: 2, name: "Sarah Chen", email: "sarah@nexusai.com", role: "Senior Developer", avatar: "👩‍💻", status: "active" },
        { id: 3, name: "Mike Wilson", email: "mike@nexusai.com", role: "Designer", avatar: "🎨", status: "away" },
        { id: 4, name: "Emma Davis", email: "emma@nexusai.com", role: "Marketing Manager", avatar: "📊", status: "active" },
        { id: 5, name: "James Brown", email: "james@nexusai.com", role: "QA Engineer", avatar: "🧪", status: "active" }
      ],
      transactions: [
        { id: "TXN001", date: "2025-12-03", type: "revenue", amount: 5000, category: "Subscription", description: "Monthly subscription payment", status: "completed" },
        { id: "TXN002", date: "2025-12-02", type: "expense", amount: 1200, category: "Infrastructure", description: "Cloud hosting fee", status: "completed" },
        { id: "TXN003", date: "2025-12-01", type: "revenue", amount: 3500, category: "Service", description: "Consulting services", status: "completed" },
        { id: "TXN004", date: "2025-11-30", type: "expense", amount: 850, category: "Marketing", description: "Ad campaign", status: "completed" },
        { id: "TXN005", date: "2025-11-29", type: "revenue", amount: 7200, category: "Product Sales", description: "License sales", status: "pending" }
      ],
      notifications: [
        { id: 1, title: "New Task Assigned", message: "You have been assigned to review the API documentation", type: "task", timestamp: "2025-12-03T10:30:00Z", read: false },
        { id: 2, title: "System Update", message: "System maintenance completed successfully", type: "system", timestamp: "2025-12-03T09:15:00Z", read: false },
        { id: 3, title: "Meeting Reminder", message: "Team standup meeting in 15 minutes", type: "reminder", timestamp: "2025-12-03T08:45:00Z", read: true },
        { id: 4, title: "Project Milestone", message: "Phase 1 of the project has been completed", type: "achievement", timestamp: "2025-12-02T15:20:00Z", read: true },
        { id: 5, title: "Security Alert", message: "Unusual login activity detected. Please verify", type: "alert", timestamp: "2025-12-02T12:00:00Z", read: true }
      ]
    };
  }

  async loadMockData() {
    // 直接返回內置模擬數據（無需 fetch）
    return this.mockData;
  }

  // 模擬 API 調用，帶進度顯示
  async simulateAPICall(endpoint, delay = 2000, onProgress = null) {
    this.isLoading = true;
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / delay) * 100, 99);
      if (onProgress) onProgress(progress);
    }, 50);

    return new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(progressInterval);
        if (onProgress) onProgress(100);
        this.isLoading = false;

        // 根據 endpoint 返回相應的模擬數據
        let result = { success: true, endpoint, timestamp: new Date().toISOString() };

        if (this.mockData) {
          const [resource] = endpoint.split('/').filter(Boolean);
          if (this.mockData[resource]) {
            result.data = this.mockData[resource];
          }
        }

        resolve(result);
      }, delay);
    });
  }

  // 帶重試邏輯的 API 調用
  async fetchWithRetry(url, maxRetries = 3, delay = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) return response;
        lastError = new Error(`HTTP ${response.status}`);
      } catch (error) {
        lastError = error;
      }
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  // 帶超時的 Fetch
  async fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

// ============================================
// Storage Manager
// ============================================
class StorageManager {
  constructor() {
    this.prefix = 'nexusai_';
  }

  // 保存數據到 LocalStorage
  saveLocal(key, value) {
    try {
      const fullKey = this.prefix + key;
      const serialized = JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  // 從 LocalStorage 讀取數據
  loadLocal(key) {
    try {
      const fullKey = this.prefix + key;
      const data = localStorage.getItem(fullKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  // 保存數據到 SessionStorage
  saveSession(key, value) {
    try {
      const fullKey = this.prefix + key;
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      return false;
    }
  }

  // 從 SessionStorage 讀取數據
  loadSession(key) {
    try {
      const fullKey = this.prefix + key;
      const data = sessionStorage.getItem(fullKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from sessionStorage:', error);
      return null;
    }
  }

  // 刪除數據
  remove(key, useSession = false) {
    try {
      const fullKey = this.prefix + key;
      if (useSession) {
        sessionStorage.removeItem(fullKey);
      } else {
        localStorage.removeItem(fullKey);
      }
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  }

  // 清除所有數據
  clear(useSession = false) {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      const keys = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key.startsWith(this.prefix)) {
          keys.push(key);
        }
      }
      keys.forEach(key => storage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // 獲取所有存儲數據
  getAll(useSession = false) {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      const items = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key.startsWith(this.prefix)) {
          const cleanKey = key.replace(this.prefix, '');
          const value = storage.getItem(key);
          items.push({ key: cleanKey, value });
        }
      }
      return items;
    } catch (error) {
      console.error('Error getting storage items:', error);
      return [];
    }
  }

  // 獲取存儲空間信息
  getStorageStats(useSession = false) {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      let totalSize = 0;
      let itemCount = 0;

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key.startsWith(this.prefix)) {
          const value = storage.getItem(key);
          totalSize += (key.length + value.length) * 2; // 估算字節數
          itemCount++;
        }
      }

      return {
        itemCount,
        estimatedSize: totalSize,
        estimatedSizeKB: (totalSize / 1024).toFixed(2),
        capacity: useSession ? 'Session' : 'Local',
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return null;
    }
  }
}

// ============================================
// Geolocation Manager
// ============================================
class GeolocationManager {
  constructor() {
    this.currentPosition = null;
  }

  // 檢查是否支持 Geolocation
  isSupported() {
    return 'geolocation' in navigator;
  }

  // 請求用戶位置
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = position;
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject({
            code: error.code,
            message: this.getErrorMessage(error.code),
          });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  // 計算兩點之間的距離（Haversine 公式）
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半徑（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // 錯誤信息轉換
  getErrorMessage(code) {
    const messages = {
      1: '位置服務被禁用',
      2: '無法獲取位置信息',
      3: '請求超時',
    };
    return messages[code] || '未知錯誤';
  }
}

// ============================================
// Notification Manager
// ============================================
class NotificationManager {
  constructor() {
    this.permission = Notification?.permission || 'default';
  }

  // 檢查是否支持 Notification API
  isSupported() {
    return 'Notification' in window;
  }

  // 請求通知權限
  async requestPermission() {
    if (!this.isSupported()) {
      return { success: false, message: 'Notification API is not supported' };
    }

    if (this.permission === 'granted') {
      return { success: true, message: 'Permission already granted' };
    }

    if (this.permission === 'denied') {
      return { success: false, message: 'Permission denied' };
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return {
        success: permission === 'granted',
        permission,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 發送通知
  sendNotification(title, options = {}) {
    if (!this.isSupported()) {
      console.warn('Notification API is not supported');
      return null;
    }

    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    const defaultOptions = {
      tag: 'nexusai-notification',
      ...options,
    };

    const notification = new Notification(title, defaultOptions);

    notification.addEventListener('click', () => {
      window.focus();
      notification.close();
    });

    return notification;
  }

  // 發送多個通知（演示）
  sendMultiple(notifications) {
    notifications.forEach((notif, index) => {
      setTimeout(() => {
        this.sendNotification(notif.title, notif.options);
      }, index * 500);
    });
  }
}

// ============================================
// Canvas Tools
// ============================================
class CanvasTools {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.isDrawing = false;
    this.brushSize = 3;
    this.color = '#00D9FF';
    this.setup();
  }

  setup() {
    // 設置 Canvas 尺寸
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width - 20;
    this.canvas.height = Math.max(300, rect.width * 0.5);

    // 填充背景
    this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-bg-secondary').trim();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 綁定事件
    this.canvas.addEventListener('mousedown', () => this.isDrawing = true);
    this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseleave', () => this.isDrawing = false);
  }

  draw(event) {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  setBrushSize(size) {
    this.brushSize = size;
  }

  setColor(color) {
    this.color = color;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-bg-secondary').trim();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawChart(data, type = 'bar') {
    this.clear();

    const padding = 40;
    const width = this.canvas.width - padding * 2;
    const height = this.canvas.height - padding * 2;

    // 繪製坐標軸
    this.ctx.strokeStyle = '#666';
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, this.canvas.height - padding);
    this.ctx.lineTo(this.canvas.width - padding, this.canvas.height - padding);
    this.ctx.stroke();

    if (type === 'bar') {
      this.drawBarChart(data, padding, width, height);
    } else if (type === 'line') {
      this.drawLineChart(data, padding, width, height);
    }
  }

  drawBarChart(data, padding, width, height) {
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = width / data.length;

    this.ctx.fillStyle = 'rgba(0, 217, 255, 0.7)';
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * height;
      const x = padding + index * barWidth + barWidth * 0.1;
      const y = this.canvas.height - padding - barHeight;

      this.ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    });
  }

  drawLineChart(data, padding, width, height) {
    const maxValue = Math.max(...data.map(d => d.value));

    this.ctx.strokeStyle = '#00D9FF';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * width;
      const y = this.canvas.height - padding - (item.value / maxValue) * height;

      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });

    this.ctx.stroke();

    // 繪製數據點
    this.ctx.fillStyle = '#00D9FF';
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * width;
      const y = this.canvas.height - padding - (item.value / maxValue) * height;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
}

// ============================================
// Observer Manager
// ============================================
class ObserverManager {
  constructor() {
    this.intersectionObservers = new Map();
    this.resizeObservers = new Map();
  }

  // 設置 Intersection Observer
  observeIntersection(elements, callback, options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      ...options,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        callback(entry.target, entry.isIntersecting, entry);
      });
    }, defaultOptions);

    elements.forEach(element => {
      observer.observe(element);
      this.intersectionObservers.set(element, observer);
    });

    return observer;
  }

  // 設置 Resize Observer
  observeResize(elements, callback) {
    const observer = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        const { width, height } = entry.contentRect;
        callback(entry.target, width, height);
      });
    });

    elements.forEach(element => {
      observer.observe(element);
      this.resizeObservers.set(element, observer);
    });

    return observer;
  }

  // 停止觀察
  unobserve(element, type = 'intersection') {
    if (type === 'intersection') {
      const observer = this.intersectionObservers.get(element);
      if (observer) {
        observer.unobserve(element);
        this.intersectionObservers.delete(element);
      }
    } else if (type === 'resize') {
      const observer = this.resizeObservers.get(element);
      if (observer) {
        observer.unobserve(element);
        this.resizeObservers.delete(element);
      }
    }
  }

  // 清理所有觀察器
  disconnect() {
    this.intersectionObservers.forEach(observer => observer.disconnect());
    this.resizeObservers.forEach(observer => observer.disconnect());
    this.intersectionObservers.clear();
    this.resizeObservers.clear();
  }
}

// ============================================
// 全局實例
// ============================================
const fetchManager = new FetchManager();
const storageManager = new StorageManager();
const geolocationManager = new GeolocationManager();
const notificationManager = new NotificationManager();
const observerManager = new ObserverManager();

// 初始化模擬數據
fetchManager.loadMockData();
