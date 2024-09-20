import type { GAxiosOptions, XhtInstance } from './typings'
import { useStoreUser } from '@/store'
import { isDev, typeViteEnv } from '@/utils/env'
import { tansParams } from '@/utils/util'
import { checkURL } from '@/utils/validate'
import { defaultSettings, network } from '@gx-config'
import { isBoolean } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { handleCode } from './checkStatus'
import { RequestEnum } from './typings'
import { GAxios } from './XHR'

const { tokenName, requestPrefix, mockPrefixUrl } = defaultSettings

const { requestTimeout, successCode } = network

const xhtInstance: XhtInstance = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res, options) => {
    const { customize, isReturnNativeResponse } = options
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (customize) {
      return res.data
    }
    // 错误的时候返回

    const { data }: { data: ResponseResult } = res
    if (!data) {
      throw new Error('请求出错，请稍候重试')
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, msg = '', message = '' } = data

    const codeVerificationArray = successCode

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = codeVerificationArray.includes(code)
    if (hasSuccess) {
      return data
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    handleCode(code, message || msg)

    return Promise.resolve(false)
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
      if (config.isMock) {
        config.url = `${mockPrefixUrl}${config.url}`
      } else {
        config.url = `${typeViteEnv('VITE_BASE_URL')}${isDev ? requestPrefix || '' : ''}${config.url}`
      }
    }

    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config) => {
    const user = useStoreUser()
    const carryToken = isBoolean(config.carryToken) ? config.carryToken : true
    if (user.accessToken && carryToken)
      config.headers[tokenName] = user.accessToken
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
  responseInterceptorsCatch: (_, error) => {
    const { response } = error
    let errorMessage = error.message || ''
    if (error.response && error.response.data) {
      const { status } = response
      handleCode(status, errorMessage)
      return Promise.resolve(false)
    } else {
      if (errorMessage === 'Network Error') {
        errorMessage = '后端接口连接异常'
      }
      if (errorMessage.includes('timeout')) {
        errorMessage = '后端接口请求超时'
      }
      if (errorMessage.includes('Request failed with status code')) {
        const code = errorMessage.substr(errorMessage.length - 3)
        errorMessage = '后端接口' + code || '' + '异常'
      }
      message.error(errorMessage || `后端接口未知异常`)
      return Promise.resolve(false)
    }
  },
  /**
   * @description: 处理响应错误数据
   */
  requestCatchHook: () => false
}

function createXhr(opt?: Partial<GAxiosOptions>) {
  return new GAxios({
    method: 'get',
    timeout: requestTimeout,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    // 忽略重复请求
    ignoreCancelToken: true,
    // 是否携带token
    carryToken: true,
    ...xhtInstance,
    ...opt
  })
}

const request: <T = any, R = undefined>(opt?: GAxiosOptions) => Promise<ResponseResult<T, R>> = opt => createXhr().request(opt)

export default request
