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