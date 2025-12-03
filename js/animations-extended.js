/**
 * 動畫庫擴展模組
 * Phase 5.1 - Motion One / Lottie / Mo.js
 */

// ============================================
// Motion One 演示
// ============================================
class MotionOneShowcase {
  constructor() {
    this.animations = [];
  }

  // 基本動畫
  animateElement(selector, keyframes, options = {}) {
    const el = document.querySelector(selector);
    if (!el || typeof Motion === 'undefined') return null;

    return Motion.animate(el, keyframes, {
      duration: 0.8,
      easing: 'ease-out',
      ...options
    });
  }

  // 彈簧動畫
  springAnimate(selector) {
    const el = document.querySelector(selector);
    if (!el || typeof Motion === 'undefined') return;

    Motion.animate(el,
      { scale: [1, 1.2, 1] },
      {
        duration: 0.6,
        easing: Motion.spring({ stiffness: 300, damping: 10 })
      }
    );
  }

  // 序列動畫
  async sequenceAnimate(selectors) {
    if (typeof Motion === 'undefined') return;

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        await Motion.animate(el,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.4 }
        ).finished;
      }
    }
  }

  // 滾動驅動動畫（模擬）
  setupScrollAnimation(selector) {
    const el = document.querySelector(selector);
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && typeof Motion !== 'undefined') {
          Motion.animate(entry.target,
            { opacity: [0, 1], x: [-50, 0] },
            { duration: 0.6 }
          );
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(el);
  }
}

// ============================================
// Lottie 演示
// ============================================
class LottieShowcase {
  constructor() {
    this.animations = {};
    // 內建示範動畫數據（簡化版）
    this.builtInAnimations = {
      loading: this.getLoadingAnimation(),
      success: this.getSuccessAnimation(),
      error: this.getErrorAnimation()
    };
  }

  // 載入動畫
  loadAnimation(containerId, animationData, options = {}) {
    if (typeof lottie === 'undefined') {
      console.warn('Lottie 未載入');
      return null;
    }

    const container = document.getElementById(containerId);
    if (!container) return null;

    // 清除現有動畫
    if (this.animations[containerId]) {
      this.animations[containerId].destroy();
    }

    const anim = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: options.loop !== false,
      autoplay: options.autoplay !== false,
      animationData,
      ...options
    });

    this.animations[containerId] = anim;
    return anim;
  }

  // 從 URL 載入
  async loadFromURL(containerId, url, options = {}) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return this.loadAnimation(containerId, data, options);
    } catch (error) {
      console.error('無法載入 Lottie 動畫:', error);
      return null;
    }
  }

  // 播放控制
  play(containerId) {
    this.animations[containerId]?.play();
  }

  pause(containerId) {
    this.animations[containerId]?.pause();
  }

  stop(containerId) {
    this.animations[containerId]?.stop();
  }

  // 速度控制
  setSpeed(containerId, speed) {
    this.animations[containerId]?.setSpeed(speed);
  }

  // 方向控制
  setDirection(containerId, direction) {
    this.animations[containerId]?.setDirection(direction);
  }

  // 跳轉到特定幀
  goToFrame(containerId, frame) {
    this.animations[containerId]?.goToAndStop(frame, true);
  }

  // 清理
  destroy(containerId) {
    if (this.animations[containerId]) {
      this.animations[containerId].destroy();
      delete this.animations[containerId];
    }
  }

  destroyAll() {
    Object.keys(this.animations).forEach(id => this.destroy(id));
  }

  // 內建動畫：載入中（圓環旋轉）
  getLoadingAnimation() {
    return {
      v: "5.7.4",
      fr: 60,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      layers: [{
        ty: 4,
        nm: "circle",
        sr: 1,
        ks: {
          r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] },
          p: { a: 0, k: [50, 50] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }
        },
        shapes: [{
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [60, 60] }
        }, {
          ty: "st",
          c: { a: 0, k: [0, 0.851, 1, 1] },
          w: { a: 0, k: 6 },
          lc: 2,
          d: [{ n: "d", nm: "dash", v: { a: 0, k: 120 } }, { n: "g", nm: "gap", v: { a: 0, k: 80 } }]
        }]
      }]
    };
  }

  // 內建動畫：成功打勾
  getSuccessAnimation() {
    return {
      v: "5.7.4",
      fr: 60,
      ip: 0,
      op: 40,
      w: 100,
      h: 100,
      layers: [{
        ty: 4,
        nm: "check",
        sr: 1,
        ks: {
          p: { a: 0, k: [50, 50] },
          a: { a: 0, k: [0, 0] },
          s: { a: 1, k: [{ t: 0, s: [0, 0] }, { t: 20, s: [100, 100] }] }
        },
        shapes: [{
          ty: "sh",
          ks: {
            a: 0,
            k: { v: [[-20, 0], [-5, 15], [20, -15]], c: false }
          }
        }, {
          ty: "st",
          c: { a: 0, k: [0.133, 0.773, 0.369, 1] },
          w: { a: 0, k: 8 },
          lc: 2,
          lj: 2
        }, {
          ty: "tm",
          s: { a: 0, k: 0 },
          e: { a: 1, k: [{ t: 15, s: [0] }, { t: 35, s: [100] }] }
        }]
      }]
    };
  }

  // 內建動畫：錯誤叉叉
  getErrorAnimation() {
    return {
      v: "5.7.4",
      fr: 60,
      ip: 0,
      op: 40,
      w: 100,
      h: 100,
      layers: [{
        ty: 4,
        nm: "x",
        sr: 1,
        ks: {
          p: { a: 0, k: [50, 50] },
          s: { a: 1, k: [{ t: 0, s: [0, 0] }, { t: 20, s: [100, 100] }] }
        },
        shapes: [{
          ty: "gr",
          it: [
            { ty: "sh", ks: { a: 0, k: { v: [[-15, -15], [15, 15]], c: false } } },
            { ty: "sh", ks: { a: 0, k: { v: [[15, -15], [-15, 15]], c: false } } },
            { ty: "st", c: { a: 0, k: [0.937, 0.267, 0.267, 1] }, w: { a: 0, k: 8 }, lc: 2 }
          ]
        }]
      }]
    };
  }
}

