import type { RequestOptions, ResponseError } from '@gx/request'
import type { ResponseResult } from '@gx/types/request'
import { app, networkSetting } from '@gx-config'
import { checkURL, isDev } from '@gx-core/shared/utils'
import { isBoolean } from '@gx-design-vue/pro-utils'
import { ContentType, errorStatus, fetchWithRetry, refreshAccessTokenOrRelogin, RequestClient, RequestEnum } from '@gx/request'
import { message } from 'ant-design-vue'
import { accessToken } from '@/utils/accessToken'
import { typeViteEnv } from '@/utils/env'

const { token } = app
const { name } = token
const { timeout, successCode } = networkSetting

export function apiUrl(url: string) {
  const prefix = isDev() ? typeViteEnv('VITE_PROXY_PREFIX') : ''
  const baseUrl = typeViteEnv('VITE_BASE_URL')
  return `${prefix}${baseUrl}${url}`
}

async function authRefreshToken() {
  const storeUser = useStoreUser()
  const storePermission = useStorePermission()
  const { refreshToken } = accessToken.getAccessToken()

  const url = apiUrl(`/system/auth/refresh-token?refreshToken=${refreshToken}`)
  const [error, ret] = await fetchWithRetry(globalThis.fetch(url, {
    method: RequestEnum.POST,
    headers: {
      'Content-Type': ContentType.json,
      'tenant-id': storePermission.tenantId,
      'visit-tenant-id': storePermission.visitTenantId,
    } as any,
  }))
  if (error) {
    return Promise.reject(error)
  }
  else {
    if (ret.status === 401)
      return Promise.reject(ret)

    const response = await ret.json() as ResponseResult<{ accessToken: string; }>
    const token = response.data.accessToken
    storeUser.setState({ token })
    accessToken.setAccessToken({ token })
    return token
  }
}

function errorMessageResponseInterceptor(client: RequestClient, error: ResponseError) {
  try {
    return errorStatus({
      client,
      error,
      // 这里可以根据实际需要，来使用刷新token，不需要的可以删除
      refreshToken: () => refreshAccessTokenOrRelogin({
        timeout,
        doRefreshToken: authRefreshToken
      }),
      formatToken: token => ({
        [name]: `Bearer ${token}`,
      }),
      // 这里是创建错误信息组件， 默认使用 antd 的 message.error，其他组件库可以自行实现
      createMessages: (msg, axiosError) => {
        // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
        // 当前接口返回的错误字段是 error 或者 message
        const responseData: any = axiosError?.response?.data
        const errorMessage = responseData?.error ?? responseData?.message ?? ''
        // 如果没有错误信息，则会根据状态码进行提示
        message.error(errorMessage || msg)
      },
      expiredToken: async () => {
        const storeUser = useStoreUser()
        try {
          await storeUser.userLogout()
        } finally {
          setTimeout(() => {
            const loginUrl = `${globalThis.location.origin}/user/login`
            globalThis.location.href = loginUrl
          }, 60)
        }
      }
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
      // 重试接口或者是http的接口都不需要走业务逻辑处理，直接使用
      if (!checkURL(config.url) && !config.retry) config.url = apiUrl(config.url || '')
      return config
    },
    // 请求拦截器处理
    requestInterceptors: (config) => {
      const storeUser = useStoreUser()
      const storePermission = useStorePermission()
      const carryToken = isBoolean(config.carryToken) ? config.carryToken : true
      if (carryToken) {
        config.headers = {
          ...(config.headers || {}),
          [name]: `Bearer ${storeUser.token}`,
          'tenant-id': storePermission.tenantId,
          'visit-tenant-id': storePermission.visitTenantId,
        }
      }
      return config
    },
    // 处理响应数据。如果数据不是预期格式，可直接抛出错误
    transformResponseHook: (response, options) => {
      const { responseReturn, retry } = options
      // 重试接口直接返回上一个处理的结果
      if (retry) return response

      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (responseReturn === 'raw') {
        return response
      }
      // 不进行任何处理，直接返回
      // 用于页面代码可能需要直接获取code，data，message这些信息时开启
      if (responseReturn === 'body') {
        return response.data
      }

      // 直接给到res.data => data
      try {
        if (response.status >= 200 && response.status < 400) {
          const { code, message = '', data } = response.data as ResponseResult

          const codeVerificationArray = successCode

          // 这里逻辑可以根据项目进行修改
          const hasSuccess = codeVerificationArray.includes(code)
          if (hasSuccess) return data

          const error = new Error(message || '内部服务器错误，请稍后再试。') as ResponseError
          error.response = {
            ...response,
            status: code
          }
          error.config = response.config
          return errorMessageResponseInterceptor(client, error)
        }
        return Promise.reject(Object.assign({}, response, { response }))
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 响应错误处理
    responseInterceptorsCatch: (error) => {
      try {
        return errorMessageResponseInterceptor(client, error)
      } catch (e) {
        console.error('responseInterceptorsCatch', e)
        return Promise.reject(e)
      }
    },
  })

  return client
}

export const requestClient = createRequestClient()
