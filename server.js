/**
 * Simple Development Server for KenzApp Landing Page
 * Serves the built website for testing and development
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

class DevServer {
    constructor(port = 3000, distDir = 'dist') {
        this.port = port;
        this.distDir = path.join(__dirname, distDir);
        this.mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject'
        };
    }

    /**
     * Start the development server
     */
    start() {
        // Check if dist directory exists
        if (!fs.existsSync(this.distDir)) {
            console.error('❌ Dist directory not found. Please run "npm run build" first.');
            process.exit(1);
        }

        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(this.port, () => {
            console.log(`🚀 Development server started!`);
            console.log(`📁 Serving files from: ${this.distDir}`);
            console.log(`🌐 Local: http://localhost:${this.port}`);
            console.log(`🔗 Network: http://${this.getLocalIP()}:${this.port}`);
            console.log(`\n💡 Press Ctrl+C to stop the server`);
        });

        // Handle server shutdown gracefully
        process.on('SIGINT', () => {
            console.log('\n👋 Shutting down development server...');
            server.close(() => {
                console.log('✅ Server stopped');
                process.exit(0);
            });
        });
    }

    /**
     * Handle incoming HTTP requests
     * @param {http.IncomingMessage} req - Request object
     * @param {http.ServerResponse} res - Response object
     */
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url);
        let pathname = parsedUrl.pathname;

        // Default to index.html for root path
        if (pathname === '/') {
            pathname = '/index.html';
        }

        // Construct file path
        const filePath = path.join(this.distDir, pathname);
        const ext = path.extname(filePath).toLowerCase();

        // Log request
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                this.send404(res, pathname);
                return;
            }

            // Check if it's a directory
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    this.send500(res, err);
                    return;
                }

                if (stats.isDirectory()) {
                    // Try to serve index.html from directory
                    const indexPath = path.join(filePath, 'index.html');
                    fs.access(indexPath, fs.constants.F_OK, (err) => {
                        if (err) {
                            this.sendDirectoryListing(res, filePath, pathname);
                        } else {
                            this.serveFile(res, indexPath, '.html');
                        }
                    });
                } else {
                    this.serveFile(res, filePath, ext);
                }
            });
        });
    }

    /**
     * Serve a file
     * @param {http.ServerResponse} res - Response object
     * @param {string} filePath - Path to file
     * @param {string} ext - File extension
     */
    serveFile(res, filePath, ext) {
        const contentType = this.mimeTypes[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                this.send500(res, err);
                return;
            }

            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(data);
        });
    }

    /**
     * Send 404 Not Found response
     * @param {http.ServerResponse} res - Response object
     * @param {string} pathname - Requested path
     */
    send404(res, pathname) {
        const html404 = `
<!DOCTYPE html>
<html>
<head>
    <title>404 - Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #e74c3c; }
        p { color: #666; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>404 - Not Found</h1>
    <p>The requested file <strong>${pathname}</strong> was not found.</p>
    <p><a href="/">← Back to Home</a></p>
</body>
</html>`;

        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(html404);
    }

    /**
     * Send 500 Internal Server Error response
     * @param {http.ServerResponse} res - Response object
     * @param {Error} error - Error object
     */
    send500(res, error) {
        const html500 = `
<!DOCTYPE html>
<html>
<head>
    <title>500 - Internal Server Error</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #e74c3c; }
        p { color: #666; }
        .error { background: #f8f8f8; padding: 20px; margin: 20px; text-align: left; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>500 - Internal Server Error</h1>
    <p>An error occurred while processing your request.</p>
    <div class="error">
        <strong>Error:</strong> ${error.message}
    </div>
    <p><a href="/">← Back to Home</a></p>
</body>
</html>`;

        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(html500);
        console.error('Server Error:', error);
    }

    /**
     * Send directory listing
     * @param {http.ServerResponse} res - Response object
     * @param {string} dirPath - Directory path
     * @param {string} urlPath - URL path
     */
    sendDirectoryListing(res, dirPath, urlPath) {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                this.send500(res, err);
                return;
            }

            const fileList = files.map(file => {
                const filePath = path.join(dirPath, file);
                const stats = fs.statSync(filePath);
                const isDir = stats.isDirectory();
                const href = path.join(urlPath, file).replace(/\\/g, '/');
                
                return `<li><a href="${href}">${file}${isDir ? '/' : ''}</a></li>`;
            }).join('');

            const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Directory Listing - ${urlPath}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
        ul { list-style: none; padding: 0; }
        li { padding: 5px 0; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Directory Listing - ${urlPath}</h1>
    <ul>
        ${urlPath !== '/' ? '<li><a href="../">../</a></li>' : ''}
        ${fileList}
    </ul>
</body>
</html>`;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    }

    /**
     * Get local IP address
     * @returns {string} - Local IP address
     */
    getLocalIP() {
        const { networkInterfaces } = require('os');
        const nets = networkInterfaces();
        
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if (net.family === 'IPv4' && !net.internal) {
                    return net.address;
                }
            }
        }
        
        return 'localhost';
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const port = parseInt(args[0]) || 3000;
    const distDir = args[1] || 'dist';
    
    const server = new DevServer(port, distDir);
    server.start();
}

module.exports = DevServer;