// ============================================
// Mo.js 演示
// ============================================
class MojsShowcase {
  constructor() {
    this.bursts = [];
    this.shapes = [];
  }

  // 爆發效果
  createBurst(options = {}) {
    if (typeof mojs === 'undefined') {
      console.warn('Mo.js 未載入');
      return null;
    }

    // 確保有 parent 元素
    const parent = options.parent || document.getElementById('mojs-area');
    if (!parent) {
      console.warn('Mo.js: 找不到 parent 元素');
      return null;
    }

    const burst = new mojs.Burst({
      parent,
      left: 0,
      top: 0,
      radius: { 0: options.radius || 100 },
      count: options.count || 8,
      children: {
        shape: options.shape || 'circle',
        fill: options.colors || ['#00D9FF', '#A855F7', '#22C55E', '#F97316'],
        radius: { 10: 0 },
        duration: options.duration || 1000,
        easing: 'cubic.out'
      }
    });

    this.bursts.push(burst);
    return burst;
  }

  // 點擊爆發
  playBurstAt(x, y, burst) {
    if (!burst) return;
    burst
      .tune({ x, y })
      .replay();
  }

  // 形狀動畫
  createShape(options = {}) {
    if (typeof mojs === 'undefined') return null;

    const shape = new mojs.Shape({
      parent: options.parent,
      shape: options.shape || 'circle',
      fill: options.fill || '#00D9FF',
      radius: options.radius || { 0: 50 },
      duration: options.duration || 800,
      easing: 'elastic.out',
      ...options
    });

    this.shapes.push(shape);
    return shape;
  }

  // 心形爆發（按讚效果）
  createHeartBurst(parent) {
    if (typeof mojs === 'undefined' || !parent) return null;

    const burst = new mojs.Burst({
      parent,
      radius: { 30: 90 },
      count: 6,
      children: {
        shape: 'circle',
        fill: ['#EF4444', '#F97316', '#EAB308'],
        radius: { 8: 0 },
        duration: 1500,
        easing: 'cubic.out'
      }
    });

    const heart = new mojs.Shape({
      parent,
      shape: 'circle', // 使用圓形模擬
      fill: '#EF4444',
      scale: { 0: 1 },
      duration: 400,
      easing: 'elastic.out'
    });

    return { burst, heart };
  }

