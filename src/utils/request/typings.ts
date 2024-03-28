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
  requestCatchHook?: (e: Error) => boolean;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: GAxiosOptions) => GAxiosOptions;

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
  responseInterceptorsCatch?: (axiosInstance: GAxiosInstance, error: AxiosError) => void;
}

export interface GAxiosOptions extends Omit<AxiosRequestConfig, 'headers' | 'method'> {
  headers?: Record<string, any>;
  method: Method;
  isMock?: boolean; // 是否是mock
  retry?: boolean; // 是否是重试接口
  isReturnNativeResponse?: boolean; // 直接返回response，不作任何处理（包含响应值等基本信息）
  customize?: boolean; // 直接返回response.data（接口返回值），错误不做统一提示
  carryToken?: boolean; // 是否携带token
  prefix?: string; // 接口自定义前缀
  ignoreCancelToken?: boolean; // 忽略重复请求
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

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
}
