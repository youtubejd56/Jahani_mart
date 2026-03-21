import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                cookieDomainRewrite: {
                    '*': 'localhost'
                },
                configure: (proxy, options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        proxyReq.setHeader('Referer', 'http://localhost:8000');
                    });
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        // Copy cookies from backend to frontend
                        const cookies = proxyRes.headers['set-cookie'];
                        if (cookies) {
                            proxyRes.headers['set-cookie'] = cookies.map(cookie =>
                                cookie.replace('Domain=localhost', 'Domain=localhost')
                            );
                        }
                    });
                },
            },
        },
    },
});
