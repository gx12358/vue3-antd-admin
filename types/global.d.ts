import type { AppRouteModule as GProAppRouteModule, MenuDataItem } from '@gx-design-vue/pro-layout'
import type { DeepPartial, ProAliasToken as GProAliasToken } from '@gx-design-vue/pro-provider'
import type { ProColumnsType as GProColumnsType, ProColumnType as GProColumnType } from '@gx-design-vue/pro-table'
import type { CSSObject as ProCssObject } from 'ant-design-vue'
import type { PropType, VNode, CSSProperties as VueCSSProperties } from 'vue'
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
  declare type ProColumnType<DataValue = any, SearchParama = RecordType> = GProColumnType<DataValue, SearchParama>
  declare type ProColumnsType<DataValue = any, SearchParama = RecordType> = GProColumnsType<DataValue, SearchParama>
  declare type CSSObject = ProCssObject
  declare type AppRouteModule = GProAppRouteModule
  declare type CSSObject = ProCssObject

  // vue
  declare type VuePropType<T> = PropType<T>
  declare type Recordable<T = any> = Record<string, T>

  interface Fn<T = any, R = T> {
    (...arg: T[]): R;
  }

  declare interface SystemMenuItem extends Omit<MenuDataItem, 'children'> {
    children?: SystemMenuItem[]
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
    interface Element extends VNode {}

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
