import {
  delCookie,
  getCookie,
  getStorage,
  removeStorage,
  setCookie,
  setStorage
} from '@/utils/storage'
import { defaultSettings } from '@gx-config'

const { storage, storageName } = defaultSettings.token

/**
 * @Author      gx12358
 * @DateTime    2021/12/27
 * @lastTime    2021/12/27
 * @description 获取accessToken
 */
export function getAccessToken() {
  if (storage) {
    if (storage === 'localStorage') {
      return getStorage({ key: storageName, originKey: true })
    } else if (storage === 'sessionStorage') {
      return getStorage({ key: storageName, type: 'session', originKey: true })
    } else if (storage === 'cookie') {
      return getCookie(storageName)
    } else {
      return getStorage({ key: storageName, originKey: true })
    }
  } else {
    return getStorage({ key: storageName, originKey: true })
  }
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
        key: storageName,
        originKey: true,
        value: accessToken,
        expired
      })
    } else if (storage === 'sessionStorage') {
      return setStorage({
        key: storageName,
        originKey: true,
        value: accessToken,
        expired,
        type: 'session'
      })
    } else if (storage === 'cookie') {
      return setCookie(storageName, accessToken, expired)
    } else {
      return setStorage({
        key: storageName,
        originKey: true,
        value: accessToken,
        expired
      })
    }
  } else {
    return setStorage({
      key: storageName,
      originKey: true,
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
      return removeStorage({ key: storageName, originKey: true })
    } else if (storage === 'sessionStorage') {
      return removeStorage({ key: storageName, type: 'session', originKey: true })
    } else if (storage === 'cookie') {
      return delCookie(storageName)
    } else {
      return removeStorage({ key: storageName, originKey: true })
    }
  } else {
    return removeStorage({ key: storageName, originKey: true })
  }
}
