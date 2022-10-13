import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import axios, { Axios, AxiosPromise } from 'axios'
import qs from 'qs'
import { message } from 'ant-design-vue'
import config from '/config/config'
import router from '@/router'
import { useStoreUser } from '@gx-vuex'
import { isDev } from '@/utils'
import { tansParams } from '@/utils/util'
import { checkURL, isBoolean } from '@/utils/validate'
import { AxiosCanceler } from './axios/axiosCancel'

export interface CreateAxiosOptions extends AxiosRequestConfig {
  headers?: any;
  isMock?: boolean;
  customize?: boolean;
  carryToken?: boolean;
  ignoreCancelToken?: boolean;
}

export interface GAxiosInstance extends Axios {
  (config: CreateAxiosOptions): AxiosPromise<ResponseResult>;

  (url: string, config?: CreateAxiosOptions): AxiosPromise<ResponseResult>;
}

let loadingInstance

const { debounce, tokenName, requestPrefix } = config.defaultSettings

const { contentType, requestTimeout, successCode } = config.network

const axiosCanceler = new AxiosCanceler()

/**
 * @author gx12358 2539306317@qq.com
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code: number, msg: string) => {
  const user = useStoreUser()
  setTimeout(() => {
    switch (code) {
      case 401:
        message.error(msg || '登录失效')
        user.resetPermissions()
        router.push({ path: '/user/login' })
        break
      case 403:
        router.push({ path: '/exception/403' })
        break
      default:
        message.error(msg || `后端接口${code}异常`)
        break
    }
  })
}
/**
 * @author gx12358 2539306317@qq.com
 * @description axios初始化
 */
const instance: GAxiosInstance = axios.create({
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType
  }
})
/**
 * @author gx12358 2539306317@qq.com
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
  (config: CreateAxiosOptions) => {
    const user = useStoreUser()

    const {
      headers: { ignoreCancelToken }
    } = config

    const carryToken = isBoolean(config.carryToken) ? config.carryToken : true

    const ignoreCancel =
      ignoreCancelToken !== undefined
        ? ignoreCancelToken
        : config?.ignoreCancelToken || true
    !ignoreCancel && axiosCanceler.addPending(config)

    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    if (!checkURL(config.url)) {
      if (config.isMock) {
        config.url = `/mock-server${config.url}`
      } else {
        config.url = `${import.meta.env.VITE_BASE_URL}${isDev ? requestPrefix || '' : ''}${config.url}`
      }
    }

    if (user.accessToken && carryToken)
      (config).headers[tokenName] = user.accessToken

    if (
      config.data &&
      config.headers['Content-Type'] ===
      'application/x-www-form-urlencoded;charset=UTF-8'
    )
      config.data = qs.stringify(config.data)
    if (debounce.some((item) => config.url?.includes(item))) {
      //这里写加载动画
    }
    return config
  },
  (error: Error | AxiosError) => {
    return Promise.reject(error)
  }
)
/**
 * @author gx12358 2539306317@qq.com
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response: AxiosResponse<any>): Promise<ResponseResult | boolean> => {
    response && axiosCanceler.removePending(response.config as CreateAxiosOptions)
    if (loadingInstance) loadingInstance.close()
    const { data, config } = response
    const { code, msg = '', message = '' } = data as ResponseResult
    // 操作正常Code数组
    const codeVerificationArray = successCode
    // 是否操作正常
    if ((config as CreateAxiosOptions).customize)
      return data
    else if (codeVerificationArray.includes(code))
      return data
    else {
      handleCode(code, msg || message)
      return Promise.resolve(false)
    }
  },
  (error: AxiosError): Promise<ResponseResult | boolean> => {
    if (loadingInstance) loadingInstance.close()
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
  }
)

const request: (opt?: CreateAxiosOptions) => Promise<ResponseResult> = async (opt) => await instance.request(opt)

export default request
