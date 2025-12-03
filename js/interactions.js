/**
 * Interactive Features Demonstration Module
 * Priority 3: Showcasing advanced interaction techniques
 */

// ============================================================================
// 1. DragDropManager - 拖拽排序功能
// ============================================================================
class DragDropManager {
  constructor() {
    this.draggedElement = null;
    this.dragOverElement = null;
    this.sourceList = null;
  }

  init() {
    this.setupDashboardWidgetDrag();
    this.setupTaskCardDrag();
    this.setupTableRowDrag();
  }

  // Dashboard 小部件拖拽
  setupDashboardWidgetDrag() {
    const widgets = document.querySelectorAll('[data-draggable="widget"]');

    widgets.forEach(widget => {
      widget.addEventListener('dragstart', (e) => {
        this.draggedElement = widget;
        widget.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
      });

      widget.addEventListener('dragend', (e) => {
        this.draggedElement = null;
        widget.style.opacity = '1';
      });

      widget.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (e.target !== widget && this.draggedElement) {
          widget.style.borderTop = '3px dashed var(--color-cyan)';
        }
      });

      widget.addEventListener('dragleave', () => {
        widget.style.borderTop = 'none';
      });

      widget.addEventListener('drop', (e) => {
        e.preventDefault();
        widget.style.borderTop = 'none';

        if (this.draggedElement && this.draggedElement !== widget) {
          // 交換位置
          const parent = widget.parentNode;
          const allWidgets = Array.from(parent.querySelectorAll('[data-draggable="widget"]'));
          const draggedIndex = allWidgets.indexOf(this.draggedElement);
          const targetIndex = allWidgets.indexOf(widget);

          if (draggedIndex < targetIndex) {
            widget.parentNode.insertBefore(this.draggedElement, widget.nextSibling);
          } else {
            widget.parentNode.insertBefore(this.draggedElement, widget);
          }
        }
      });
    });
  }

  // 任務卡片拖拽排序
  setupTaskCardDrag() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;

    const taskCards = taskList.querySelectorAll('.task-card');

    taskCards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        this.draggedElement = card;
        this.sourceList = card.parentNode;
        card.style.opacity = '0.6';
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        card.style.opacity = '1';
        this.draggedElement = null;
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (this.draggedElement && this.draggedElement !== card) {
          const rect = card.getBoundingClientRect();
          const middle = rect.top + rect.height / 2;

          if (e.clientY < middle) {
            card.style.marginTop = '30px';
            card.style.borderTop = '2px dashed var(--color-cyan)';
          } else {
            card.style.marginTop = '0';
            card.style.borderBottom = '2px dashed var(--color-cyan)';
          }
        }
      });

      card.addEventListener('dragleave', () => {
        card.style.marginTop = '0';
        card.style.borderTop = 'none';
        card.style.borderBottom = 'none';
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.style.borderTop = 'none';
        card.style.borderBottom = 'none';

        if (this.draggedElement && this.draggedElement !== card) {
          card.parentNode.insertBefore(this.draggedElement, card);
        }
      });
    });
  }

  // 表格行拖拽排序
  setupTableRowDrag() {
    const tableBody = document.querySelector('.data-table tbody');
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
      row.addEventListener('dragstart', (e) => {
        this.draggedElement = row;
        row.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
      });

      row.addEventListener('dragend', () => {
        row.style.opacity = '1';
        this.draggedElement = null;
      });

      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (this.draggedElement && this.draggedElement !== row) {
          row.style.borderTop = '2px solid var(--color-cyan)';
        }
      });

      row.addEventListener('dragleave', () => {
        row.style.borderTop = 'none';
      });

      row.addEventListener('drop', (e) => {
        e.preventDefault();
        row.style.borderTop = 'none';

        if (this.draggedElement && this.draggedElement !== row) {
          row.parentNode.insertBefore(this.draggedElement, row);
        }
      });
    });
  }
}

