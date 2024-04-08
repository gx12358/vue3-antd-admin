declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const Component: DefineComponent<Record<any, any>, Record<any, any>, any>
  export default component
}

declare module 'virtual:*' {
  const result: any
  export default result
}
