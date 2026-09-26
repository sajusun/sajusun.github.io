// SAKHAWAT HOSSAIN PORTFOLIO JAVASCRIPT

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark / Light)
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('sakhawat_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sakhawat_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });

  function updateThemeIcons(theme) {
    themeToggleButtons.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fas fa-sun text-yellow-400';
        } else {
          icon.className = 'fas fa-moon text-indigo-600';
        }
      }
    });
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    const menuIcon = mobileMenuBtn.querySelector('i');

    function toggleMenu(show) {
      const isHidden = mobileMenu.classList.contains('hidden');
      const shouldOpen = typeof show === 'boolean' ? show : isHidden;

      if (shouldOpen) {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        if (menuIcon) {
          menuIcon.className = 'fas fa-times text-lg';
        }
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (menuIcon) {
          menuIcon.className = 'fas fa-bars text-lg';
        }
      }
    }

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close mobile menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close when clicking outside header
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden')) {
        const header = document.querySelector('header');
        if (header && !header.contains(e.target)) {
          toggleMenu(false);
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        toggleMenu(false);
      }
    });

    // Auto-close on resize to desktop (>= 768px)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
        toggleMenu(false);
      }
    });
  }

  // 3. Toast Notifications
  window.showToast = function(message, isSuccess = true) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-info-circle'}"></i> <span>${message}</span>`;
    toast.style.backgroundColor = isSuccess ? '#10b981' : '#6366f1';
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // 4. Copy to Clipboard Utility
  window.copyToClipboard = function(text, label = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => {
      window.showToast(label, true);
    }).catch(() => {
      window.showToast('Failed to copy', false);
    });
  };

  // 5. Project Filtering (for projects.html and home page if applicable)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const categories = (card.getAttribute('data-category') || '').split(' ');
          if (filterValue === 'all' || categories.includes(filterValue)) {
            card.style.display = 'block';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transition = 'opacity 0.3s ease';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
      } else {
        backToTopBtn.classList.add('opacity-0', 'invisible');
        backToTopBtn.classList.remove('opacity-100', 'visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 7. Contact Page Form Tabs & Google Apps Script Integration
  const tabBtnMessage = document.getElementById('tab-btn-message');
  const tabBtnQuote = document.getElementById('tab-btn-quote');
  const panelMessage = document.getElementById('form-panel-message');
  const panelQuote = document.getElementById('form-panel-quote');

  if (tabBtnMessage && tabBtnQuote && panelMessage && panelQuote) {
    const activateMessageTab = () => {
      tabBtnMessage.classList.add('active');
      tabBtnQuote.classList.remove('active');
      panelMessage.classList.remove('hidden');
      panelQuote.classList.add('hidden');
    };

    const activateQuoteTab = () => {
      tabBtnQuote.classList.add('active');
      tabBtnMessage.classList.remove('active');
      panelQuote.classList.remove('hidden');
      panelMessage.classList.add('hidden');
    };

    tabBtnMessage.addEventListener('click', activateMessageTab);
    tabBtnQuote.addEventListener('click', activateQuoteTab);

    // Auto-open quote tab if URL has hash or parameter #quote / ?tab=quote or ?service=
    const urlParams = new URLSearchParams(window.location.search);
    if (window.location.hash === '#quote' || window.location.hash === '#quote-form' || urlParams.get('tab') === 'quote' || urlParams.get('service')) {
      activateQuoteTab();
      
      const serviceParam = urlParams.get('service');
      const projectTypeSelect = document.getElementById('quote-project-type');
      if (serviceParam && projectTypeSelect) {
        for (let i = 0; i < projectTypeSelect.options.length; i++) {
          const optVal = projectTypeSelect.options[i].value.toLowerCase();
          if (optVal.includes(serviceParam.toLowerCase())) {
            projectTypeSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  }

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7cfKUkSEf8HONShmBRTvDyc7EgNgi_50QE072MzX9Xue99XpSi5F2UMkUtireaW3k/exec';
  const ajaxForms = document.querySelectorAll('.contact-ajax-form');

  if (ajaxForms.length > 0) {
    ajaxForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const formType = form.querySelector('input[name="form_type"]')?.value || 'Message';

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

        const formData = new FormData(form);

        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Cross-origin Google Apps Script mode
          });

          if (formType === 'Quote') {
            window.showToast('Quote request submitted! I will get back to you with an estimate shortly.', true);
          } else {
            window.showToast('Thank you! Your message has been sent successfully.', true);
          }
          form.reset();
        } catch (error) {
          console.error('Submission error:', error);
          window.showToast('Failed to send. Please reach out via Email or WhatsApp directly.', false);
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    });
  }

  // 8. System Architecture Modal Management
  const archButtons = document.querySelectorAll('.btn-architecture');
  const archModals = document.querySelectorAll('.arch-modal-backdrop');

  function openArchModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeArchModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function closeAllArchModals() {
    archModals.forEach(modal => {
      closeArchModal(modal);
    });
  }

  archButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = btn.getAttribute('data-target-modal');
      if (targetModalId) {
        openArchModal(targetModalId);
      }
    });
  });

  // Modal close handlers (close button & backdrop click)
  archModals.forEach(modal => {
    const closeBtns = modal.querySelectorAll('.arch-modal-close');
    closeBtns.forEach(cBtn => {
      cBtn.addEventListener('click', () => {
        closeArchModal(modal);
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeArchModal(modal);
      }
    });

    // Tab switching inside modal
    const tabBtns = modal.querySelectorAll('.arch-tab-btn');
    const tabPanels = modal.querySelectorAll('.arch-tab-panel');

    tabBtns.forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const targetPanelId = tabBtn.getAttribute('data-tab-target');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');

        tabPanels.forEach(panel => {
          if (panel.id === targetPanelId) {
            panel.classList.remove('hidden');
          } else {
            panel.classList.add('hidden');
          }
        });
      });
    });
  });

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllArchModals();
    }
  });

  // 9. PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          // Check for worker updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  window.showToast('New version available! Refresh to update.', true);
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('[PWA] Service worker registration failed:', err);
        });
    });
  }
});


