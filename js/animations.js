/* ============================================
   Animations Module - Animation Libraries Showcase
   Features: Anime.js, GSAP, CSS, Canvas, SVG
   ============================================ */

// ============================================
// 1. Performance Monitor
// ============================================

class PerformanceMonitor {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.metrics = {
      anime: { fps: 0, time: 0 },
      gsap: { fps: 0, time: 0 },
      css: { fps: 0, time: 0 },
      canvas: { fps: 0, time: 0 }
    };
  }

  start() {
    this.measureFPS();
  }

  measureFPS() {
    const now = performance.now();
    this.frameCount++;

    if (now >= this.lastTime + 1000) {
      this.fps = Math.round(this.frameCount * 1000 / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;
      this.updateDisplay();
    }

    requestAnimationFrame(() => this.measureFPS());
  }

  updateDisplay() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="perf-metric">
        <span class="metric-label">FPS</span>
        <span class="metric-value">${this.fps}</span>
      </div>
    `;
  }

  recordMetric(library, time) {
    if (this.metrics[library]) {
      this.metrics[library].time = time;
      this.metrics[library].fps = this.fps;
    }
  }

  getMetrics() {
    return this.metrics;
  }
}

// ============================================
// 2. Anime.js Showcase
// ============================================

class AnimeShowcase {
  constructor() {
    this.container = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.container = document.getElementById('anime-showcase');
    if (!this.container) return;

    this.renderUI();
    this.attachEventListeners();
    this.isInitialized = true;
  }

  renderUI() {
    this.container.innerHTML = `
      <div class="showcase-section">
        <h3>Anime.js 演示</h3>

        <div class="demo-grid">
          <!-- 進度條動畫 -->
          <div class="demo-card">
            <h4>圓形進度條</h4>
            <svg class="circle-progress" width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" stroke-width="8"/>
              <circle class="progress-circle" cx="60" cy="60" r="50" fill="none" stroke="#00d9ff" stroke-width="8" stroke-dasharray="314" stroke-dashoffset="314"/>
            </svg>
            <button class="demo-btn" data-demo="progress">運行</button>
          </div>

          <!-- 計數動畫 -->
          <div class="demo-card">
            <h4>數字計數</h4>
            <div class="counter-display">0</div>
            <button class="demo-btn" data-demo="counter">運行</button>
          </div>

          <!-- 列表動畫 -->
          <div class="demo-card">
            <h4>列表入場</h4>
            <ul class="demo-list">
              <li>項目 1</li>
              <li>項目 2</li>
              <li>項目 3</li>
            </ul>
            <button class="demo-btn" data-demo="list">運行</button>
          </div>

          <!-- Hover 卡片 -->
          <div class="demo-card">
            <h4>Hover 效果</h4>
            <div class="hover-box">懸停試試</div>
            <button class="demo-btn" data-demo="hover">重置</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const btns = this.container.querySelectorAll('.demo-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const demoType = e.target.dataset.demo;
        this.runDemo(demoType);
      });
    });

    // Hover 效果持久化
    const hoverBox = this.container.querySelector('.hover-box');
    if (hoverBox) {
      hoverBox.addEventListener('mouseenter', () => {
        anime.set(hoverBox, {
          scale: 1.1,
          boxShadow: '0 10px 30px rgba(0, 217, 255, 0.3)'
        });
      });
      hoverBox.addEventListener('mouseleave', () => {
        anime.set(hoverBox, {
          scale: 1,
          boxShadow: '0 0 0 rgba(0, 217, 255, 0)'
        });
      });
    }
  }

  runDemo(type) {
    const startTime = performance.now();

    switch(type) {
      case 'progress':
        this.animateProgress();
        break;
      case 'counter':
        this.animateCounter();
        break;
      case 'list':
        this.animateList();
        break;
      case 'hover':
        this.resetHover();
        break;
    }

    const duration = performance.now() - startTime;
    console.log(`[Anime.js] ${type} 動畫耗時: ${duration.toFixed(2)}ms`);
  }

  animateProgress() {
    const circle = this.container.querySelector('.progress-circle');
    anime.set(circle, { strokeDashoffset: 314 });

    anime({
      targets: circle,
      strokeDashoffset: [314, 0],
      duration: 2000,
      easing: 'easeInOutQuad'
    });
  }

  animateCounter() {
    const counter = this.container.querySelector('.counter-display');
    anime({
      targets: { value: 0 },
      value: 999999,
      duration: 2000,
      easing: 'easeInOutQuad',
      update(anim) {
        counter.textContent = Math.round(anim.progress * 999999).toLocaleString();
      }
    });
  }

  animateList() {
    const items = this.container.querySelectorAll('.demo-list li');
    anime.set(items, { opacity: 0, translateY: -20 });

    anime({
      targets: items,
      opacity: [0, 1],
      translateY: ['-20px', '0px'],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutQuad'
    });
  }

  resetHover() {
    const hoverBox = this.container.querySelector('.hover-box');
    anime({
      targets: hoverBox,
      scale: [1.1, 1],
      rotate: [360, 0],
      duration: 600,
      easing: 'easeOutQuad'
    });
  }
}

