import type { DeepPartial, ProAliasToken as GProAliasToken } from '@gx-design-vue/pro-provider'
import type { ProColumnType as GProColumnType } from '@gx-design-vue/pro-table'
import type { CSSObject as ProCssObject } from 'ant-design-vue'
import type {
  PropType,
  VNode,
  VNodeChild,
  CSSProperties as VueCSSProperties
} from 'vue'
import Vue from 'vue'

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

  declare interface LocalResult {
    value: any;
    time: string;
    expired: number;
  }

  type ProAliasToken = DeepPartial<GProAliasToken>
  declare type CSSProperties = VueCSSProperties
  declare type ProColumnType = GProColumnType
  declare type CSSObject = ProCssObject

  // vue
  declare type Key = string | number
  declare type VuePropType<T> = PropType<T>
  declare type VueNode = VNodeChild | JSX.Element
  declare type Recordable<T = any> = Record<string, T>

  interface Fn<T = any, R = T> {
    (...arg: T[]): R;
  }

  declare interface ViteEnv {
    VITE_PORT: number;
    VITE_USE_MODE: 'development' | 'production' | 'pro';
    VITE_USE_MOCK: boolean;
    VITE_NODE_ENV: 'development' | 'production';
    VITE_USE_PWA: boolean;
    VITE_BASE_URL: string;
    VITE_APP_ENV: 'dev';
    VUE_APP_VERSION: string;
    VITE_PROXY: [ string, string ][];
    VITE_DROP_CONSOLE: boolean;
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
    VITE_LEGACY: boolean;
    VITE_HOME_PAGE: string; // 主页
    VITE_HOME_PAGE_DOC: string; // 系统文档
    VITE_GITHUB_PAGE: string; // github 地址
    VITE_GITEE_PAGE: string; // gitee 地址
  }

  declare function parseInt(s: string | number, radix?: number): number

  declare function parseFloat(string: string | number): number

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
    type Element = VNode

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
