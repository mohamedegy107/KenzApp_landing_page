/* animations.js */
/**
 * Animations Module
 * Handles scroll animations, interactive effects, and visual enhancements
 */

class AnimationsManager {
    constructor() {
        this.animatedElements = [];
        this.scrollThreshold = 0.1; // 10% of element visible
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupParallaxEffects();
        this.setupHoverEffects();
        this.initializeWOW();
    }

    /**
     * Setup scroll-triggered animations
     */
    setupScrollAnimations() {
        // Create intersection observer for scroll animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: this.scrollThreshold,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with animation classes
        this.observeAnimationElements();
    }

    /**
     * Observe elements that should be animated on scroll
     */
    observeAnimationElements() {
        const animationSelectors = [
            '.fade-in',
            '.slide-up',
            '.slide-down',
            '.slide-left',
            '.slide-right',
            '.zoom-in',
            '.zoom-out',
            '.rotate-in',
            '.bounce-in',
            '.single-services',
            '.testimonial-item',
            '.feature-item',
            '.about-content',
            '.dashboard-preview'
        ];

        animationSelectors.forEach(selector => {
            $(selector).each((index, element) => {
                $(element).addClass('animate-on-scroll');
                this.observer.observe(element);
            });
        });
    }

    /**
     * Animate element when it comes into view
     * @param {Element} element - Element to animate
     */
    animateElement(element) {
        const $element = $(element);
        
        // Add animation class based on element's data attribute or default
        const animationType = $element.data('animation') || 'fade-in';
        
        $element.addClass('animated').addClass(animationType);
        
        // Add stagger delay for multiple elements
        const delay = $element.data('delay') || 0;
        if (delay > 0) {
            $element.css('animation-delay', `${delay}ms`);
        }

        // Remove from observer after animation
        this.observer.unobserve(element);
    }

