/**
 * ES2025 Features Demonstration Module
 * Priority 4: Showcasing modern JavaScript features
 */

// ============================================================================
// 1. ArrayGrouping - Array.groupBy 分組演示
// ============================================================================
class ArrayGrouping {
  constructor() {
    this.sampleData = [
      { id: 1, name: 'Alice Chen', status: 'active', amount: 5000, date: '2025-12-03' },
      { id: 2, name: 'Bob Smith', status: 'pending', amount: 3200, date: '2025-12-02' },
      { id: 3, name: 'Carol Wang', status: 'active', amount: 7800, date: '2025-12-01' },
      { id: 4, name: 'David Liu', status: 'inactive', amount: 2100, date: '2025-11-30' },
      { id: 5, name: 'Emma Zhou', status: 'active', amount: 4500, date: '2025-11-29' },
      { id: 6, name: 'Frank Lee', status: 'pending', amount: 6300, date: '2025-11-28' },
    ];
  }

  // 使用 Object.groupBy (ES2025)
  groupByStatus() {
    // Object.groupBy 是 ES2025 新特性
    if (typeof Object.groupBy === 'function') {
      return Object.groupBy(this.sampleData, item => item.status);
    }
    // Polyfill for older browsers
    return this.polyfillGroupBy(this.sampleData, item => item.status);
  }

  // 按金額範圍分組
  groupByAmountRange() {
    const getRange = (amount) => {
      if (amount < 3000) return 'low';
      if (amount < 5000) return 'medium';
      return 'high';
    };

    if (typeof Object.groupBy === 'function') {
      return Object.groupBy(this.sampleData, item => getRange(item.amount));
    }
    return this.polyfillGroupBy(this.sampleData, item => getRange(item.amount));
  }

  // 按日期分組
  groupByDate() {
    if (typeof Object.groupBy === 'function') {
      return Object.groupBy(this.sampleData, item => item.date);
    }
    return this.polyfillGroupBy(this.sampleData, item => item.date);
  }

  // Polyfill for Object.groupBy
  polyfillGroupBy(array, callback) {
    return array.reduce((result, item, index) => {
      const key = callback(item, index, array);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    }, {});
  }

