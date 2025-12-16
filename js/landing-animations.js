/**
 * Landing Page Animations & Language Toggle
 * 滾動動畫與語言切換功能
 */

(function() {
  'use strict';

  // ========================================
  // 語言切換系統
  // ========================================

  const LanguageManager = {
    storageKey: 'nexusai-lang',
    defaultLang: 'zh',

    init() {
      const savedLang = localStorage.getItem(this.storageKey) || this.defaultLang;
      this.setLanguage(savedLang);
      this.bindEvents();
    },

    setLanguage(lang) {
      document.documentElement.setAttribute('data-theme-lang', lang);
      localStorage.setItem(this.storageKey, lang);
      this.updateToggleButton(lang);
    },

    toggleLanguage() {
      const currentLang = document.documentElement.getAttribute('data-theme-lang') || this.defaultLang;
      const newLang = currentLang === 'zh' ? 'en' : 'zh';
      this.setLanguage(newLang);
    },

    updateToggleButton(lang) {
      const toggleBtns = document.querySelectorAll('[data-lang-toggle]');
      toggleBtns.forEach(btn => {
        const zhSpan = btn.querySelector('[data-lang-btn="zh"]');
        const enSpan = btn.querySelector('[data-lang-btn="en"]');

        if (zhSpan && enSpan) {
          zhSpan.classList.toggle('active', lang === 'zh');
          enSpan.classList.toggle('active', lang === 'en');
        }
      });
    },

    bindEvents() {
      document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
        btn.addEventListener('click', () => this.toggleLanguage());
      });
    }
  };

  // ========================================
  // 滾動動畫系統
  // ========================================

  const ScrollAnimations = {
    init() {
      this.observeElements();
    },

    observeElements() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // 可選：動畫完成後停止觀察
            // observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // 觀察所有需要動畫的元素
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
      });
    }
  };

  // ========================================
  // 平滑滾動
  // ========================================

  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;

          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            e.preventDefault();
            const navHeight = document.querySelector('.top-nav')?.offsetHeight || 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  };

  // ========================================
  // 導航欄滾動效果
  // ========================================

  const NavScrollEffect = {
    init() {
      const nav = document.querySelector('.top-nav');
      if (!nav) return;

      let lastScrollY = window.scrollY;
      let ticking = false;

      const updateNav = () => {
        const scrollY = window.scrollY;

        // 添加滾動後的背景效果
        if (scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(updateNav);
          ticking = true;
        }
      });
    }
  };

  // ========================================
  // 計數動畫
  // ========================================

  const CounterAnimation = {
    init() {
      const counters = document.querySelectorAll('[data-counter]');
      if (!counters.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
      const target = parseInt(element.getAttribute('data-counter'), 10);
      const suffix = element.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        element.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    }
  };

  // ========================================
  // 視差效果（簡化版）
  // ========================================

  const ParallaxEffect = {
    init() {
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      if (!parallaxElements.length) return;

      let ticking = false;

      const updateParallax = () => {
        const scrollY = window.scrollY;

        parallaxElements.forEach(el => {
          const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
          const offset = scrollY * speed;
          el.style.transform = `translateY(${offset}px)`;
        });

        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      });
    }
  };

  // ========================================
  // 初始化
  // ========================================

  const init = () => {
    LanguageManager.init();
    ScrollAnimations.init();
    SmoothScroll.init();
    NavScrollEffect.init();
    CounterAnimation.init();
    ParallaxEffect.init();

    console.log('Landing page animations initialized');
  };

  // DOM 載入完成後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
