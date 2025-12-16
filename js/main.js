/* ============================================
   Main JavaScript - Common Utilities & Features
   ============================================ */

// ============================================
// 1. DOM Utilities
// ============================================

const DOM = {
  // Select single element
  select: (selector) => document.querySelector(selector),

  // Select multiple elements
  selectAll: (selector) => document.querySelectorAll(selector),

  // Create element
  create: (tag, classes = '', html = '') => {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    if (html) el.innerHTML = html;
    return el;
  },

  // Add class
  addClass: (el, className) => el.classList.add(className),

  // Remove class
  removeClass: (el, className) => el.classList.remove(className),

  // Toggle class
  toggleClass: (el, className) => el.classList.toggle(className),

  // Check if has class
  hasClass: (el, className) => el.classList.contains(className),
};

// ============================================
// 2. Event Utilities
// ============================================

const Events = {
  // Add event listener
  on: (el, event, handler) => {
    if (el) el.addEventListener(event, handler);
  },

  // Remove event listener
  off: (el, event, handler) => {
    if (el) el.removeEventListener(event, handler);
  },

  // Trigger custom event
  trigger: (el, eventName, detail = {}) => {
    el.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true }));
  },

  // Debounce function
  debounce: (func, delay = 300) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  // Throttle function
  throttle: (func, limit = 300) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// ============================================
// 3. Storage Utilities
// ============================================

const Storage = {
  // Get from localStorage
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return localStorage.getItem(key);
    }
  },

  // Set to localStorage
  set: (key, value) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  },

  // Remove from localStorage
  remove: (key) => localStorage.removeItem(key),

  // Clear all localStorage
  clear: () => localStorage.clear(),
};

// ============================================
// 4. API Utilities
// ============================================

const API = {
  // Fetch wrapper
  fetch: async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  },

  // GET request
  get: (url) => API.fetch(url),

  // POST request
  post: (url, data) => API.fetch(url, { method: 'POST', body: JSON.stringify(data) }),

  // PUT request
  put: (url, data) => API.fetch(url, { method: 'PUT', body: JSON.stringify(data) }),

  // DELETE request
  delete: (url) => API.fetch(url, { method: 'DELETE' }),
};

// ============================================
// 5. Notification/Toast System
// ============================================

const Toast = {
  show: (message, type = 'info', duration = 3000) => {
    const toastId = `toast-${Date.now()}`;
    const toast = DOM.create(
      'div',
      `toast toast-${type}`,
      `
        <i data-lucide="check-circle"></i>
        <div class="toast-content">
          <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
          <i data-lucide="x"></i>
        </button>
      `
    );

    const container = DOM.select('.toast-container') || DOM.create('div', 'toast-container');
    if (!DOM.select('.toast-container')) {
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }

    toast.id = toastId;
    container.appendChild(toast);

    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      Events.on(closeBtn, 'click', () => toast.remove());
    }

    // Auto-close
    if (duration > 0) {
      setTimeout(() => toast.remove(), duration);
    }

    return toast;
  },

  success: (message, duration = 3000) => Toast.show(message, 'success', duration),
  error: (message, duration = 3000) => Toast.show(message, 'error', duration),
  warning: (message, duration = 3000) => Toast.show(message, 'warning', duration),
  info: (message, duration = 3000) => Toast.show(message, 'info', duration),
};

// ============================================
// 6. Modal System
// ============================================