// ============================================================================
// 2. GestureDetector - 手勢識別
// ============================================================================
class GestureDetector {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.longPressTimeout = null;
    this.lastTouchDistance = 0;
  }

  init() {
    this.setupSwipeDetection();
    this.setupLongPressDetection();
    this.setupPinchZoom();
  }

  // 滑動檢測 (左右滑動卡片)
  setupSwipeDetection() {
    const cardContainer = document.querySelector('[data-gesture="swipe"]');
    if (!cardContainer) return;

    cardContainer.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    });

    cardContainer.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe();
    });
  }

  handleSwipe() {
    const diffX = this.touchStartX - this.touchEndX;
    const diffY = this.touchStartY - this.touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 50) {
        this.onSwipeLeft();
      } else if (diffX < -50) {
        this.onSwipeRight();
      }
    }
  }

  onSwipeLeft() {
    console.log('向左滑動');
    // 在實際應用中切換到下一張卡片
  }

  onSwipeRight() {
    console.log('向右滑動');
    // 在實際應用中切換到上一張卡片
  }

  // 長按檢測 (長按顯示上下文菜單)
  setupLongPressDetection() {
    const pressElements = document.querySelectorAll('[data-gesture="long-press"]');

    pressElements.forEach(element => {
      element.addEventListener('touchstart', (e) => {
        this.longPressTimeout = setTimeout(() => {
          this.showContextMenu(element, e);
        }, 500); // 500ms 長按
      });

      element.addEventListener('touchend', () => {
        clearTimeout(this.longPressTimeout);
      });

      element.addEventListener('touchmove', () => {
        clearTimeout(this.longPressTimeout);
      });
    });
  }

  showContextMenu(element, event) {
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.cssText = `
      position: fixed;
      left: ${event.touches[0].clientX}px;
      top: ${event.touches[0].clientY}px;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      padding: var(--spacing-2);
      z-index: 1000;
    `;
    menu.innerHTML = `
      <div style="padding: var(--spacing-2); cursor: pointer;">編輯</div>
      <div style="padding: var(--spacing-2); cursor: pointer;">刪除</div>
    `;

    document.body.appendChild(menu);

    setTimeout(() => {
      document.body.removeChild(menu);
    }, 3000);
  }

  // 雙指捏合放大縮小
  setupPinchZoom() {
    const zoomElement = document.querySelector('[data-gesture="pinch"]');
    if (!zoomElement) return;

    zoomElement.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (this.lastTouchDistance > 0) {
          const scale = distance / this.lastTouchDistance;
          if (scale > 1.05) {
            this.onPinchZoomIn();
          } else if (scale < 0.95) {
            this.onPinchZoomOut();
          }
        }
        this.lastTouchDistance = distance;
      }
    });

    zoomElement.addEventListener('touchend', () => {
      this.lastTouchDistance = 0;
    });
  }

  onPinchZoomIn() {
    console.log('放大');
  }

  onPinchZoomOut() {
    console.log('縮小');
  }
}

// ============================================================================
// 3. SearchEnhancer - 搜尋增強
// ============================================================================
class SearchEnhancer {
  constructor() {
    this.searchHistory = this.loadSearchHistory();
    this.debounceTimer = null;
    this.suggestions = ['Dashboard', '資料管理', '使用者管理', '設定', '通知'];
    this.mockData = [
      { id: 1, title: 'Dashboard 設定', category: '系統' },
      { id: 2, title: '資料管理系統', category: '數據' },
      { id: 3, title: '使用者管理', category: '用戶' },
      { id: 4, title: '設定面板', category: '配置' },
      { id: 5, title: '通知中心', category: '通知' }
    ];
  }

  init() {
    this.setupRealTimeSearch();
    this.setupAutoComplete();
    this.setupSearchHistory();
    this.displayInitialSuggestions();
  }

  loadSearchHistory() {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  }

