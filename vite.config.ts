import { resolve } from 'node:path';
import uni from '@dcloudio/vite-plugin-uni';
import AutoImportTypes from 'auto-import-types';
import PiniaAutoRefs from 'pinia-auto-refs';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import { NutResolver } from 'nutui-uniapp';

import env from './src/config/env';

// https://vitejs.dev/config/
export default defineConfig({
  base:'./',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    AutoImportTypes(),
    PiniaAutoRefs(),
    AutoImport({
      dts: 'src/auto-imports.d.ts',
      imports: [
        'vue',
        'uni-app',
        'pinia',
        {
          '@/helper/pinia-auto-refs': ['useStore']
        }
      ],
      exclude: ['createApp'],
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      resolvers: [NutResolver()],
      extensions: ['vue'],
      dts: 'src/components.d.ts'
    }),
    uni(),
    Unocss()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@import '@/static/css/custom_theme.scss';@import 'nutui-uniapp/styles/variables.scss';"
      }
    }
  },
  server: {
    open: true,
    base: './ ',
    proxy: {
      '^/api': {
        // target: env.apiBaseUrl,
        target: 'https://zhijia-admin.vimhe.com/admins',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
