import type { AxiosError } from 'axios'
import type { GAxiosInstance, GAxiosOptions, GAxiosResponse } from './typings'
import { isFunction } from '@gx-design-vue/pro-utils'
import axios from 'axios'
import { cloneDeep } from 'lodash-es'
import qs from 'qs'
import { AxiosCanceler } from './axiosCancel'
import { ContentType, RequestEnum } from './typings'

/**
 * @Author      gx12358
 * @DateTime    2023/1/6
 * @lastTime    2023/1/6
 * @description 重新定义axios
 */
export class GAxios {
  private axiosInstance: GAxiosInstance
  private readonly options: GAxiosOptions

  constructor(options: Partial<GAxiosOptions>) {
    this.options = options as GAxiosOptions
    this.axiosInstance = axios.create(options) as GAxiosInstance
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

    this.axiosInstance.interceptors.request.use<GAxiosOptions>(async (config) => {
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
    this.axiosInstance.interceptors.response.use((res: GAxiosResponse) => {
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
  supportFormData(config: GAxiosOptions) {
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

  request<T, R = undefined>(config?: Partial<GAxiosOptions>): Promise<ResponseResult<T, R>> {
    let conf = cloneDeep(config || {} as GAxiosOptions)

    conf.originOptions = cloneDeep(config)

    const opt: GAxiosOptions = Object.assign({}, this.options, conf)

    const { beforeRequestHook, requestCatchHook, transformResponseHook } = opt
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(opt)
    }

    conf = this.supportFormData(opt)

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, GAxiosResponse>(conf)
        .then((res: GAxiosResponse) => {
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              const result = transformResponseHook(res, config || {})
              resolve(result)
            } catch (error) {
              console.error('request-error', error)
              reject(error)
              return
            }
            return
          }
          resolve(res as unknown as Promise<ResponseResult<T, R>>)
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            resolve(requestCatchHook(e, config as any) as any)
            return
          }
          console.error('request-error', e)
          reject(e as any)
        })
    })
  }
}
