/**
 * Theme Toggle - NexusAI Demo Site
 * 主題切換功能
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'nexusai-theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';

  /**
   * 取得儲存的主題偏好
   */
  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  /**
   * 儲存主題偏好
   */
  function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  /**
   * 取得系統偏好主題
   */
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return LIGHT_THEME;
    }
    return DARK_THEME;
  }

  /**
   * 套用主題
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleButton(theme);
  }

  /**
   * 更新切換按鈕圖示
   */
  function updateToggleButton(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;

    const nextLabel = theme === LIGHT_THEME ? '切換至深色主題' : '切換至淺色主題';
    const nextIcon = theme === LIGHT_THEME ? 'moon' : 'sun';

    btn.setAttribute('title', nextLabel);
    btn.setAttribute('aria-label', nextLabel);

    // Lucide 會把 <i> 轉成 <svg>，因此用重建內容的方式確保每次都能更新圖示
    btn.innerHTML = `<i data-lucide="${nextIcon}"></i>`;

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  /**
   * 切換主題
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || DARK_THEME;
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

    applyTheme(newTheme);
    saveTheme(newTheme);
  }

  /**
   * 初始化
   */
  function init() {
    // 決定初始主題：儲存的偏好 > 系統偏好 > 預設深色
    const savedTheme = getSavedTheme();
    const initialTheme = savedTheme || getSystemTheme();

    applyTheme(initialTheme);

    // 綁定切換按鈕事件
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }

    // 監聽系統主題變化（僅在未手動設定時）
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
        if (!getSavedTheme()) {
          applyTheme(e.matches ? LIGHT_THEME : DARK_THEME);
        }
      });
    }
  }

  // DOM 載入完成後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 匯出給全域使用
  window.NexusTheme = {
    toggle: toggleTheme,
    set: function(theme) {
      applyTheme(theme);
      saveTheme(theme);
    },
    get: function() {
      return document.documentElement.getAttribute('data-theme') || DARK_THEME;
    }
  };
})();
