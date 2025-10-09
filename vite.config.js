import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: 'public/dist',
        manifest: true,
        rollupOptions: {
            input: 'public/js/profile.js'
        }
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
});