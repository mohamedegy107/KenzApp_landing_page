/**
 * Main JavaScript Entry Point
 * Initializes all modules and handles global functionality
 */

// Import modules (if using ES6 modules)
// import NavigationManager from './modules/navigation.js';
// import UIEffectsManager from './modules/ui-effects.js';
// import LanguageSwitcher from './modules/language-switcher.js';
// import AnimationsManager from './modules/animations.js';

class KenzApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        if (this.isInitialized) return;

        // Wait for DOM to be ready
        $(document).ready(() => {
            this.initializeModules();
            this.setupGlobalEventHandlers();
            this.handlePageLoad();
            this.isInitialized = true;
            
            console.log('KenzApp initialized successfully');
        });
    }

    /**
     * Initialize all modules
     */
    initializeModules() {
        try {
            // Initialize Navigation Module
            if (typeof NavigationManager !== 'undefined') {
                this.modules.navigation = new NavigationManager();
            }

            // Initialize UI Effects Module
            if (typeof UIEffectsManager !== 'undefined') {
                this.modules.uiEffects = new UIEffectsManager();
            }

            // Initialize Language Switcher Module
            if (typeof LanguageSwitcher !== 'undefined') {
                this.modules.languageSwitcher = new LanguageSwitcher();
            }

            // Initialize Animations Module
            if (typeof AnimationsManager !== 'undefined') {
                this.modules.animations = new AnimationsManager();
            }

            console.log('All modules initialized:', Object.keys(this.modules));
        } catch (error) {
            console.error('Error initializing modules:', error);
        }
    }

    /**
     * Setup global event handlers
     */
    setupGlobalEventHandlers() {
        // Handle window resize
        $(window).on('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle scroll events
        $(window).on('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16)); // ~60fps

        // Handle orientation change
        $(window).on('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Handle page visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle form submissions
        $('form').on('submit', (event) => {
            this.handleFormSubmission(event);
        });

        // Handle external links
        $('a[href^="http"]').not('[href*="' + window.location.hostname + '"]').attr({
            target: '_blank',
            rel: 'noopener noreferrer'
        });

        // Handle keyboard navigation
        $(document).on('keydown', (event) => {
            this.handleKeyboardNavigation(event);
        });
    }

    /**
     * Handle page load completion
     */
    handlePageLoad() {
        // Remove loading states
        $('body').removeClass('loading');
        
        // Trigger custom page loaded event
        $(document).trigger('pageLoaded');
        
        // Initialize lazy loading for images
        this.initializeLazyLoading();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--window-width', windowWidth + 'px');
        document.documentElement.style.setProperty('--window-height', windowHeight + 'px');
        
        // Trigger custom resize event
        $(document).trigger('windowResized', [windowWidth, windowHeight]);
        
        // Handle mobile/desktop switching
        if (windowWidth <= 768 && !$('body').hasClass('mobile')) {
            $('body').addClass('mobile').removeClass('desktop');
        } else if (windowWidth > 768 && !$('body').hasClass('desktop')) {
            $('body').addClass('desktop').removeClass('mobile');
        }
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        // Update scroll progress
        $('.scroll-progress').css('width', scrollPercent + '%');
        
        // Trigger custom scroll event
        $(document).trigger('windowScrolled', [scrollTop, scrollPercent]);
    }

    /**
     * Handle page visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden
            $(document).trigger('pageHidden');
        } else {
            // Page is visible
            $(document).trigger('pageVisible');
        }
    }

    /**
     * Handle form submissions
     * @param {Event} event - Form submission event
     */
    handleFormSubmission(event) {
        const $form = $(event.target);
        const formData = new FormData(event.target);
        
        // Basic form validation
        if (!this.validateForm($form)) {
            event.preventDefault();
            return false;
        }
        
        // Add loading state
        $form.addClass('submitting');
        $form.find('button[type="submit"]').prop('disabled', true);
        
        // Trigger custom form submission event
        $(document).trigger('formSubmitted', [$form, formData]);
    }

    /**
     * Validate form fields
     * @param {jQuery} $form - Form element
     * @returns {boolean} - Validation result
     */
    validateForm($form) {
        let isValid = true;
        
        // Check required fields
        $form.find('[required]').each(function() {
            const $field = $(this);
            const value = $field.val().trim();
            
            if (!value) {
                $field.addClass('error');
                isValid = false;
            } else {
                $field.removeClass('error');
            }
        });
        
        // Check email fields
        $form.find('input[type="email"]').each(function() {
            const $field = $(this);
            const email = $field.val().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                $field.addClass('error');
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Handle keyboard navigation
     * @param {Event} event - Keyboard event
     */
    handleKeyboardNavigation(event) {
        // Handle Escape key
        if (event.key === 'Escape') {
            // Close modals, dropdowns, etc.
            $('.modal.show').modal('hide');
            $('.dropdown-menu.show').removeClass('show');
        }
        
        // Handle Tab key for accessibility
        if (event.key === 'Tab') {
            $('body').addClass('keyboard-navigation');
        }
    }

    /**
     * Initialize lazy loading for images
     */
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            img.src = src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor page load performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page Load Performance:', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        totalTime: perfData.loadEventEnd - perfData.fetchStart
                    });
                }, 0);
            });
        }
    }

    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} - Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Get module instance
     * @param {string} moduleName - Name of the module
     * @returns {Object|null} - Module instance
     */
    getModule(moduleName) {
        return this.modules[moduleName] || null;
    }

    /**
     * Show notification to user
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = $(`
            <div class="notification notification-${type}">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `);
        
        $('body').append(notification);
        
        // Show notification
        setTimeout(() => {
            notification.addClass('show');
        }, 10);
        
        // Auto hide
        setTimeout(() => {
            notification.removeClass('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
        
        // Manual close
        notification.find('.notification-close').on('click', () => {
            notification.removeClass('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }

    /**
     * Destroy the application and clean up
     */
    destroy() {
        // Destroy all modules
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        // Remove event listeners
        $(window).off('resize scroll orientationchange');
        $(document).off('keydown');
        
        this.isInitialized = false;
        console.log('KenzApp destroyed');
    }
}

// Initialize the application
window.kenzApp = new KenzApp();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KenzApp;
}