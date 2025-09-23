/**
 * Site Configuration
 * Centralized configuration for the Kenz landing page
 * Following SOLID principles - Single Responsibility
 */

const SiteConfig = {
    // Site Information
    site: {
        title: {
            en: "Kenz - Professional Task Completion Platform",
            ar: "كنز  - منصة إنجاز المهام المهنية"
        },
        description: "Kenz is a professional task completion platform being developed with planned integrations to top offerwall and survey networks. Join our beta community and prepare for future earning opportunities through legitimate micro-tasks with secure payouts upon full launch.",
        url: "https://kenzapp.com",
        favicon: "assets/images/kenz-favicon.svg"
    },

    // API Configuration
    api: {
        baseUrl: "https://api.kenzapp.com/v1",
        endpoints: {
            userRegister: "/users/register",
            taskComplete: "/tasks/complete",
            webhookCallback: "/webhook/callback"
        },
        timeout: 30000
    },

    // UI Configuration
    ui: {
        animations: {
            preloaderDelay: 500,
            fadeOutDuration: 500,
            scrollOffset: 73
        },
        breakpoints: {
            mobile: 575,
            tablet: 767,
            desktop: 991,
            large: 1200
        }
    },

    // Language Configuration
    languages: {
        default: "en",
        supported: ["en", "ar"],
        rtl: ["ar"]
    },

    // Component Configuration
    components: {
        navbar: {
            stickyOffset: 20,
            collapseOnClick: true
        },
        preloader: {
            enabled: true,
            minDisplayTime: 500
        },
        backToTop: {
            showOffset: 300,
            scrollDuration: 800
        }
    },

    // External Services
    services: {
        analytics: {
            enabled: false,
            trackingId: ""
        },
        maps: {
            enabled: false,
            apiKey: ""
        }
    },

    // Build Configuration
    build: {
        minify: true,
        sourceMaps: false,
        outputDir: "dist"
    }
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteConfig;
} else if (typeof window !== 'undefined') {
    window.SiteConfig = SiteConfig;
}