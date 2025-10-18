import type { AxiosError } from 'axios'
import type { GAxiosOptions, GAxiosResponse } from './typings'
import { network } from '@gx-config'
import { isString } from '@gx-design-vue/pro-utils'
import { Button, message as Toast } from 'ant-design-vue'
import { globalConfirm } from '@/components/GlobalLayout/Confirm'
import { router } from '@/router'
import { useStoreUser } from '@/store'
import { refreshAccessTokenOrRelogin } from '@/utils/request/refresh-token'
import { asyncRunSafe } from '@/utils/util'
import { GAxios } from './XHR'

const { requestTimeout: TIME_OUT } = network

let model
let isLoggingIn = false

/**
 * @author gx12358 2539306317@qq.com
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
export const handleCode = async (options: {
  response: GAxiosResponse
  instance: GAxios
  error: AxiosError
  status?: number;
}) => {
  const user = useStoreUser()

  let status = options.status || options.response?.status || 500
  status = isString(status) ? Number(status) : status
  const message = options.error.message || 'unknown error'
  const error = new Error(message)
  const config = options.response?.config as GAxiosOptions
  if (status === 204) {
    return {
      code: 200,
      data: null,
      message: 'success'
    }
  }

  if (status === 401) {
    try {
      if (user.refreshToken) {
        const [refreshErr] = await asyncRunSafe(refreshAccessTokenOrRelogin(TIME_OUT))
        if (refreshErr === null)
          return options.instance?.request<any>(config?.originOptions)
      }

      if (isLoggingIn || model) return

      isLoggingIn = true
      model = globalConfirm({
        title: '系统提示',
        content: `登录状态已过期，请重新登录`,
        closable: false,
        footer: h('div', {
          class: 'confirm-btn'
        }, h(Button, {
          type: 'primary',
          onClick: () => {
            isLoggingIn = false
            user.resetPermissions()
            router.push({ path: '/user/login' })
            model.destroy()
          }
        }, '重新登录'))
      })
      return Promise.reject(error)
    } catch (e) {
      console.error('checkStatus', e)
      return Promise.reject(e)
    }
  }

  if (!config?.ignoreErrorMessage) {
    Toast.error(message || 'Server Error')
  }
  return Promise.reject(error)
}
