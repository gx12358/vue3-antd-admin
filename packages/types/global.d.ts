declare type Recordable<T = any> = Record<string, T>

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare interface ViteEnv {
  VITE_USE_MODE: 'development' | 'production' | 'pro'
  VITE_NODE_ENV: 'development' | 'production'
  VITE_APP_ENV: 'dev' | 'pro'
  VITE_APP_VERSION: string
}

declare const __GX_PRO_ADMIN_METADATA__: {
  name: string;
  authorEmail: string;
  authorName: string;
  authorUrl: string;
  buildTime: string;
  dependencies: Record<string, string>;
  description: string;
  devDependencies: Record<string, string>;
  homepage: string;
  license: string;
  repositoryUrl: string;
  version: string;
}

declare interface DefaultResult<T> {
  code: number;
  message?: string;
  data: T;
}

declare type ResponseResult<T = any, R = undefined> = R extends undefined
  ? DefaultResult<T>
  : DefaultResult<T> & R

declare interface PageResult<T> {
  list: T[];
  totalCount: number;
}
