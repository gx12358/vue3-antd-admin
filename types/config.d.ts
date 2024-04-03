declare interface CdnModuleList {
  name: string;
  globalName: string;
  path: string;
  css?: string;
}

declare interface SettingConfig {
  publicPath: string;
  outputDir: string;
  assetsDir: string;
  title: string;
  shortName: string;
  titleSeparator: string;
  titleReverse: boolean;
  waterMark: boolean;
  waterMarkTitle: string;
  viewScrollRoot: string;
  useCdn: boolean;
  cdnUrl: string;
  cdnModules: CdnModuleList[];
  useProxy: boolean;
  requestPrefix: string;
  proxyTarget: string | Record<string, any>;
  mockPrefixUrl?: string;
  devPort: number;
  copyright: string;
  keepAliveMaxNum: number;
  routerMode: string;
  routesWhiteList: string[];
  tokenName: string;
  tokenTableName: string;
  storage: 'localStorage' | 'sessionStorage' | 'cookie';
  recordRoute: boolean;
  loginInterception: boolean;
  loginRSA: boolean;
  authentication: 'all' | 'front';
  checkMockToken: boolean;
}

declare interface NetworkConfig {
  requestTimeout: number;
  successCode: (string | number)[];
}
