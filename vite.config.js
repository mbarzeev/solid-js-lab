import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtoolsPlugin from '@solid-devtools/transform';

export default defineConfig({
    plugins: [
        devtoolsPlugin({
            jsxLocation: true,
            name: true,
        }),
        solidPlugin(),
    ],
    build: {
        target: 'esnext',
        polyfillDynamicImport: false,
    },
});
