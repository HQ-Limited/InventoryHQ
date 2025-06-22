import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
    plugins: [react(), mkcert()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5042',
                changeOrigin: true,
            },
        },
    },
});
