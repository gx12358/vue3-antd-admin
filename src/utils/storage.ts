import { isJSONStr, isNumber, isObject, isString } from '@gx-design-vue/pro-utils'
import dayjs from 'dayjs'
import { Decrypt, Encrypt } from './crypto'
import { isPro, typeViteEnv } from './env'

function isEncryption(status: boolean) {
  return isPro() ? status : false
}

function handleStorageValue(value: string) {
  if (isJSONStr(value))
    return JSON.parse(value)
  return value
}

/**
 * @Author      gx12358
 * @DateTime    2019/12/3
 * @lastTime    2019/12/3
 * @description 设置Local-key的规则
 */
export function getStorageKey(key: string, originKey?: boolean) {
  const { pkg } = __APP_INFO__
  return originKey ? key : `${pkg.name}_${pkg.version}_${typeViteEnv('VITE_APP_ENV') === 'dev'
    ? 'development'
    : typeViteEnv('VITE_USE_MODE')}_${key}`
}

/**
 * @Author      gx12358
 * @DateTime    2019/12/3
 * @lastTime    2019/12/3
 * @description 获取Storage
 */
export function getStorage({
  key,
  originKey,
  type = 'local',
  encryption = true
}: {
  key: string;
  encryption?: boolean;
  type?: 'local' | 'cookie' | 'session';
  originKey?: boolean;
}) {
  const storageValue = type === 'local'
    ? localStorage.getItem(getStorageKey(key, originKey))
    : type === 'session' ? sessionStorage.getItem(getStorageKey(key, originKey)) : getCookie(
      getStorageKey(
        key,
        originKey
      ))
  const result: string | LocalResult = storageValue
    ? isEncryption(encryption) ? Decrypt(storageValue) : handleStorageValue(storageValue)
    : ''
  if (result && isObject(result)) {
    if (result.expired) {
      const expiredStatus = dayjs().diff(dayjs(result.time)) >= result.expired
      if (expiredStatus) {
        removeStorage({ key, originKey, type })
        return ''
      }
    }
  } else if (result && isString(result)) {
    return isJSONStr(result) ? JSON.parse(result) : result
  }
  return typeof result === 'string' ? result : result?.['value'] || result || ''
}

/**
 * @Author      gx12358
 * @DateTime    2019/12/3
 * @lastTime    2019/12/3
 * @description 设置Storage
 */
export function setStorage({
  key,
  value,
  expired,
  originKey,
  type = 'local',
  encryption = true
}: {
  key: string;
  value: any;
  originKey?: boolean;
  expired?: number;
  encryption?: boolean;
  type?: 'local' | 'cookie' | 'session';
}) {
  const result: LocalResult = originKey ? value : {
    value,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    expired: expired || 0
  }
  const storageValue = isEncryption(encryption)
    ? Encrypt(JSON.stringify(result))
    : isString(result) || isNumber(result) ? result : JSON.stringify(result)
  if (type === 'local') localStorage.setItem(getStorageKey(key, originKey), storageValue)
  else if (type === 'cookie') setCookie(getStorageKey(key, originKey), storageValue)
  else sessionStorage.setItem(getStorageKey(key, originKey), storageValue)
}

/**
 * @Author      gx12358
 * @DateTime    2019/12/3
 * @lastTime    2019/12/3
 * @description 删除Storage
 */
export function removeStorage({
  key,
  originKey,
  type = 'local'
}: {
  key: string;
  originKey?: boolean;
  type?: 'local' | 'cookie' | 'session';
}) {
  if (type === 'local') localStorage.removeItem(getStorageKey(key, originKey))
  else if (type === 'cookie') delCookie(getStorageKey(key, originKey))
  else sessionStorage.removeItem(getStorageKey(key, originKey))
}

/**
 * @Author      gx12358
 * @DateTime    2019-09-24
 * @lastTime    2019-09-24
 * @description 获取Cookie-name
 */
function getCookies(cname: string) {
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
function GetCookieDomain() {
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

/**
 * @Author      gx12358
 * @DateTime    2019-09-24
 * @lastTime    2019-09-24
 * @description 设置Cookie
 */
export function setCookie(cname: string, cvalue: string, exdays?: number) {
  const d = new Date()
  d.setTime(d.getTime() + (exdays || 365) * 24 * 60 * 60 * 1000)
  const expires = `=${d.toUTCString()}`
  document.cookie = `${cname}=${encodeURIComponent(
    cvalue
  )}; expires=${expires}; domain=${GetCookieDomain()}; path=/`
}

/**
 * @Author      gx12358
 * @DateTime    2019-09-24
 * @lastTime    2019-09-24
 * @description 获取Cookie
 */
export function getCookie(cname: string) {
  const result = getCookies(cname)
  if (result === '') {
    return ''
  }
  return decodeURIComponent(result)
}

/**
 * @Author      gx12358
 * @DateTime    2019-09-24
 * @lastTime    2019-09-24
 * @description 删除Cookie
 */
export function delCookie(name: string) {
  const exp = new Date()
  exp.setTime(exp.getTime() - 1)
  const cval = getCookies(name)
  if (cval !== null) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${GetCookieDomain()}; path=/`
  }
}
