import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@/lib': path.resolve(__dirname, 'src/dashboard/Innovator/lib'),
            '@innovator': path.resolve(__dirname, 'src/dashboard/Innovator'),
            '@problemsolver': path.resolve(__dirname, 'src/dashboard/ProblemSolver'),
            '@advisor': path.resolve(__dirname, 'src/dashboard/Advisor'),
            '@client': path.resolve(__dirname, 'src/dashboard/Client'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8000', // or whatever your Express port is
                changeOrigin: true,
            },
        },
    },
    test: {
        globals: true,
    }
})