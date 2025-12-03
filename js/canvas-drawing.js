/**
 * Canvas 繪圖工具完善模組
 * Phase 5.2 - 完整繪圖工具
 */

// ============================================
// CanvasDrawingTool - 完整繪圖工具
// ============================================
class CanvasDrawingTool {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');

    // 狀態
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    // 工具設定
    this.currentTool = 'pen';
    this.brushSize = 5;
    this.brushColor = '#00D9FF';
    this.fillColor = '#A855F7';

    // 歷史記錄
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 50;

    // 形狀繪製
    this.startX = 0;
    this.startY = 0;
    this.tempCanvas = null;

    // 初始化
    this.init();
  }

  init() {
    // 設置 Canvas 尺寸
    this.resizeCanvas();

    // 建立臨時畫布（用於形狀預覽）
    this.tempCanvas = document.createElement('canvas');
    this.tempCtx = this.tempCanvas.getContext('2d');

    // 綁定事件
    this.bindEvents();

    // 初始背景
    this.clearCanvas();

    // 保存初始狀態
    this.saveState();

    console.log('✅ Canvas 繪圖工具初始化完成');
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = 400;

    // 同步臨時畫布
    if (this.tempCanvas) {
      this.tempCanvas.width = this.canvas.width;
      this.tempCanvas.height = this.canvas.height;
    }
  }

  bindEvents() {
    // 滑鼠事件
    this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.endDraw());
    this.canvas.addEventListener('mouseleave', () => this.endDraw());

    // 觸控事件
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.startDraw(this.getTouchPos(e));
    });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.draw(this.getTouchPos(e));
    });
    this.canvas.addEventListener('touchend', () => this.endDraw());

    // 視窗調整
    window.addEventListener('resize', () => {
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.resizeCanvas();
      this.ctx.putImageData(imageData, 0, 0);
    });
  }

  getTouchPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      clientX: touch.clientX,
      clientY: touch.clientY,
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top
    };
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // ============================================
  // 工具切換
  // ============================================
  setTool(tool) {
    this.currentTool = tool;
    this.canvas.style.cursor = this.getCursorForTool(tool);
    console.log(`🔧 切換工具: ${tool}`);
  }

  getCursorForTool(tool) {
    const cursors = {
      pen: 'crosshair',
      pencil: 'crosshair',
      brush: 'crosshair',
      eraser: 'cell',
      fill: 'cell',
      line: 'crosshair',
      rect: 'crosshair',
      circle: 'crosshair',
      text: 'text'
    };
    return cursors[tool] || 'default';
  }

  // ============================================
  // 筆刷設定
  // ============================================
  setBrushSize(size) {
    this.brushSize = Math.max(1, Math.min(100, size));
  }

  setBrushColor(color) {
    this.brushColor = color;
  }

  setFillColor(color) {
    this.fillColor = color;
  }

  // ============================================
  // 繪製方法
  // ============================================
  startDraw(e) {
    this.isDrawing = true;
    const pos = this.getMousePos(e);
    this.lastX = pos.x;
    this.lastY = pos.y;
    this.startX = pos.x;
    this.startY = pos.y;

    // 保存當前狀態用於形狀預覽
    if (['rect', 'circle', 'line'].includes(this.currentTool)) {
      this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
      this.tempCtx.drawImage(this.canvas, 0, 0);
    }

    // 點擊填充
    if (this.currentTool === 'fill') {
      this.floodFill(Math.floor(pos.x), Math.floor(pos.y), this.brushColor);
      this.saveState();
    }
  }

  draw(e) {
    if (!this.isDrawing) return;

    const pos = this.getMousePos(e);

    switch (this.currentTool) {
      case 'pen':
      case 'pencil':
        this.drawLine(this.lastX, this.lastY, pos.x, pos.y);
        this.lastX = pos.x;
        this.lastY = pos.y;
        break;

      case 'brush':
        this.drawBrush(pos.x, pos.y);
        this.lastX = pos.x;
        this.lastY = pos.y;
        break;

      case 'eraser':
        this.erase(pos.x, pos.y);
        break;

      case 'line':
        this.previewLine(pos.x, pos.y);
        break;

      case 'rect':
        this.previewRect(pos.x, pos.y);
        break;

      case 'circle':
        this.previewCircle(pos.x, pos.y);
        break;
    }
  }

  endDraw() {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    // 完成形狀繪製
    if (['line', 'rect', 'circle'].includes(this.currentTool)) {
      this.saveState();
    } else if (['pen', 'pencil', 'brush', 'eraser'].includes(this.currentTool)) {
      this.saveState();
    }
  }

  // ============================================
  // 繪製工具實現
  // ============================================
  drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = this.brushColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
  }

  drawBrush(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = this.brushColor;
    this.ctx.fill();

    // 連接點
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = this.brushColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();
  }

  erase(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0F172A';
    this.ctx.fill();
  }

  // ============================================
  // 形狀預覽與繪製
  // ============================================
  previewLine(endX, endY) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.tempCanvas, 0, 0);

    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = this.brushColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();
  }

  previewRect(endX, endY) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.tempCanvas, 0, 0);

    const width = endX - this.startX;
    const height = endY - this.startY;

    this.ctx.beginPath();
    this.ctx.rect(this.startX, this.startY, width, height);
    this.ctx.strokeStyle = this.brushColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.stroke();
  }

  previewCircle(endX, endY) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.tempCanvas, 0, 0);

    const radius = Math.sqrt(
      Math.pow(endX - this.startX, 2) + Math.pow(endY - this.startY, 2)
    );

    this.ctx.beginPath();
    this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.brushColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.stroke();
  }

  // ============================================
  // 填充工具（Flood Fill）
  // ============================================
  floodFill(startX, startY, fillColor) {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 取得目標顏色
    const targetColor = this.getPixelColor(data, startX, startY, width);
    const replacementColor = this.hexToRgb(fillColor);

    // 如果顏色相同則跳過
    if (this.colorsMatch(targetColor, replacementColor)) return;

    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop();

      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const currentColor = this.getPixelColor(data, x, y, width);
      if (!this.colorsMatch(currentColor, targetColor)) continue;

      this.setPixelColor(data, x, y, width, replacementColor);

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  getPixelColor(data, x, y, width) {
    const i = (y * width + x) * 4;
    return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
  }

  setPixelColor(data, x, y, width, color) {
    const i = (y * width + x) * 4;
    data[i] = color.r;
    data[i + 1] = color.g;
    data[i + 2] = color.b;
    data[i + 3] = 255;
  }

  colorsMatch(c1, c2, tolerance = 10) {
    return Math.abs(c1.r - c2.r) < tolerance &&
           Math.abs(c1.g - c2.g) < tolerance &&
           Math.abs(c1.b - c2.b) < tolerance;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  // ============================================
  // 歷史管理
  // ============================================
  saveState() {
    // 移除之後的歷史
    this.history = this.history.slice(0, this.historyIndex + 1);

    // 保存當前狀態
    this.history.push(this.canvas.toDataURL());

    // 限制歷史長度
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.historyIndex = this.history.length - 1;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreState(this.history[this.historyIndex]);
      console.log('↩️ 撤銷');
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreState(this.history[this.historyIndex]);
      console.log('↪️ 重做');
    }
  }

  restoreState(dataUrl) {
    const img = new Image();
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  }

  // ============================================
  // 清除
  // ============================================
  clearCanvas() {
    this.ctx.fillStyle = '#0F172A';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 清除臨時畫布
    if (this.tempCtx) {
      this.tempCtx.fillStyle = '#0F172A';
      this.tempCtx.fillRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    }
  }

  // ============================================
  // 匯出功能
  // ============================================
  exportPNG() {
    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
    console.log('💾 已匯出 PNG');
  }

  exportJPG() {
    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.jpg`;
    link.href = this.canvas.toDataURL('image/jpeg', 0.9);
    link.click();
    console.log('💾 已匯出 JPG');
  }

  async copyToClipboard() {
    try {
      const blob = await new Promise(resolve => {
        this.canvas.toBlob(resolve, 'image/png');
      });
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      console.log('📋 已複製到剪貼簿');
      return true;
    } catch (error) {
      console.error('複製失敗:', error);
      return false;
    }
  }
}

// ============================================
// UI 渲染
// ============================================
function renderCanvasDrawingShowcase(container) {
  container.innerHTML = `
    <div class="canvas-drawing-showcase">
      <div class="showcase-header">
        <h2>🎨 Canvas 繪圖工具</h2>
        <p>完整繪圖功能展示</p>
      </div>

      <!-- 工具列 -->
      <div class="canvas-toolbar">
        <div class="tool-group">
          <span class="tool-group-label">繪圖工具</span>
          <button class="tool-btn active" data-tool="pen" title="鋼筆">🖊️</button>
          <button class="tool-btn" data-tool="pencil" title="鉛筆">✏️</button>
          <button class="tool-btn" data-tool="brush" title="畫刷">🖌️</button>
          <button class="tool-btn" data-tool="eraser" title="橡皮擦">🧽</button>
        </div>

        <div class="tool-group">
          <span class="tool-group-label">形狀</span>
          <button class="tool-btn" data-tool="line" title="線條">📏</button>
          <button class="tool-btn" data-tool="rect" title="矩形">⬜</button>
          <button class="tool-btn" data-tool="circle" title="圓形">⭕</button>
          <button class="tool-btn" data-tool="fill" title="填充">🪣</button>
        </div>

        <div class="tool-group">
          <span class="tool-group-label">顏色</span>
          <input type="color" id="brush-color" value="#00D9FF" title="筆刷顏色">
          <div class="color-presets">
            <button class="color-preset" style="background: #00D9FF" data-color="#00D9FF"></button>
            <button class="color-preset" style="background: #A855F7" data-color="#A855F7"></button>
            <button class="color-preset" style="background: #22C55E" data-color="#22C55E"></button>
            <button class="color-preset" style="background: #F97316" data-color="#F97316"></button>
            <button class="color-preset" style="background: #EF4444" data-color="#EF4444"></button>
            <button class="color-preset" style="background: #FFFFFF" data-color="#FFFFFF"></button>
          </div>
        </div>

        <div class="tool-group">
          <span class="tool-group-label">大小: <span id="size-value">5</span>px</span>
          <input type="range" id="brush-size" min="1" max="50" value="5">
        </div>
      </div>

      <!-- 畫布區 -->
      <div class="canvas-container">
        <canvas id="drawing-canvas"></canvas>
      </div>

      <!-- 操作列 -->
      <div class="canvas-actions">
        <div class="action-group">
          <button class="btn btn-outline-cyan btn-sm" id="btn-undo" title="撤銷 (Ctrl+Z)">
            ↩️ 撤銷
          </button>
          <button class="btn btn-outline-cyan btn-sm" id="btn-redo" title="重做 (Ctrl+Y)">
            ↪️ 重做
          </button>
          <button class="btn btn-outline-cyan btn-sm" id="btn-clear" title="清除">
            🗑️ 清除
          </button>
        </div>

        <div class="action-group">
          <button class="btn btn-solid-cyan btn-sm" id="btn-export-png">
            💾 匯出 PNG
          </button>
          <button class="btn btn-outline-cyan btn-sm" id="btn-export-jpg">
            📷 匯出 JPG
          </button>
          <button class="btn btn-outline-cyan btn-sm" id="btn-copy">
            📋 複製
          </button>
        </div>
      </div>

      <!-- 快捷鍵提示 -->
      <div class="shortcut-hints">
        <span>⌨️ 快捷鍵:</span>
        <span class="hint">Ctrl+Z 撤銷</span>
        <span class="hint">Ctrl+Y 重做</span>
        <span class="hint">1-8 切換工具</span>
        <span class="hint">[ ] 調整大小</span>
      </div>
    </div>
  `;
}

// ============================================
// 初始化
// ============================================
let canvasDrawingTool = null;

function initCanvasDrawingShowcase() {
  const container = document.getElementById('canvas-drawing-tab');
  if (!container) {
    console.warn('找不到 canvas-drawing-tab 容器');
    return;
  }

  // 渲染 UI
  renderCanvasDrawingShowcase(container);

  // 初始化繪圖工具
  canvasDrawingTool = new CanvasDrawingTool('drawing-canvas');

  // 工具按鈕事件
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      canvasDrawingTool.setTool(btn.dataset.tool);
    });
  });

  // 顏色選擇
  document.getElementById('brush-color')?.addEventListener('input', (e) => {
    canvasDrawingTool.setBrushColor(e.target.value);
  });

  // 顏色預設
  document.querySelectorAll('.color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      canvasDrawingTool.setBrushColor(color);
      document.getElementById('brush-color').value = color;
    });
  });

  // 大小調整
  document.getElementById('brush-size')?.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    canvasDrawingTool.setBrushSize(size);
    document.getElementById('size-value').textContent = size;
  });

  // 操作按鈕
  document.getElementById('btn-undo')?.addEventListener('click', () => {
    canvasDrawingTool.undo();
  });

  document.getElementById('btn-redo')?.addEventListener('click', () => {
    canvasDrawingTool.redo();
  });

  document.getElementById('btn-clear')?.addEventListener('click', () => {
    canvasDrawingTool.clearCanvas();
    canvasDrawingTool.saveState();
  });

  document.getElementById('btn-export-png')?.addEventListener('click', () => {
    canvasDrawingTool.exportPNG();
  });

  document.getElementById('btn-export-jpg')?.addEventListener('click', () => {
    canvasDrawingTool.exportJPG();
  });

  document.getElementById('btn-copy')?.addEventListener('click', async () => {
    const success = await canvasDrawingTool.copyToClipboard();
    if (success && typeof Toast !== 'undefined') {
      Toast.success('已複製到剪貼簿');
    }
  });

  // 鍵盤快捷鍵
  document.addEventListener('keydown', (e) => {
    // 只在 canvas 頁面處理
    if (!document.getElementById('canvas-drawing-tab')?.classList.contains('active')) return;

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        e.preventDefault();
        canvasDrawingTool.undo();
      } else if (e.key === 'y') {
        e.preventDefault();
        canvasDrawingTool.redo();
      }
    }

    // 數字鍵切換工具
    const toolKeys = { '1': 'pen', '2': 'pencil', '3': 'brush', '4': 'eraser',
                       '5': 'line', '6': 'rect', '7': 'circle', '8': 'fill' };
    if (toolKeys[e.key]) {
      document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === toolKeys[e.key]);
      });
      canvasDrawingTool.setTool(toolKeys[e.key]);
    }

    // [ ] 調整大小
    if (e.key === '[') {
      const sizeInput = document.getElementById('brush-size');
      const newSize = Math.max(1, parseInt(sizeInput.value) - 5);
      sizeInput.value = newSize;
      canvasDrawingTool.setBrushSize(newSize);
      document.getElementById('size-value').textContent = newSize;
    } else if (e.key === ']') {
      const sizeInput = document.getElementById('brush-size');
      const newSize = Math.min(50, parseInt(sizeInput.value) + 5);
      sizeInput.value = newSize;
      canvasDrawingTool.setBrushSize(newSize);
      document.getElementById('size-value').textContent = newSize;
    }
  });

  console.log('✅ Canvas 繪圖工具初始化完成');
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CanvasDrawingTool, initCanvasDrawingShowcase };
}