  // 漣漪效果
  createRipple(x, y, parent) {
    if (typeof mojs === 'undefined' || !parent) return null;

    return new mojs.Shape({
      parent,
      left: x,
      top: y,
      shape: 'circle',
      fill: 'none',
      stroke: '#00D9FF',
      strokeWidth: { 10: 0 },
      radius: { 0: 100 },
      duration: 800,
      easing: 'cubic.out'
    }).play();
  }

  // 清理
  cleanup() {
    this.bursts.forEach(b => b?.el?.remove());
    this.shapes.forEach(s => s?.el?.remove());
    this.bursts = [];
    this.shapes = [];
  }
}

// ============================================
// 動畫庫性能對比
// ============================================
class AnimationLibraryComparison {
  constructor() {
    this.results = {};
  }

  // 執行性能測試
  async runBenchmark(library, testFn, iterations = 100) {
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      await testFn();
    }

    const end = performance.now();
    const duration = end - start;

    this.results[library] = {
      totalTime: duration,
      avgTime: duration / iterations,
      iterations
    };

    return this.results[library];
  }

  // 取得對比結果
  getComparison() {
    return Object.entries(this.results)
      .sort((a, b) => a[1].avgTime - b[1].avgTime)
      .map(([lib, data]) => ({
        library: lib,
        ...data,
        rank: 0
      }))
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }
}

