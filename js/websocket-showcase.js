/**
 * WebSocket 實時通信模擬模組
 * Phase 6.3 - 模擬 WebSocket 功能
 */

// ============================================
// MockWebSocketServer - 模擬伺服器
// ============================================
class MockWebSocketServer {
  constructor() {
    this.clients = new Map();
    this.messageQueue = [];
    this.mockUsers = [
      { id: 1, name: 'Alice', avatar: '👩' },
      { id: 2, name: 'Bob', avatar: '👨' },
      { id: 3, name: 'Carol', avatar: '👩‍💼' },
      { id: 4, name: 'David', avatar: '👨‍💻' }
    ];
    this.stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
    this.intervals = [];
  }

  // 模擬連接
  connect(clientId, onMessage) {
    this.clients.set(clientId, { onMessage, connected: true });
    console.log(`[MockServer] 客戶端連接: ${clientId}`);

    // 發送歡迎訊息
    setTimeout(() => {
      this.sendToClient(clientId, {
        type: 'system',
        message: '歡迎加入！',
        timestamp: Date.now()
      });
    }, 100);

    return true;
  }

  disconnect(clientId) {
    if (this.clients.has(clientId)) {
      this.clients.delete(clientId);
      console.log(`[MockServer] 客戶端斷開: ${clientId}`);
    }
  }

  // 發送訊息給單一客戶端
  sendToClient(clientId, message) {
    const client = this.clients.get(clientId);
    if (client?.onMessage) {
      client.onMessage(message);
    }
  }

  // 廣播給所有客戶端
  broadcast(message) {
    this.clients.forEach((client, id) => {
      this.sendToClient(id, message);
    });
  }

  // ============================================
  // 模擬場景
  // ============================================

  // 聊天室模擬
  startChatSimulation(clientId, onMessage) {
    const messages = [
      '大家好！',
      '今天天氣真好',
      '有人看了昨天的比賽嗎？',
      '這個功能太棒了！',
      '剛剛部署完成 🚀',
      '有人要喝咖啡嗎？☕',
      '週末有什麼計畫？',
      '我覺得這個設計很不錯'
    ];

    const interval = setInterval(() => {
      const user = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];

      onMessage({
        type: 'chat',
        user,
        message,
        timestamp: Date.now()
      });
    }, 2000 + Math.random() * 3000);

    this.intervals.push(interval);
    return interval;
  }

  // 股票數據模擬
  startStockSimulation(clientId, onMessage) {
    const basePrice = {
      'AAPL': 185.50,
      'GOOGL': 142.30,
      'MSFT': 378.90,
      'TSLA': 248.60,
      'AMZN': 178.20
    };

    const interval = setInterval(() => {
      const stocks = this.stockSymbols.map(symbol => {
        const change = (Math.random() - 0.5) * 2;
        const price = basePrice[symbol] + change;
        basePrice[symbol] = price;

        return {
          symbol,
          price: price.toFixed(2),
          change: change.toFixed(2),
          changePercent: ((change / price) * 100).toFixed(2)
        };
      });

      onMessage({
        type: 'stock',
        stocks,
        timestamp: Date.now()
      });
    }, 1000);

    this.intervals.push(interval);
    return interval;
  }

  // 通知模擬
  startNotificationSimulation(clientId, onMessage) {
    const notifications = [
      { title: '新訂單', message: '您有一筆新訂單待處理', icon: '📦' },
      { title: '系統更新', message: '系統將在 10 分鐘後維護', icon: '🔧' },
      { title: '付款成功', message: '您的付款已成功處理', icon: '💰' },
      { title: '新留言', message: 'Alice 在您的文章下留言', icon: '💬' },
      { title: '安全提醒', message: '偵測到新的登入裝置', icon: '🔐' }
    ];

    const interval = setInterval(() => {
      const notification = notifications[Math.floor(Math.random() * notifications.length)];

      onMessage({
        type: 'notification',
        ...notification,
        timestamp: Date.now()
      });
    }, 4000 + Math.random() * 3000);

    this.intervals.push(interval);
    return interval;
  }

  // 停止所有模擬
  stopAllSimulations() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }
}

