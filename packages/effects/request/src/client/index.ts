import type { RequestOptions } from '../typings'
import { deepMerge } from '@gx-design-vue/pro-utils'
import { ContentType } from '../typings'
import { CreateClient } from './fetch'

class RequestClient {
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
    } as Partial<RequestOptions>
    const { ...axiosConfig } = options
    const requestConfig = deepMerge<RequestOptions>(defaultConfig as RequestOptions, axiosConfig)

    this.baseRequest = new CreateClient(requestConfig)
  }

  /**
   * DELETE请求方法
   */
  public delete<T = any, R = undefined>(
    url: string,
    config?: Partial<RequestOptions>,
  ): Promise<ResponseResult<T, R>> {
    return this.request<T, R>(url, { ...config, method: 'DELETE' })
  }

  /**
   * GET请求方法
   */
  public get<T = any, R = undefined>(
    url: string,
    config?: Partial<RequestOptions>,
  ): Promise<ResponseResult<T, R>> {
    return this.request<T, R>(url, { ...config, method: 'GET' })
  }

  /**
   * POST请求方法
   */
  public post<T = any, R = undefined>(
    url: string,
    config?: Partial<RequestOptions>,
  ): Promise<ResponseResult<T, R>> {
    return this.request<T, R>(url, { ...config, method: 'POST' })
  }

  /**
   * PUT请求方法
   */
  public put<T = any, R = undefined>(
    url: string,
    config?: Partial<RequestOptions>,
  ): Promise<ResponseResult<T, R>> {
    return this.request<T, R>(url, { ...config, method: 'PUT' })
  }

  public request<T = any, R = undefined>(
    url: string,
    config?: Partial<RequestOptions>
  ): Promise<ResponseResult<T, R>> {
    return this.baseRequest.request({ ...config, url })
  }
}

export {
  RequestClient
}
