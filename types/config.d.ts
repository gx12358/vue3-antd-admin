declare interface CdnModuleList {
  name: string;
  globalName: string;
  path: string;
  css?: string;
}

declare interface SettingConfig {
  servive: {
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
    waterMark: {
      use: boolean;
      content: string;
    };
    viewScrollRoot: string;
    copyright: string;
    keepAliveMaxNum: number;
    routerMode: string;
    routesWhiteList: string[];
    recordRoute: boolean;
    loginInterception: boolean;
    loginRSA: boolean;
    authentication: 'all' | 'front';
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
  mock: {
    prefix: string;
    // 0 校验是否有token值 1 校验是否有token值且token时有效的（mock用户） -1 不校验
    checkToken: -1 | 0 | 1;
  };
  token: {
    name: string;
    storage: 'localStorage' | 'sessionStorage' | 'cookie';
    storageName: string;
  };
}

declare interface NetworkConfig {
  requestTimeout: number;
  successCode: (string | number)[];
}
