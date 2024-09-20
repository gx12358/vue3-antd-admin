import type { AxiosError } from 'axios'
import type { GAxiosInstance, GAxiosOptions, GAxiosResponse } from './typings'
import { isFunction } from '@gx-design-vue/pro-utils'
import axios from 'axios'
import { cloneDeep } from 'lodash-es'
import qs from 'qs'
import { AxiosCanceler } from './axiosCancel'
import { ContentTypeEnum, RequestEnum } from './typings'

export const getPendingUrl = (config: GAxiosOptions) => config.cancelKey || [ config.method, config.url ].join(
  '&')

/**
 * @Author      gx12358
 * @DateTime    2023/1/6
 * @lastTime    2023/1/6
 * @description 重新定义axios
 */
export class GAxios {
  private axiosInstance: GAxiosInstance
  private readonly options: GAxiosOptions

  constructor(options: GAxiosOptions) {
    this.options = options
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

    this.axiosInstance.interceptors.request.use<GAxiosOptions>((config) => {
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
        config = requestInterceptors(config)
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
        axiosCanceler.removePending(error.config)

        return responseInterceptorsCatch(this.axiosInstance, error)
      }
    )
  }

  // support form-data
  supportFormData(config: GAxiosOptions) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (contentType !== ContentTypeEnum.FORM_URLENCODED || !Reflect.has(
      config,
      'data'
    ) || config.method?.toUpperCase() === RequestEnum.GET) {
      return config
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' })
    }
  }

  request<T = ResponseResult | boolean>(config: GAxiosOptions): Promise<T> {
    let conf: GAxiosOptions = cloneDeep(config)

    const opt: GAxiosOptions = Object.assign({}, this.options, conf)

    const { beforeRequestHook, requestCatchHook, transformResponseHook } = opt
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(opt)
    }

    conf = this.supportFormData(opt)

    return new Promise((resolve) => {
      this.axiosInstance
        .request<any, GAxiosResponse>(conf)
        .then((res: GAxiosResponse) => {
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              const ret = transformResponseHook(res, config)
              resolve(ret)
              // eslint-disable-next-line unused-imports/no-unused-vars
            } catch (_err) {
              resolve(false as unknown as Promise<T>)
              return
            }
            return
          }
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            resolve(requestCatchHook(e) as any)
            return
          }
          resolve(false as any)
        })
    })
  }
}
