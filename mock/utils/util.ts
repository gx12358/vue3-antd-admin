import { faker } from '@faker-js/faker'
import { defaultSettings } from '@gx-config'
import { deepMerge, isObject } from '@gx-design-vue/pro-utils'
import { tokenAccount, userList } from '@gx-mock/config/user'
import userIds from '@gx-mock/config/user/id'
import { toLower } from 'lodash-es'
import { Decrypt, Encrypt } from './crypto'

const { mock, token } = defaultSettings

export function handleRandomImage(width: number, height: number) {
  return faker.image.url({
    width,
    height
  })
}

export function getTokenBuUserId(token) {
  return Number(Object.keys(tokenAccount).find(item => tokenAccount[item] === token))
}

export function getToken(headers: RequestHeater): string | undefined {
  return headers?.[toLower(token.name)]
}

export function tokenByUserInfo(token): UserDetails {
  return Decrypt(token)
}

export function createrToken(token) {
  const userInfo = userList.find(item => item.user?.userId === getTokenBuUserId(token))
  return Encrypt({ userId: userInfo?.user?.userId })
}

export function checkToken(token) {
  if (mock.checkToken === -1) return true
  if (token) {
    if (mock.checkToken === 0) return true

    const useInfo: UserDetails = tokenByUserInfo(token)
    return useInfo ? useInfo?.userId && userIds.some(item => useInfo?.userId === item.id) : false
  }
  return false
}

export const checkBackDataFun = (
  config: Partial<ResponseResult>,
  token: string,
  merageRoot?: boolean
): ResponseResult => {
  let result: Partial<ResponseResult> = {
    code: 200,
    data: null
  }
  if (isObject(config)) {
    const { data } = config
    if (merageRoot) {
      result = deepMerge(result, config, {
        omitEmpty: false,
        omitNil: false
      })
    } else {
      result.data = config
    }
    if (data) {
      result.data = data
    }
  } else {
    result.data = config as any
  }

  const invaiteToken = checkToken(token)

  return deepMerge<ResponseResult>(result as unknown as ResponseResult, {
    code: invaiteToken ? 200 : 401,
    message: invaiteToken
      ? (result.message || result.code) ? 'success' : 'Request failed'
      : 'Invalid token!'
  })
}

export function getArraryList<T>(length: number, callback: (key: number) => T) {
  return Array.from({ length }).map((_, key) => callback(key))
}

export function getMockRandowList<T = any>(data: T[]) {
  return data[faker.number.int({ min: 0, max: data.length - 1 })] as T
}

export function mockNumber(min: number, max: number) {
  return faker.number.int({ min, max })
}
