import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Configuración global para todos los tests
        globals: true,
        environment: 'node',

        // Excluir archivos no necesarios
        exclude: ['node_modules', 'dist', 'build', '**/*.d.ts'],

        // Configuración de reportes
        reporters: ['verbose', 'json', 'html'],

        // Configuración para mostrar tests agrupados
        outputFile: {
            json: './test-results/results.json',
            html: './test-results/index.html',
        },

        // Configuración de cobertura
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            include: ['src/**/*.{js,ts}'],
            exclude: [
                'src/**/*.test.{js,ts}',
                'src/**/*.spec.{js,ts}',
                'src/**/test/**',
                'src/**/__tests__/**',
            ],
        },

        // Timeout para tests largos
        testTimeout: 10000,

        // Setup files si necesitas configuración global
        setupFiles: [],
    },

    // Configuración para resolver módulos
    resolve: {
        alias: {
            '@': '/src',
            '@utils': '/src/_utils',
            '@types': '/src/types',
            '@generator': '/src/generator',
            '@parser': '/src/parser',
            '@middleware': '/src/middleware',
            '@integration': '/src/integration',
            '@hooks': '/src/hooks',
            '@templates': '/src/templates',
        },
    },
});
