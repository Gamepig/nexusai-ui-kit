/**
 * Worker 多線程演示模組
 * Phase 6.4 - 使用 Inline Blob Worker（支援 file:// 協議）
 */

// ============================================
// Inline Worker 代碼
// ============================================
const PRIME_WORKER_CODE = `
self.onmessage = function(e) {
  const { max, reportProgress } = e.data;
  const startTime = performance.now();
  const primes = [];
  const progressStep = Math.floor(max / 10);

  for (let num = 2; num <= max; num++) {
    if (isPrime(num)) {
      primes.push(num);
    }
    if (reportProgress && num % progressStep === 0) {
      self.postMessage({
        type: 'progress',
        percent: Math.floor((num / max) * 100)
      });
    }
  }

  const endTime = performance.now();
  self.postMessage({
    type: 'result',
    primes,
    count: primes.length,
    duration: endTime - startTime
  });
};

function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  for (let i = 3; i * i <= num; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}
`;

const SORT_WORKER_CODE = `
self.onmessage = function(e) {
  const { array, algorithm } = e.data;
  const startTime = performance.now();
  let sortedArray;

  switch (algorithm) {
    case 'quick':
      sortedArray = quickSort([...array]);
      break;
    case 'merge':
      sortedArray = mergeSort([...array]);
      break;
    case 'heap':
      sortedArray = heapSort([...array]);
      break;
    default:
      sortedArray = [...array].sort((a, b) => a - b);
  }

  const endTime = performance.now();
  self.postMessage({
    type: 'result',
    sortedArray,
    duration: endTime - startTime,
    algorithm
  });
};

function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let l = 0, r = 0;
  while (l < left.length && r < right.length) {
    if (left[l] < right[r]) result.push(left[l++]);
    else result.push(right[r++]);
  }
  return [...result, ...left.slice(l), ...right.slice(r)];
}

function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}
`;

// ============================================
// WorkerShowcase - Worker 演示主類
// ============================================
class WorkerShowcase {
  constructor() {
    this.workers = {};
    this.blobURLs = {};
    this.results = {};
  }

  // ============================================
  // Inline Worker 創建（支援 file:// 協議）
  // ============================================
  createInlineWorker(name, code) {
    try {
      const blob = new Blob([code], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);

      this.workers[name] = worker;
      this.blobURLs[name] = url;

      console.log(`✅ Inline Worker 已創建: ${name}`);
      return worker;
    } catch (error) {
      console.error(`❌ Worker 創建失敗: ${name}`, error);
      return null;
    }
  }

  terminateWorker(name) {
    if (this.workers[name]) {
      this.workers[name].terminate();
      delete this.workers[name];
    }
    if (this.blobURLs[name]) {
      URL.revokeObjectURL(this.blobURLs[name]);
      delete this.blobURLs[name];
    }
  }

  terminateAll() {
    Object.keys(this.workers).forEach(name => this.terminateWorker(name));
  }

  // ============================================
  // 質數計算
  // ============================================
  async computePrimes(max, useWorker = true, onProgress = null) {
    if (useWorker) {
      return this.computePrimesWithWorker(max, onProgress);
    } else {
      return this.computePrimesMainThread(max, onProgress);
    }
  }

  computePrimesMainThread(max, onProgress) {
    return new Promise(resolve => {
      const startTime = performance.now();
      const primes = [];
      const progressStep = Math.floor(max / 10);

      for (let num = 2; num <= max; num++) {
        if (this.isPrime(num)) {
          primes.push(num);
        }
        if (onProgress && num % progressStep === 0) {
          onProgress(Math.floor((num / max) * 100));
        }
      }

      const endTime = performance.now();
      resolve({
        primes,
        count: primes.length,
        duration: endTime - startTime
      });
    });
  }

  computePrimesWithWorker(max, onProgress) {
    return new Promise((resolve, reject) => {
      const worker = this.createInlineWorker('prime', PRIME_WORKER_CODE);
      if (!worker) {
        reject(new Error('無法創建 Worker'));
        return;
      }

      worker.onmessage = (e) => {
        if (e.data.type === 'progress' && onProgress) {
          onProgress(e.data.percent);
        } else if (e.data.type === 'result') {
          this.terminateWorker('prime');
          resolve(e.data);
        }
      };

      worker.onerror = (error) => {
        this.terminateWorker('prime');
        reject(error);
      };

      worker.postMessage({ max, reportProgress: !!onProgress });
    });
  }

  isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i * i <= num; i += 2) {
      if (num % i === 0) return false;
    }
    return true;
  }

  // ============================================
  // 大數組排序
  // ============================================
  async sortLargeArray(size, algorithm = 'quick', useWorker = true) {
    const array = this.generateRandomArray(size);
    if (useWorker) {
      return this.sortWithWorker(array, algorithm);
    } else {
      return this.sortMainThread(array, algorithm);
    }
  }

  generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * size));
  }

  sortMainThread(array, algorithm) {
    return new Promise(resolve => {
      const startTime = performance.now();
      let sortedArray;

      switch (algorithm) {
        case 'quick':
          sortedArray = this.quickSort([...array]);
          break;
        case 'merge':
          sortedArray = this.mergeSort([...array]);
          break;
        default:
          sortedArray = [...array].sort((a, b) => a - b);
      }

      const endTime = performance.now();
      resolve({
        sortedArray,
        duration: endTime - startTime,
        algorithm
      });
    });
  }

  sortWithWorker(array, algorithm) {
    return new Promise((resolve, reject) => {
      const worker = this.createInlineWorker('sort', SORT_WORKER_CODE);
      if (!worker) {
        reject(new Error('無法創建 Worker'));
        return;
      }

      worker.onmessage = (e) => {
        if (e.data.type === 'result') {
          this.terminateWorker('sort');
          resolve(e.data);
        }
      };

      worker.onerror = (error) => {
        this.terminateWorker('sort');
        reject(error);
      };

      worker.postMessage({ array, algorithm });
    });
  }

  quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);
    return [...this.quickSort(left), ...middle, ...this.quickSort(right)];
  }

  mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid));
    const right = this.mergeSort(arr.slice(mid));
    return this.merge(left, right);
  }

  merge(left, right) {
    const result = [];
    let l = 0, r = 0;
    while (l < left.length && r < right.length) {
      if (left[l] < right[r]) result.push(left[l++]);
      else result.push(right[r++]);
    }
    return [...result, ...left.slice(l), ...right.slice(r)];
  }
}

// ============================================
// UI 渲染
// ============================================
function renderWorkerShowcase(container) {
  container.innerHTML = `
    <div class="worker-showcase">
      <div class="showcase-header">
        <h2>⚡ Web Worker 多線程演示</h2>
        <p>展示 Worker 如何避免阻塞主線程</p>
      </div>

      <!-- 質數計算 -->
      <div class="showcase-section">
        <h3>🔢 質數計算</h3>
        <p class="section-desc">計算指定範圍內的所有質數</p>

        <div class="worker-demo">
          <div class="demo-controls">
            <label>範圍上限:</label>
            <select id="prime-range">
              <option value="10000">10,000</option>
              <option value="50000" selected>50,000</option>
              <option value="100000">100,000</option>
              <option value="500000">500,000</option>
            </select>
          </div>

          <div class="demo-comparison">
            <div class="demo-card">
              <h4>🐌 主線程</h4>
              <p class="demo-desc">會阻塞 UI</p>
              <button class="btn btn-outline-cyan btn-sm" id="btn-prime-main">
                執行
              </button>
              <div class="result-box">
                <div class="result-time" id="prime-main-time">-</div>
                <div class="result-count" id="prime-main-count">-</div>
              </div>
              <div class="ui-indicator" id="prime-main-indicator">
                <div class="spinner"></div>
              </div>
            </div>

            <div class="demo-card">
              <h4>⚡ Worker</h4>
              <p class="demo-desc">不阻塞 UI</p>
              <button class="btn btn-solid-cyan btn-sm" id="btn-prime-worker">
                執行
              </button>
              <div class="result-box">
                <div class="result-time" id="prime-worker-time">-</div>
                <div class="result-count" id="prime-worker-count">-</div>
              </div>
              <div class="progress-bar" id="prime-worker-progress">
                <div class="progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 排序演示 -->
      <div class="showcase-section">
        <h3>📊 大數組排序</h3>
        <p class="section-desc">排序大量隨機數據</p>

        <div class="worker-demo">
          <div class="demo-controls">
            <label>數組大小:</label>
            <select id="sort-size">
              <option value="10000">10,000</option>
              <option value="50000" selected>50,000</option>
              <option value="100000">100,000</option>
              <option value="500000">500,000</option>
            </select>
            <label>算法:</label>
            <select id="sort-algorithm">
              <option value="quick">快速排序</option>
              <option value="merge">合併排序</option>
              <option value="heap">堆排序</option>
            </select>
          </div>

          <div class="demo-comparison">
            <div class="demo-card">
              <h4>🐌 主線程</h4>
              <button class="btn btn-outline-cyan btn-sm" id="btn-sort-main">
                執行
              </button>
              <div class="result-box">
                <div class="result-time" id="sort-main-time">-</div>
              </div>
            </div>

            <div class="demo-card">
              <h4>⚡ Worker</h4>
              <button class="btn btn-solid-cyan btn-sm" id="btn-sort-worker">
                執行
              </button>
              <div class="result-box">
                <div class="result-time" id="sort-worker-time">-</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- UI 響應性測試 -->
      <div class="showcase-section">
        <h3>🎯 UI 響應性測試</h3>
        <p class="section-desc">在計算過程中測試 UI 是否卡頓</p>

        <div class="ui-test-area">
          <div class="test-animation" id="test-animation">
            <div class="bouncing-ball"></div>
          </div>
          <p class="test-hint">觀察小球動畫是否流暢</p>

          <div class="test-counter">
            <span>點擊計數:</span>
            <button class="btn btn-outline-cyan btn-sm" id="btn-counter">
              點我 (<span id="counter-value">0</span>)
            </button>
          </div>
        </div>
      </div>

      <!-- 說明 -->
      <div class="worker-info">
        <h3>💡 Web Worker 說明</h3>
        <ul>
          <li><strong>不阻塞主線程</strong>：Worker 在背景執行，UI 保持響應</li>
          <li><strong>獨立作用域</strong>：Worker 無法直接存取 DOM</li>
          <li><strong>訊息傳遞</strong>：透過 postMessage 與主線程溝通</li>
          <li><strong>Inline Worker</strong>：使用 Blob URL 創建，支援本地檔案開啟</li>
        </ul>
      </div>
    </div>
  `;
}

