import { isJSONStr } from '@/utils/validate'
import { isArray, isObject } from '@gx-design-vue/pro-utils'
import Base64 from '@/utils/crypto/base64'

const cryptoBase64 = new Base64()

// 加密方法
export function Encrypt(word: string | object) {
  let str: string
  if (isObject(word) || isArray(word)) {
    str = JSON.stringify(word)
  } else {
    str = word as string
  }

  return cryptoBase64.encode(str as string)
}

// 解密方法
export function Decrypt(word: string) {
  const decryptedStr = cryptoBase64.decode(word)
  return isJSONStr(decryptedStr) ? JSON.parse(decryptedStr) : decryptedStr
}
