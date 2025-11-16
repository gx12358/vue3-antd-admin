import type { RequestOptions } from '@gx/request'
import type { AxiosError } from 'axios'
import { app, networkSetting } from '@gx-config'
import { checkURL, isDev, tansParams } from '@gx-core/shared/utils'
import { isBoolean } from '@gx-design-vue/pro-utils'
import { ContentType, errorStatus, fetchWithRetry, refreshAccessTokenOrRelogin, RequestClient, RequestEnum } from '@gx/request'
import { message } from 'ant-design-vue'
import { accessToken } from '@/utils/accessToken'
import { typeViteEnv } from '@/utils/env'

const { mock, token } = app

const { timeout, successCode } = networkSetting

export function apiUrl(url: string, mock?: { prefix: string; isMock: boolean }) {
  const isMock = isBoolean(typeViteEnv('VITE_IS_MOCK')) ? typeViteEnv('VITE_IS_MOCK') : mock?.isMock
  const prefix = isDev() && !isMock ? typeViteEnv('VITE_PROXY_PREFIX') : ''
  const baseUrl = isMock ? mock?.prefix : typeViteEnv('VITE_BASE_URL')

  return `${prefix}${baseUrl}${url}`
}

async function authRefreshToken() {
  const { refreshToken } = accessToken.getAccessToken()

  const url = apiUrl('/refresh-token')
  const [error, ret] = await fetchWithRetry(globalThis.fetch(url, {
    method: RequestEnum.POST,
    headers: {
      'Content-Type': ContentType.json
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  }))
  if (error) {
    return Promise.reject(error)
  }
  else {
    if (ret.status === 401)
      return Promise.reject(ret)

    const { data } = await ret.json()
    const response = data as ResponseResult<{ token: string; refreshToken: string }>
    accessToken.setAccessToken({ token: response.data.token, refreshToken: response.data.refreshToken })
  }
}

function errorMessageResponseInterceptor(error: AxiosError) {
  try {
    return errorStatus({
      error,
      makeErrorMessage: (msg, innerError) => {
        // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
        // 当前mock接口返回的错误字段是 error 或者 message
        const responseData: any = innerError?.response?.data ?? {}
        const errorMessage = responseData?.error ?? responseData?.message ?? ''
        // 如果没有错误信息，则会根据状态码进行提示
        message.error(errorMessage || msg)
      },
      refreshTokenFn: () => refreshAccessTokenOrRelogin({
        timeout,
        doRefreshToken: authRefreshToken
      })
    })
  } catch (e) {
    return Promise.reject(e)
  }
}

function createRequestClient(options?: RequestOptions) {
  const client = new RequestClient({
    ...(options || {}),
    timeout,
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
        config.url = apiUrl(config.url || '', { prefix: mock.prefix, isMock: config.isMock! })
      }

      return config
    },
    // 请求拦截器处理
    requestInterceptors: (config) => {
      const user = useStoreUser()
      const { name } = token
      const carryToken = isBoolean(config.carryToken) ? config.carryToken : true
      if (carryToken) {
        config.headers = {
          [name]: user.token,
          ...(config.headers || {})
        }
      }
      return config
    },
    // 处理响应数据。如果数据不是预期格式，可直接抛出错误
    transformResponseHook: (res, options) => {
      const { responseReturn } = options
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (responseReturn === 'raw') {
        return res
      }
      // 不进行任何处理，直接返回
      // 用于页面代码可能需要直接获取code，data，message这些信息时开启
      if (responseReturn === 'body') {
        return res.data
      }

      try {
        if (res.status >= 200 && res.status < 400) {
          const { data }: { data: ResponseResult } = res
          const { code, message = '' } = data

          const codeVerificationArray = successCode

          // 这里逻辑可以根据项目进行修改
          const hasSuccess = codeVerificationArray.includes(code)
          if (hasSuccess) {
            return data
          }

          const error = new Error(message || '内部服务器错误，请稍后再试。') as AxiosError
          error.status = code
          return errorMessageResponseInterceptor(error)
        }
        return Promise.reject(Object.assign({}, res, { res }))
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 响应错误处理
    responseInterceptorsCatch: (error) => {
      try {
        return errorMessageResponseInterceptor(error)
      } catch (e) {
        console.error('responseInterceptorsCatch', e)
        return Promise.reject(e)
      }
    },
  })

  return client
}

export const requestClient = createRequestClient()
