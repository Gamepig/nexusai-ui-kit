/**
 * 共用側邊欄元件
 * 統一管理所有頁面的側邊欄
 */

const SidebarConfig = {
  // 主選單項目
  mainMenu: [
    { href: 'dashboard.html', icon: 'layout-dashboard', label: '儀表板' },
    { href: 'js-showcase.html', icon: 'code-2', label: 'JS 功能展示' },
    { href: 'projects.html', icon: 'folder', label: '專案' },
    { href: 'data-table.html', icon: 'table', label: '資料管理' },
    { href: 'kanban.html', icon: 'trello', label: '任務看板' },
    { href: 'calendar.html', icon: 'calendar', label: '行事曆' },
    { href: 'notifications.html', icon: 'bell', label: '通知' }
  ],

  // 開發者工具（僅在 js-showcase 顯示）
  devTools: [
    { tab: 'animations', icon: 'sparkles', label: '動畫效果' },
    { tab: 'web-apis', icon: 'globe', label: 'Web API' },
    { tab: 'interactions', icon: 'mouse-pointer-click', label: '互動功能' },
    { tab: 'es-features', icon: 'code-2', label: 'ES 特性' },
    { tab: 'charts', icon: 'bar-chart-3', label: '數據可視化' },
    { tab: 'animations-extended', icon: 'film', label: '擴展動畫' },
    { tab: 'canvas-drawing', icon: 'palette', label: '繪圖工具' },
    { tab: 'worker', icon: 'cpu', label: '多線程' },
    { tab: 'pwa', icon: 'smartphone', label: 'PWA' },
    { tab: 'websocket', icon: 'plug', label: 'WebSocket' },
    { tab: 'webgl', icon: 'box', label: '3D 效果' }
  ],

  // 底部選單
  bottomMenu: [
    { href: 'profile.html', icon: 'user', label: '個人資料' },
    { href: 'settings-general.html', icon: 'settings', label: '設定' },
    { href: '../index.html', icon: 'home', label: '回首頁' }
  ]
};

/**
 * 取得當前頁面名稱
 */
function getCurrentPage() {
  // 支援 file:// 和 http:// 協議
  const href = window.location.href;
  const filename = href.split('/').pop().split('?')[0].split('#')[0] || 'index.html';
  console.log('📄 當前頁面:', filename);
  return filename;
}

/**
 * 生成選單項目 HTML
 */
function renderMenuItem(item, isActive = false) {
  const activeClass = isActive ? ' active' : '';
  return `
    <a href="${item.href}" class="sidebar-item${activeClass}">
      <i data-lucide="${item.icon}"></i>
      <span>${item.label}</span>
    </a>
  `;
}

/**
 * 生成開發者工具按鈕 HTML
 */
function renderDevToolButton(item) {
  return `
    <button class="sidebar-item" onclick="sidebarSwitchTab('${item.tab}')"
            style="border: none; background: transparent; width: 100%; text-align: left; cursor: pointer;">
      <i data-lucide="${item.icon}"></i>
      <span>${item.label}</span>
    </button>
  `;
}

/**
 * 側邊欄專用的 tab 切換函數
 */
function sidebarSwitchTab(tabName) {
  // 優先使用頁面定義的 scrollToShowcase
  if (typeof scrollToShowcase === 'function') {
    scrollToShowcase(tabName);
    return;
  }

  // 備用：直接切換 tab
  const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
  if (tabButton) {
    tabButton.click();
    // 滾動到 tabs
    setTimeout(() => {
      const tabsContainer = document.querySelector('.tabs-container');
      if (tabsContainer) {
        tabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

/**
 * 渲染側邊欄
 */
function renderSidebar(containerId = 'sidebar-container', options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('找不到側邊欄容器:', containerId);
    return;
  }

  const currentPage = getCurrentPage();
  const showDevTools = options.showDevTools !== false && currentPage === 'js-showcase.html';

  let html = '<nav class="sidebar-nav">';

  // 主選單
  SidebarConfig.mainMenu.forEach(item => {
    const isActive = currentPage === item.href;
    html += renderMenuItem(item, isActive);
  });

  // 開發者工具區塊
  if (showDevTools) {
    html += `
      <div class="sidebar-divider"></div>
      <div class="sidebar-section-title">開發者工具</div>
    `;
    SidebarConfig.devTools.forEach(item => {
      html += renderDevToolButton(item);
    });
  }

  // 分隔線
  html += '<div class="sidebar-divider"></div>';

  // 底部選單
  SidebarConfig.bottomMenu.forEach(item => {
    const isActive = currentPage === item.href;
    html += renderMenuItem(item, isActive);
  });

  html += '</nav>';

  container.innerHTML = html;

  // 重新初始化 Lucide 圖示（延遲執行確保 DOM 更新完成）
  setTimeout(() => {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
      console.log('✅ 側邊欄圖示已初始化');
    }
  }, 0);

  console.log('✅ 側邊欄已載入');
}

/**
 * 切換到指定 tab（供開發者工具使用）
 */
function switchToTab(tabName) {
  // 先滾動到 showcase 區域
  const tabsContainer = document.querySelector('.tabs-container');
  if (tabsContainer) {
    tabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // 觸發 tab 切換
  setTimeout(() => {
    const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (tabButton) {
      tabButton.click();
    }
  }, 300);
}

/**
 * 初始化側邊欄
 */
function initSidebar(options = {}) {
  // 如果頁面有 sidebar-container，自動渲染
  const container = document.getElementById('sidebar-container');
  if (container) {
    renderSidebar('sidebar-container', options);
  }
}

// 立即執行初始化（因為 script 在 body 末端載入，DOM 已就緒）
(function() {
  // 檢查 DOM 是否已就緒
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebar);
  } else {
    // DOM 已就緒，立即執行
    initSidebar();
  }
})();

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SidebarConfig, renderSidebar, initSidebar, sidebarSwitchTab };
}
