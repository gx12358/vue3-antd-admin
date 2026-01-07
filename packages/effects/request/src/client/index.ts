import type { HttpResponse, RequestOptions } from '../typings'
import { deepMerge } from '@gx-design-vue/pro-utils'
import qs from 'qs'
import { ContentType } from '../typings'
import { CreateClient } from './fetch'

export function getParamsSerializer(params: any) {
  return params ? qs.stringify(params, { arrayFormat: 'repeat' }) : ''
}

class RequestClient {
  // 是否正在刷新token
  public isRefreshing = false
  // 刷新token队列
  public refreshTokenQueue: ((token: string) => void)[] = []
  public readonly baseRequest: CreateClient
  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: Partial<RequestOptions> = {}) {
    // 合并默认配置和传入的配置
    const defaultConfig = {
      method: 'get',
      timeout: 10_000,
      headers: {
        'Content-Type': ContentType.json,
      },
      // 忽略重复请求
      ignoreCancelToken: true,
      // 是否携带token
      carryToken: true,
      paramsSerializer: getParamsSerializer
    } as Partial<RequestOptions>
    const { ...axiosConfig } = options
    const requestConfig = deepMerge(defaultConfig, axiosConfig)

    this.baseRequest = new CreateClient(requestConfig)
  }

  /**
   * DELETE请求方法
   */
  public delete<T = any, R = undefined>(
    url: string,
    config?: Partial<RequestOptions>,
  ): Promise<HttpResponse<T, R>> {
    return this.request<T, R>(url, { ...config, method: 'DELETE' })
  }

  /**
   * GET请求方法
   */
  public get<T = any, R = undefined>(
    url: string,
    config?: Partial<RequestOptions>,
  ): Promise<HttpResponse<T, R>> {
    return this.request<T, R>(url, { ...config, method: 'GET' })
  }

  /**
   * POST请求方法
   */
  public post<T = any, R = undefined>(
    url: string,
    config?: Partial<RequestOptions>,
  ): Promise<HttpResponse<T, R>> {
    return this.request<T, R>(url, { ...config, method: 'POST' })
  }

  /**
   * PUT请求方法
   */
  public put<T = any, R = undefined>(
    url: string,
    config?: Partial<RequestOptions>,
  ): Promise<HttpResponse<T, R>> {
    return this.request<T, R>(url, { ...config, method: 'PUT' })
  }

  public request<T = any, R = undefined>(
    url: string,
    config?: Partial<RequestOptions>
  ): Promise<HttpResponse<T, R>> {
    if (config?.download) {
      config.responseReturn = 'body'
      config.responseType = 'blob'
    }
    if (config?.uploader) {
      config.headers = {
        ...(config.headers || {}),
        'Content-Type': ContentType.upload
      }
    }
    return this.baseRequest.request({ ...config, url })
  }
}

export {
  RequestClient
}
