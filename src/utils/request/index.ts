import type { AxiosError } from 'axios'
import type { GAxiosOptions, GAxiosResponse } from './typings'
import { defaultSettings, network } from '@gx-config'
import { isBoolean } from '@gx-design-vue/pro-utils'
import { useStoreUser } from '@/store'
import { tansParams } from '@/utils/util'
import { checkURL } from '@/utils/validate'
import { handleCode } from './checkStatus'
import { ContentType, RequestEnum } from './typings'
import { getRequestUrl } from './utils'
import { GAxios } from './XHR'

const { token, mock } = defaultSettings

const { requestTimeout: TIME_OUT, successCode } = network

const baseRequest = new GAxios({
  method: 'get',
  timeout: TIME_OUT,
  headers: {
    'Content-Type': ContentType.json,
  },
  // 忽略重复请求
  ignoreCancelToken: true,
  // 是否携带token
  carryToken: true,
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res, options) => {
    const { customize, needAllResponseContent } = options
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (needAllResponseContent) {
      return res
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (customize) {
      return res.data
    }

    try {
      if (res.status === 200) {
        const { data }: { data: ResponseResult } = res
        if (!data) {
          const message = new Error('请求出错，请稍候重试')
          return Promise.reject(message)
        }
        //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
        const { code, message = '' } = data

        const codeVerificationArray = successCode

        // 这里逻辑可以根据项目进行修改
        const hasSuccess = codeVerificationArray.includes(code)
        if (hasSuccess) {
          return data
        }

        // 在此处根据自己项目的实际情况对不同的code执行不同的操作
        // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
        return handleCode({
          status: code,
          response: res,
          error: new Error(message) as AxiosError,
          instance: baseRequest,
        })
      }

      return res
    } catch (e) {
      console.error('transformResponseHook', e)
      return Promise.reject(e)
    }
  },

  // 请求之前处理config
  beforeRequestHook: (config) => {
    // get请求映射params参数
    if (config.method?.toUpperCase() === RequestEnum.GET && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    if (!checkURL(config.url)) {
      config.url = getRequestUrl(config.url || '', { prefix: mock.prefix, isMock: config.isMock! })
    }

    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config) => {
    const { name } = token
    const user = useStoreUser()
    const carryToken = isBoolean(config.carryToken) ? config.carryToken : true
    if (user.token && carryToken) {
      if (config.headers) {
        config.headers[name] = user.token
      } else {
        config.headers = {
          [name]: user.token
        }
      }
    }
    return config
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res) => {
    return res
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error) => {
    const response = error.response as unknown as GAxiosResponse
    try {
      return handleCode({
        instance: baseRequest,
        response,
        error,
      })
    } catch (e) {
      console.error('responseInterceptorsCatch', e)
      return Promise.reject(e)
    }
  },
})

const request: <T = any, R = undefined>(config: GAxiosOptions) => Promise<ResponseResult<T, R>> = (config) => {
  return baseRequest.request(config)
}

export const get: <T = any, R = undefined>(url: GAxiosOptions['url'], config?: Partial<GAxiosOptions>) => Promise<ResponseResult<T, R>> = (url, config = {}) => {
  return request({ ...config, url, method: 'get' })
}

export const post: <T = any, R = undefined>(url: GAxiosOptions['url'], config?: Partial<GAxiosOptions>) => Promise<ResponseResult<T, R>> = (url, config = {}) => {
  return request({ ...config, url, method: 'post' })
}

export const put: <T = any, R = undefined>(url: GAxiosOptions['url'], config?: Partial<GAxiosOptions>) => Promise<ResponseResult<T, R>> = (url, config = {}) => {
  return request({ ...config, url, method: 'put' })
}

export const del: <T = any, R = undefined>(url: GAxiosOptions['url'], config?: Partial<GAxiosOptions>) => Promise<ResponseResult<T, R>> = (url, config = {}) => {
  return request({ ...config, url, method: 'delete' })
}

export const patch: <T = any, R = undefined>(url: GAxiosOptions['url'], config?: Partial<GAxiosOptions>) => Promise<ResponseResult<T, R>> = (url, config = {}) => {
  return request({ ...config, url, method: 'patch' })
}

export default request
