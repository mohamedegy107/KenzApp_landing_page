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