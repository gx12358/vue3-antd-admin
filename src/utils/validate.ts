/**
 * @author gx12358 2539306317@qq.com
 * @description 判读是否为外链
 * @param path
 * @returns {boolean}
 */
export function isExternal(path) {
  return /^(?:https?:|mailto:|tel:)/.test(path)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否是名称
 * @param value
 * @returns {boolean}
 */
export function isName(value) {
  const reg = /^[\u4e00-\u9fa5a-z0-9]+$/i
  return reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否为IP
 * @param ip
 * @returns {boolean}
 */
export function isIP(ip) {
  const reg = /^(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(ip)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否是传统网站
 * @param url
 * @returns {boolean}
 */
export function isUrl(url) {
  const reg = /^(?:https?|ftp):\/\/(?:[a-zA-Z0-9.-]+(?::[a-zA-Z0-9.&%$-]+)*@)*(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d?)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}|(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(?:com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(?::\d+)*(?:\/(?:$|[\w.,?'\\+&%$#=~-]+))*$/
  return reg.test(url)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否是小写字母
 * @param value
 * @returns {boolean}
 */
export function isLowerCase(value) {
  const reg = /^[a-z]+$/
  return reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否是大写字母
 * @param value
 * @returns {boolean}
 */
export function isUpperCase(value) {
  const reg = /^[A-Z]+$/
  return reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否是大写字母开头
 * @param value
 * @returns {boolean}
 */
export function isAlphabets(value) {
  const reg = /^[A-Z]+$/i
  return reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否是端口号
 * @param value
 * @returns {boolean}
 */
export function isPort(value) {
  const reg = /^(?:\d|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  return reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否是手机号
 * @param value
 * @returns {boolean}
 */
export function isPhone(value = '', backReg?: boolean) {
  const reg = /^1\d{10}$/
  return backReg ? reg : reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否是身份证号(第二代)
 * @param value
 * @returns {boolean}
 */
export function isIdCard(value) {
  const reg = /^[1-9]\d{5}(?:18|19|[23]\d)\d{2}(?:0[1-9]|10|11|12)(?:[0-2][1-9]|10|20|30|31)\d{3}[0-9X]$/i
  return reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否是邮箱
 * @param value
 * @returns {boolean}
 */
export function isEmail(value = '', backReg?: boolean) {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  return backReg ? reg : reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否中文
 * @param value
 * @returns {boolean}
 */
export function isChina(value) {
  const reg = /^[\u4E00-\u9FA5]{2,4}$/
  return reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否为空
 * @param value
 * @returns {boolean}
 */
export function isBlank(value) {
  return (value == null || false || value === '' || value.trim() === '' || value.toLocaleLowerCase()
    .trim() === 'null')
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断是否为固话
 * @param value
 * @returns {boolean}
 */
export function isTel(value) {
  const reg = /^(?:400|800)[0-9\\-]{7,10}|(?:(?:\d{4}|\d{3})[- ]?)?\d{7,8}(?:[- 转]*\d{1,4})?$/
  return reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断经度 -180.0～+180.0（整数部分为0～180，必须输入1到5位小数）
 * @param value
 * @returns {boolean}
 */
export function isLongitude(value) {
  const reg = /^[-|+]?(?:0?\d{1,2}\.\d{1,5}|1[0-7]?\d\.\d{1,5}|180\.0{1,5})$/
  return reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 判断纬度 -90.0～+90.0（整数部分为0～90，必须输入1到5位小数）
 * @param value
 * @returns {boolean}
 */
export function isLatitude(value) {
  const reg = /^[-|+]?(?:[0-8]?\d\.\d{1,5}|90\.0{1,5})$/
  return reg.test(value)
}

/**
 * @author gx12358 2539306317@qq.com
 * @description rtsp校验，只要有rtsp://
 * @param value
 * @returns {boolean}
 */
export function isRTSP(value) {
  const reg = /^rtsp:\/\/(?:[a-z]{0,10}:.{0,10}@)?(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  const reg1 = /^rtsp:\/\/(?:[a-z]{0,10}:.{0,10}@)?(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):\d{1,5}/
  const reg2 = /^rtsp:\/\/(?:[a-z]{0,10}:.{0,10}@)?(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\//
  return reg.test(value) || reg1.test(value) || reg2.test(value)
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/11/4
 * @lastTime    2020/11/4
 * @description 判断是否是JSON字符串
 */
export function isJSONStr(str: any) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (e) {
      return false
    }
  }
  return false
}

export function checkURL(URL) {
  const str = URL
  // eslint-disable-next-line regexp/strict
  const Expression = /https?:\/\/(?:[\w-]+\.)+[\w-]+(?:\/[\w- ./?%&=]*)?/
  const objExp = new RegExp(Expression)
  return objExp.test(str)
}