    /**
     * Setup counter animations for statistics
     */
    setupCounterAnimations() {
        $('.counter').each((index, element) => {
            const $counter = $(element);
            const target = parseInt($counter.data('target')) || parseInt($counter.text());
            const duration = $counter.data('duration') || 2000;
            
            // Reset counter
            $counter.text('0');
            
            // Observe counter for animation
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter($counter, target, duration);
                        counterObserver.unobserve(entry.target);
                    }
                });
            });
            
            counterObserver.observe(element);
        });
    }

    /**
     * Animate counter from 0 to target value
     * @param {jQuery} $counter - Counter element
     * @param {number} target - Target number
     * @param {number} duration - Animation duration in ms
     */
    animateCounter($counter, target, duration) {
        const startTime = Date.now();
        const startValue = 0;
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
            
            $counter.text(currentValue.toLocaleString());
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                $counter.text(target.toLocaleString());
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    /**
     * Setup parallax effects for background elements
     */
    setupParallaxEffects() {
        const parallaxElements = $('.parallax-element');
        
        if (parallaxElements.length === 0) return;
        
        $(window).on('scroll', () => {
            const scrollTop = $(window).scrollTop();
            
            parallaxElements.each((index, element) => {
                const $element = $(element);
                const speed = $element.data('speed') || 0.5;
                const yPos = -(scrollTop * speed);
                
                $element.css('transform', `translateY(${yPos}px)`);
            });
        });
    }

    /**
     * Setup hover effects for interactive elements
     */
    setupHoverEffects() {
        // Service cards hover effect
        $('.single-services').hover(
            function() {
                $(this).addClass('hover-effect');
            },
            function() {
                $(this).removeClass('hover-effect');
            }
        );

        // Button hover effects
        $('.main-btn, .main-btn-2').hover(
            function() {
                $(this).addClass('btn-hover');
            },
            function() {
                $(this).removeClass('btn-hover');
            }
        );

        // Image hover effects
        $('.hover-zoom img').hover(
            function() {
                $(this).addClass('zoomed');
            },
            function() {
                $(this).removeClass('zoomed');
            }
        );
    }

    /**
     * Initialize WOW.js for additional animations
     */
    initializeWOW() {
        if (typeof WOW !== 'undefined') {
            const wow = new WOW({
                boxClass: 'wow',
                animateClass: 'animated',
                offset: 0,
                mobile: true,
                live: true,
                callback: function(box) {
                    console.log("WOW: animating " + box.tagName.toLowerCase());
                },
                scrollContainer: null,
                resetAnimation: true
            });
            wow.init();
        }
    }

    /**
     * Add custom animation to element
     * @param {string|jQuery} element - Element selector or jQuery object
     * @param {string} animationClass - Animation class name
     * @param {number} delay - Animation delay in ms
     */
    addAnimation(element, animationClass, delay = 0) {
        const $element = typeof element === 'string' ? $(element) : element;
        
        setTimeout(() => {
            $element.addClass('animated').addClass(animationClass);
        }, delay);
    }

    /**
     * Remove animation from element
     * @param {string|jQuery} element - Element selector or jQuery object
     * @param {string} animationClass - Animation class name to remove
     */
    removeAnimation(element, animationClass) {
        const $element = typeof element === 'string' ? $(element) : element;
        $element.removeClass('animated').removeClass(animationClass);
    }

    /**
     * Create typing effect for text
     * @param {string|jQuery} element - Element selector or jQuery object
     * @param {string} text - Text to type
     * @param {number} speed - Typing speed in ms per character
     */
    typeText(element, text, speed = 100) {
        const $element = typeof element === 'string' ? $(element) : element;
        let index = 0;
        
        $element.text('');
        
        const typeInterval = setInterval(() => {
            $element.text(text.substring(0, index + 1));
            index++;
            
            if (index >= text.length) {
                clearInterval(typeInterval);
            }
        }, speed);
    }

    /**
     * Create pulse effect for elements
     * @param {string|jQuery} element - Element selector or jQuery object
     * @param {number} duration - Pulse duration in ms
     * @param {number} iterations - Number of pulses (0 for infinite)
     */
    pulseElement(element, duration = 1000, iterations = 3) {
        const $element = typeof element === 'string' ? $(element) : element;
        
        $element.css({
            'animation': `pulse ${duration}ms ease-in-out ${iterations === 0 ? 'infinite' : iterations}`
        });
        
        if (iterations > 0) {
            setTimeout(() => {
                $element.css('animation', '');
            }, duration * iterations);
        }
    }

    /**
     * Create shake effect for elements (useful for form validation)
     * @param {string|jQuery} element - Element selector or jQuery object
     */
    shakeElement(element) {
        const $element = typeof element === 'string' ? $(element) : element;
        
        $element.addClass('shake');
        
        setTimeout(() => {
            $element.removeClass('shake');
        }, 500);
    }

    /**
     * Smooth scroll to element
     * @param {string|jQuery} target - Target element selector or jQuery object
     * @param {number} duration - Scroll duration in ms
     * @param {number} offset - Offset from target in pixels
     */
    scrollToElement(target, duration = 800, offset = 0) {
        const $target = typeof target === 'string' ? $(target) : target;
        
        if ($target.length === 0) return;
        
        const targetOffset = $target.offset().top - offset;
        
        $('html, body').animate({
            scrollTop: targetOffset
        }, duration);
    }

    /**
     * Destroy animations and clean up
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        $(window).off('scroll.animations');
        $('.animate-on-scroll').removeClass('animate-on-scroll animated');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationsManager;
}

// Auto-initialize if jQuery is available
if (typeof $ !== 'undefined') {
    $(document).ready(() => {
        window.animationsManager = new AnimationsManager();
    });
}

/* language-switcher.js */
/**
 * Language Switcher Module
 * Handles language switching functionality and RTL support
 */

class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.translations = {};
        this.rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        this.init();
    }

    init() {
        this.setupLanguageSwitcher();
        this.loadTranslations();
        this.applyLanguage(this.currentLanguage);
    }

    /**
     * Setup language switcher UI and event handlers
     */
    setupLanguageSwitcher() {
        // Create language switcher if it doesn't exist
        if ($('.language-switcher').length === 0) {
            this.createLanguageSwitcher();
        }

        // Handle language change
        $('.language-switcher select').on('change', (event) => {
            const selectedLanguage = $(event.target).val();
            this.switchLanguage(selectedLanguage);
        });

        // Set current language in dropdown
        $('.language-switcher select').val(this.currentLanguage);
    }

    /**
     * Create language switcher HTML
     */
    createLanguageSwitcher() {
        const languageSwitcher = `
            <div class="language-switcher">
                <select id="languageSelect">
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                </select>
            </div>
        `;

        $('body').append(languageSwitcher);
    }

    /**
     * Switch to a different language
     * @param {string} languageCode - Language code (e.g., 'en', 'ar', 'es')
     */
    switchLanguage(languageCode) {
        this.currentLanguage = languageCode;
        this.storeLanguage(languageCode);
        this.applyLanguage(languageCode);
        this.updateDirection(languageCode);
        
        // Trigger custom event
        $(document).trigger('languageChanged', [languageCode]);
    }

    /**
     * Apply language translations to the page
     * @param {string} languageCode - Language code
     */
    applyLanguage(languageCode) {
        const translations = this.translations[languageCode];
        
        if (!translations) {
            console.warn(`Translations not found for language: ${languageCode}`);
            return;
        }

        // Apply translations to elements with data-translate attribute
        $('[data-translate]').each(function() {
            const key = $(this).data('translate');
            const translation = translations[key];
            
            if (translation) {
                if ($(this).is('input, textarea')) {
                    $(this).attr('placeholder', translation);
                } else {
                    $(this).text(translation);
                }
            }
        });

        // Update HTML lang attribute
        $('html').attr('lang', languageCode);
    }

    /**
     * Update text direction for RTL languages
     * @param {string} languageCode - Language code
     */
    updateDirection(languageCode) {
        const isRTL = this.rtlLanguages.includes(languageCode);
        const direction = isRTL ? 'rtl' : 'ltr';
        
        $('html').attr('dir', direction);
        $('body').toggleClass('rtl', isRTL);
    }

    /**
     * Load translations from external files or inline data
     */
    async loadTranslations() {
        // Default English translations
        this.translations.en = {
            'nav.home': 'Home',
            'nav.services': 'Services',
            'nav.about': 'About',
            'nav.features': 'Features',
            'nav.download': 'Download',
            'hero.title': 'Earn Money with Simple Tasks',
            'hero.subtitle': 'Complete micro-tasks and earn real money with KenzApp',
            'hero.cta': 'Get Started',
            'services.title': 'Our Services',
            'services.subtitle': 'Discover various ways to earn money',
            'about.title': 'How KenzApp Works',
            'footer.copyright': '© 2024 KenzApp. All rights reserved.'
        };

        // Arabic translations
        this.translations.ar = {
            'nav.home': 'الرئيسية',
            'nav.services': 'الخدمات',
            'nav.about': 'حول',
            'nav.features': 'المميزات',
            'nav.download': 'تحميل',
            'hero.title': 'اربح المال من المهام البسيطة',
            'hero.subtitle': 'أكمل المهام الصغيرة واربح أموال حقيقية مع كينز آب',
            'hero.cta': 'ابدأ الآن',
            'services.title': 'خدماتنا',
            'services.subtitle': 'اكتشف طرق مختلفة لكسب المال',
            'about.title': 'كيف يعمل كينز آب',
            'footer.copyright': '© 2024 كينز آب. جميع الحقوق محفوظة.'
        };

        // Try to load additional translations from external files
        try {
            const response = await fetch('/assets/translations/translations.json');
            if (response.ok) {
                const externalTranslations = await response.json();
                this.translations = { ...this.translations, ...externalTranslations };
            }
        } catch (error) {
            console.log('External translations not found, using default translations');
        }
    }

    /**
     * Get stored language from localStorage
     * @returns {string|null} - Stored language code
     */
    getStoredLanguage() {
        return localStorage.getItem('kenzapp-language');
    }

    /**
     * Store language preference in localStorage
     * @param {string} languageCode - Language code to store
     */
    storeLanguage(languageCode) {
        localStorage.setItem('kenzapp-language', languageCode);
    }

    /**
     * Get current language
     * @returns {string} - Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Check if current language is RTL
     * @returns {boolean} - True if current language is RTL
     */
    isRTL() {
        return this.rtlLanguages.includes(this.currentLanguage);
    }

    /**
     * Add translation for a specific language
     * @param {string} languageCode - Language code
     * @param {Object} translations - Translation object
     */
    addTranslations(languageCode, translations) {
        if (!this.translations[languageCode]) {
            this.translations[languageCode] = {};
        }
        
        this.translations[languageCode] = {
            ...this.translations[languageCode],
            ...translations
        };
    }

    /**
     * Get translation for a specific key
     * @param {string} key - Translation key
     * @param {string} languageCode - Language code (optional, uses current language)
     * @returns {string} - Translated text
     */
    translate(key, languageCode = this.currentLanguage) {
        const translations = this.translations[languageCode];
        return translations && translations[key] ? translations[key] : key;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
}

