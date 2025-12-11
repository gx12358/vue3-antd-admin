import { requestClient } from '@/services/base'
import * as SystemUserProfileApi from './typing'

export { SystemUserProfileApi }

/** 获取登录用户信息 */
export function getUserProfile() {
  return requestClient.get<SystemUserProfileApi.UserProfileRespVO>(
    '/system/user/profile/get',
  )
}

/** 修改用户个人信息 */
export function updateUserProfile(
  data: SystemUserProfileApi.UpdateProfileReqVO,
) {
  return requestClient.put('/system/user/profile/update', {
    data
  })
}

/** 修改用户个人密码 */
export function updateUserPassword(
  data: SystemUserProfileApi.UpdatePasswordReqVO,
) {
  return requestClient.put('/system/user/profile/update-password', {
    data
  })
}
