import { resolve } from 'node:path';
import uni from '@dcloudio/vite-plugin-uni';
import AutoImportTypes from 'auto-import-types';
import PiniaAutoRefs from 'pinia-auto-refs';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import { NutResolver } from 'nutui-uniapp';

import process from 'node:process';
import fs from 'node:fs';
import env from './src/config/env';
import { viteMockServe } from 'vite-plugin-mock'

// const process_env = process.env
// console.log('process.env', process_env)

import path from 'node:path';

const ENV_DIR = path.join(__dirname, "envs");
console.log('ENV_DIR',ENV_DIR)

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const envUse = loadEnv(mode, ENV_DIR, "");
  return {
    base: './',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    plugins: [
      AutoImportTypes(),
      PiniaAutoRefs(),
      viteMockServe({
        mockPath: '_mock', // mock文件夹路径
        enable: command === 'serve' // 只有开发环境才开启mock
      }),
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
          target: env.apiBaseUrl,
          // target: 'https://zhijia-admin.vimhe.com/admins',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
});