// Auto-initialize if jQuery is available
if (typeof $ !== 'undefined') {
    $(document).ready(() => {
        window.languageSwitcherModule = new LanguageSwitcher();
    });
}

/* navigation.js */
/**
 * Navigation Module
 * Handles navbar sticky behavior, menu active states, and mobile navigation
 */

class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.setupStickyNavbar();
        this.setupActiveMenuLinks();
        this.setupMobileNavigation();
    }

    /**
     * Setup sticky navbar behavior on scroll
     */
    setupStickyNavbar() {
        $(window).on('scroll', (event) => {
            const scroll = $(window).scrollTop();
            const navbar = $(".navbar-area");
            
            if (scroll < 20) {
                navbar.removeClass("sticky");
            } else {
                navbar.addClass("sticky");
            }
        });
    }

    /**
     * Setup active menu link highlighting based on scroll position
     */
    setupActiveMenuLinks() {
        const scrollLinks = $('.page-scroll');
        
        $(window).scroll(() => {
            const scrollbarLocation = $(window).scrollTop();

            scrollLinks.each(function() {
                const sectionOffset = $(this.hash).offset().top - 73;

                if (sectionOffset <= scrollbarLocation) {
                    $(this).parent().addClass('active');
                    $(this).parent().siblings().removeClass('active');
                }
            });
        });
    }

    /**
     * Setup mobile navigation behavior
     */
    setupMobileNavigation() {
        // Close navbar-collapse when a link is clicked
        $(".navbar-nav a").on('click', () => {
            $(".navbar-collapse").removeClass("show");
            $(".navbar-toggler").removeClass('active');
        });

        // Toggle navbar-toggler active state
        $(".navbar-toggler").on('click', function() {
            $(this).toggleClass("active");
        });
    }

    /**
     * Smooth scroll to section
     * @param {string} target - The target section selector
     * @param {number} duration - Animation duration in milliseconds
     */
    scrollToSection(target, duration = 1000) {
        const targetOffset = $(target).offset().top - 70;
        
        $('html, body').animate({
            scrollTop: targetOffset
        }, duration);
    }

    /**
     * Get current active section
     * @returns {string} - The ID of the current active section
     */
    getCurrentActiveSection() {
        const scrollPosition = $(window).scrollTop();
        let activeSection = '';

        $('.page-scroll').each(function() {
            const sectionOffset = $(this.hash).offset().top - 100;
            const sectionHeight = $(this.hash).outerHeight();

            if (scrollPosition >= sectionOffset && scrollPosition < sectionOffset + sectionHeight) {
                activeSection = this.hash;
            }
        });

        return activeSection;
    }

    /**
     * Update navigation state
     * @param {string} activeSection - The section to mark as active
     */
    updateNavigationState(activeSection) {
        $('.navbar-nav .nav-item').removeClass('active');
        $(`.navbar-nav a[href="${activeSection}"]`).parent().addClass('active');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}