// ============================================
// WebSocketShowcase - 演示主類
// ============================================
class WebSocketShowcase {
  constructor() {
    this.mockServer = new MockWebSocketServer();
    this.clientId = 'client-' + Date.now();
    this.isConnected = false;
    this.messageHandlers = new Map();
    this.activeSimulation = null;
  }

  // 模擬連接
  connect(onMessage) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockServer.connect(this.clientId, (msg) => {
          this.messageHandlers.forEach(handler => handler(msg));
          onMessage?.(msg);
        });
        this.isConnected = true;
        console.log('✅ 模擬 WebSocket 已連接');
        resolve(true);
      }, 500);
    });
  }

  // 斷開連接
  disconnect() {
    this.mockServer.stopAllSimulations();
    this.mockServer.disconnect(this.clientId);
    this.isConnected = false;
    this.activeSimulation = null;
    console.log('🔌 模擬 WebSocket 已斷開');
  }

  // 發送訊息（模擬）
  send(message) {
    if (!this.isConnected) {
      console.warn('WebSocket 未連接');
      return false;
    }

    console.log('[發送]', message);

    // 模擬回應
    if (message.type === 'chat') {
      setTimeout(() => {
        this.mockServer.sendToClient(this.clientId, {
          type: 'chat',
          user: { id: 0, name: '你', avatar: '🧑' },
          message: message.text,
          timestamp: Date.now()
        });
      }, 100);
    }

    return true;
  }

  // 添加訊息處理器
  onMessage(id, handler) {
    this.messageHandlers.set(id, handler);
  }

  // 移除訊息處理器
  offMessage(id) {
    this.messageHandlers.delete(id);
  }

  // 開始演示
  startDemo(type, onMessage) {
    if (this.activeSimulation) {
      this.mockServer.stopAllSimulations();
    }

    switch (type) {
      case 'chat':
        this.activeSimulation = this.mockServer.startChatSimulation(this.clientId, onMessage);
        break;
      case 'stock':
        this.activeSimulation = this.mockServer.startStockSimulation(this.clientId, onMessage);
        break;
      case 'notification':
        this.activeSimulation = this.mockServer.startNotificationSimulation(this.clientId, onMessage);
        break;
    }
  }

  stopDemo() {
    this.mockServer.stopAllSimulations();
    this.activeSimulation = null;
  }
}

