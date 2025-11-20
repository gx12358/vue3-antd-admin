import type { AxiosError } from 'axios'
import type { HttpResponse, RequestInstance, RequestOptions, RequestResponse } from '../typings'
import { deepMerge, isFunction } from '@gx-design-vue/pro-utils'
import axios from 'axios'
import { cloneDeep } from 'lodash-es'
import qs from 'qs'
import { ContentType, RequestEnum } from '../typings'
import { AxiosCanceler } from './cancel'

export class CreateClient {
  private axiosInstance: RequestInstance
  private readonly options: RequestOptions

  constructor(options: Partial<RequestOptions>) {
    this.options = options as RequestOptions
    this.axiosInstance = axios.create(options) as RequestInstance
    this.setupInterceptors()
  }

  /**
   * @description: Interceptor configuration 拦截器配置
   */
  private setupInterceptors() {
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch
    } = this.options

    const axiosCanceler = new AxiosCanceler(this.options.ignoreCancelToken)

    this.axiosInstance.interceptors.request.use<RequestOptions>(async (config) => {
      const { cancelCallBackHook } = config
      axiosCanceler.addPending(config)
      if (cancelCallBackHook) {
        cancelCallBackHook({
          reset: axiosCanceler.reset,
          cancel: (key?: string) => axiosCanceler.removePending(config, key),
          cancelAll: axiosCanceler.removeAllPending
        })
      }
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = await requestInterceptors(config)
      }
      return config
    }, undefined)

    // Request interceptor error capture
    requestInterceptorsCatch && isFunction(requestInterceptorsCatch) && this.axiosInstance.interceptors.request.use(
      undefined,
      requestInterceptorsCatch
    )

    // Response result interceptor processing
    this.axiosInstance.interceptors.response.use((res: RequestResponse) => {
      res && axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors)) {
        return responseInterceptors(res)
      }
      return res
    }, undefined)

    // Response result interceptor error capture
    responseInterceptorsCatch && isFunction(responseInterceptorsCatch) && this.axiosInstance.interceptors.response.use(
      undefined,
      (error) => {
        return responseInterceptorsCatch(error)
      }
    )
  }

  // support form-data
  supportFormData(config: RequestOptions) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    const hasBody = Reflect.has(config, 'data') || Reflect.has(config, 'body')

    if (contentType !== ContentType.form || !hasBody || config.method?.toUpperCase() === RequestEnum.GET) {
      return config
    }

    const body = config.data ?? config.body

    return {
      ...config,
      data: qs.stringify(body, { arrayFormat: 'brackets' })
    }
  }

  request<T, R = undefined>(options: Partial<RequestOptions> = {}): Promise<HttpResponse<T, R>> {
    let requestConfig = cloneDeep(options) as RequestOptions

    requestConfig.originOptions = cloneDeep(requestConfig)

    const axiosConfig = deepMerge<RequestOptions>(requestConfig, { ...this.options }, {
      omitNil: true,
      omitEmpty: true
    })

    const { beforeRequestHook, requestCatchHook, transformResponseHook } = axiosConfig
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      requestConfig = beforeRequestHook(axiosConfig)
    }

    requestConfig = this.supportFormData(axiosConfig)

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, RequestResponse>(requestConfig)
        .then((res: RequestResponse) => {
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              const result = transformResponseHook(res, requestConfig || {})
              resolve(result)
            } catch (error) {
              reject(error)
            }
            return
          }
          resolve(res as any)
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, requestConfig))
            return
          }
          reject(e as any)
        })
    })
  }
}