// ============================================
// UI 渲染
// ============================================
function renderAnimationsExtendedShowcase(container) {
  container.innerHTML = `
    <div class="animations-extended-showcase">
      <div class="showcase-header">
        <h2>🎬 擴展動畫庫演示</h2>
        <p>Motion One / Lottie / Mo.js 動畫效果展示</p>
      </div>

      <!-- Motion One 區塊 -->
      <div class="showcase-section">
        <h3>⚡ Motion One</h3>
        <p class="section-desc">輕量級動畫庫，僅約 3KB</p>

        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-preview">
              <div id="motion-basic" class="motion-box">基本動畫</div>
            </div>
            <button class="btn btn-outline-cyan btn-sm" onclick="motionDemo.basic()">
              播放
            </button>
          </div>

          <div class="demo-card">
            <div class="demo-preview">
              <div id="motion-spring" class="motion-box">彈簧效果</div>
            </div>
            <button class="btn btn-outline-cyan btn-sm" onclick="motionDemo.spring()">
              播放
            </button>
          </div>

          <div class="demo-card">
            <div class="demo-preview">
              <div id="motion-sequence-1" class="motion-box-sm" style="opacity: 0;">1</div>
              <div id="motion-sequence-2" class="motion-box-sm" style="opacity: 0;">2</div>
              <div id="motion-sequence-3" class="motion-box-sm" style="opacity: 0;">3</div>
            </div>
            <button class="btn btn-outline-cyan btn-sm" onclick="motionDemo.sequence()">
              序列動畫
            </button>
          </div>
        </div>
      </div>

      <!-- Lottie 區塊 -->
      <div class="showcase-section">
        <h3>🎞️ Lottie</h3>
        <p class="section-desc">After Effects 動畫播放器</p>

        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-preview lottie-preview">
              <div id="lottie-loading" class="lottie-container"></div>
            </div>
            <div class="lottie-controls">
              <button class="btn btn-sm" onclick="lottieDemo.play('loading')">▶️</button>
              <button class="btn btn-sm" onclick="lottieDemo.pause('loading')">⏸️</button>
              <button class="btn btn-sm" onclick="lottieDemo.stop('loading')">⏹️</button>
            </div>
            <span class="demo-label">載入中</span>
          </div>

          <div class="demo-card">
            <div class="demo-preview lottie-preview">
              <div id="lottie-success" class="lottie-container"></div>
            </div>
            <div class="lottie-controls">
              <button class="btn btn-sm" onclick="lottieDemo.replay('success')">🔄 重播</button>
            </div>
            <span class="demo-label">成功</span>
          </div>

          <div class="demo-card">
            <div class="demo-preview lottie-preview">
              <div id="lottie-error" class="lottie-container"></div>
            </div>
            <div class="lottie-controls">
              <button class="btn btn-sm" onclick="lottieDemo.replay('error')">🔄 重播</button>
            </div>
            <span class="demo-label">錯誤</span>
          </div>
        </div>

        <div class="speed-control">
          <label>播放速度：</label>
          <input type="range" min="0.25" max="3" step="0.25" value="1"
                 onchange="lottieDemo.setAllSpeed(this.value)">
          <span id="speed-value">1x</span>
        </div>
      </div>

      <!-- Mo.js 區塊 -->
      <div class="showcase-section">
        <h3>💥 Mo.js</h3>
        <p class="section-desc">動態圖形與爆發效果</p>

        <div class="mojs-demo-area" id="mojs-area">
          <p class="mojs-hint">👆 點擊此區域觸發爆發效果</p>
        </div>

        <div class="mojs-buttons">
          <button class="btn btn-outline-cyan btn-sm" onclick="mojsDemo.burstCenter()">
            💥 中心爆發
          </button>
          <button class="btn btn-outline-cyan btn-sm" onclick="mojsDemo.rippleEffect()">
            🌊 漣漪效果
          </button>
          <button class="btn btn-outline-cyan btn-sm" onclick="mojsDemo.heartBurst()">
            ❤️ 愛心爆發
          </button>
        </div>
      </div>

      <!-- 性能對比 -->
      <div class="showcase-section">
        <h3>📊 庫對比</h3>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>動畫庫</th>
              <th>大小</th>
              <th>特點</th>
              <th>適用場景</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Motion One</strong></td>
              <td>~3KB</td>
              <td>輕量、高性能</td>
              <td>UI 微動畫</td>
            </tr>
            <tr>
              <td><strong>Lottie</strong></td>
              <td>~50KB</td>
              <td>支援 AE 導出</td>
              <td>複雜插圖動畫</td>
            </tr>
            <tr>
              <td><strong>Mo.js</strong></td>
              <td>~30KB</td>
              <td>爆發特效</td>
              <td>互動回饋</td>
            </tr>
            <tr>
              <td><strong>Anime.js</strong></td>
              <td>~17KB</td>
              <td>功能全面</td>
              <td>通用動畫</td>
            </tr>
            <tr>
              <td><strong>GSAP</strong></td>
              <td>~60KB</td>
              <td>專業級、插件豐富</td>
              <td>複雜動畫序列</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================
// 初始化
// ============================================
let motionShowcase, lottieShowcase, mojsShowcase;

// Motion 演示控制
const motionDemo = {
  basic() {
    const el = document.getElementById('motion-basic');
    if (!el) return;

    // 使用 CSS 動畫作為後備
    el.style.transition = 'transform 0.5s ease-out';
    el.style.transform = 'translateX(50px)';
    setTimeout(() => {
      el.style.transform = 'translateX(0)';
    }, 500);
  },

  spring() {
    const el = document.getElementById('motion-spring');
    if (!el) return;

    el.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    el.style.transform = 'scale(1.3)';
    setTimeout(() => {
      el.style.transform = 'scale(1)';
    }, 300);
  },

  async sequence() {
    const els = ['motion-sequence-1', 'motion-sequence-2', 'motion-sequence-3'];
    for (const id of els) {
      const el = document.getElementById(id);
      if (el) {
        el.style.transition = 'all 0.3s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        await new Promise(r => setTimeout(r, 200));
      }
    }
    // 重置
    setTimeout(() => {
      els.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
        }
      });
    }, 1500);
  }
};

// Lottie 演示控制
const lottieDemo = {
  showcase: null,

  init() {
    this.showcase = new LottieShowcase();

    // 載入內建動畫
    this.showcase.loadAnimation('lottie-loading', this.showcase.builtInAnimations.loading);
    this.showcase.loadAnimation('lottie-success', this.showcase.builtInAnimations.success, { loop: false });
    this.showcase.loadAnimation('lottie-error', this.showcase.builtInAnimations.error, { loop: false });
  },

  play(name) {
    this.showcase?.play(`lottie-${name}`);
  },

  pause(name) {
    this.showcase?.pause(`lottie-${name}`);
  },

  stop(name) {
    this.showcase?.stop(`lottie-${name}`);
  },

  replay(name) {
    this.showcase?.stop(`lottie-${name}`);
    this.showcase?.play(`lottie-${name}`);
  },

  setAllSpeed(speed) {
    document.getElementById('speed-value').textContent = speed + 'x';
    Object.keys(this.showcase?.animations || {}).forEach(id => {
      this.showcase.setSpeed(id, parseFloat(speed));
    });
  }
};

// Mo.js 演示控制
const mojsDemo = {
  showcase: null,
  burst: null,

  init() {
    this.showcase = new MojsShowcase();

    // 預建爆發效果
    this.burst = this.showcase.createBurst({
      radius: 80,
      count: 10,
      colors: ['#00D9FF', '#A855F7', '#22C55E', '#F97316', '#EF4444']
    });

    // 點擊觸發
    const area = document.getElementById('mojs-area');
    if (area) {
      area.addEventListener('click', (e) => {
        const rect = area.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.burst) {
          this.showcase.playBurstAt(x, y, this.burst);
        } else {
          // 後備：CSS 動畫
          this.createCSSBurst(area, x, y);
        }
      });
    }
  },

  burstCenter() {
    const area = document.getElementById('mojs-area');
    if (!area) return;

    const rect = area.getBoundingClientRect();
    if (this.burst) {
      this.showcase.playBurstAt(rect.width / 2, rect.height / 2, this.burst);
    } else {
      this.createCSSBurst(area, rect.width / 2, rect.height / 2);
    }
  },

  rippleEffect() {
    const area = document.getElementById('mojs-area');
    if (!area) return;

    const rect = area.getBoundingClientRect();
    this.createCSSRipple(area, rect.width / 2, rect.height / 2);
  },

  heartBurst() {
    const area = document.getElementById('mojs-area');
    if (!area) return;

    // CSS 後備心形動畫
    const heart = document.createElement('div');
    heart.className = 'heart-burst';
    heart.textContent = '❤️';
    heart.style.left = '50%';
    heart.style.top = '50%';
    area.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
  },

  // CSS 後備動畫
  createCSSBurst(parent, x, y) {
    const colors = ['#00D9FF', '#A855F7', '#22C55E', '#F97316'];

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'css-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.backgroundColor = colors[i % colors.length];
      particle.style.setProperty('--angle', (i * 45) + 'deg');
      parent.appendChild(particle);

      setTimeout(() => particle.remove(), 800);
    }
  },

  createCSSRipple(parent, x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'css-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    parent.appendChild(ripple);

    setTimeout(() => ripple.remove(), 800);
  }
};

// ============================================
// 主初始化函數
// ============================================
async function initAnimationsExtendedShowcase() {
  const container = document.getElementById('animations-extended-tab');
  if (!container) {
    console.warn('找不到 animations-extended-tab 容器');
    return;
  }

  // 渲染 UI
  renderAnimationsExtendedShowcase(container);

  // 初始化各演示
  motionShowcase = new MotionOneShowcase();

  // Lottie 初始化
  if (typeof lottie !== 'undefined') {
    lottieDemo.init();
  } else {
    console.log('Lottie 未載入，使用後備顯示');
    document.querySelectorAll('.lottie-container').forEach(el => {
      el.innerHTML = '<div class="lottie-placeholder">Lottie 動畫</div>';
    });
  }

  // Mo.js 初始化
  if (typeof mojs !== 'undefined') {
    mojsDemo.init();
  } else {
    console.log('Mo.js 未載入，使用 CSS 後備動畫');
    mojsDemo.showcase = new MojsShowcase();
    mojsDemo.init();
  }

  console.log('✅ 擴展動畫庫演示初始化完成');
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MotionOneShowcase,
    LottieShowcase,
    MojsShowcase,
    initAnimationsExtendedShowcase
  };
}
