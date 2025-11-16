declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

/// <reference types="unplugin-turbo-console/client" />

/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const Component: DefineComponent<Record<any, any>, Record<any, any>, any>
  export default component
}

declare module 'diagram-js/lib/navigation/movecanvas' {}

declare module '*.tsx' {
  import Vue from 'compatible-vue'

  export default Vue
}

declare module 'virtual:*' {
  const result: any
  export default result
}

declare global {
  namespace JSX {
    interface Element extends VNode {}

    interface ElementClass extends Vue {}

    interface ElementAttributesProperty {
      $props: any
    }

    interface IntrinsicElements {
      [elem: string]: any
    }

    interface IntrinsicAttributes {
      [elem: string]: any
    }
  }
}
