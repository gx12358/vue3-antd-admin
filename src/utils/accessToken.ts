import {
  delCookie,
  getStorage,
  removeStorage,
  setCookie,
  setStorage
} from '@/utils/storage'
import { defaultSettings } from '@gx-config'

const { storage, tokenTableName } = defaultSettings

/**
 * @Author      gx12358
 * @DateTime    2021/12/27
 * @lastTime    2021/12/27
 * @description 获取accessToken
 */
export function getAccessToken() {
  return getStorage({ key: tokenTableName, type: storage || 'localStorage' })
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 存储accessToken
 * @param accessToken
 * @returns {void|*}
 */
export function setAccessToken(accessToken: string, expired?: number) {
  if (storage) {
    if (storage === 'localStorage') {
      return setStorage({
        key: tokenTableName,
        value: accessToken,
        expired
      })
    } else if (storage === 'sessionStorage') {
      return setStorage({
        key: tokenTableName,
        value: accessToken,
        expired,
        type: 'session'
      })
    } else if (storage === 'cookie') {
      return setCookie(tokenTableName, accessToken, expired)
    } else {
      return setStorage({
        key: tokenTableName,
        value: accessToken,
        expired
      })
    }
  } else {
    return setStorage({
      key: tokenTableName,
      value: accessToken,
      expired
    })
  }
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 移除accessToken
 * @returns {void|Promise<void>}
 */
export function removeAccessToken() {
  if (storage) {
    if (storage === 'localStorage') {
      return removeStorage(tokenTableName)
    } else if (storage === 'sessionStorage') {
      return removeStorage(tokenTableName, 'session')
    } else if (storage === 'cookie') {
      return delCookie(tokenTableName)
    } else {
      return removeStorage(tokenTableName)
    }
  } else {
    return removeStorage(tokenTableName)
  }
}