// Auto-initialize if jQuery is available
if (typeof $ !== 'undefined') {
    $(document).ready(() => {
        window.navigationModule = new Navigation();
    });
}

/* ui-effects.js */
/**
 * UI Effects Module
 * Handles preloader, back-to-top button, SVG replacement, and animations
 */

class UIEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupPreloader();
        this.setupBackToTop();
        this.setupSVGReplacement();
        this.initializeAnimations();
    }

    /**
     * Setup preloader functionality
     */
    setupPreloader() {
        $(window).on('load', (event) => {
            $('.preloader').delay(500).fadeOut(500);
        });
    }

    /**
     * Setup back-to-top button functionality
     */
    setupBackToTop() {
        // Show or hide the back-to-top button based on scroll position
        $(window).on('scroll', (event) => {
            const scrollTop = $(window).scrollTop();
            const backToTopButton = $('.back-to-top');

            if (scrollTop > 600) {
                backToTopButton.fadeIn(200);
            } else {
                backToTopButton.fadeOut(200);
            }
        });

        // Animate scroll to top when button is clicked
        $('.back-to-top').on('click', (event) => {
            event.preventDefault();
            this.scrollToTop();
        });
    }

    /**
     * Smooth scroll to top of page
     * @param {number} duration - Animation duration in milliseconds
     */
    scrollToTop(duration = 1500) {
        $('html, body').animate({
            scrollTop: 0,
        }, duration);
    }

    /**
     * Setup SVG image replacement for better styling control
     */
    setupSVGReplacement() {
        $('img.svg').each(function() {
            const $img = $(this);
            const imgID = $img.attr('id');
            const imgClass = $img.attr('class');
            const imgURL = $img.attr('src');

            $.get(imgURL, (data) => {
                // Get the SVG tag, ignore the rest
                let $svg = $(data).find('svg');

                // Add replaced image's ID to the new SVG
                if (typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }

                // Add replaced image's classes to the new SVG
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }

                // Remove any invalid XML tags
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);
            }, 'xml');
        });
    }

    /**
     * Initialize WOW.js animations
     */
    initializeAnimations() {
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }
    }

    /**
     * Create a loading spinner
     * @param {string} target - Target element selector
     * @param {string} size - Spinner size ('sm', 'md', 'lg')
     */
    showLoadingSpinner(target, size = 'md') {
        const spinner = this.createSpinner(size);
        $(target).html(spinner);
    }

    /**
     * Create spinner HTML
     * @param {string} size - Spinner size
     * @returns {string} - Spinner HTML
     */
    createSpinner(size) {
        const sizeClass = `spinner-${size}`;
        return `
            <div class="spinner ${sizeClass}">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        `;
    }

    /**
     * Show notification toast
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
     * @param {number} duration - Display duration in milliseconds
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = $(`
            <div class="notification notification-${type}">
                <div class="notification-content">
                    <span class="notification-message">${message}</span>
                    <button class="notification-close">&times;</button>
                </div>
            </div>
        `);

        $('body').append(notification);
        
        // Animate in
        notification.addClass('show');

        // Auto-hide after duration
        setTimeout(() => {
            this.hideNotification(notification);
        }, duration);

        // Manual close
        notification.find('.notification-close').on('click', () => {
            this.hideNotification(notification);
        });
    }

    /**
     * Hide notification
     * @param {jQuery} notification - Notification element
     */
    hideNotification(notification) {
        notification.removeClass('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    /**
     * Animate element on scroll
     * @param {string} selector - Element selector
     * @param {string} animation - Animation class
     * @param {number} offset - Trigger offset from viewport
     */
    animateOnScroll(selector, animation, offset = 100) {
        $(window).on('scroll', () => {
            $(selector).each(function() {
                const elementTop = $(this).offset().top;
                const elementBottom = elementTop + $(this).outerHeight();
                const viewportTop = $(window).scrollTop();
                const viewportBottom = viewportTop + $(window).height();

                if (elementBottom > viewportTop + offset && elementTop < viewportBottom - offset) {
                    $(this).addClass(animation);
                }
            });
        });
    }

    /**
     * Parallax effect for elements
     * @param {string} selector - Element selector
     * @param {number} speed - Parallax speed (0-1)
     */
    parallaxEffect(selector, speed = 0.5) {
        $(window).on('scroll', () => {
            const scrolled = $(window).scrollTop();
            const parallax = scrolled * speed;
            
            $(selector).css('transform', `translateY(${parallax}px)`);
        });
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIEffects;
}

// Auto-initialize if jQuery is available
if (typeof $ !== 'undefined') {
    $(document).ready(() => {
        window.uiEffectsModule = new UIEffects();
    });
}

/* main.js */
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