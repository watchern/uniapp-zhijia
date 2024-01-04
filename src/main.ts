import 'uno.css';
import { createSSRApp } from 'vue';
import App from './App.vue';
import store from '@/store';
// #ifdef H5
import QrReader from 'vue3-qr-reader';
// #endif
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入中文语言包

dayjs.locale('zh-cn');
export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  // #ifdef H5
  app.use(QrReader);
  // #endif
  return {
    app
  };
}
