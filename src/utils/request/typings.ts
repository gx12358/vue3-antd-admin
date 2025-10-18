import type {
  AxiosError,
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosInterceptorOptions,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Method
} from 'axios'

export interface GAxiosResponse<T = any> extends Omit<AxiosResponse, 'data' | 'config'> {
  data: T;
  config: Omit<GAxiosOptions, 'headers'>;
}

export interface CancelOptions {
  cancel: (key?: string) => void,
  cancelAll: () => void;
  reset: () => void
}

export interface XhtInstance {
  /**
   * @Author      gx12358
   * @DateTime    2023/1/6
   * @lastTime    2023/1/6
   * @description 请求之前处理config
   */
  beforeRequestHook?: (config: GAxiosOptions) => GAxiosOptions;

  /**
   * @Author      gx12358
   * @DateTime    2023/11/3
   * @lastTime    2023/11/3
   * @description 请求之前返回cancel函数
   */
  cancelCallBackHook?: ({ cancel, cancelAll, reset }: CancelOptions) => void;

  /**
   * @description: 处理响应数据
   */
  transformResponseHook?: (res: GAxiosResponse, options: Partial<GAxiosOptions>) => any;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: Partial<GAxiosOptions>) => boolean;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: GAxiosOptions) => GAxiosOptions | Promise<GAxiosOptions>;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: GAxiosResponse) => GAxiosResponse;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: AxiosError) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: AxiosError) => Promise<any>;
}

export interface GAxiosOptions extends Omit<AxiosRequestConfig, 'headers' | 'method' | 'url'> {
  url: string;
  method: Method;
  headers?: Record<string, any>;
  body?: AxiosRequestConfig['data'];
  isMock?: boolean; // 是否是mock
  originOptions?: Partial<GAxiosOptions>
  retry?: boolean; // 是否是重试接口
  needAllResponseContent?: boolean; // 直接返回response，不作任何处理（包含响应值等基本信息）
  customize?: boolean; // 直接返回response.data（接口返回值），错误不做统一提示
  carryToken?: boolean; // 是否携带token
  prefix?: string; // 接口自定义前缀
  proxyUrl?: string;
  baseUrl?: keyof ViteEnv | false; // api 前缀（个别接口有不同的gateway -- 环境变量控制）
  ignoreCancelToken?: boolean; // 忽略重复请求
  ignoreErrorMessage?: boolean; // 错误信息不展示
  cancelKey?: string; // 取消请求key（用来需要请求）
  /**
   * @Author      gx12358
   * @DateTime    2023/1/6
   * @lastTime    2023/1/6
   * @description 请求之前处理config
   */
  beforeRequestHook?: XhtInstance['beforeRequestHook'];

  /**
   * @Author      gx12358
   * @DateTime    2023/11/3
   * @lastTime    2023/11/3
   * @description 请求之前返回cancel函数
   */
  cancelCallBackHook?: XhtInstance['cancelCallBackHook'];

  /**
   * @description: 处理响应数据
   */
  transformResponseHook?: XhtInstance['transformResponseHook'];

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: XhtInstance['requestCatchHook'];

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: XhtInstance['requestInterceptors'];

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: XhtInstance['responseInterceptors'];

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: XhtInstance['requestInterceptorsCatch'];

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: XhtInstance['responseInterceptorsCatch'];
}

export interface GAxiosInstance extends Omit<AxiosInstance, 'interceptors'> {
  (config: GAxiosOptions): AxiosPromise<ResponseResult>;

  (url: string, config?: GAxiosOptions): AxiosPromise<ResponseResult>;

  interceptors: {
    request: Omit<AxiosInterceptorManager<InternalAxiosRequestConfig>, 'use'> & {
      use<V>(
        onFulfilled?: ((value: V) => V | Promise<V>) | null,
        onRejected?: ((error: any) => any) | null,
        options?: AxiosInterceptorOptions
      ): number;
    };
    response: Omit<AxiosInterceptorManager<AxiosResponse>, 'use'> & {
      use<V>(
        onFulfilled?: ((value: V) => V | Promise<V>) | null,
        onRejected?: ((error: any) => any) | null,
        options?: AxiosInterceptorOptions
      ): number;
    };
  }
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const ContentType = {
  json: 'application/json',
  stream: 'text/event-stream',
  audio: 'audio/mpeg',
  form: 'application/x-www-form-urlencoded; charset=UTF-8',
  download: 'application/octet-stream', // for download
  downloadZip: 'application/zip', // for download
  upload: 'multipart/form-data', // for upload
}
