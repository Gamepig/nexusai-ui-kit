/**
 * 3D 效果展示模組
 * Canvas 2D 實作（相容 file:// 協議）
 */

// ============================================
// Canvas3D - 使用 Canvas 2D 模擬 3D 效果
// ============================================
class Canvas3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn('找不到容器:', containerId);
      return;
    }

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.container.clientWidth || 800;
    this.height = 400;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.container.appendChild(this.canvas);

    this.objects = [];
    this.animationId = null;
    this.rotation = { x: 0, y: 0 };
    this.autoRotate = true;
    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.cameraZ = 5;

    this.setupControls();
    window.addEventListener('resize', () => this.resize());

    console.log('✅ Canvas 3D 初始化完成');
  }

  setupControls() {
    // 滑鼠拖動旋轉
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.lastMouse = { x: e.offsetX, y: e.offsetY };
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.offsetX - this.lastMouse.x;
        const dy = e.offsetY - this.lastMouse.y;
        this.rotation.y += dx * 0.01;
        this.rotation.x += dy * 0.01;
        this.lastMouse = { x: e.offsetX, y: e.offsetY };
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });

    // 滾輪縮放
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraZ += e.deltaY * 0.01;
      this.cameraZ = Math.max(3, Math.min(10, this.cameraZ));
    });

    // 雙擊恢復自動旋轉
    this.canvas.addEventListener('dblclick', () => {
      this.autoRotate = true;
    });
  }

  resize() {
    this.width = this.container.clientWidth || 800;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  // 3D 投影
  project(point) {
    const scale = 200 / (this.cameraZ + point.z);
    return {
      x: this.width / 2 + point.x * scale,
      y: this.height / 2 + point.y * scale,
      scale: scale
    };
  }

  // 旋轉矩陣
  rotatePoint(point, rx, ry) {
    // 繞 Y 軸旋轉
    let x = point.x * Math.cos(ry) - point.z * Math.sin(ry);
    let z = point.x * Math.sin(ry) + point.z * Math.cos(ry);

    // 繞 X 軸旋轉
    let y = point.y * Math.cos(rx) - z * Math.sin(rx);
    z = point.y * Math.sin(rx) + z * Math.cos(rx);

    return { x, y, z };
  }

  // ============================================
  // 3D 物件
  // ============================================
  addCube(options = {}) {
    const size = options.size || 1;
    const color = options.color || '#00d9ff';
    const x = options.x || 0;
    const y = options.y || 0;
    const z = options.z || 0;

    // 立方體的 8 個頂點
    const vertices = [
      { x: -size, y: -size, z: -size },
      { x: size, y: -size, z: -size },
      { x: size, y: size, z: -size },
      { x: -size, y: size, z: -size },
      { x: -size, y: -size, z: size },
      { x: size, y: -size, z: size },
      { x: size, y: size, z: size },
      { x: -size, y: size, z: size }
    ].map(v => ({ x: v.x + x, y: v.y + y, z: v.z + z }));

    // 12 條邊
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    // 6 個面（用於填充）
    const faces = [
      [0, 1, 2, 3], // 前
      [4, 5, 6, 7], // 後
      [0, 1, 5, 4], // 下
      [2, 3, 7, 6], // 上
      [0, 3, 7, 4], // 左
      [1, 2, 6, 5]  // 右
    ];

    this.objects.push({
      type: 'cube',
      vertices,
      edges,
      faces,
      color,
      wireframe: options.wireframe || false
    });
  }

  addSphere(options = {}) {
    const radius = options.radius || 1;
    const color = options.color || '#a855f7';
    const x = options.x || 0;
    const y = options.y || 0;
    const z = options.z || 0;
    const segments = 12;

    const vertices = [];
    const edges = [];

    // 生成球體頂點
    for (let i = 0; i <= segments; i++) {
      const lat = (i / segments) * Math.PI;
      for (let j = 0; j <= segments; j++) {
        const lon = (j / segments) * 2 * Math.PI;
        vertices.push({
          x: x + radius * Math.sin(lat) * Math.cos(lon),
          y: y + radius * Math.cos(lat),
          z: z + radius * Math.sin(lat) * Math.sin(lon)
        });
      }
    }

    // 生成邊
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const idx = i * (segments + 1) + j;
        edges.push([idx, idx + 1]);
        edges.push([idx, idx + segments + 1]);
      }
    }

    this.objects.push({
      type: 'sphere',
      vertices,
      edges,
      color,
      wireframe: true
    });
  }

  addTorus(options = {}) {
    const radius = options.radius || 1;
    const tube = options.tube || 0.3;
    const color = options.color || '#22c55e';
    const x = options.x || 0;
    const y = options.y || 0;
    const z = options.z || 0;
    const segments = 16;
    const tubeSegments = 12;

    const vertices = [];
    const edges = [];

    // 生成圓環頂點
    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * 2 * Math.PI;
      for (let j = 0; j <= tubeSegments; j++) {
        const v = (j / tubeSegments) * 2 * Math.PI;
        vertices.push({
          x: x + (radius + tube * Math.cos(v)) * Math.cos(u),
          y: y + tube * Math.sin(v),
          z: z + (radius + tube * Math.cos(v)) * Math.sin(u)
        });
      }
    }

    // 生成邊
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < tubeSegments; j++) {
        const idx = i * (tubeSegments + 1) + j;
        edges.push([idx, idx + 1]);
        edges.push([idx, idx + tubeSegments + 1]);
      }
    }

    this.objects.push({
      type: 'torus',
      vertices,
      edges,
      color,
      wireframe: true
    });
  }

  addParticles(count = 200) {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 6
      });
    }

    this.objects.push({
      type: 'particles',
      vertices: particles,
      color: '#00d9ff'
    });
  }

  // ============================================
  // 渲染
  // ============================================
  render() {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 渲染每個物件
    this.objects.forEach(obj => {
      if (obj.type === 'particles') {
        this.renderParticles(obj);
      } else {
        this.renderWireframe(obj);
      }
    });
  }

  renderWireframe(obj) {
    const { vertices, edges, color } = obj;

    // 旋轉並投影所有頂點
    const projected = vertices.map(v => {
      const rotated = this.rotatePoint(v, this.rotation.x, this.rotation.y);
      return this.project(rotated);
    });

    // 繪製邊
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    edges.forEach(([i, j]) => {
      const p1 = projected[i];
      const p2 = projected[j];
      if (p1 && p2) {
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
      }
    });

    this.ctx.stroke();

    // 繪製頂點
    this.ctx.fillStyle = color;
    projected.forEach(p => {
      if (p) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, Math.max(2, p.scale * 0.5), 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
  }

  renderParticles(obj) {
    const { vertices, color } = obj;

    vertices.forEach(v => {
      const rotated = this.rotatePoint(v, this.rotation.x, this.rotation.y);
      const p = this.project(rotated);

      // 根據深度調整透明度和大小
      const alpha = Math.max(0.2, Math.min(1, (5 - rotated.z) / 5));
      const size = Math.max(1, p.scale * 0.3);

      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.globalAlpha = 1;
  }

  // ============================================
  // 動畫
  // ============================================
  animate() {
    if (this.autoRotate) {
      this.rotation.y += 0.01;
      this.rotation.x += 0.005;
    }

    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // ============================================
  // 場景預設
  // ============================================
  clearScene() {
    this.stop();
    this.objects = [];
    this.rotation = { x: 0, y: 0 };
    this.autoRotate = true;
  }

  loadGeometryShowcase() {
    this.clearScene();
    this.addCube({ x: -2.5, color: '#00d9ff', size: 0.8 });
    this.addSphere({ x: 0, color: '#a855f7', radius: 0.8 });
    this.addTorus({ x: 2.5, color: '#22c55e', radius: 0.6, tube: 0.25 });
    this.animate();
  }

  loadParticleShowcase() {
    this.clearScene();
    this.addParticles(300);
    this.animate();
  }

  loadWireframeShowcase() {
    this.clearScene();
    this.addCube({ x: -2.5, color: '#00d9ff', size: 0.8, wireframe: true });
    this.addSphere({ x: 0, color: '#a855f7', radius: 0.8 });
    this.addTorus({ x: 2.5, color: '#22c55e', radius: 0.6, tube: 0.25 });
    this.animate();
  }

  dispose() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// ============================================
// UI 渲染
// ============================================
function renderWebGLShowcase(container) {
  container.innerHTML = `
    <div class="webgl-showcase">
      <div class="showcase-header">
        <h2>🎮 3D 效果展示</h2>
        <p>Canvas 2D 模擬 3D 渲染</p>
      </div>

      <!-- 3D 場景 -->
      <div class="webgl-container" id="webgl-canvas"></div>

      <!-- 控制面板 -->
      <div class="webgl-controls">
        <div class="control-group">
          <span class="control-label">場景預設</span>
          <button class="btn btn-solid-cyan btn-sm" data-scene="geometry">
            📦 基礎幾何
          </button>
          <button class="btn btn-outline-cyan btn-sm" data-scene="particles">
            ✨ 粒子系統
          </button>
          <button class="btn btn-outline-cyan btn-sm" data-scene="wireframe">
            🔲 線框模式
          </button>
        </div>
      </div>

      <!-- 互動提示 -->
      <div class="webgl-tips">
        <span>🖱️ 拖動旋轉</span>
        <span>🔍 滾輪縮放</span>
        <span>👆 雙擊恢復自動旋轉</span>
      </div>

      <!-- 說明 -->
      <div class="webgl-info">
        <h3>💡 3D 渲染技術說明</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>Canvas 2D</strong>
            <p>使用數學投影模擬 3D 效果，相容性最佳</p>
          </div>
          <div class="info-item">
            <strong>WebGL</strong>
            <p>GPU 加速渲染，需要伺服器環境</p>
          </div>
          <div class="info-item">
            <strong>應用場景</strong>
            <p>遊戲、數據視覺化、產品展示</p>
          </div>
          <div class="info-item">
            <strong>本實作</strong>
            <p>純客戶端，支援 file:// 協議</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// 初始化
// ============================================
let canvas3d = null;

function initWebGLShowcase() {
  const container = document.getElementById('webgl-tab');
  if (!container) {
    console.warn('找不到 webgl-tab 容器');
    return;
  }

  // 渲染 UI
  renderWebGLShowcase(container);

  // 初始化 Canvas 3D
  canvas3d = new Canvas3D('webgl-canvas');

  // 載入預設場景
  canvas3d.loadGeometryShowcase();

  // 場景切換按鈕
  document.querySelectorAll('[data-scene]').forEach(btn => {
    btn.addEventListener('click', () => {
      // 更新按鈕狀態
      document.querySelectorAll('[data-scene]').forEach(b => {
        b.classList.remove('btn-solid-cyan');
        b.classList.add('btn-outline-cyan');
      });
      btn.classList.remove('btn-outline-cyan');
      btn.classList.add('btn-solid-cyan');

      // 切換場景
      const scene = btn.dataset.scene;
      switch (scene) {
        case 'geometry':
          canvas3d.loadGeometryShowcase();
          break;
        case 'particles':
          canvas3d.loadParticleShowcase();
          break;
        case 'wireframe':
          canvas3d.loadWireframeShowcase();
          break;
      }
    });
  });

  console.log('✅ 3D 展示初始化完成');
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Canvas3D, initWebGLShowcase };
}