// ============================================
// UI 渲染
// ============================================
function renderWebSocketShowcase(container) {
  container.innerHTML = `
    <div class="websocket-showcase">
      <div class="showcase-header">
        <h2>🔌 WebSocket 實時通信</h2>
        <p>模擬 WebSocket 雙向通信（無需後端）</p>
      </div>

      <!-- 連接狀態 -->
      <div class="ws-status-bar">
        <div class="ws-status" id="ws-status">
          <span class="status-dot"></span>
          <span class="status-text">未連接</span>
        </div>
        <div class="ws-controls">
          <button class="btn btn-solid-cyan btn-sm" id="btn-ws-connect">
            🔌 連接
          </button>
          <button class="btn btn-outline-cyan btn-sm" id="btn-ws-disconnect" disabled>
            ❌ 斷開
          </button>
        </div>
      </div>

      <!-- 演示選擇 -->
      <div class="showcase-section">
        <h3>🎭 選擇演示場景</h3>
        <div class="demo-selector">
          <button class="demo-option active" data-demo="chat">
            💬 即時聊天
          </button>
          <button class="demo-option" data-demo="stock">
            📈 股票行情
          </button>
          <button class="demo-option" data-demo="notification">
            🔔 實時通知
          </button>
        </div>
      </div>

      <!-- 聊天演示 -->
      <div class="demo-panel" id="demo-chat">
        <div class="chat-container">
          <div class="chat-messages" id="chat-messages">
            <div class="chat-placeholder">連接後開始聊天...</div>
          </div>
          <div class="chat-input">
            <input type="text" id="chat-input" placeholder="輸入訊息..." disabled>
            <button class="btn btn-solid-cyan btn-sm" id="btn-send-chat" disabled>
              發送
            </button>
          </div>
        </div>
      </div>

      <!-- 股票演示 -->
      <div class="demo-panel hidden" id="demo-stock">
        <div class="stock-container">
          <div class="stock-list" id="stock-list">
            <div class="stock-item">
              <span class="stock-symbol">AAPL</span>
              <span class="stock-price">-</span>
              <span class="stock-change">-</span>
            </div>
            <div class="stock-item">
              <span class="stock-symbol">GOOGL</span>
              <span class="stock-price">-</span>
              <span class="stock-change">-</span>
            </div>
            <div class="stock-item">
              <span class="stock-symbol">MSFT</span>
              <span class="stock-price">-</span>
              <span class="stock-change">-</span>
            </div>
            <div class="stock-item">
              <span class="stock-symbol">TSLA</span>
              <span class="stock-price">-</span>
              <span class="stock-change">-</span>
            </div>
            <div class="stock-item">
              <span class="stock-symbol">AMZN</span>
              <span class="stock-price">-</span>
              <span class="stock-change">-</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 通知演示 -->
      <div class="demo-panel hidden" id="demo-notification">
        <div class="notification-container">
          <div class="notification-list" id="notification-list">
            <div class="notification-placeholder">等待通知...</div>
          </div>
        </div>
      </div>

      <!-- 訊息日誌 -->
      <div class="showcase-section">
        <h3>📜 訊息日誌</h3>
        <div class="message-log" id="message-log">
          <div class="log-placeholder">連接後顯示訊息...</div>
        </div>
        <button class="btn btn-outline-cyan btn-sm" id="btn-clear-log">
          🗑️ 清除日誌
        </button>
      </div>

      <!-- 說明 -->
      <div class="ws-info">
        <h3>💡 WebSocket 說明</h3>
        <ul>
          <li><strong>雙向通信</strong>：伺服器可主動推送訊息給客戶端</li>
          <li><strong>低延遲</strong>：持久連接，無需重複建立 HTTP 請求</li>
          <li><strong>適用場景</strong>：即時聊天、股票行情、遊戲、協作編輯</li>
          <li><strong>注意</strong>：此演示使用模擬伺服器，無需真實後端</li>
        </ul>
      </div>
    </div>
  `;
}

// ============================================
// 初始化
// ============================================
let wsShowcase = null;
let currentDemo = 'chat';

function initWebSocketShowcase() {
  const container = document.getElementById('websocket-tab');
  if (!container) {
    console.warn('找不到 websocket-tab 容器');
    return;
  }

  // 渲染 UI
  renderWebSocketShowcase(container);

  // 初始化
  wsShowcase = new WebSocketShowcase();

  // 連接按鈕
  document.getElementById('btn-ws-connect')?.addEventListener('click', async () => {
    const statusEl = document.getElementById('ws-status');
    const connectBtn = document.getElementById('btn-ws-connect');
    const disconnectBtn = document.getElementById('btn-ws-disconnect');

    statusEl.classList.add('connecting');
    statusEl.querySelector('.status-text').textContent = '連接中...';

    await wsShowcase.connect();

    statusEl.classList.remove('connecting');
    statusEl.classList.add('connected');
    statusEl.querySelector('.status-text').textContent = '已連接';

    connectBtn.disabled = true;
    disconnectBtn.disabled = false;

    // 啟用輸入
    document.getElementById('chat-input').disabled = false;
    document.getElementById('btn-send-chat').disabled = false;

    // 開始當前演示
    startCurrentDemo();

    addLog('system', '已連接到伺服器');
  });

  // 斷開按鈕
  document.getElementById('btn-ws-disconnect')?.addEventListener('click', () => {
    wsShowcase.disconnect();

    const statusEl = document.getElementById('ws-status');
    statusEl.classList.remove('connected');
    statusEl.querySelector('.status-text').textContent = '已斷開';

    document.getElementById('btn-ws-connect').disabled = false;
    document.getElementById('btn-ws-disconnect').disabled = true;
    document.getElementById('chat-input').disabled = true;
    document.getElementById('btn-send-chat').disabled = true;

    addLog('system', '已斷開連接');
  });

  // 演示選擇
  document.querySelectorAll('.demo-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.demo-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentDemo = btn.dataset.demo;

      // 切換面板
      document.querySelectorAll('.demo-panel').forEach(panel => {
        panel.classList.add('hidden');
      });
      document.getElementById(`demo-${currentDemo}`)?.classList.remove('hidden');

      // 重啟演示
      if (wsShowcase.isConnected) {
        startCurrentDemo();
      }
    });
  });

  // 發送聊天訊息
  document.getElementById('btn-send-chat')?.addEventListener('click', sendChatMessage);
  document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // 清除日誌
  document.getElementById('btn-clear-log')?.addEventListener('click', () => {
    document.getElementById('message-log').innerHTML = '<div class="log-placeholder">日誌已清除</div>';
  });

  console.log('✅ WebSocket 演示初始化完成');
}

