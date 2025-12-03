# RWD 響應式設計分析報告

## 專案：demo-site
**分析日期**：2025-12-04
**分析工具**：Claude Code + rwd-design Skill
**嚴重程度分級**：🔴 Critical | 🟠 Major | 🟡 Minor | 🟢 Info

---

## 一、問題總覽

| 嚴重度 | 問題數 | 主要影響 |
|-------|-------|---------|
| 🔴 Critical | 5 | 手機版完全無法使用 |
| 🟠 Major | 6 | 佈局偏離嚴重 |
| 🟡 Minor | 4 | 體驗欠佳 |

---

## 二、Critical 問題（必須立即修復）

### 🔴 C1: 使用 Desktop-First 而非 Mobile-First

**檔案**：`css/responsive.css`
**行數**：整個檔案

**問題描述**：
整個 responsive.css 使用 `max-width` 查詢（Desktop-First），違反 2025 RWD 最佳實踐。Mobile-First 是業界標準，因為超過 60% 的網頁流量來自手機。

**目前寫法**：
```css
/* ❌ Desktop-First */
@media (max-width: 767px) {
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: 1fr;
  }
}
```

**建議修改**：
```css
/* ✅ Mobile-First */
.grid-2, .grid-3, .grid-4 {
  grid-template-columns: 1fr; /* 手機預設 */
}

@media (min-width: 768px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
}
```

---

### 🔴 C2: 固定 px 值導致手機版佈局破裂

**檔案**：
- `css/layout.css:507-511`
- `dashboard.html:19-32`（內嵌樣式）

**問題描述**：
page-layout 使用固定 240px sidebar 寬度，dashboard 頁面使用固定 280px margin-left。在手機（320px-480px）上，內容被擠壓到只有 40-200px 寬度，完全無法閱讀。

**目前寫法**：
```css
/* css/layout.css */
.page-layout {
  grid-template-columns: 240px 1fr;  /* ❌ 固定 240px */
  margin-top: 80px;  /* ❌ 固定 80px */
}

/* dashboard.html 內嵌樣式 */
.dashboard-header {
  margin-left: 280px;  /* ❌ 固定值，手機上內容被擠壓 */
}
.dashboard-layout {
  margin-left: 280px;  /* ❌ 固定值 */
}
```

**建議修改**：
```css
/* Mobile-First 重構 */
.page-layout {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 64px;
}

.dashboard-header,
.dashboard-layout {
  margin-left: 0;
  padding: var(--spacing-4);
}

@media (min-width: 1024px) {
  .page-layout {
    grid-template-columns: 240px 1fr;
    margin-top: 80px;
  }

  .dashboard-header,
  .dashboard-layout {
    margin-left: 240px;
    padding: var(--spacing-8);
  }
}
```

---

### 🔴 C3: Hero 標題使用固定 4rem

**檔案**：`index.html:63-71`（內嵌 style）

**問題描述**：
Hero 區塊標題使用固定 4rem (64px)，在 320px 手機上會溢出容器或產生不自然的換行。

**目前寫法**：
```css
.hero h1 {
  font-size: 4rem;  /* ❌ 固定 64px，手機上過大 */
}
```

**建議修改**（使用 CSS clamp）：
```css
.hero h1 {
  font-size: clamp(1.75rem, 1rem + 5vw, 4rem);
  /* 最小 28px → 最大 64px，流暢縮放 */
}

.hero p {
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
}
```

---

### 🔴 C4: KPI 卡片網格固定 4 欄

**檔案**：`dashboard.html:35-38`（內嵌樣式）

**問題描述**：
KPI 卡片永遠使用 4 欄網格，在手機上會擠成無法閱讀的小塊。

**目前寫法**：
```css
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* ❌ 永遠 4 欄 */
  gap: var(--spacing-6);
}
```

**建議修改**：
```css
.kpi-cards {
  display: grid;
  grid-template-columns: 1fr;  /* 手機：1 欄 */
  gap: var(--spacing-4);
}

@media (min-width: 480px) {
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);  /* 大手機：2 欄 */
  }
}

@media (min-width: 1024px) {
  .kpi-cards {
    grid-template-columns: repeat(4, 1fr);  /* 桌機：4 欄 */
    gap: var(--spacing-6);
  }
}
```

---

### 🔴 C5: Sidebar 手機版互動問題

**檔案**：
- `css/responsive.css:56-70`
- `js/sidebar.js`

**問題描述**：
1. Sidebar 有 `left: -240px` 的隱藏邏輯，但缺少 overlay 遮罩
2. 無 ESC 鍵關閉功能
3. 無焦點捕獲（focus trap）
4. 手機版 hamburger menu 可見但點擊後 sidebar 與內容重疊