// ============================================
// 3. GSAP Showcase
// ============================================

class GSAPShowcase {
  constructor() {
    this.container = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.container = document.getElementById('gsap-showcase');
    if (!this.container) return;

    this.renderUI();
    this.attachEventListeners();
    this.isInitialized = true;
  }

  renderUI() {
    this.container.innerHTML = `
      <div class="showcase-section">
        <h3>GSAP 演示</h3>

        <div class="demo-grid">
          <!-- 卡片翻轉 -->
          <div class="demo-card">
            <h4>3D 翻轉</h4>
            <div class="flip-box">翻轉我</div>
            <button class="demo-btn" data-demo="flip">運行</button>
          </div>

          <!-- 時間軸 -->
          <div class="demo-card">
            <h4>時間軸序列</h4>
            <div class="timeline-box">
              <div class="timeline-item">步驟 1</div>
              <div class="timeline-item">步驟 2</div>
              <div class="timeline-item">步驟 3</div>
            </div>
            <button class="demo-btn" data-demo="timeline">運行</button>
          </div>

          <!-- 文字效果 -->
          <div class="demo-card">
            <h4>文字動畫</h4>
            <div class="text-anim">GSAP Power</div>
            <button class="demo-btn" data-demo="text">運行</button>
          </div>

          <!-- 組合動畫 -->
          <div class="demo-card">
            <h4>組合效果</h4>
            <div class="combo-box">複合動畫</div>
            <button class="demo-btn" data-demo="combo">運行</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const btns = this.container.querySelectorAll('.demo-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const demoType = e.target.dataset.demo;
        this.runDemo(demoType);
      });
    });
  }

  runDemo(type) {
    const startTime = performance.now();

    switch(type) {
      case 'flip':
        this.animateFlip();
        break;
      case 'timeline':
        this.animateTimeline();
        break;
      case 'text':
        this.animateText();
        break;
      case 'combo':
        this.animateCombo();
        break;
    }

    const duration = performance.now() - startTime;
    console.log(`[GSAP] ${type} 動畫耗時: ${duration.toFixed(2)}ms`);
  }

  animateFlip() {
    const box = this.container.querySelector('.flip-box');
    gsap.to(box, {
      rotationY: 360,
      duration: 1.5,
      ease: 'back.out',
      perspective: 1000
    });
  }

  animateTimeline() {
    const items = this.container.querySelectorAll('.timeline-item');
    const tl = gsap.timeline();

    items.forEach((item, index) => {
      tl.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, index * 0.2);
    });
  }

  animateText() {
    const text = this.container.querySelector('.text-anim');
    gsap.fromTo(text,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: 'elastic.out' }
    );
  }

  animateCombo() {
    const box = this.container.querySelector('.combo-box');
    gsap.to(box, {
      duration: 2,
      x: 50,
      rotation: 360,
      scale: 1.2,
      ease: 'sine.inOut'
    });
  }
}

// ============================================
// 4. Canvas Showcase
// ============================================

class CanvasShowcase {
  constructor() {
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.container = document.getElementById('canvas-showcase');
    if (!this.container) return;

    this.renderUI();
    this.setupCanvas();
    this.attachEventListeners();
    this.isInitialized = true;
  }

  renderUI() {
    this.container.innerHTML = `
      <div class="showcase-section">
        <h3>Canvas 動畫</h3>

        <div class="demo-grid">
          <!-- 粒子系統 -->
          <div class="demo-card">
            <h4>粒子系統</h4>
            <canvas class="particle-canvas" width="200" height="150"></canvas>
            <button class="demo-btn" data-demo="particles">點擊生成</button>
          </div>

          <!-- 波形動畫 -->
          <div class="demo-card">
            <h4>波形動畫</h4>
            <canvas class="wave-canvas" width="200" height="150"></canvas>
            <button class="demo-btn" data-demo="wave">運行</button>
          </div>

          <!-- 網格背景 -->
          <div class="demo-card">
            <h4>網格背景</h4>
            <canvas class="grid-canvas" width="200" height="150"></canvas>
            <button class="demo-btn" data-demo="grid">運行</button>
          </div>

          <!-- 簡單繪圖 -->
          <div class="demo-card">
            <h4>繪圖演示</h4>
            <canvas class="draw-canvas" width="200" height="150"></canvas>
            <button class="demo-btn" data-demo="draw">運行</button>
          </div>
        </div>
      </div>
    `;
  }

  setupCanvas() {
    const canvas = this.container.querySelector('.particle-canvas');
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  attachEventListeners() {
    const btns = this.container.querySelectorAll('.demo-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const demoType = e.target.dataset.demo;
        this.runDemo(demoType);
      });
    });
  }

  runDemo(type) {
    const startTime = performance.now();

    switch(type) {
      case 'particles':
        this.animateParticles();
        break;
      case 'wave':
        this.animateWave();
        break;
      case 'grid':
        this.animateGrid();
        break;
      case 'draw':
        this.animateDraw();
        break;
    }

    const duration = performance.now() - startTime;
    console.log(`[Canvas] ${type} 動畫耗時: ${duration.toFixed(2)}ms`);
  }

  animateParticles() {
    const canvas = this.container.querySelector('.particle-canvas');
    const ctx = canvas.getContext('2d');

    // 清空並生成粒子
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 3 + 1;

      ctx.fillStyle = `rgba(0, 217, 255, ${Math.random() * 0.7 + 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  animateWave() {
    const canvas = this.container.querySelector('.wave-canvas');
    const ctx = canvas.getContext('2d');
    let time = 0;

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00d9ff';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin((x + time) * 0.05) * 30;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      time += 2;
      if (time < 100) requestAnimationFrame(drawWave);
    };

    drawWave();
  }

  animateGrid() {
    const canvas = this.container.querySelector('.grid-canvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.2)';
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  animateDraw() {
    const canvas = this.container.querySelector('.draw-canvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製簡單圖形
    ctx.fillStyle = '#00d9ff';
    ctx.fillRect(50, 30, 100, 60);

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(100, 100, 25, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ============================================
// 5. Initialization
// ============================================

function initAnimationShowcases() {
  const animeShowcase = new AnimeShowcase();
  const gsapShowcase = new GSAPShowcase();
  const canvasShowcase = new CanvasShowcase();

  animeShowcase.init();
  gsapShowcase.init();
  canvasShowcase.init();

  return {
    anime: animeShowcase,
    gsap: gsapShowcase,
    canvas: canvasShowcase
  };
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimationShowcases);
} else {
  initAnimationShowcases();
}