function startCurrentDemo() {
  wsShowcase.stopDemo();

  switch (currentDemo) {
    case 'chat':
      wsShowcase.startDemo('chat', handleChatMessage);
      break;
    case 'stock':
      wsShowcase.startDemo('stock', handleStockMessage);
      break;
    case 'notification':
      wsShowcase.startDemo('notification', handleNotificationMessage);
      break;
  }
}

// ============================================
// 訊息處理
// ============================================
function handleChatMessage(data) {
  const container = document.getElementById('chat-messages');
  container.querySelector('.chat-placeholder')?.remove();

  const msgEl = document.createElement('div');
  msgEl.className = 'chat-message';
  msgEl.innerHTML = `
    <span class="chat-avatar">${data.user.avatar}</span>
    <div class="chat-content">
      <span class="chat-name">${data.user.name}</span>
      <span class="chat-text">${data.message}</span>
    </div>
  `;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;

  addLog('chat', `${data.user.name}: ${data.message}`);
}

function handleStockMessage(data) {
  data.stocks.forEach(stock => {
    const items = document.querySelectorAll('.stock-item');
    items.forEach(item => {
      const symbol = item.querySelector('.stock-symbol').textContent;
      if (symbol === stock.symbol) {
        const priceEl = item.querySelector('.stock-price');
        const changeEl = item.querySelector('.stock-change');

        priceEl.textContent = `$${stock.price}`;
        changeEl.textContent = `${stock.change > 0 ? '+' : ''}${stock.change} (${stock.changePercent}%)`;
        changeEl.className = `stock-change ${parseFloat(stock.change) >= 0 ? 'positive' : 'negative'}`;
      }
    });
  });

  addLog('stock', `股票更新: ${data.stocks.map(s => `${s.symbol}:$${s.price}`).join(', ')}`);
}

function handleNotificationMessage(data) {
  const container = document.getElementById('notification-list');
  container.querySelector('.notification-placeholder')?.remove();

  const notifEl = document.createElement('div');
  notifEl.className = 'notification-item';
  notifEl.innerHTML = `
    <span class="notif-icon">${data.icon}</span>
    <div class="notif-content">
      <span class="notif-title">${data.title}</span>
      <span class="notif-message">${data.message}</span>
    </div>
    <span class="notif-time">${new Date(data.timestamp).toLocaleTimeString()}</span>
  `;
  container.prepend(notifEl);

  // 保持最多 10 個通知
  while (container.children.length > 10) {
    container.removeChild(container.lastChild);
  }

  addLog('notification', `${data.title}: ${data.message}`);
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  wsShowcase.send({ type: 'chat', text });

  // 顯示自己的訊息
  const container = document.getElementById('chat-messages');
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-message self';
  msgEl.innerHTML = `
    <div class="chat-content">
      <span class="chat-text">${text}</span>
    </div>
    <span class="chat-avatar">🧑</span>
  `;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;

  input.value = '';
}

function addLog(type, message) {
  const container = document.getElementById('message-log');
  container.querySelector('.log-placeholder')?.remove();

  const logEl = document.createElement('div');
  logEl.className = `log-entry log-${type}`;
  logEl.innerHTML = `
    <span class="log-time">${new Date().toLocaleTimeString()}</span>
    <span class="log-type">[${type.toUpperCase()}]</span>
    <span class="log-message">${message}</span>
  `;
  container.appendChild(logEl);
  container.scrollTop = container.scrollHeight;

  // 保持最多 50 條日誌
  while (container.children.length > 50) {
    container.removeChild(container.firstChild);
  }
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WebSocketShowcase, MockWebSocketServer, initWebSocketShowcase };
}
