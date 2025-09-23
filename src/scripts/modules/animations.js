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