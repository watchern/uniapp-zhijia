/// <reference types="vite/client" />

declare module '*.vue' {
  // @ts-ignore
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  import { ToRef } from '@vue/runtime-core'
  // @ts-ignore
  export type AutoToRefs<T> = {
    [K in keyof T]: T[K] extends Function ? T[K] : ToRef<T[K]>
  }
}

declare module 'vue3-qr-reader';
