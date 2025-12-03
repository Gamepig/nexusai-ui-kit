/**
 * Chart.js 數據可視化模組
 * Phase 5.3 - 數據可視化集成
 */

// ============================================
// ChartMockData - 模擬數據生成器
// ============================================
class ChartMockData {
  constructor() {
    this.cachedData = null;
  }

  // 載入 JSON 數據
  async loadData() {
    if (this.cachedData) return this.cachedData;

    try {
      const response = await fetch('data/mock-data.json');
      this.cachedData = await response.json();
      return this.cachedData;
    } catch (error) {
      console.warn('無法載入 mock-data.json，使用內建數據');
      return this.getDefaultData();
    }
  }

  // 預設數據
  getDefaultData() {
    return {
      charts: {
        revenue: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
          datasets: [{
            label: '2024 營收',
            data: [120000, 190000, 150000, 250000, 220000, 300000],
            borderColor: '#00D9FF',
            backgroundColor: 'rgba(0, 217, 255, 0.1)'
          }]
        },
        sales: {
          labels: ['產品 A', '產品 B', '產品 C', '產品 D'],
          datasets: [{
            label: '銷售量',
            data: [350, 200, 150, 400],
            backgroundColor: ['#00D9FF', '#A855F7', '#22C55E', '#F97316']
          }]
        },
        marketShare: {
          labels: ['我司', '競品 A', '競品 B', '其他'],
          data: [35, 25, 20, 20],
          backgroundColor: ['#00D9FF', '#A855F7', '#22C55E', '#6B7280']
        },
        performance: {
          labels: ['速度', '穩定性', '易用性', '功能性', '安全性'],
          datasets: [{
            label: '評分',
            data: [85, 90, 75, 88, 92],
            borderColor: '#00D9FF',
            backgroundColor: 'rgba(0, 217, 255, 0.2)'
          }]
        },
        scatter: {
          datasets: [{
            label: '價格 vs 銷量',
            data: [
              { x: 100, y: 200 },
              { x: 150, y: 180 },
              { x: 200, y: 250 },
              { x: 250, y: 300 },
              { x: 300, y: 280 },
              { x: 350, y: 350 },
              { x: 400, y: 320 },
              { x: 450, y: 400 }
            ],
            backgroundColor: '#00D9FF'
          }]
        },
        hourlyVisits: {
          labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
          data: [120, 50, 280, 450, 380, 320],
          backgroundColor: [
            'rgba(0, 217, 255, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(34, 197, 94, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(107, 114, 128, 0.7)'
          ]
        }
      }
    };
  }

  // 生成隨機數據
  getRandomData(points = 12, min = 100, max = 500) {
    return Array.from({ length: points }, () =>
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  // 生成實時更新數據點
  getRealtimePoint(baseValue = 300, variance = 50) {
    return baseValue + (Math.random() - 0.5) * variance * 2;
  }
}

// ============================================
// ChartShowcase - 圖表展示主類
// ============================================
class ChartShowcase {
  constructor() {
    this.charts = {};
    this.mockData = new ChartMockData();
    this.isDarkTheme = true;
    this.realtimeInterval = null;
  }

  // 初始化所有圖表
  async init() {
    const data = await this.mockData.loadData();

    // 等待 DOM 準備好
    await this.waitForCanvas();

    // 設置全域 Chart.js 配置
    this.setupGlobalDefaults();

    // 創建各類圖表
    await this.createLineChart('revenueChart', data.charts.revenue);
    await this.createBarChart('salesChart', data.charts.sales);
    await this.createPieChart('marketShareChart', data.charts.marketShare);
    await this.createDoughnutChart('goalChart', data.charts.marketShare);
    await this.createRadarChart('performanceChart', data.charts.performance);
    await this.createScatterChart('scatterChart', data.charts.scatter);
    await this.createPolarChart('hourlyChart', data.charts.hourlyVisits);
    await this.createMixedChart('mixedChart', data.charts.revenue);

    console.log('✅ Chart.js 圖表初始化完成');
  }

  // 等待 Canvas 元素
  waitForCanvas() {
    return new Promise(resolve => {
      const check = () => {
        if (document.getElementById('revenueChart')) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  }

  // 設置全域預設值
  setupGlobalDefaults() {
    Chart.defaults.color = '#9CA3AF';
    Chart.defaults.borderColor = 'rgba(75, 85, 99, 0.3)';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // 動畫配置
    Chart.defaults.animation = {
      duration: 1000,
      easing: 'easeOutQuart'
    };
  }

  // 取得主題配色
  getThemeColors() {
    return {
      primary: '#00D9FF',
      secondary: '#A855F7',
      success: '#22C55E',
      warning: '#F97316',
      danger: '#EF4444',
      gray: '#6B7280',
      text: this.isDarkTheme ? '#E5E7EB' : '#374151',
      grid: this.isDarkTheme ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
      background: this.isDarkTheme ? '#0F172A' : '#FFFFFF'
    };
  }

  // ============================================
  // 折線圖
  // ============================================
  async createLineChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const colors = this.getThemeColors();

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((ds, i) => ({
          ...ds,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: ds.borderColor,
          pointBorderColor: colors.background,
          pointBorderWidth: 2
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#E5E7EB',
            bodyColor: '#9CA3AF',
            borderColor: colors.primary,
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: NT$${context.raw.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: colors.grid },
            ticks: { color: colors.text }
          },
          y: {
            grid: { color: colors.grid },
            ticks: {
              color: colors.text,
              callback: (value) => `NT$${(value / 1000)}K`
            }
          }
        }
      }
    });
  }

  // ============================================
  // 柱狀圖
  // ============================================
  async createBarChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const colors = this.getThemeColors();

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets.map(ds => ({
          ...ds,
          borderRadius: 8,
          borderSkipped: false
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#E5E7EB',
            bodyColor: '#9CA3AF',
            borderColor: colors.primary,
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.text }
          },
          y: {
            grid: { color: colors.grid },
            ticks: { color: colors.text }
          }
        }
      }
    });
  }

  // ============================================
  // 圓餅圖
  // ============================================
  async createPieChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: data.backgroundColor,
          borderWidth: 2,
          borderColor: '#0F172A'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });
  }

  // ============================================
  // 環形圖
  // ============================================
  async createDoughnutChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: data.backgroundColor,
          borderWidth: 0,
          cutout: '70%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15
            }
          }
        }
      }
    });
  }

  // ============================================
  // 雷達圖
  // ============================================
  async createRadarChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const colors = this.getThemeColors();

    this.charts[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: data.labels,
        datasets: data.datasets.map(ds => ({
          ...ds,
          pointRadius: 4,
          pointHoverRadius: 6
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { usePointStyle: true }
          }
        },
        scales: {
          r: {
            angleLines: { color: colors.grid },
            grid: { color: colors.grid },
            pointLabels: { color: colors.text },
            ticks: {
              color: colors.text,
              backdropColor: 'transparent'
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  }

  // ============================================
  // 散佈圖
  // ============================================
  async createScatterChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const colors = this.getThemeColors();

    this.charts[canvasId] = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: data.datasets.map(ds => ({
          ...ds,
          pointRadius: 8,
          pointHoverRadius: 12
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            callbacks: {
              label: (context) => {
                return `價格: NT$${context.raw.x} | 銷量: ${context.raw.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: '價格 (NT$)',
              color: colors.text
            },
            grid: { color: colors.grid },
            ticks: { color: colors.text }
          },
          y: {
            title: {
              display: true,
              text: '銷量',
              color: colors.text
            },
            grid: { color: colors.grid },
            ticks: { color: colors.text }
          }
        }
      }
    });
  }

  // ============================================
  // 極區圖
  // ============================================
  async createPolarChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const colors = this.getThemeColors();

    this.charts[canvasId] = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: data.backgroundColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { usePointStyle: true }
          }
        },
        scales: {
          r: {
            grid: { color: colors.grid },
            ticks: {
              color: colors.text,
              backdropColor: 'transparent'
            }
          }
        }
      }
    });
  }

  // ============================================
  // 混合圖表（折線 + 柱狀）
  // ============================================
  async createMixedChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const colors = this.getThemeColors();

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels.slice(0, 6),
        datasets: [
          {
            type: 'line',
            label: '趨勢線',
            data: data.datasets[0].data.slice(0, 6),
            borderColor: colors.secondary,
            backgroundColor: 'transparent',
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            type: 'bar',
            label: '月營收',
            data: data.datasets[0].data.slice(0, 6),
            backgroundColor: 'rgba(0, 217, 255, 0.6)',
            borderRadius: 4,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { usePointStyle: true }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.text }
          },
          y: {
            grid: { color: colors.grid },
            ticks: {
              color: colors.text,
              callback: (value) => `NT$${(value / 1000)}K`
            }
          }
        }
      }
    });
  }

  // ============================================
  // 實時數據更新
  // ============================================
  startRealtimeUpdate(chartId) {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
    }

    const chart = this.charts[chartId];
    if (!chart) return;

    this.realtimeInterval = setInterval(() => {
      const data = chart.data.datasets[0].data;

      // 移除第一個數據點，添加新的
      data.shift();
      data.push(this.mockData.getRealtimePoint(300, 100));

      // 更新標籤
      const labels = chart.data.labels;
      labels.shift();
      const now = new Date();
      labels.push(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);

      chart.update('none');
    }, 2000);

    console.log(`📊 開始實時更新: ${chartId}`);
  }

  stopRealtimeUpdate() {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
      this.realtimeInterval = null;
      console.log('📊 停止實時更新');
    }
  }

  // ============================================
  // 主題切換
  // ============================================
  setTheme(isDark) {
    this.isDarkTheme = isDark;
    const colors = this.getThemeColors();

    // 更新全域配置
    Chart.defaults.color = colors.text;
    Chart.defaults.borderColor = colors.grid;

    // 更新所有圖表
    Object.values(this.charts).forEach(chart => {
      if (chart.options.scales) {
        Object.values(chart.options.scales).forEach(scale => {
          if (scale.grid) scale.grid.color = colors.grid;
          if (scale.ticks) scale.ticks.color = colors.text;
          if (scale.pointLabels) scale.pointLabels.color = colors.text;
        });
      }
      chart.update();
    });

    console.log(`🎨 主題已切換: ${isDark ? '深色' : '淺色'}`);
  }

  // ============================================
  // 動態更新數據
  // ============================================
  updateChart(chartId, newData) {
    const chart = this.charts[chartId];
    if (!chart) return;

    if (newData.labels) {
      chart.data.labels = newData.labels;
    }
    if (newData.datasets) {
      newData.datasets.forEach((ds, i) => {
        if (chart.data.datasets[i]) {
          Object.assign(chart.data.datasets[i], ds);
        }
      });
    }

    chart.update();
  }

  // 隨機更新演示
  randomizeData(chartId) {
    const chart = this.charts[chartId];
    if (!chart) return;

    chart.data.datasets.forEach(ds => {
      if (Array.isArray(ds.data)) {
        ds.data = ds.data.map(val => {
          if (typeof val === 'number') {
            return Math.max(0, val + (Math.random() - 0.5) * val * 0.3);
          }
          return val;
        });
      }
    });

    chart.update();
  }

  // ============================================
  // 清理
  // ============================================
  destroy() {
    this.stopRealtimeUpdate();
    Object.values(this.charts).forEach(chart => chart.destroy());
    this.charts = {};
    console.log('🗑️ 圖表已清理');
  }
}

// ============================================
// UI 渲染器
// ============================================
function renderChartsShowcase(container) {
  container.innerHTML = `
    <div class="charts-showcase">
      <!-- 標題與控制 -->
      <div class="showcase-header">
        <h2>📊 Chart.js 數據可視化</h2>
        <p>展示 Chart.js 的各類圖表與互動功能</p>
        <div class="chart-controls">
          <button class="btn btn-outline-cyan btn-sm" onclick="window.chartShowcase?.randomizeAll()">
            🎲 隨機數據
          </button>
          <button class="btn btn-outline-cyan btn-sm" onclick="window.chartShowcase?.toggleRealtime()">
            ⏱️ 實時更新
          </button>
        </div>
      </div>

      <!-- 圖表網格 -->
      <div class="charts-grid">
        <!-- 折線圖 -->
        <div class="chart-card chart-card-large">
          <div class="chart-card-header">
            <h3>📈 營收趨勢（折線圖）</h3>
            <span class="chart-badge">Line Chart</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>

        <!-- 柱狀圖 -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3>📊 產品銷售（柱狀圖）</h3>
            <span class="chart-badge">Bar Chart</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="salesChart"></canvas>
          </div>
        </div>

        <!-- 圓餅圖 -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3>🥧 市場份額（圓餅圖）</h3>
            <span class="chart-badge">Pie Chart</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="marketShareChart"></canvas>
          </div>
        </div>

        <!-- 環形圖 -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3>🍩 目標達成（環形圖）</h3>
            <span class="chart-badge">Doughnut</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="goalChart"></canvas>
          </div>
        </div>

        <!-- 雷達圖 -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3>🎯 產品評分（雷達圖）</h3>
            <span class="chart-badge">Radar Chart</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="performanceChart"></canvas>
          </div>
        </div>

        <!-- 散佈圖 -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3>⚬ 價格銷量（散佈圖）</h3>
            <span class="chart-badge">Scatter</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="scatterChart"></canvas>
          </div>
        </div>

        <!-- 極區圖 -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3>🕐 時段分佈（極區圖）</h3>
            <span class="chart-badge">Polar Area</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="hourlyChart"></canvas>
          </div>
        </div>

        <!-- 混合圖表 -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3>🔀 組合圖表（混合）</h3>
            <span class="chart-badge">Mixed</span>
          </div>
          <div class="chart-wrapper">
            <canvas id="mixedChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 功能說明 -->
      <div class="chart-features">
        <h3>✨ 互動功能</h3>
        <ul>
          <li>🖱️ 滑鼠懸停顯示詳細數據</li>
          <li>👆 點擊圖例切換數據系列</li>
          <li>🎲 隨機數據演示動畫效果</li>
          <li>⏱️ 實時數據更新（折線圖）</li>
          <li>🎨 支援深色/淺色主題</li>
          <li>📱 響應式自適應尺寸</li>
        </ul>
      </div>
    </div>
  `;
}

// ============================================
// 初始化函數
// ============================================
async function initChartsShowcase() {
  const container = document.getElementById('charts-tab');
  if (!container) {
    console.warn('找不到 charts-tab 容器');
    return;
  }

  // 渲染 UI
  renderChartsShowcase(container);

  // 初始化圖表
  window.chartShowcase = new ChartShowcase();

  // 擴展方法
  window.chartShowcase.randomizeAll = function() {
    Object.keys(this.charts).forEach(id => this.randomizeData(id));
  };

  window.chartShowcase.isRealtimeRunning = false;
  window.chartShowcase.toggleRealtime = function() {
    if (this.isRealtimeRunning) {
      this.stopRealtimeUpdate();
      this.isRealtimeRunning = false;
    } else {
      this.startRealtimeUpdate('revenueChart');
      this.isRealtimeRunning = true;
    }
  };

  await window.chartShowcase.init();
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChartShowcase, ChartMockData, initChartsShowcase };
}