  saveSearchHistory() {
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory.slice(0, 10)));
  }

  // 顯示初始建議
  displayInitialSuggestions() {
    // 移除搜尋建議容器
    const suggestionsContainer = document.querySelector('[data-search="suggestions-static"]');
    if (suggestionsContainer && suggestionsContainer.parentElement) {
      suggestionsContainer.parentElement.style.display = 'none';
    }

    // 重新初始化搜尋歷史
    this.updateSearchHistory();
  }

  // 實時搜尋 (Debounce)
  setupRealTimeSearch() {
    const searchInput = document.querySelector('[data-search="input"]');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      const query = e.target.value.trim();

      // 顯示建議下拉菜單
      const suggestionsList = document.querySelector('[data-search="suggestions"]');
      if (suggestionsList) {
        if (query.length === 0) {
          suggestionsList.style.maxHeight = '0';
        } else {
          suggestionsList.style.maxHeight = '300px';
        }
      }

      this.debounceTimer = setTimeout(() => {
        if (query.length > 0) {
          this.performSearch(query);
        }
      }, 300); // 300ms debounce
    });

    // 搜尋框失焦時隱藏建議
    searchInput.addEventListener('blur', () => {
      const suggestionsList = document.querySelector('[data-search="suggestions"]');
      if (suggestionsList) {
        setTimeout(() => {
          suggestionsList.style.maxHeight = '0';
        }, 200);
      }
    });
  }

  performSearch(query) {
    const suggestionList = document.querySelector('[data-search="suggestions"]');
    if (!suggestionList) return;

    // 過濾搜尋結果
    const filtered = this.mockData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      suggestionList.innerHTML = `
        <div style="padding: var(--spacing-3); color: var(--color-text-tertiary); text-align: center;">
          未找到匹配結果
        </div>
      `;
      return;
    }

    suggestionList.innerHTML = filtered.map(item => `
      <div class="search-result-item" style="
        padding: var(--spacing-3);
        cursor: pointer;
        border-bottom: 1px solid var(--color-border-muted);
        transition: background 0.15s ease;
      " onmouseover="this.style.background='var(--color-bg-tertiary)'" onmouseout="this.style.background='transparent'">
        <div style="font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">
          ${item.title}
        </div>
        <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-top: 4px;">
          ${item.category}
        </div>
      </div>
    `).join('');

    // 點擊結果時添加到歷史
    const items = suggestionList.querySelectorAll('.search-result-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const title = item.querySelector('div').textContent;
        this.addToSearchHistory(title);
        document.querySelector('[data-search="input"]').value = title;
        suggestionList.style.maxHeight = '0';
      });
    });
  }

  // 自動完成建議
  setupAutoComplete() {
    const searchInput = document.querySelector('[data-search="input"]');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const suggestions = this.suggestions.filter(s =>
        s.toLowerCase().startsWith(query) && query.length > 0
      );

      const suggestionList = document.querySelector('[data-search="suggestions"]');
      if (!suggestionList) return;

      // 在下拉菜單頂部添加自動完成建議
      if (suggestions.length > 0 && query.length > 0) {
        const header = `<div style="padding: var(--spacing-2) var(--spacing-3); background: var(--color-bg-secondary); border-bottom: 1px solid var(--color-border-default); font-size: var(--font-size-xs); color: var(--color-text-tertiary); font-weight: var(--font-weight-semibold);">建議</div>`;
        const suggestionItems = suggestions.map(s => `
          <div style="padding: var(--spacing-3); cursor: pointer; border-bottom: 1px solid var(--color-border-muted); color: var(--color-cyan); transition: background 0.15s ease;"
               onmouseover="this.style.background='var(--color-bg-tertiary)'"
               onmouseout="this.style.background='transparent'"
               onclick="document.querySelector('[data-search=\\\"input\\\"]').value='${s}'; this.parentElement.style.maxHeight='0';">
            ${s}
          </div>
        `).join('');

        if (suggestionList.innerHTML.includes('category')) {
          // 如果已有搜尋結果，在開頭添加建議
          suggestionList.innerHTML = header + suggestionItems + suggestionList.innerHTML;
        }
      }
    });
  }

  // 搜尋歷史管理
  setupSearchHistory() {
    this.updateSearchHistory();
  }

  addToSearchHistory(query) {
    if (query.length > 0 && !this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      this.saveSearchHistory();
      this.updateSearchHistory();
    }
  }

  updateSearchHistory() {
    const container = document.querySelector('[data-search="history"]');
    if (!container) return;

    // 只顯示最近 5 個搜尋歷史
    const recentHistory = this.searchHistory.slice(0, 5);

    if (recentHistory.length === 0) {
      container.innerHTML = '<span style="color: var(--color-text-tertiary); padding: var(--spacing-2);">暫無搜尋歷史</span>';
      return;
    }

    container.innerHTML = recentHistory.map(query => `
      <span class="history-item" style="
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border-default);
        padding: var(--spacing-2) var(--spacing-3);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: var(--font-size-sm);
        transition: all 0.2s ease;
        white-space: nowrap;
        flex-shrink: 0;
      "
      onmouseover="this.style.background='var(--color-cyan)'; this.style.color='white'; this.style.borderColor='var(--color-cyan)'"
      onmouseout="this.style.background='var(--color-bg-secondary)'; this.style.color='var(--color-text-primary)'; this.style.borderColor='var(--color-border-default)'"
      onclick="document.querySelector('[data-search=\\\"input\\\"]').value='${query}'; document.querySelector('[data-search=\\\"input\\\"]').dispatchEvent(new Event('input'));">
        🕐 ${query}
      </span>
    `).join('');
  }
}

