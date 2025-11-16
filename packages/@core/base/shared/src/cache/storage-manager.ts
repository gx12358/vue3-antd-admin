import { isJSONStr, isNumber, isObject, isString } from '@gx-design-vue/pro-utils'
import dayjs from 'dayjs'
import { Decrypt, Encrypt, typeViteEnv } from '../utils'
import { isPro } from '../utils/env'

export type LocalStorageKey = 'localStorage' | 'sessionStorage' | 'cookie'

// 存储本地类型
export interface LocalStorageResult<T = any> {
  value: T;
  time: string;
  expired: number;
}

export interface SetItemProps {
  key: string;
  value: any;
  isOrigin?: boolean;
  expired?: number;
  encryption?: boolean;
  type?: LocalStorageKey;
}

export interface GetItemProps {
  key: string;
  encryption?: boolean;
  type?: LocalStorageKey;
  isOrigin?: boolean;
}

export interface RemoveItemProps {
  key: string;
  isOrigin?: boolean;
  type?: LocalStorageKey;
}

/**
 * @Author      gx12358
 * @DateTime    2019-09-24
 * @lastTime    2019-09-24
 * @description 获取Cookie-name
 */
export function getCookies(cname: string) {
  const name = `${cname}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return decodeURIComponent(c.substring(name.length, c.length))
    }
  }
  return ''
}

/**
 * @Author      gx12358
 * @DateTime    2019-09-24
 * @lastTime    2019-09-24
 * @description 获取Cookiedomin
 */
export function GetCookieDomain() {
  let host = location.hostname
  const ip = /^(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  if (ip.test(host) === true || host === 'localhost')
    return host
  // eslint-disable-next-line regexp/optimal-quantifier-concatenation
  const regex = /([\s\S]*).*/
  const match = host.match(regex)
  if (typeof match !== 'undefined' && match !== null) {
    const someIndex = 1
    host = match[someIndex]
  }
  if (typeof host !== 'undefined' && host !== null) {
    const strAry = host.split('.')
    if (strAry.length > 1) {
      host = `${strAry[strAry.length - 2]}.${strAry[strAry.length - 1]}`
    }
  }
  return `.${host}`
}

function handleStorageValue(value: string) {
  if (isJSONStr(value))
    return JSON.parse(value)
  return value
}

function isEncryption(status?: boolean) {
  return isPro() ? !!status : false
}

export function getStorageKey(key: string, isOrigin?: boolean) {
  const { version, name } = __GX_PRO_ADMIN_METADATA__
  if (isOrigin) return key
  return `${name}_${version}_${typeViteEnv('VITE_USE_MODE')}_${key}`
}

class CreateStorage {
  public storageKey: (key: string, isOrigin?: boolean) => string
  public encryption: (status?: boolean) => boolean

  constructor(props?: {
    storageKey?: (key: string, isOrigin?: boolean) => string;
    encryption?: (status?: boolean) => boolean;
  }) {
    this.storageKey = props?.storageKey ?? getStorageKey
    this.encryption = props?.encryption ?? isEncryption
  }

  getStorage<T = any>({
    key,
    isOrigin,
    type = 'localStorage',
    encryption = true
  }: GetItemProps): T {
    const storageValue = type === 'localStorage'
      ? localStorage.getItem(this.storageKey(key, isOrigin))
      : type === 'sessionStorage'
        ? sessionStorage.getItem(this.storageKey(key, isOrigin))
        : this.getCookie(this.storageKey(key, isOrigin))
    const result: string | LocalStorageResult = storageValue
      ? this.encryption(encryption) ? Decrypt(storageValue) : handleStorageValue(storageValue)
      : ''
    if (result && isObject(result)) {
      if (result.expired) {
        const expiredStatus = dayjs().diff(dayjs(result.time)) >= result.expired
        if (expiredStatus) {
          this.removeStorage({ key, isOrigin, type })
          return '' as T
        }
      }
    } else if (result && isString(result)) {
      return isJSONStr(result) ? JSON.parse(result) : result as T
    }
    return typeof result === 'string' ? result as T : result?.['value'] || result || ''
  }

  setStorage({
    key,
    value,
    expired,
    isOrigin,
    type = 'localStorage',
    encryption = true
  }: SetItemProps) {
    const result: LocalStorageResult = isOrigin
      ? value
      : {
        value,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        expired: expired || 0
      }
    const storageValue = this.encryption(encryption)
      ? Encrypt(JSON.stringify(result))
      : isString(result) || isNumber(result) ? result : JSON.stringify(result)
    if (type === 'localStorage') localStorage.setItem(this.storageKey(key, isOrigin), storageValue)
    else if (type === 'cookie') this.setCookie(this.storageKey(key, isOrigin), storageValue)
    else sessionStorage.setItem(this.storageKey(key, isOrigin), storageValue)
  }

  removeStorage({
    key,
    isOrigin,
    type = 'localStorage'
  }: RemoveItemProps) {
    if (type === 'localStorage') localStorage.removeItem(this.storageKey(key, isOrigin))
    else if (type === 'cookie') this.delCookie(this.storageKey(key, isOrigin))
    else sessionStorage.removeItem(this.storageKey(key, isOrigin))
  }

  getCookie(cname: string) {
    const result = getCookies(cname)
    if (result === '') {
      return ''
    }
    return decodeURIComponent(result)
  }

  setCookie(cname: string, cvalue: string, exdays?: number) {
    const d = new Date()
    d.setTime(d.getTime() + (exdays || 365) * 24 * 60 * 60 * 1000)
    const expires = `=${d.toUTCString()}`
    document.cookie = `${cname}=${encodeURIComponent(
      cvalue
    )}; expires=${expires}; domain=${GetCookieDomain()}; path=/`
  }

  delCookie(name: string) {
    const exp = new Date()
    exp.setTime(exp.getTime() - 1)
    const cval = getCookies(name)
    if (cval !== null) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${GetCookieDomain()}; path=/`
    }
  }
}

export {
  CreateStorage
}
