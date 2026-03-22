import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
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
        build: {
            // Set the base path for production deployment
            base: env.VITE_BASE_URL || '/',
        },
    };
});