// ============================================================================
// 4. TableInteraction - 表格互動
// ============================================================================
class TableInteraction {
  constructor() {
    this.currentSort = { column: null, direction: 'asc' };
    this.selectedRows = new Set();
  }

  init() {
    this.setupColumnSorting();
    this.setupRowSelection();
    this.setupRowFiltering();
  }

  // 列頭排序 (升序/降序/無序)
  setupColumnSorting() {
    const headers = document.querySelectorAll('.data-table thead th');

    headers.forEach((header, index) => {
      header.style.cursor = 'pointer';
      header.addEventListener('click', () => {
        this.sortTable(index, header);
      });
    });
  }

  sortTable(columnIndex, header) {
    const table = document.querySelector('.data-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // 切換排序方向
    if (this.currentSort.column === columnIndex) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.column = columnIndex;
      this.currentSort.direction = 'asc';
    }

    // 排序數據
    rows.sort((a, b) => {
      const aValue = a.cells[columnIndex].textContent.trim();
      const bValue = b.cells[columnIndex].textContent.trim();

      let comparison = 0;
      if (!isNaN(aValue) && !isNaN(bValue)) {
        comparison = parseFloat(aValue) - parseFloat(bValue);
      } else {
        comparison = aValue.localeCompare(bValue, 'zh-TW');
      }

      return this.currentSort.direction === 'asc' ? comparison : -comparison;
    });

    // 重新排列表格行
    rows.forEach(row => tbody.appendChild(row));

    // 更新表頭視覺
    document.querySelectorAll('.data-table thead th').forEach((h, i) => {
      if (i === columnIndex) {
        h.innerHTML += ` ${this.currentSort.direction === 'asc' ? '↑' : '↓'}`;
      } else {
        h.innerHTML = h.innerHTML.replace(' ↑', '').replace(' ↓', '');
      }
    });
  }

  // 行選擇與批量操作
  setupRowSelection() {
    const table = document.querySelector('.data-table');
    if (!table) return;

    // 全選/反選
    const selectAllCheckbox = table.querySelector('thead input[type="checkbox"]');
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = e.target.checked;
          checkbox.closest('tr').style.backgroundColor = e.target.checked ? 'rgba(0, 217, 255, 0.1)' : '';
        });
      });
    }

    // 行選擇
    const rowCheckboxes = table.querySelectorAll('tbody input[type="checkbox"]');
    rowCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const row = e.target.closest('tr');
        row.style.backgroundColor = e.target.checked ? 'rgba(0, 217, 255, 0.1)' : '';

        if (e.target.checked) {
          this.selectedRows.add(row);
        } else {
          this.selectedRows.delete(row);
        }
      });
    });
  }

  // 多列篩選
  setupRowFiltering() {
    const filterInputs = document.querySelectorAll('[data-filter]');

    filterInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    const table = document.querySelector('.data-table');
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
      let visible = true;
      const filterInputs = document.querySelectorAll('[data-filter]');

      filterInputs.forEach(input => {
        const columnIndex = parseInt(input.dataset.filterColumn);
        const filterValue = input.value.toLowerCase();
        const cellValue = row.cells[columnIndex].textContent.toLowerCase();

        if (filterValue && !cellValue.includes(filterValue)) {
          visible = false;
        }
      });

      row.style.display = visible ? '' : 'none';
    });
  }
}

// ============================================================================
// 5. FormValidator - 表單驗證
// ============================================================================
class FormValidator {
  constructor() {
    this.rules = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\d{10,}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      username: /^[a-zA-Z0-9_]{3,20}$/
    };
  }

  init() {
    this.setupRealTimeValidation();
    this.setupFormSubmit();
  }

  // 實時驗證
  setupRealTimeValidation() {
    const form = document.querySelector('[data-form="validate"]');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('has-error')) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(field) {
    const validators = {
      email: (value) => this.rules.email.test(value),
      phone: (value) => this.rules.phone.test(value),
      password: (value) => this.rules.password.test(value),
      username: (value) => this.rules.username.test(value),
      required: (value) => value.trim().length > 0,
      minlength: (value) => value.length >= parseInt(field.dataset.minLength || 0)
    };

    let isValid = true;
    const type = field.dataset.validate || field.type;

    if (validators[type]) {
      isValid = validators[type](field.value);
    }

    this.updateFieldStatus(field, isValid);
    return isValid;
  }

  updateFieldStatus(field, isValid) {
    const errorElement = field.nextElementSibling;

    if (isValid) {
      field.classList.remove('has-error');
      field.classList.add('has-success');
      if (errorElement?.classList.contains('error-message')) {
        errorElement.style.display = 'none';
      }
    } else {
      field.classList.remove('has-success');
      field.classList.add('has-error');
      if (errorElement?.classList.contains('error-message')) {
        errorElement.style.display = 'block';
      }
    }
  }

  // 表單提交驗證
  setupFormSubmit() {
    const form = document.querySelector('[data-form="validate"]');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input, textarea, select');
      let allValid = true;

      inputs.forEach(input => {
        if (!this.validateField(input)) {
          allValid = false;
        }
      });

      if (allValid) {
        console.log('表單驗證通過，可提交');
        // 實際提交邏輯
      }
    });
  }
}

