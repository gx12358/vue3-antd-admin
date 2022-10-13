import type {
  Slot,
  VNode,
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
  PropType as VuePropType
} from 'vue'

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

  // vue
  declare type Key = string | number;
  declare type PropType<T> = VuePropType<T>;
  declare type VueNode = VNodeChild | JSX.Element;

  declare type WithFalse<T> = T | false;

  declare type RecordType = Record<string, any>;

  declare type CustomRender =
    | Slot
    | VNodeChild
    | VNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((...props: any[]) => Slot)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((...props: any[]) => VNode)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((...args: any[]) => VNode)
    | VNode[]
    | JSX.Element
    | string
    | null
    | undefined

  declare type GProVueNode = VueNode | VueNode[] | WithFalse<() => CustomRender>;

  declare type Nullable<T> = T | null;
  declare type Recordable<T = any> = Record<string, T>;
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  declare type TimeoutHandle = ReturnType<typeof setTimeout>;

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  declare interface WheelEvent {
    path?: EventTarget[];
  }

  declare interface ViteEnv {
    VITE_PORT: number;
    VITE_USE_MODE: string;
    VITE_USE_MOCK: boolean;
    VITE_NODE_ENV: string;
    VITE_USE_PWA: boolean;
    VITE_BASE_URL: string;
    VITE_APP_ENV: string;
    VUE_APP_VERSION: string;
    VUE_APP_AUTHOR: any;
    VITE_PROXY: [ string, string ][];
    VITE_USE_CDN: boolean;
    VITE_DROP_CONSOLE: boolean;
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
    VITE_LEGACY: boolean;
    VITE_GENERATE_UI: string;
  }

  declare type Breakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

  declare function parseInt(s: string | number, radix?: number): number;

  declare function parseFloat(string: string | number): number;

  namespace JSX {
    type Element = VNode;

    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new(): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>;
}

