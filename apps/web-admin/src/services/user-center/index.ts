import { requestClient } from '@/services/base'
import * as AuthApi from './typing'

export * from './account'

export { AuthApi }

export function loginApi(data) {
  return requestClient.post<AuthApi.LoginResult>('/system/auth/login', {
    data
  })
}

/** 刷新 accessToken */
export function refreshTokenApi(refreshToken: string) {
  return requestClient.post(
    `/system/auth/refresh-token?refreshToken=${refreshToken}`,
  )
}

export function logoutApi() {
  return requestClient.get('/system/auth/logout')
}

export function registerApi(data) {
  return requestClient.post('/user/register', {
    data,
  })
}

/** 获取权限信息 */
export async function getAuthPermissionInfoApi() {
  return requestClient.get<AuthApi.AuthPermissionInfo>(
    '/system/auth/get-permission-info',
  )
}