**建議補充 CSS**：
```css
/* 加入 overlay 遮罩 */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  z-index: 998;
  transition: opacity 0.3s, visibility 0.3s;
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* 防止 body 滾動 */
body.sidebar-open {
  overflow: hidden;
}
```

**建議補充 JS**：
```javascript
// ESC 關閉
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('active')) {
    closeSidebar();
  }
});

// 點擊 overlay 關閉
overlay.addEventListener('click', closeSidebar);
```

---

## 三、Major 問題（嚴重影響體驗）

### 🟠 M1: 字型系統缺乏流體縮放

**檔案**：`css/design-tokens.css:269-279`

**問題描述**：
所有字型大小使用固定 px 值，無法根據螢幕尺寸流暢調整。

**目前寫法**：
```css
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 30px;
--font-size-4xl: 36px;
--font-size-5xl: 48px;
--font-size-6xl: 60px;
```

**建議修改**：
```css
--font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
--font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--font-size-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
--font-size-xl: clamp(1.25rem, 1rem + 1.25vw, 1.5rem);
--font-size-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
--font-size-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);
--font-size-4xl: clamp(2.25rem, 1.5rem + 3.75vw, 3rem);
--font-size-5xl: clamp(2.5rem, 1.5rem + 5vw, 4rem);
--font-size-6xl: clamp(3rem, 2rem + 5vw, 5rem);
```

---

### 🟠 M2: 間距系統固定 px

**檔案**：`css/design-tokens.css:229-241`

**問題描述**：
間距值在小螢幕上可能過大，造成可用空間不足。

**目前寫法**：
```css
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-20: 80px;
--spacing-24: 96px;
```

**建議修改**（新增流體間距變數）：
```css
/* 保留原有固定值，新增流體版本 */
--space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
--space-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
--space-lg: clamp(1.5rem, 1rem + 2.5vw, 2.5rem);
--space-xl: clamp(2rem, 1.5rem + 2.5vw, 4rem);
--space-2xl: clamp(3rem, 2rem + 5vw, 6rem);
```

---

### 🟠 M3: Dashboard 內容區固定 2:1 分割

**檔案**：`dashboard.html:121-125`（內嵌樣式）

**問題描述**：
主內容與側邊欄永遠使用 2:1 比例，手機上無法正常顯示。

**目前寫法**：
```css
.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;  /* ❌ 固定比例 */
  gap: var(--spacing-8);
}
```

**建議修改**：
```css
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}

@media (min-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-8);
  }
}
```

---

### 🟠 M4: 按鈕在手機版強制 100% 寬度

**檔案**：`css/responsive.css:99-101`

**問題描述**：
所有按鈕在手機版都變成全寬，這會破壞 hero-buttons 等需要並排按鈕的設計。

**目前寫法**：
```css
@media (max-width: 767px) {
  .btn {
    width: 100%;  /* ❌ 所有按鈕都變全寬 */
  }
}
```

**建議修改**：
```css
/* 移除通用規則，改為針對特定場景 */
@media (max-width: 767px) {
  .form-actions .btn,
  .modal-footer .btn {
    width: 100%;
  }

  /* Hero 按鈕保持自然寬度，但允許換行 */
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .hero-buttons .btn {
    width: auto;
    min-width: 200px;
  }
}
```

---

### 🟠 M5: Footer 網格缺乏 Mobile-First 設計

**檔案**：`css/layout.css:553-558`

**問題描述**：
Footer 預設 3 欄，依賴 responsive.css 覆蓋為 1 欄。違反 Mobile-First 原則。

**目前寫法**：
```css
footer .container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* ❌ 預設 3 欄 */
}
```

**建議修改**：
```css
footer .container {
  display: grid;
  grid-template-columns: 1fr;  /* 手機：1 欄 */
  gap: var(--spacing-6);
}

@media (min-width: 480px) {
  footer .container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  footer .container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

### 🟠 M6: 導航連結文字在平板過小

**檔案**：`css/responsive.css:188-189`

**問題描述**：
平板版導航按鈕字型縮小到 14px，可能影響可讀性和觸控體驗。

**目前寫法**：
```css
@media (min-width: 768px) and (max-width: 1279px) {
  .nav-actions .btn {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--font-size-sm);  /* 14px */
  }
}
```

**建議修改**：
```css
@media (min-width: 768px) and (max-width: 1279px) {
  .nav-actions .btn {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: var(--font-size-base);  /* 保持 16px */
  }
}
```

---

## 四、Minor 問題（建議優化）

### 🟡 m1: 缺少 Container Queries

**建議**：
對卡片組件使用 CSS Container Queries，使其在不同寬度容器中自適應，實現真正的組件級響應式設計。

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

**瀏覽器支援**：Chrome 105+, Firefox 110+, Safari 16+

---

### 🟡 m2: 無觸控目標最小尺寸保證

**問題描述**：
部分按鈕和連結可能小於 44x44px，不符合 WCAG 觸控目標建議。

**建議新增**：
```css
/* 確保所有可互動元素符合觸控目標 */
button,
a,
input,
select,
textarea {
  min-height: 44px;
}

