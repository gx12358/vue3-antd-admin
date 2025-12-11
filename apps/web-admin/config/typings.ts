import type { LocalStorageKey } from '@gx-core/shared/cache'
import type { ThemeValue } from '@gx-design-vue/context'

export interface CdnModuleList {
  name: string;
  globalName: string;
  path: string;
  css?: string;
}

export type SystemRoutesAuth = 'all' | 'front'

export interface SettingConfig {
  server: {
    port: number;
  };
  build: {
    publicPath: string;
    outputDir: string;
    assetsDir: string;
  };
  system: {
    title: string;
    shortName: string;
    titleSeparator: string;
    titleReverse: boolean;
    theme: {
      value: ThemeValue;
      storageKey: string;
    };
    waterMark: {
      use: boolean;
      content: string;
    };
    viewScrollRoot: string;
    copyright: string;
    keepAliveMaxNum: number;
    router: {
      mode: 'hash' | 'browser';
      whiteList: string[];
      recordRoute: boolean;
      auth: SystemRoutesAuth;
      rootPath?: string;
    }
    loginInterception: boolean;
    loginRSA: boolean;
  };
  cdn: {
    use: boolean;
    url: string;
    modules?: CdnModuleList[]
  };
  proxy: {
    use: boolean;
    target: string | Record<string, any>;
  };
  token: {
    name: string;
    storage: {
      name: string;
      refreshName: string;
      type: LocalStorageKey
    }
  };
}

export interface NetworkConfig {
  timeout: number;
  successCode: (string | number)[];
}