// ============================================
// 初始化
// ============================================
let workerShowcase = null;
let counterValue = 0;

function initWorkerShowcase() {
  const container = document.getElementById('worker-tab');
  if (!container) {
    console.warn('找不到 worker-tab 容器');
    return;
  }

  // 渲染 UI
  renderWorkerShowcase(container);

  // 初始化
  workerShowcase = new WorkerShowcase();

  // 質數計算 - 主線程
  document.getElementById('btn-prime-main')?.addEventListener('click', async () => {
    const max = parseInt(document.getElementById('prime-range').value);
    const indicator = document.getElementById('prime-main-indicator');
    const timeEl = document.getElementById('prime-main-time');
    const countEl = document.getElementById('prime-main-count');

    indicator.classList.add('active');
    timeEl.textContent = '計算中...';
    countEl.textContent = '-';

    // 使用 setTimeout 讓 UI 更新
    setTimeout(async () => {
      const result = await workerShowcase.computePrimes(max, false);
      indicator.classList.remove('active');
      timeEl.textContent = `${result.duration.toFixed(2)} ms`;
      countEl.textContent = `找到 ${result.count.toLocaleString()} 個質數`;
    }, 50);
  });

  // 質數計算 - Worker
  document.getElementById('btn-prime-worker')?.addEventListener('click', async () => {
    const max = parseInt(document.getElementById('prime-range').value);
    const progressBar = document.getElementById('prime-worker-progress');
    const progressFill = progressBar.querySelector('.progress-fill');
    const timeEl = document.getElementById('prime-worker-time');
    const countEl = document.getElementById('prime-worker-count');

    progressBar.classList.add('active');
    progressFill.style.width = '0%';
    timeEl.textContent = '計算中...';
    countEl.textContent = '-';

    try {
      const result = await workerShowcase.computePrimes(max, true, (percent) => {
        progressFill.style.width = percent + '%';
      });

      progressFill.style.width = '100%';
      timeEl.textContent = `${result.duration.toFixed(2)} ms`;
      countEl.textContent = `找到 ${result.count.toLocaleString()} 個質數`;

      setTimeout(() => progressBar.classList.remove('active'), 500);
    } catch (error) {
      timeEl.textContent = '錯誤';
      console.error(error);
    }
  });

  // 排序 - 主線程
  document.getElementById('btn-sort-main')?.addEventListener('click', async () => {
    const size = parseInt(document.getElementById('sort-size').value);
    const algorithm = document.getElementById('sort-algorithm').value;
    const timeEl = document.getElementById('sort-main-time');

    timeEl.textContent = '排序中...';

    setTimeout(async () => {
      const result = await workerShowcase.sortLargeArray(size, algorithm, false);
      timeEl.textContent = `${result.duration.toFixed(2)} ms`;
    }, 50);
  });

  // 排序 - Worker
  document.getElementById('btn-sort-worker')?.addEventListener('click', async () => {
    const size = parseInt(document.getElementById('sort-size').value);
    const algorithm = document.getElementById('sort-algorithm').value;
    const timeEl = document.getElementById('sort-worker-time');

    timeEl.textContent = '排序中...';

    try {
      const result = await workerShowcase.sortLargeArray(size, algorithm, true);
      timeEl.textContent = `${result.duration.toFixed(2)} ms`;
    } catch (error) {
      timeEl.textContent = '錯誤';
      console.error(error);
    }
  });

  // 點擊計數器
  document.getElementById('btn-counter')?.addEventListener('click', () => {
    counterValue++;
    document.getElementById('counter-value').textContent = counterValue;
  });

  console.log('✅ Worker 演示初始化完成');
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WorkerShowcase, initWorkerShowcase };
}