/* 小型元素外圍增加觸控區域 */
.icon-btn {
  position: relative;
}

.icon-btn::before {
  content: '';
  position: absolute;
  inset: -8px;
}
```

---

### 🟡 m3: 動畫未完整處理 prefers-reduced-motion

**檔案**：`css/responsive.css:368-373`

**問題描述**：
responsive.css 有處理 reduced-motion，但 components.css 中定義的動畫（如 gradientShift、pulse-glow）未受影響。

**建議修改**：
將 reduced-motion 處理移至 design-tokens.css 或 components.css 頂部：

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### 🟡 m4: 圖片未使用 srcset

**檔案**：`index.html`

**問題描述**：
背景圖片使用 JS 隨機選擇，未提供多尺寸版本，可能在手機上載入過大的圖片。

**建議**：
1. 為每張圖片準備多種尺寸（400w, 800w, 1200w, 1600w）
2. 使用 `<picture>` 元素或 CSS `image-set()`

```css
.hero {
  background-image: image-set(
    url('image/hero-mobile.webp') 1x,
    url('image/hero-desktop.webp') 2x
  );
}

@media (min-width: 768px) {
  .hero {
    background-image: url('image/hero-desktop.jpg');
  }
}
```

---

## 五、修復優先順序

| 順序 | 問題編號 | 說明 | 影響範圍 | 預估修改量 |
|-----|---------|------|---------|-----------|
| 1 | C2 | 固定 margin-left 導致手機版破裂 | 所有 dashboard 頁面 | 中等 |
| 2 | C4 | KPI 卡片固定 4 欄 | dashboard.html | 小 |
| 3 | C3 | Hero 標題固定 4rem | index.html | 小 |
| 4 | C1 | 整體 Desktop-First 架構 | 全站 | 大（需重構） |
| 5 | C5 | Sidebar 互動問題 | 全站手機版 | 中等 |
| 6 | M1 | 字型固定 px | design-tokens.css | 中等 |
| 7 | M2 | 間距固定 px | design-tokens.css | 小 |
| 8 | M3 | Dashboard 內容區固定比例 | dashboard.html | 小 |
| 9 | M4 | 按鈕強制全寬 | responsive.css | 小 |
| 10 | M5 | Footer 預設 3 欄 | layout.css | 小 |
| 11 | M6 | 平板導航字型過小 | responsive.css | 小 |

---

## 六、需要修改的檔案清單

| 檔案路徑 | 修改類型 | 相關問題 |
|---------|---------|---------|
| `css/responsive.css` | 重構為 Mobile-First | C1, M4 |
| `css/layout.css` | 移除固定 px，改為流體佈局 | C2, M5 |
| `css/design-tokens.css` | 字型/間距改用 clamp() | M1, M2 |
| `index.html` | 內嵌 CSS 改為流體字型 | C3 |
| `dashboard.html` | 內嵌 CSS 加入響應式規則 | C2, C4, M3 |
| `js/sidebar.js` | 加入 overlay 和 ESC 關閉功能 | C5 |
| `css/components.css` | 加入 reduced-motion 處理 | m3 |

---

## 七、測試清單

修復後請在以下裝置/尺寸進行測試：

### 手機
- [ ] iPhone SE (375px)
- [ ] iPhone 14/15 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] Android 常見尺寸 (360px, 412px)

### 平板
- [ ] iPad Mini (768px)
- [ ] iPad (810px)
- [ ] iPad Pro 11" (834px)
- [ ] iPad Pro 12.9" (1024px)

### 桌機
- [ ] 小型筆電 (1280px)
- [ ] 標準桌機 (1440px)
- [ ] 大型螢幕 (1920px+)

### 瀏覽器
- [ ] Chrome (桌機 + 手機)
- [ ] Safari (桌機 + iOS)
- [ ] Firefox
- [ ] Edge

### Lighthouse 指標目標
- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 90
- [ ] CLS < 0.1
- [ ] LCP < 2.5s

---

## 八、參考資源

- [MDN - Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [web.dev - Responsive Design](https://web.dev/learn/design/)
- [CSS clamp() Calculator](https://utopia.fyi/type/calculator/)
- [BrowserStack - Responsive Breakpoints](https://www.browserstack.com/guide/responsive-design-breakpoints)
- [Smashing Magazine - Fluid Typography](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)

---

**報告產生者**：Claude Code + rwd-design Skill
**等待指令進行修復**
