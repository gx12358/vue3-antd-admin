import { isJSONStr } from '@/utils/validate'
import { isArray, isObject } from '@gx-design-vue/pro-utils'
import CryptoProJS from 'crypto-js'
import * as CryptoJS from 'crypto-js/core'
import 'crypto-js/enc-utf8'
import 'crypto-js/tripledes'
import 'crypto-js/sha1'

const key = '1234123412ABCDEF' // 十六位十六进制数作为密钥

/**
 * 登录密码加密
 * @param password
 * @returns {string}
 */
export const encodePassword = (password: string) => {
  const key = CryptoProJS.enc.Utf8.parse('8QONwyJtHesysWpM')
  const passwordENC = CryptoProJS.AES.encrypt(password, key, {
    mode: CryptoProJS.mode.ECB,
    padding: CryptoProJS.pad.Pkcs7
  })
  const encodePW = passwordENC.ciphertext.toString()
  return encodePW
}

// 加密方法
export function Encrypt(word) {
  let str: string | object = word
  if (isObject(word) || isArray(word)) {
    str = JSON.stringify(word)
  }
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const ivHex = CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(str, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

// 解密方法
export function Decrypt(word) {
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const ivHex = CryptoJS.enc.Utf8.parse(key)
  const decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(word)
  }, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
  return isJSONStr(decryptedStr.toString())
    ? JSON.parse(decryptedStr.toString())
    : decryptedStr.toString()
}
