import push from '@/hooks/systemPush'
import { App } from '@vue/runtime-core'

export const globalProperties = {
  install(app: App){
    // 定义全局 $push
    // #ifdef APP
    app.config.globalProperties.$push= push
    // #endif
  }
}
