/**
 * Build Script for KenzApp Landing Page
 * Assembles modular components into a complete website
 */

const fs = require('fs');
const path = require('path');

class BuildSystem {
    constructor() {
        this.srcDir = path.join(__dirname, 'src');
        this.distDir = path.join(__dirname, 'dist');
        this.assetsDir = path.join(__dirname, 'assets');
        this.componentsDir = path.join(this.srcDir, 'components');
        this.stylesDir = path.join(this.srcDir, 'styles');
        this.scriptsDir = path.join(this.srcDir, 'scripts');
    }

    /**
     * Main build process
     */
    async build() {
        console.log('🚀 Starting build process...');
        
        try {
            // Clean and create dist directory
            this.cleanDist();
            this.createDist();
            
            // Build HTML
            await this.buildHTML();
            
            // Build CSS
            await this.buildCSS();
            
            // Build JavaScript
            await this.buildJavaScript();
            
            // Copy assets
            await this.copyAssets();
            
            console.log('✅ Build completed successfully!');
            console.log(`📁 Output directory: ${this.distDir}`);
            
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    }

    /**
     * Clean dist directory
     */
    cleanDist() {
        if (fs.existsSync(this.distDir)) {
            fs.rmSync(this.distDir, { recursive: true, force: true });
        }
    }

    /**
     * Create dist directory structure
     */
    createDist() {
        fs.mkdirSync(this.distDir, { recursive: true });
        fs.mkdirSync(path.join(this.distDir, 'css'), { recursive: true });
        fs.mkdirSync(path.join(this.distDir, 'js'), { recursive: true });
        fs.mkdirSync(path.join(this.distDir, 'assets'), { recursive: true });
    }

    /**
     * Build HTML by assembling components
     */
    async buildHTML() {
        console.log('📄 Building HTML...');
        
        // Read the original index.html as template
        const originalIndexPath = path.join(__dirname, 'index.html');
        let htmlContent = fs.readFileSync(originalIndexPath, 'utf8');
        
        // Read component files
        const components = {
            header: this.readComponent('header.html'),
            services: this.readComponent('services.html'),
            taskExamples: this.readComponent('task-examples.html'),
            about: this.readComponent('about.html'),
            testimonials: this.readComponent('testimonials.html')
        };
        
        // Create the assembled HTML
        const assembledHTML = this.createAssembledHTML(components);
        
        // Write to dist
        fs.writeFileSync(path.join(this.distDir, 'index.html'), assembledHTML);
        
        console.log('✅ HTML built successfully');
    }

    /**
     * Read component file
     * @param {string} filename - Component filename
     * @returns {string} - Component content
     */
    readComponent(filename) {
        const componentPath = path.join(this.componentsDir, filename);
        if (fs.existsSync(componentPath)) {
            return fs.readFileSync(componentPath, 'utf8');
        }
        console.warn(`⚠️  Component not found: ${filename}`);
        return '';
    }

    /**
     * Create assembled HTML document
     * @param {Object} components - Component contents
     * @returns {string} - Complete HTML document
     */
    createAssembledHTML(components) {
        return `<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>KenzApp - Earn Money with Simple Tasks</title>
    <meta name="description" content="Complete micro-tasks and earn real money with KenzApp. Flexible timers, simple tasks, and secure platform." />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="shortcut icon" type="image/x-icon" href="assets/images/favicon.svg" />
    
    <!-- CSS -->
    <link rel="stylesheet" href="css/main.css" />
    <link rel="stylesheet" href="assets/css/lineicons.css" />
    <link rel="stylesheet" href="assets/css/animate.css" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://kenzapp.com/">
    <meta property="og:title" content="KenzApp - Earn Money with Simple Tasks">
    <meta property="og:description" content="Complete micro-tasks and earn real money with KenzApp. Flexible timers, simple tasks, and secure platform.">
    <meta property="og:image" content="assets/images/og-image.jpg">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://kenzapp.com/">
    <meta property="twitter:title" content="KenzApp - Earn Money with Simple Tasks">
    <meta property="twitter:description" content="Complete micro-tasks and earn real money with KenzApp. Flexible timers, simple tasks, and secure platform.">
    <meta property="twitter:image" content="assets/images/og-image.jpg">
</head>

<body>
    <!-- Preloader -->
    <div class="preloader">
        <div class="preloader-inner">
            <div class="preloader-icon">
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
    <!-- /End Preloader -->

    ${components.header}

    ${components.services}

    ${components.taskExamples}

    ${components.about}

    ${components.testimonials}

    <!-- Start Footer Area -->
    <footer class="footer-area footer-dark">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-6 col-12">
                    <div class="single-footer">
                        <div class="logo">
                            <a href="index.html"><img src="assets/images/logo/white-logo.svg" alt="Logo"></a>
                        </div>
                        <div class="content">
                            <p class="text">Earn money by completing simple tasks on your mobile device. Join thousands of users who are already earning with KenzApp.</p>
                            <p class="text">
                                <span>Phone: +1 (555) 123-4567</span>
                                <span>Email: support@kenzapp.com</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-6 col-12">
                    <div class="single-footer">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="javascript:void(0)">About</a></li>
                            <li><a href="javascript:void(0)">Careers</a></li>
                            <li><a href="javascript:void(0)">Press</a></li>
                            <li><a href="javascript:void(0)">Blog</a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-2 col-md-6 col-12">
                    <div class="single-footer">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="javascript:void(0)">Help Center</a></li>
                            <li><a href="javascript:void(0)">Contact Us</a></li>
                            <li><a href="javascript:void(0)">FAQ</a></li>
                            <li><a href="javascript:void(0)">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 col-12">
                    <div class="single-footer">
                        <h3>Subscribe</h3>
                        <div class="subscribe-form">
                            <form action="#" method="get" target="_blank" class="newsletter-form">
                                <input name="EMAIL" placeholder="Your email address" class="common-input" type="email">
                                <button class="btn">Subscribe</button>
                            </form>
                        </div>
                        <div class="social">
                            <ul>
                                <li><a href="javascript:void(0)"><i class="lni lni-facebook-filled"></i></a></li>
                                <li><a href="javascript:void(0)"><i class="lni lni-twitter-original"></i></a></li>
                                <li><a href="javascript:void(0)"><i class="lni lni-instagram-filled"></i></a></li>
                                <li><a href="javascript:void(0)"><i class="lni lni-linkedin-original"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- End Footer Area -->

    <!-- Back to Top -->
    <a href="#" class="scroll-top">
        <i class="lni lni-chevron-up"></i>
    </a>

    <!-- JavaScript -->
    <script src="assets/js/vendor/jquery-1.12.4.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/wow.min.js"></script>
    <script src="js/main.js"></script>
</body>
</html>`;
    }

    /**
     * Build CSS by concatenating all stylesheets
     */
    async buildCSS() {
        console.log('🎨 Building CSS...');
        
        // Always concatenate CSS files instead of using @import
        const cssContent = this.concatenateCSS();
        
        // Write to dist
        fs.writeFileSync(path.join(this.distDir, 'css', 'main.css'), cssContent);
        
        console.log('✅ CSS built successfully');
    }

    /**
     * Concatenate all CSS files
     * @returns {string} - Combined CSS content
     */
    concatenateCSS() {
        let cssContent = '';
        
        // Add Google Fonts import
        cssContent += '@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700|Poppins:300,400,500,600,700&display=swap");\n\n';
        
        // Base styles
        const baseDir = path.join(this.stylesDir, 'base');
        if (fs.existsSync(baseDir)) {
            const baseFiles = ['variables.css', 'reset.css'];
            baseFiles.forEach(file => {
                const filePath = path.join(baseDir, file);
                if (fs.existsSync(filePath)) {
                    cssContent += `/* ${file} */\n`;
                    cssContent += fs.readFileSync(filePath, 'utf8') + '\n\n';
                }
            });
        }
        
        // Component styles
        const componentsDir = path.join(this.stylesDir, 'components');
        if (fs.existsSync(componentsDir)) {
            const componentFiles = fs.readdirSync(componentsDir);
            componentFiles.forEach(file => {
                if (file.endsWith('.css')) {
                    const filePath = path.join(componentsDir, file);
                    cssContent += `/* ${file} */\n`;
                    cssContent += fs.readFileSync(filePath, 'utf8') + '\n\n';
                }
            });
        }
        
        // Add utility classes from main.css
        const mainCSSPath = path.join(this.stylesDir, 'main.css');
        if (fs.existsSync(mainCSSPath)) {
            const mainCSS = fs.readFileSync(mainCSSPath, 'utf8');
            // Extract utility classes (everything after the imports)
            const utilityStart = mainCSS.indexOf('/* Utility Classes */');
            if (utilityStart !== -1) {
                cssContent += '/* Utility Classes from main.css */\n';
                cssContent += mainCSS.substring(utilityStart) + '\n\n';
            }
        }
        
        return cssContent;
    }

    /**
     * Build JavaScript by concatenating all modules
     */
    async buildJavaScript() {
        console.log('⚡ Building JavaScript...');
        
        let jsContent = '';
        
        // Add modules
        const modulesDir = path.join(this.scriptsDir, 'modules');
        if (fs.existsSync(modulesDir)) {
            const moduleFiles = fs.readdirSync(modulesDir);
            moduleFiles.forEach(file => {
                if (file.endsWith('.js')) {
                    const filePath = path.join(modulesDir, file);
                    jsContent += `/* ${file} */\n`;
                    jsContent += fs.readFileSync(filePath, 'utf8') + '\n\n';
                }
            });
        }
        
        // Add main script
        const mainJSPath = path.join(this.scriptsDir, 'main.js');
        if (fs.existsSync(mainJSPath)) {
            jsContent += '/* main.js */\n';
            jsContent += fs.readFileSync(mainJSPath, 'utf8');
        }
        
        // Write to dist
        fs.writeFileSync(path.join(this.distDir, 'js', 'main.js'), jsContent);
        
        console.log('✅ JavaScript built successfully');
    }

    /**
     * Copy assets to dist directory
     */
    async copyAssets() {
        console.log('📁 Copying assets...');
        
        if (fs.existsSync(this.assetsDir)) {
            this.copyRecursive(this.assetsDir, path.join(this.distDir, 'assets'));
        }
        
        console.log('✅ Assets copied successfully');
    }

    /**
     * Copy directory recursively
     * @param {string} src - Source directory
     * @param {string} dest - Destination directory
     */
    copyRecursive(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        entries.forEach(entry => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                this.copyRecursive(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }

    /**
     * Watch for changes and rebuild (development mode)
     */
    watch() {
        console.log('👀 Watching for changes...');
        
        const watchDirs = [this.srcDir];
        
        watchDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                fs.watch(dir, { recursive: true }, (eventType, filename) => {
                    if (filename && (filename.endsWith('.html') || filename.endsWith('.css') || filename.endsWith('.js'))) {
                        console.log(`📝 File changed: ${filename}`);
                        this.build();
                    }
                });
            }
        });
    }
}

// CLI interface
if (require.main === module) {
    const buildSystem = new BuildSystem();
    
    const args = process.argv.slice(2);
    const command = args[0] || 'build';
    
    switch (command) {
        case 'build':
            buildSystem.build();
            break;
        case 'watch':
            buildSystem.build().then(() => {
                buildSystem.watch();
            });
            break;
        case 'clean':
            buildSystem.cleanDist();
            console.log('✅ Cleaned dist directory');
            break;
        default:
            console.log('Usage: node build.js [build|watch|clean]');
    }
}

module.exports = BuildSystem;