const Modal = {
  show: (id) => {
    const modal = DOM.select(`#${id}`);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  },

  hide: (id) => {
    const modal = DOM.select(`#${id}`);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  },

  init: () => {
    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach((btn) => {
      Events.on(btn, 'click', (e) => {
        if (e.target.closest('.modal')) return;
        const modal = e.target.closest('.modal') || e.target.closest('.modal-backdrop');
        if (modal) {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      });
    });
  },
};

// ============================================
// 7. Navigation - Hamburger Menu with Mobile Improvements
// ============================================

const Navigation = {
  overlay: null,

  init: () => {
    const hamburgerBtn = DOM.select('.hamburger-menu');
    const sidebar = DOM.select('.sidebar');

    if (!hamburgerBtn || !sidebar) return;

    // Create overlay element if it doesn't exist
    Navigation.overlay = DOM.select('.sidebar-overlay');
    if (!Navigation.overlay) {
      Navigation.overlay = DOM.create('div', 'sidebar-overlay');
      document.body.appendChild(Navigation.overlay);
    }

    // Hamburger click handler
    Events.on(hamburgerBtn, 'click', () => {
      Navigation.toggleSidebar(sidebar);
    });

    // Overlay click handler - close sidebar
    Events.on(Navigation.overlay, 'click', () => {
      Navigation.closeSidebar(sidebar);
    });

    // ESC key handler - close sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.hasClass(sidebar, 'active')) {
        Navigation.closeSidebar(sidebar);
      }
    });

    // Close sidebar on mobile nav link click
    sidebar.querySelectorAll('a').forEach((link) => {
      Events.on(link, 'click', () => {
        if (window.innerWidth < 1024) {
          Navigation.closeSidebar(sidebar);
        }
      });
    });

    // Close sidebar on window resize to desktop
    window.addEventListener('resize', Events.debounce(() => {
      if (window.innerWidth >= 1024 && DOM.hasClass(sidebar, 'active')) {
        Navigation.closeSidebar(sidebar);
      }
    }, 100));
  },

  toggleSidebar: (sidebar) => {
    if (DOM.hasClass(sidebar, 'active')) {
      Navigation.closeSidebar(sidebar);
    } else {
      Navigation.openSidebar(sidebar);
    }
  },

  openSidebar: (sidebar) => {
    DOM.addClass(sidebar, 'active');
    DOM.addClass(Navigation.overlay, 'active');
    DOM.addClass(document.body, 'sidebar-open');
  },

  closeSidebar: (sidebar) => {
    DOM.removeClass(sidebar, 'active');
    DOM.removeClass(Navigation.overlay, 'active');
    DOM.removeClass(document.body, 'sidebar-open');
  },
};

// ============================================
// 8. Form Utilities
// ============================================

const Form = {
  // Validate email
  validateEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validate required field
  validateRequired: (value) => value.trim().length > 0,

  // Get form data
  getFormData: (formSelector) => {
    const form = DOM.select(formSelector);
    if (!form) return null;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    return data;
  },

  // Set form data
  setFormData: (formSelector, data) => {
    const form = DOM.select(formSelector);
    if (!form) return;

    Object.keys(data).forEach((key) => {
      const input = form.elements[key];
      if (input) input.value = data[key];
    });
  },

  // Clear form
  clearForm: (formSelector) => {
    const form = DOM.select(formSelector);
    if (form) form.reset();
  },
};

// ============================================
// 9. Scroll Utilities
// ============================================

const Scroll = {
  // Smooth scroll to element
  to: (selector, offset = 80) => {
    const element = DOM.select(selector);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  },

  // Scroll to top
  toTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),

  // Check if element is in viewport
  isInViewport: (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  },
};

// ============================================
// 10. Animation Utilities
// ============================================

const Animation = {
  // Fade in
  fadeIn: (el, duration = 300) => {
    el.style.opacity = '0';
    el.style.transition = `opacity ${duration}ms ease`;
    setTimeout(() => (el.style.opacity = '1'), 10);
  },

  // Fade out
  fadeOut: (el, duration = 300) => {
    el.style.opacity = '1';
    el.style.transition = `opacity ${duration}ms ease`;
    setTimeout(() => (el.style.opacity = '0'), 10);
  },

  // Slide down
  slideDown: (el, duration = 300) => {
    el.style.maxHeight = '0';
    el.style.overflow = 'hidden';
    el.style.transition = `max-height ${duration}ms ease`;
    setTimeout(() => {
      el.style.maxHeight = el.scrollHeight + 'px';
    }, 10);
  },

  // Slide up
  slideUp: (el, duration = 300) => {
    el.style.maxHeight = el.scrollHeight + 'px';
    el.style.overflow = 'hidden';
    el.style.transition = `max-height ${duration}ms ease`;
    setTimeout(() => {
      el.style.maxHeight = '0';
    }, 10);
  },
};