  // 傳統方法對比
  traditionalGroupBy(array, key) {
    return array.reduce((result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  }

  // 渲染演示
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const statusGrouped = this.groupByStatus();
    const amountGrouped = this.groupByAmountRange();

    container.innerHTML = `
      <div class="es-feature-demo">
        <div class="demo-header">
          <h4>Array Grouping (Object.groupBy)</h4>
          <span class="es-badge">ES2025</span>
        </div>

        <div class="demo-grid">
          <div class="demo-panel">
            <h5>原始數據</h5>
            <div class="code-block">
              <pre><code>${JSON.stringify(this.sampleData.slice(0, 3), null, 2)}...</code></pre>
            </div>
          </div>

          <div class="demo-panel">
            <h5>按狀態分組</h5>
            <div class="code-block">
              <pre><code>Object.groupBy(data, item => item.status)</code></pre>
            </div>
            <div class="result-display">
              ${this.renderGroupedResult(statusGrouped)}
            </div>
          </div>

          <div class="demo-panel">
            <h5>按金額範圍分組</h5>
            <div class="code-block">
              <pre><code>Object.groupBy(data, item => getRange(item.amount))</code></pre>
            </div>
            <div class="result-display">
              ${this.renderGroupedResult(amountGrouped)}
            </div>
          </div>
        </div>

        <div class="code-comparison">
          <div class="comparison-item">
            <h5>ES2025 新語法</h5>
            <div class="code-block modern">
              <pre><code>const grouped = Object.groupBy(users, u => u.status);</code></pre>
            </div>
          </div>
          <div class="comparison-item">
            <h5>傳統方法</h5>
            <div class="code-block legacy">
              <pre><code>const grouped = users.reduce((acc, user) => {
  const key = user.status;
  acc[key] = acc[key] || [];
  acc[key].push(user);
  return acc;
}, {});</code></pre>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderGroupedResult(grouped) {
    return Object.entries(grouped)
      .map(([key, items]) => `
        <div class="group-item">
          <span class="group-key">${key}</span>
          <span class="group-count">${items.length} 項</span>
        </div>
      `)
      .join('');
  }
}

// ============================================================================
// 2. PromiseAdvanced - Promise.withResolvers 演示
// ============================================================================
class PromiseAdvanced {
  constructor() {
    this.demoState = {
      isRunning: false,
      currentPromise: null
    };
  }

  // Promise.withResolvers polyfill
  static withResolvers() {
    if (typeof Promise.withResolvers === 'function') {
      return Promise.withResolvers();
    }
    // Polyfill
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }

  // 演示手動控制 Promise
  createControllablePromise(containerId) {
    const { promise, resolve, reject } = PromiseAdvanced.withResolvers();

    this.demoState.currentPromise = { promise, resolve, reject };

    const container = document.getElementById(containerId);
    if (!container) return;

    // 更新 UI 狀態
    this.updatePromiseUI(container, 'pending');

    promise
      .then(value => {
        this.updatePromiseUI(container, 'fulfilled', value);
      })
      .catch(error => {
        this.updatePromiseUI(container, 'rejected', error);
      });

    return { promise, resolve, reject };
  }

  updatePromiseUI(container, state, value = null) {
    const stateElement = container.querySelector('.promise-state');
    const valueElement = container.querySelector('.promise-value');

    if (stateElement) {
      stateElement.className = `promise-state state-${state}`;
      stateElement.textContent = state.toUpperCase();
    }

    if (valueElement && value !== null) {
      valueElement.textContent = JSON.stringify(value);
    }
  }

  // 超時控制演示
  async timeoutDemo(ms, operation) {
    const { promise: timeoutPromise, reject } = PromiseAdvanced.withResolvers();

    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);

    try {
      const result = await Promise.race([operation(), timeoutPromise]);
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="es-feature-demo">
        <div class="demo-header">
          <h4>Promise.withResolvers()</h4>
          <span class="es-badge">ES2025</span>
        </div>

        <div class="demo-content">
          <p class="demo-description">
            允許在 Promise 外部控制 resolve/reject，無需在 executor 內部處理。
          </p>

          <div class="promise-demo-area" id="promise-demo-area">
            <div class="promise-status-box">
              <span>Promise 狀態：</span>
              <span class="promise-state state-idle">IDLE</span>
            </div>
            <div class="promise-value-box">
              <span>結果值：</span>
              <span class="promise-value">-</span>
            </div>
          </div>

          <div class="demo-controls">
            <button class="btn btn-solid-cyan btn-sm" onclick="esFeatures.promise.startDemo()">
              建立 Promise
            </button>
            <button class="btn btn-outline-cyan btn-sm" onclick="esFeatures.promise.resolveDemo()">
              手動 Resolve
            </button>
            <button class="btn btn-outline-cyan btn-sm" onclick="esFeatures.promise.rejectDemo()">
              手動 Reject
            </button>
          </div>
        </div>

        <div class="code-comparison">
          <div class="comparison-item">
            <h5>ES2025 新語法</h5>
            <div class="code-block modern">
              <pre><code>const { promise, resolve, reject } = Promise.withResolvers();

// 外部控制
setTimeout(() => resolve('Success!'), 1000);

await promise; // 'Success!'</code></pre>
            </div>
          </div>
          <div class="comparison-item">
            <h5>傳統方法</h5>
            <div class="code-block legacy">
              <pre><code>let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

// 外部控制
setTimeout(() => resolve('Success!'), 1000);</code></pre>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  startDemo() {
    this.createControllablePromise('promise-demo-area');
  }

  resolveDemo() {
    if (this.demoState.currentPromise) {
      this.demoState.currentPromise.resolve({ message: 'Manually resolved!', timestamp: Date.now() });
    }
  }

  rejectDemo() {
    if (this.demoState.currentPromise) {
      this.demoState.currentPromise.reject(new Error('Manually rejected!'));
    }
  }
}

// ============================================================================
// 3. TemporalDemo - Temporal API 演示 (Stage 3 提案)
// ============================================================================
class TemporalDemo {
  constructor() {
    // Temporal API 尚未正式發布，使用模擬演示
    this.hasTemporalAPI = typeof globalThis.Temporal !== 'undefined';
  }

  // 模擬 Temporal.Now
  getCurrentInstant() {
    if (this.hasTemporalAPI) {
      return Temporal.Now.instant().toString();
    }
    return new Date().toISOString();
  }

  // 模擬 Temporal.PlainDate
  getPlainDate() {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      toString() {
        return `${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`;
      }
    };
  }

  // 模擬 Temporal.PlainTime
  getPlainTime() {
    const now = new Date();
    return {
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
      toString() {
        return `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}:${String(this.second).padStart(2, '0')}`;
      }
    };
  }

  // 模擬日期運算
  addDays(days) {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return future.toISOString().split('T')[0];
  }

  // 模擬時區轉換
  getTimeInZone(timezone) {
    try {
      return new Date().toLocaleString('zh-TW', { timeZone: timezone });
    } catch {
      return 'Invalid timezone';
    }
  }

  // 計算兩日期之間的差異
  dateDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const plainDate = this.getPlainDate();
    const plainTime = this.getPlainTime();

    container.innerHTML = `
      <div class="es-feature-demo">
        <div class="demo-header">
          <h4>Temporal API</h4>
          <span class="es-badge stage3">Stage 3</span>
        </div>

        <div class="demo-description">
          <p>Temporal API 是取代 Date 的現代日期時間 API，提供更直觀的操作方式。</p>
          <p class="note">目前為 Stage 3 提案，以下為模擬演示。</p>
        </div>

        <div class="temporal-demo-grid">
          <div class="temporal-card">
            <h5>PlainDate</h5>
            <div class="temporal-value" id="temporal-date">${plainDate.toString()}</div>
            <div class="code-block">
              <pre><code>Temporal.Now.plainDateISO()
// ${plainDate.toString()}</code></pre>
            </div>
          </div>

          <div class="temporal-card">
            <h5>PlainTime</h5>
            <div class="temporal-value" id="temporal-time">${plainTime.toString()}</div>
            <div class="code-block">
              <pre><code>Temporal.Now.plainTimeISO()
// ${plainTime.toString()}</code></pre>
            </div>
          </div>

          <div class="temporal-card">
            <h5>日期運算</h5>
            <div class="temporal-value">+7 天 = ${this.addDays(7)}</div>
            <div class="code-block">
              <pre><code>date.add({ days: 7 })
// ${this.addDays(7)}</code></pre>
            </div>
          </div>

          <div class="temporal-card">
            <h5>時區轉換</h5>
            <div class="temporal-value" style="font-size: 0.9rem;">
              台北: ${this.getTimeInZone('Asia/Taipei')}<br>
              東京: ${this.getTimeInZone('Asia/Tokyo')}<br>
              紐約: ${this.getTimeInZone('America/New_York')}
            </div>
          </div>
        </div>

        <div class="date-calculator">
          <h5>日期差異計算器</h5>
          <div class="calculator-inputs">
            <input type="date" id="date1" value="${plainDate.toString()}">
            <span>到</span>
            <input type="date" id="date2" value="${this.addDays(30)}">
            <button class="btn btn-solid-cyan btn-sm" onclick="esFeatures.temporal.calculateDiff()">計算</button>
          </div>
          <div class="calculator-result" id="date-diff-result">
            相差 30 天
          </div>
        </div>

        <div class="code-comparison">
          <div class="comparison-item">
            <h5>Temporal API (未來)</h5>
            <div class="code-block modern">
              <pre><code>const date = Temporal.PlainDate.from('2025-12-03');
const nextWeek = date.add({ days: 7 });
const diff = date.until(nextWeek);
console.log(diff.days); // 7</code></pre>
            </div>
          </div>
          <div class="comparison-item">
            <h5>傳統 Date</h5>
            <div class="code-block legacy">
              <pre><code>const date = new Date('2025-12-03');
const nextWeek = new Date(date);
nextWeek.setDate(date.getDate() + 7);
const diff = (nextWeek - date) / (1000 * 60 * 60 * 24);
console.log(diff); // 7</code></pre>
            </div>
          </div>
        </div>
      </div>
    `;

    // 啟動時間更新
    this.startTimeUpdate();
  }

  startTimeUpdate() {
    setInterval(() => {
      const timeEl = document.getElementById('temporal-time');
      if (timeEl) {
        timeEl.textContent = this.getPlainTime().toString();
      }
    }, 1000);
  }

  calculateDiff() {
    const date1 = document.getElementById('date1')?.value;
    const date2 = document.getElementById('date2')?.value;
    const resultEl = document.getElementById('date-diff-result');

    if (date1 && date2 && resultEl) {
      const diff = this.dateDifference(date1, date2);
      resultEl.textContent = `相差 ${diff} 天`;
    }
  }
}

// ============================================================================
// 4. SafeAccess - 可選鏈與空值合併演示
// ============================================================================
class SafeAccess {
  constructor() {
    this.sampleObjects = {
      complete: {
        user: {
          name: 'Alice',
          profile: {
            email: 'alice@example.com',
            address: {
              city: 'Taipei',
              country: 'Taiwan'
            }
          },
          settings: {
            theme: 'dark',
            notifications: true
          }
        }
      },
      partial: {
        user: {
          name: 'Bob',
          profile: null
        }
      },
      empty: {}
    };
  }

  // 可選鏈演示
  demonstrateOptionalChaining() {
    const complete = this.sampleObjects.complete;
    const partial = this.sampleObjects.partial;
    const empty = this.sampleObjects.empty;

    return {
      complete: {
        city: complete?.user?.profile?.address?.city,
        theme: complete?.user?.settings?.theme
      },
      partial: {
        city: partial?.user?.profile?.address?.city,
        theme: partial?.user?.settings?.theme
      },
      empty: {
        city: empty?.user?.profile?.address?.city,
        theme: empty?.user?.settings?.theme
      }
    };
  }

  // 空值合併演示
  demonstrateNullishCoalescing() {
    const getValue = (obj, fallback) => obj?.user?.settings?.theme ?? fallback;

    return {
      withValue: getValue(this.sampleObjects.complete, 'light'),
      withNull: getValue(this.sampleObjects.partial, 'light'),
      withEmpty: getValue(this.sampleObjects.empty, 'light')
    };
  }

  // 與 || 運算子的對比
  comparisonDemo() {
    const values = {
      zero: 0,
      emptyString: '',
      nullValue: null,
      undefinedValue: undefined,
      falseValue: false
    };

    return Object.entries(values).map(([key, value]) => ({
      key,
      original: value,
      withOr: value || 'fallback',
      withNullish: value ?? 'fallback'
    }));
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const chainResults = this.demonstrateOptionalChaining();
    const nullishResults = this.demonstrateNullishCoalescing();
    const comparison = this.comparisonDemo();

    container.innerHTML = `
      <div class="es-feature-demo">
        <div class="demo-header">
          <h4>可選鏈 (?.) 與空值合併 (??)</h4>
          <span class="es-badge">ES2020</span>
        </div>

        <div class="demo-grid">
          <div class="demo-panel">
            <h5>可選鏈 (?.)</h5>
            <p class="demo-description">安全訪問深層屬性，避免 TypeError</p>

            <div class="access-results">
              <div class="result-item">
                <span class="label">完整對象:</span>
                <span class="value">${chainResults.complete.city || 'undefined'}</span>
              </div>
              <div class="result-item">
                <span class="label">部分對象:</span>
                <span class="value">${chainResults.partial.city || 'undefined'}</span>
              </div>
              <div class="result-item">
                <span class="label">空對象:</span>
                <span class="value">${chainResults.empty.city || 'undefined'}</span>
              </div>
            </div>

            <div class="code-block">
              <pre><code>// 安全訪問
user?.profile?.address?.city

// 方法調用
user?.getProfile?.()</code></pre>
            </div>
          </div>

          <div class="demo-panel">
            <h5>空值合併 (??)</h5>
            <p class="demo-description">僅在 null/undefined 時使用默認值</p>

            <div class="access-results">
              <div class="result-item">
                <span class="label">有值:</span>
                <span class="value">${nullishResults.withValue}</span>
              </div>
              <div class="result-item">
                <span class="label">null:</span>
                <span class="value">${nullishResults.withNull}</span>
              </div>
              <div class="result-item">
                <span class="label">undefined:</span>
                <span class="value">${nullishResults.withEmpty}</span>
              </div>
            </div>

            <div class="code-block">
              <pre><code>// 空值合併
const theme = settings?.theme ?? 'light';

// 與 || 的區別
0 || 'fallback'  // 'fallback'
0 ?? 'fallback'  // 0</code></pre>
            </div>
          </div>
        </div>

        <div class="comparison-table">
          <h5>|| vs ?? 運算子對比</h5>
          <table class="data-table">
            <thead>
              <tr>
                <th>原始值</th>
                <th>value || 'fallback'</th>
                <th>value ?? 'fallback'</th>
              </tr>
            </thead>
            <tbody>
              ${comparison.map(row => `
                <tr>
                  <td><code>${row.key}: ${JSON.stringify(row.original)}</code></td>
                  <td><code>${JSON.stringify(row.withOr)}</code></td>
                  <td><code>${JSON.stringify(row.withNullish)}</code></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

// ============================================================================
// 5. ClassEncapsulation - Class 私有字段演示
// ============================================================================
class ClassEncapsulation {
  // 私有字段
  #privateCounter = 0;
  #privateSecret = 'hidden-value';

  // 靜態私有字段
  static #instanceCount = 0;

  // 公開字段
  publicValue = 'visible';

  constructor(name) {
    this.name = name;
    ClassEncapsulation.#instanceCount++;
    this.#privateCounter = 0;
  }

  // 私有方法
  #privateMethod() {
    return `Private method called by ${this.name}`;
  }

  // 公開方法訪問私有成員
  increment() {
    this.#privateCounter++;
    return this.#privateCounter;
  }

  getCounter() {
    return this.#privateCounter;
  }

  getSecret() {
    return this.#privateSecret;
  }

  callPrivate() {
    return this.#privateMethod();
  }

  static getInstanceCount() {
    return ClassEncapsulation.#instanceCount;
  }

  // 演示渲染
  static render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 重置實例計數以便演示
    ClassEncapsulation.#instanceCount = 0;

    // 創建演示實例
    const demo1 = new ClassEncapsulation('Demo1');
    const demo2 = new ClassEncapsulation('Demo2');

    container.innerHTML = `
      <div class="es-feature-demo">
        <div class="demo-header">
          <h4>Class 私有字段與靜態成員</h4>
          <span class="es-badge">ES2022</span>
        </div>

        <div class="demo-grid">
          <div class="demo-panel">
            <h5>私有字段 (#)</h5>
            <p class="demo-description">真正的私有屬性，外部無法訪問</p>

            <div class="class-demo-controls">
              <button class="btn btn-solid-cyan btn-sm" id="increment-btn">
                增加計數器
              </button>
              <span class="counter-display" id="counter-value">0</span>
            </div>

            <div class="code-block">
              <pre><code>class Counter {
  #count = 0;  // 私有字段

  increment() {
    this.#count++;
    return this.#count;
  }
}

const c = new Counter();
c.#count;  // SyntaxError!
c.increment();  // 1</code></pre>
            </div>
          </div>

          <div class="demo-panel">
            <h5>靜態成員 (static)</h5>
            <p class="demo-description">類級別的共享屬性和方法</p>

            <div class="static-demo">
              <div class="result-item">
                <span class="label">實例計數:</span>
                <span class="value" id="instance-count">${ClassEncapsulation.getInstanceCount()}</span>
              </div>
            </div>

            <div class="code-block">
              <pre><code>class User {
  static #count = 0;  // 私有靜態

  constructor() {
    User.#count++;
  }

  static getCount() {
    return User.#count;
  }
}</code></pre>
            </div>
          </div>
        </div>

        <div class="demo-panel full-width">
          <h5>訪問控制對比</h5>
          <table class="data-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>語法</th>
                <th>外部可訪問</th>
                <th>子類可訪問</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>公開字段</td>
                <td><code>this.value</code></td>
                <td><span class="status-badge status-active">是</span></td>
                <td><span class="status-badge status-active">是</span></td>
              </tr>
              <tr>
                <td>私有字段</td>
                <td><code>this.#value</code></td>
                <td><span class="status-badge status-inactive">否</span></td>
                <td><span class="status-badge status-inactive">否</span></td>
              </tr>
              <tr>
                <td>靜態公開</td>
                <td><code>static value</code></td>
                <td><span class="status-badge status-active">是</span></td>
                <td><span class="status-badge status-active">是</span></td>
              </tr>
              <tr>
                <td>靜態私有</td>
                <td><code>static #value</code></td>
                <td><span class="status-badge status-inactive">否</span></td>
                <td><span class="status-badge status-inactive">否</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // 綁定按鈕事件
    const incrementBtn = document.getElementById('increment-btn');
    const counterValue = document.getElementById('counter-value');

    if (incrementBtn && counterValue) {
      incrementBtn.addEventListener('click', () => {
        const newValue = demo1.increment();
        counterValue.textContent = newValue;
      });
    }
  }
}

// ============================================================================
// 6. ES Features Showcase Manager
// ============================================================================
class ESFeaturesShowcase {
  constructor() {
    this.arrayGrouping = new ArrayGrouping();
    this.promise = new PromiseAdvanced();
    this.temporal = new TemporalDemo();
    this.safeAccess = new SafeAccess();
  }

  init() {
    const container = document.getElementById('es-features-tab');
    if (!container) return;

    // 清空並重建內容
    container.innerHTML = `
      <div class="es-features-showcase">
        <div class="showcase-header">
          <h2>ES2025+ 現代 JavaScript 特性</h2>
          <p>展示最新的 JavaScript 語言特性與最佳實踐</p>
        </div>

        <div class="es-nav-tabs">
          <button class="es-nav-tab active" data-section="grouping">Array Grouping</button>
          <button class="es-nav-tab" data-section="promise">Promise.withResolvers</button>
          <button class="es-nav-tab" data-section="temporal">Temporal API</button>
          <button class="es-nav-tab" data-section="safe-access">可選鏈 & 空值合併</button>
          <button class="es-nav-tab" data-section="class">Class 私有字段</button>
        </div>

        <div class="es-section active" id="es-grouping"></div>
        <div class="es-section" id="es-promise"></div>
        <div class="es-section" id="es-temporal"></div>
        <div class="es-section" id="es-safe-access"></div>
        <div class="es-section" id="es-class"></div>
      </div>
    `;

    // 初始化各區塊
    this.arrayGrouping.render('es-grouping');
    this.promise.render('es-promise');
    this.temporal.render('es-temporal');
    this.safeAccess.render('es-safe-access');
    ClassEncapsulation.render('es-class');

    // 綁定 Tab 切換
    this.bindTabEvents();
  }

  bindTabEvents() {
    const tabs = document.querySelectorAll('.es-nav-tab');
    const sections = document.querySelectorAll('.es-section');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // 移除所有 active
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // 添加當前 active
        tab.classList.add('active');
        const sectionId = `es-${tab.dataset.section}`;
        const section = document.getElementById(sectionId);
        if (section) {
          section.classList.add('active');
        }
      });
    });
  }
}

// ============================================================================
// 全局初始化
// ============================================================================
const esFeatures = new ESFeaturesShowcase();

// 當切換到 ES 特性 Tab 時初始化
function initESFeaturesShowcase() {
  esFeatures.init();
}

// 導出供外部使用
if (typeof window !== 'undefined') {
  window.esFeatures = esFeatures;
  window.initESFeaturesShowcase = initESFeaturesShowcase;
}
