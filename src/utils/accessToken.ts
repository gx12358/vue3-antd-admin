import { defaultSettings } from '@gx-config'
import {
  getStorage,
  removeStorage,
  setStorage
} from '@/utils/storage'

const { storage } = defaultSettings.token

const { type = 'localStorage', refreshName, name } = storage

/**
 * @Author      gx12358
 * @DateTime    2021/12/27
 * @lastTime    2021/12/27
 * @description 获取accessToken
 */
export function getAccessToken() {
  return {
    token: getStorage({ key: name, originKey: true, type }),
    refreshToken: getStorage({ key: refreshName, originKey: true, type }),
  }
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 存储accessToken
 * @param accessToken
 * @returns {void|*}
 */
export function setAccessToken({ token, refreshToken }: { token: string; refreshToken?: string }) {
  if (refreshToken) {
    setStorage({
      key: refreshName,
      originKey: true,
      value: refreshToken,
    })
  }
  setStorage({
    key: name,
    type,
    originKey: true,
    value: token,
  })
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 移除accessToken
 * @returns {void|Promise<void>}
 */
export function removeAccessToken() {
  removeStorage({ key: name, originKey: true, type })
  removeStorage({ key: refreshName, originKey: true, type })
}
