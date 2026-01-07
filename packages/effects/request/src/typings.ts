import type { ResponseResult } from '@gx/types/request'
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

export interface ResponseError extends Omit<AxiosError, 'config' | 'response'> {
  response: RequestResponse
  config: RequestOptions
}

export interface RequestResponse<T = any> extends Omit<AxiosResponse, 'data' | 'config'> {
  data: T;
  config: Omit<RequestOptions, 'headers'>;
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
  beforeRequestHook?: (config: RequestOptions) => RequestOptions;

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
  transformResponseHook?: (response: RequestResponse, options: Partial<RequestOptions>) => any;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: Partial<RequestOptions>) => void;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: RequestOptions) => RequestOptions | Promise<RequestOptions>;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (response: RequestResponse) => RequestResponse;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: ResponseError) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: ResponseError) => Promise<any>;
}

export interface RequestOptions extends Omit<AxiosRequestConfig, 'headers' | 'method' | 'url'> {
  url: string;
  method: Method;
  // 是否上传
  uploader?: boolean;
  // 是否下载
  download?: boolean;
  headers?: Record<string, any>;
  body?: AxiosRequestConfig['data'];
  isMock?: boolean; // 开启Mock接口
  originOptions?: Partial<RequestOptions>
  retry?: boolean; // 是否是重试接口
  /**
   * 响应数据的返回方式。
   * - raw: 原始的AxiosResponse，包括headers、status等，不做是否成功请求的检查。
   * - body: 返回响应数据的BODY部分（只会根据status检查请求是否成功，忽略对code的判断，这种情况下应由调用方检查请求是否成功）。
   * - data: 解构响应的BODY数据，只返回其中的data节点数据（会检查status和code是否为成功状态）。
   */
  responseReturn?: 'raw' | 'data' | 'body'; // 直接返回response，不作任何处理（包含响应值等基本信息）
  carryToken?: boolean; // 是否携带token
  prefix?: string; // 接口自定义前缀
  proxyUrl?: string;
  baseUrl?: string; // api 前缀（个别接口有不同的gateway -- 环境变量控制）
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

export interface RequestInstance extends Omit<AxiosInstance, 'interceptors'> {
  (config: RequestOptions): AxiosPromise<ResponseResult>;

  (url: string, config?: RequestOptions): AxiosPromise<ResponseResult>;

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

export type HttpResponse<T, R = undefined> = R extends undefined ? T : ResponseResult<T, R>

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