// ============================================
// 11. Utility Functions
// ============================================

const Utils = {
  // Generate random ID
  randomId: () => Math.random().toString(36).substr(2, 9),

  // Format date
  formatDate: (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },

  // Deep clone object
  clone: (obj) => JSON.parse(JSON.stringify(obj)),

  // Merge objects
  merge: (target, source) => ({ ...target, ...source }),

  // Get query parameter
  getQueryParam: (param) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
  },
};

// ============================================
// 12. Tab Switcher
// ============================================

const Tabs = {
  init: () => {
    const tabs = DOM.selectAll('.tabs');

    tabs.forEach((tabContainer) => {
      const tabButtons = tabContainer.querySelectorAll('.tab-item');

      tabButtons.forEach((button) => {
        Events.on(button, 'click', (e) => {
          e.preventDefault();

          // Remove active from all tabs
          tabButtons.forEach((btn) => DOM.removeClass(btn, 'active'));

          // Add active to clicked tab
          DOM.addClass(button, 'active');

          // Trigger tab change event
          Events.trigger(tabContainer, 'tabchange', { tab: button.textContent });
        });
      });
    });
  },
};

// ============================================
// 13. Dropdown Menu
// ============================================

const Dropdown = {
  init: () => {
    const dropdowns = DOM.selectAll('.dropdown');

    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector('.dropdown-trigger');

      if (trigger) {
        Events.on(trigger, 'click', (e) => {
          e.stopPropagation();
          DOM.toggleClass(dropdown, 'active');
        });
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdowns.forEach((dropdown) => {
        DOM.removeClass(dropdown, 'active');
      });
    });
  },
};

// ============================================
// 14. Lazy Load Images
// ============================================

const LazyLoad = {
  init: () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      const lazyImages = DOM.selectAll('img.lazy');
      lazyImages.forEach((img) => imageObserver.observe(img));
    }
  },
};

// ============================================
// 15. Dark Mode Toggle (Optional)
// ============================================

const DarkMode = {
  init: () => {
    const STORAGE_KEY = 'nexusai-theme';
    const themeToggles = DOM.selectAll('[data-theme-toggle]');
    if (!themeToggles.length) return;

    const systemTheme =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const savedTheme = Storage.get(STORAGE_KEY);
    const initialTheme = savedTheme || systemTheme;

    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);

      const nextLabel = theme === 'light' ? '切換至深色主題' : '切換至淺色主題';
      const nextIcon = theme === 'light' ? 'moon' : 'sun';

      // 更新所有主題切換按鈕
      themeToggles.forEach(btn => {
        btn.setAttribute('title', nextLabel);
        btn.setAttribute('aria-label', nextLabel);
        btn.innerHTML = `<i data-lucide="${nextIcon}"></i>`;
      });

      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    };

    applyTheme(initialTheme);

    // 為所有主題切換按鈕綁定事件
    themeToggles.forEach(btn => {
      Events.on(btn, 'click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        Storage.set(STORAGE_KEY, newTheme);
      });
    });
  },
};


// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 App initialized');

  // Initialize all modules
  Navigation.init();
  Modal.init();
  Tabs.init();
  Dropdown.init();
  LazyLoad.init();
  DarkMode.init();

  // Example: Show welcome toast
  // Toast.success('Welcome to NexusAI Demo!');
});

// ============================================
// Window resize handler (with debounce)
// ============================================

window.addEventListener(
  'resize',
  Events.debounce(() => {
    console.log('Window resized:', window.innerWidth);
  }, 300)
);

// ============================================
// Scroll position tracking (with throttle)
// ============================================

window.addEventListener(
  'scroll',
  Events.throttle(() => {
    const scrollPos = window.scrollY;
    // console.log('Scroll position:', scrollPos);
  }, 300)
);