// ============================================================================
// 6. KeyboardShortcuts - 鍵盤快捷鍵
// ============================================================================
class KeyboardShortcuts {
  constructor() {
    this.shortcuts = {
      'ctrl+k': 'openSearch',
      'cmd+k': 'openSearch',
      'escape': 'closeModals',
      'enter': 'submitForm',
      'arrowup': 'navigatePrevious',
      'arrowdown': 'navigateNext'
    };
  }

  init() {
    this.setupGlobalShortcuts();
    this.displayShortcutHelp();
  }

  // 全局快捷鍵監聽
  setupGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      const key = this.getKeyCombo(e);

      if (this.shortcuts[key]) {
        e.preventDefault();
        this.handleShortcut(this.shortcuts[key], e);
      }
    });
  }

  getKeyCombo(e) {
    const keys = [];

    if (e.ctrlKey) keys.push('ctrl');
    if (e.metaKey) keys.push('cmd');
    if (e.altKey) keys.push('alt');
    if (e.shiftKey) keys.push('shift');

    const key = e.key.toLowerCase();
    if (!['control', 'meta', 'alt', 'shift'].includes(key)) {
      keys.push(key);
    }

    return keys.join('+');
  }

  handleShortcut(action, event) {
    const handlers = {
      openSearch: () => {
        const searchInput = document.querySelector('[data-search="input"]');
        if (searchInput) searchInput.focus();
      },
      closeModals: () => {
        const modals = document.querySelectorAll('[data-modal]');
        modals.forEach(modal => modal.style.display = 'none');
      },
      submitForm: () => {
        const activeForm = document.querySelector('form:focus-within');
        if (activeForm) activeForm.submit();
      },
      navigatePrevious: () => console.log('向上導航'),
      navigateNext: () => console.log('向下導航')
    };

    if (handlers[action]) {
      handlers[action]();
    }
  }

  // 快捷鍵幫助面板
  displayShortcutHelp() {
    const helpPanel = document.querySelector('[data-shortcuts="help"]');
    if (!helpPanel) return;

    const shortcutsList = [
      { keys: 'Ctrl+K / Cmd+K', action: '打開搜尋' },
      { keys: 'Esc', action: '關閉彈窗' },
      { keys: 'Enter', action: '提交表單' },
      { keys: '↑ ↓', action: '導航列表' }
    ];

    helpPanel.innerHTML = shortcutsList.map(shortcut => `
      <div class="shortcut-item" style="display: flex; justify-content: space-between; padding: var(--spacing-3); border-bottom: 1px solid var(--color-border-muted);">
        <kbd style="background: var(--color-bg-tertiary); padding: 0 var(--spacing-2); border-radius: var(--radius-sm);">${shortcut.keys}</kbd>
        <span style="color: var(--color-text-secondary);">${shortcut.action}</span>
      </div>
    `).join('');
  }
}

// ============================================================================
// 初始化函數
// ============================================================================
function initializeInteractions() {
  const dragDrop = new DragDropManager();
  dragDrop.init();

  const gestureDetector = new GestureDetector();
  gestureDetector.init();

  const searchEnhancer = new SearchEnhancer();
  searchEnhancer.init();

  const tableInteraction = new TableInteraction();
  tableInteraction.init();

  const formValidator = new FormValidator();
  formValidator.init();

  const keyboardShortcuts = new KeyboardShortcuts();
  keyboardShortcuts.init();

  console.log('✅ 互動功能模組已初始化');
}

// 確保 DOM 加載完成後初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeInteractions);
} else {
  initializeInteractions();
}
