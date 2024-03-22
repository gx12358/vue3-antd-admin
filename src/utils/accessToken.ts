import { defaultSettings } from '@gx-config'
import {
  setStorage,
  getStorage,
  removeStorage,
  setCookie,
  delCookie
} from '@/utils/storage'

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
    if ('localStorage' === storage) {
      return setStorage({
        key: tokenTableName,
        value: accessToken,
        expired
      })
    } else if ('sessionStorage' === storage) {
      return setStorage({
        key: tokenTableName,
        value: accessToken,
        expired,
        type: 'session'
      })
    } else if ('cookie' === storage) {
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
    if ('localStorage' === storage) {
      return removeStorage(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return removeStorage(tokenTableName, 'session')
    } else if ('cookie' === storage) {
      return delCookie(tokenTableName)
    } else {
      return removeStorage(tokenTableName)
    }
  } else {
    return removeStorage(tokenTableName)
  }
}
