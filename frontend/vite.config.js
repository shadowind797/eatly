import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from "vite-plugin-environment"

export default defineConfig({
    plugins: [EnvironmentPlugin("all"), react()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: './src/main.jsx',
        },
    },
});