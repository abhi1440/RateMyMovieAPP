import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace 'RateMyMovie' with your actual repo name if different
export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:4000', // Your backend port for local dev
                changeOrigin: true,
                secure: false,
            },
        },
    },
});