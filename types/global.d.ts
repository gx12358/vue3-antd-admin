import type {
  VNode,
  VNodeChild,
  CSSProperties as VueCSSProperties,
  PropType,
} from 'vue'
import Vue from 'vue'
import type { CSSObject as ProCssObject } from 'ant-design-vue'
import type { ProColumnType as GProColumnType } from '@gx-design-vue/pro-table'

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  }

  declare type LocalResult = {
    value: any;
    time: string;
    expired: number;
  }

  declare type CSSProperties = VueCSSProperties
  declare type ProColumnType = GProColumnType
  declare type CSSObject = ProCssObject

  // vue
  declare type Key = string | number;
  declare type VuePropType<T> = PropType<T>;
  declare type VueNode = VNodeChild | JSX.Element;

  declare type Recordable<T = any> = Record<string, T>;

  declare type Nullable<T> = T | null;
  declare type Recordable<T = any> = Record<string, T>;

  declare interface ViteEnv {
    VITE_PORT: number;
    VITE_USE_MODE: 'development' | 'production' | 'pro';
    VITE_USE_MOCK: boolean;
    VITE_NODE_ENV: 'development' | 'production';
    VITE_USE_PWA: boolean;
    VITE_BASE_URL: string;
    VITE_APP_ENV: 'dev';
    VUE_APP_VERSION: string;
    VUE_APP_AUTHOR: any;
    VITE_OSS_BUCKET: string;
    VITE_OSS_ORIGIN: string;
    VITE_PROXY: [ string, string ][];
    VITE_DROP_CONSOLE: boolean;
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
    VITE_LEGACY: boolean;
    VITE_GENERATE_UI: string;
  }

  declare function parseInt(s: string | number, radix?: number): number;

  declare function parseFloat(string: string | number): number;

  class FilerobotImageEditor {
    constructor(selector: HTMLElement, options: any) {
    }
  }

  interface Window {
    editorConfig: {
      isFirstRenderCropUpdated?: boolean
    };
    FilerobotImageEditor?: any
  }

  namespace JSX {
    type Element = VNode;

    interface ElementClass extends Vue {}

    interface ElementAttributesProperty {
      $props: any;
    }

    interface IntrinsicElements {
      [elem: string]: any;
    }

    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}
