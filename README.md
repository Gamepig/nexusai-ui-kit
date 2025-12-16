# NexusAI UI Kit - 深色科技主題設計系統

**建置日期**: 2025-12-16
**狀態**: ✅ 完整功能
**版本**: v3.0
**GitHub**: [nexusai-ui-kit](https://github.com/Gamepig/nexusai-ui-kit)

---

## 📋 專案概述

企業級深色科技主題完整 UI Kit，展示現代化的設計系統、響應式佈局和實用 JavaScript 功能。包含完整的應用頁面集合，適用於 AI 平台、SaaS 管理、數據分析、項目管理等現代 Web 應用。

**特色**: 純 HTML + CSS + JavaScript，無框架依賴，開箱即用。

---

## 🎯 核心特色

### 設計系統
- 🎨 **OKLCH 顏色系統**: 使用 OKLCH 格式，更科學精確的顏色管理
- 🌈 **完整色彩系統**: 中性色（帶自然色調）、品牌色、語意色彩
- 📐 **三陰影法則**: 小、中、大三種陰影強度創造視覺層次
- 🏗️ **四層結構**: 基礎背景、稍淺背景、卡片容器、互動元素的層級系統
- ✨ **光照效果**: 頂部淺色邊框和底部深色邊框創造深度感
- 📱 **響應式設計**: Mobile (< 640px) / Tablet (640-1023px) / Desktop (≥ 1024px) / Large Desktop (≥ 1280px)
- 🌓 **明暗主題**: 支援 Light/Dark 主題切換，兩種模式都使用 OKLCH 格式

### 元件庫
- 🧩 **60+ UI 元件**: 按鈕、卡片、表單、表格、Modal、Dropdown、Tabs、Alert 等
- 🎯 **完整變體支援**: Solid、Outline、Pill、Ghost、Size (xs/sm/md/lg) 等
- 📊 **響應式網格**: 卡片自動適應畫面寬度（手機1欄、平板2欄、桌面3-4欄）
- ⚡ **高效能**: 純 HTML + CSS（無框架依賴）

### JavaScript 功能展示
- 🛠️ **DOM 工具**: 元素操作、類名管理
- 📡 **事件系統**: 監聽、防抖、節流
- 💾 **存儲管理**: localStorage/sessionStorage 封裝
- 🔄 **API 工具**: Fetch 包裝、HTTP 方法
- 📢 **通知系統**: Toast / Alert
- 🎪 **Modal 系統**: 模態框管理
- 🧲 **Form 工具**: 驗證、數據操作
- 📜 **Scroll 工具**: 平滑滾動、視口檢測
- 🎬 **動畫工具**: Fade、Slide 效果

---

## 📁 專案結構

```
nexusai-ui-kit/
├── index.html                  # 首頁 (Landing Page)
├── offline.html                # 離線頁 (PWA)
├── test-animations.html        # 動畫測試
├── manifest.json               # PWA Manifest
├── sw.js                       # Service Worker
├── README.md                   # 本檔案
│
├── 📄 pages/ (16 個頁面)
│   ├── dashboard.html          # 儀表板
│   ├── js-showcase.html        # JavaScript 功能展示 ⭐
│   ├── projects.html           # 項目列表
│   ├── project-detail.html     # 項目詳情
│   ├── calendar.html           # 日曆
│   ├── kanban.html             # 看板
│   ├── data-table.html         # 數據表格
│   ├── notifications.html      # 通知中心
│   ├── profile.html            # 用戶資料
│   ├── settings-general.html   # 設置 - 一般
│   ├── settings-security.html  # 設置 - 安全
│   ├── settings-billing.html   # 設置 - 計費
│   ├── pricing.html            # 定價頁
│   ├── about.html              # 關於頁
│   ├── contact.html            # 聯繫頁
│   └── readme-viewer.html      # 文檔查看器
│
├── 🎨 css/ (16 個 CSS)
│   ├── design-tokens.css       # 設計變數
│   ├── components.css          # 元件樣式
│   ├── layout.css              # 全域佈局
│   ├── responsive.css          # 響應式樣式
│   ├── theme-light.css         # 淺色主題
│   ├── animations-showcase.css # 動畫演示
│   ├── animations-extended.css # 擴展動畫
│   ├── web-api-showcase.css    # Web API 演示
│   ├── interactions-showcase.css # 互動功能
│   ├── es-features-showcase.css  # ES 特性
│   ├── charts-showcase.css     # 圖表樣式
│   ├── canvas-drawing.css      # Canvas 繪圖
│   ├── worker-showcase.css     # Worker 演示
│   ├── pwa-showcase.css        # PWA 演示
│   ├── websocket-showcase.css  # WebSocket 演示
│   └── webgl-showcase.css      # WebGL 演示
│
├── 📦 js/ (18 個 JS)
│   ├── main.js                 # 主 JavaScript
│   ├── sidebar.js              # 側邊欄功能
│   ├── theme-toggle.js         # 主題切換
│   ├── animations.js           # 動畫演示
│   ├── animations-extended.js  # 擴展動畫
│   ├── web-api.js              # Web API 核心
│   ├── web-api-showcase.js     # Web API UI
│   ├── interactions.js         # 互動功能
│   ├── es-features.js          # ES2024+ 特性
│   ├── charts.js               # Chart.js 圖表
│   ├── canvas-drawing.js       # Canvas 繪圖
│   ├── worker-showcase.js      # Worker 演示
│   ├── pwa-showcase.js         # PWA 功能
│   ├── websocket-showcase.js   # WebSocket 演示
│   ├── webgl-showcase.js       # WebGL 3D
│   └── workers/                # Web Workers
│       ├── prime-worker.js
│       └── sort-worker.js
│
├── 🖼️ image/                   # 圖片資源
├── 📊 data/                    # 模擬數據
│   ├── mock-api.json
│   └── mock-data.json
│
├── 📋 planning/                # 規劃文檔
│
└── 📄 docs/                    # 報告文檔
    └── RWD_ANALYSIS_REPORT.md  # RWD 分析報告
```

---

## 🚀 快速開始

### 1. Clone 專案

```bash
git clone https://github.com/Gamepig/nexusai-ui-kit.git
cd nexusai-ui-kit
```

### 2. 啟動本地伺服器

```bash
# 方式1: VS Code Live Server
# 安裝 "Live Server" 擴充 → 右鍵 index.html → Open with Live Server

# 方式2: Python HTTP Server
python -m http.server 8000
# 訪問 http://localhost:8000

# 方式3: Node.js
npx serve .
```

### 3. 頁面導覽

| 頁面 | URL | 描述 |
|------|-----|------|
| **Landing** | `/index.html` | 首頁、特色、CTA |
| **Dashboard** | `/pages/dashboard.html` | KPI、表格、圖表 |
| **JS 展示** | `/pages/js-showcase.html` | 所有 JS 功能演示 ⭐ |
| **Projects** | `/pages/projects.html` | 項目列表 |
| **Calendar** | `/pages/calendar.html` | 日曆管理 |
| **Kanban** | `/pages/kanban.html` | 看板視圖 |
| **Data Table** | `/pages/data-table.html` | 數據表格 |
| **Settings** | `/pages/settings-*.html` | 設置頁面 |
| **Pricing** | `/pages/pricing.html` | 定價方案 |

---

## 🎬 功能展示

### JavaScript 功能展示頁 (`pages/js-showcase.html`)

統整所有 JavaScript 功能演示於單一頁面：

#### 1️⃣ 動畫效果 (Animation)
- **Anime.js**: 進度條、計數、列表入場、Hover 效果
- **GSAP**: 3D 翻轉、時間軸、文字動畫、組合動畫
- **Canvas**: 粒子系統、波形、網格背景
- **Lottie**: JSON 動畫播放
- **Mo.js**: 形狀爆發動畫

#### 2️⃣ Web API 實踐
- **Fetch API**: 模擬 API 調用、進度條
- **Web Storage**: LocalStorage/SessionStorage 管理
- **Geolocation**: 位置請求、距離計算
- **Notification**: 系統通知
- **Canvas API**: 繪圖工具、圖表生成
- **Observer API**: Intersection/Resize 監測

#### 3️⃣ 互動功能
- **拖拽排序**: Drag & Drop API
- **搜尋增強**: Debounce + Autocomplete
- **表格互動**: 排序、選擇
- **表單驗證**: 實時反饋
- **鍵盤快捷鍵**: Ctrl+K 搜尋、Esc 關閉

#### 4️⃣ ES2024+ 特性
- **Object.groupBy**: 數據分組
- **Promise.withResolvers**: 手動控制 Promise
- **Temporal API**: 日期時間操作 (模擬)
- **可選鏈 & 空值合併**: `?.` 和 `??`
- **Class 私有字段**: `#` 私有成員

#### 5️⃣ 圖表 (Chart.js)
- 折線圖、柱狀圖、圓餅圖、雷達圖
- 即時數據更新
- 響應式配置

#### 6️⃣ Web Workers
- 質數計算 Worker
- 排序演算法 Worker
- 主線程/Worker 性能對比

#### 7️⃣ PWA 功能
- Service Worker 狀態
- 離線緩存管理
- 安裝提示

#### 8️⃣ WebSocket 演示
- 模擬連線
- 訊息收發
- 連線狀態監控

#### 9️⃣ WebGL 3D
- Three.js 3D 場景
- 幾何體演示
- 相機控制

---

## 🎨 設計系統參考

### 色彩系統（OKLCH 格式）

本專案採用 OKLCH 顏色格式，提供更科學和精確的顏色管理：

```css
/* 中性色調色板（Hue 250，加入 2-3% 藍色色調） */
--neutral-50: oklch(98% 0.002 250);  /* 最淺 */
--neutral-500: oklch(50% 0.002 250); /* 中間值 */
--neutral-900: oklch(10% 0.002 250); /* 最深 */

/* 四層背景結構 */
--bg-level-1: oklch(15% 0.002 250);  /* 基礎背景 */
--bg-level-2: oklch(20% 0.002 250); /* 稍淺背景 */
--bg-level-3: oklch(25% 0.002 250); /* 卡片容器 */
--bg-level-4: oklch(30% 0.002 250); /* 互動元素 */

/* 品牌色（OKLCH 格式） */
--color-cyan: oklch(60% 0.35 220);   /* 系統、連結（Hue 220） */
--color-green: oklch(60% 0.2 145);   /* 成功、確認（Hue 145） */
--color-purple: oklch(55% 0.3 280);  /* 次要、進階（Hue 280） */
--color-orange: oklch(65% 0.2 70);   /* 警告（Hue 70） */
--color-red: oklch(55% 0.25 25);     /* 錯誤、危險（Hue 25） */

/* 語意色彩 */
--color-success: oklch(60% 0.2 145);
--color-warning: oklch(70% 0.2 70);
--color-error: oklch(55% 0.25 25);
--color-info: oklch(60% 0.2 220);
```

### 陰影系統（三陰影法則）

```css
/* 小陰影 - 輕微的凸起效果、按鈕懸停狀態 */
--shadow-sm: 0 1px 2px 0 oklch(0% 0 0 / 0.05);

/* 中等陰影 - 卡片容器、下拉選單、模態框 */
--shadow-md: 
  0 4px 6px -1px oklch(0% 0 0 / 0.1),
  0 2px 4px -2px oklch(0% 0 0 / 0.1);

/* 大陰影 - 浮動操作按鈕、重要的模態框、頂層元素 */
--shadow-lg: 
  0 10px 15px -3px oklch(0% 0 0 / 0.1),
  0 4px 6px -4px oklch(0% 0 0 / 0.1);
```

### 光照效果

卡片元件使用光照效果創造深度感：

```css
.card {
  background: var(--bg-level-3);
  border-top: 1px solid oklch(30% 0.002 250);    /* 淺色邊框 - 光照 */
  border-bottom: 1px solid oklch(10% 0.002 250); /* 深色邊框 - 陰影 */
  box-shadow: var(--shadow-md);
}
```

### 間距系統

```css
--spacing-1:   4px
--spacing-2:   8px
--spacing-3:   12px
--spacing-4:   16px
--spacing-6:   24px
--spacing-8:   32px
```

### 響應式斷點

```css
/* 手機 */
@media (max-width: 639px) {
  /* 1 欄布局 */
}

/* 平板 */
@media (min-width: 640px) {
  /* 2 欄布局 */
}

/* 小桌面 */
@media (min-width: 1024px) {
  /* 3 欄布局 */
}

/* 大桌面 */
@media (min-width: 1280px) {
  /* 4 欄布局 */
}
```

### 響應式網格系統

卡片網格會根據畫面寬度自動調整：
- **手機** (< 640px): 1 欄
- **平板** (640px - 1023px): 2 欄
- **小桌面** (1024px - 1279px): 3 欄
- **大桌面** (≥ 1280px): 4 欄

---

## 💻 JavaScript API 參考

### Toast 通知

```javascript
Toast.success('操作成功！');
Toast.error('發生錯誤');
Toast.warning('請注意');
Toast.info('提示訊息');
```

### 存儲管理

```javascript
Storage.set('key', value);
Storage.get('key');
Storage.remove('key');
```

### 事件工具

```javascript
Events.on(element, 'click', handler);
Events.debounce(func, 300);
Events.throttle(func, 300);
```

### 表單工具

```javascript
Form.validateEmail(email);
Form.getFormData('#form');
Form.clearForm('#form');
```

---

## 📱 PWA 支援

本專案支援 Progressive Web App：

- ✅ Service Worker 離線緩存
- ✅ Manifest 應用配置
- ✅ 離線頁面 (`offline.html`)
- ✅ 安裝到桌面

---

## 🔧 技術棧

| 類別 | 技術 |
|------|------|
| **核心** | HTML5, CSS3, ES6+ |
| **動畫** | Anime.js, GSAP, Lottie, Mo.js |
| **圖表** | Chart.js |
| **3D** | Three.js (WebGL) |
| **圖示** | Lucide Icons |
| **PWA** | Service Worker, Web Manifest |

---

## 📄 授權

MIT License

---

## 📞 聯繫

- **GitHub**: [Gamepig/nexusai-ui-kit](https://github.com/Gamepig/nexusai-ui-kit)

---

## 🆕 v3.0 更新內容

### 設計系統升級
- ✅ **OKLCH 顏色系統**: 全面採用 OKLCH 格式，取代 HEX/RGB
- ✅ **三陰影法則**: 重構陰影系統，使用 OKLCH 格式的三種強度
- ✅ **四層結構**: 建立完整的背景層級系統
- ✅ **光照效果**: 卡片元件應用頂部光照和底部陰影效果
- ✅ **響應式網格**: 卡片網格自動適應畫面寬度（1-4欄）

### 技術改進
- ✅ 中性色加入 2-3% 藍色色調，更自然
- ✅ 所有顏色使用 OKLCH 格式，更科學精確
- ✅ 深色和淺色主題都使用 OKLCH 格式
- ✅ 響應式斷點優化，更好的移動端體驗

---

**版本**: v3.0  
**最後更新**: 2025-12-16  
**頁面數**: 19  
**CSS 檔案**: 17  
**JS 模組**: 18
