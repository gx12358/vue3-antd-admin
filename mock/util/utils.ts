import { Random } from 'mockjs'
import { defaultSettings } from '@gx-config'
import type { UserDetails } from '@gx-mock/config/user'
import { userList, tokenAccount } from '@gx-mock/config/user'
import { Encrypt, Decrypt } from '@gx-mock/util/crypto'
import { checkBackDataFun, getRequestToken } from '@gx-mock/_util'

const { mockPrefixUrl, checkMockToken } = defaultSettings

export function getTokenBuUserId(token) {
  return Number(Object.keys(tokenAccount).find(item => tokenAccount[item] === token))
}

export function createrToken(token) {
  const userInfo = userList.find(item => item.user.userId === getTokenBuUserId(token))
  return Encrypt({ userId: userInfo.user.userId })
}

export function getTokeUserInfo(token): UserDetails {
  return Decrypt(token)
}

export function handleRandomImage(width = 50, height = 50) {
  return `https://picsum.photos/${width}/${height}?random=${Random.guid()}`
}

export function checkToken(token) {
  if (token) {
    const useInfo: UserDetails = getTokeUserInfo(token)
    if (useInfo && useInfo?.userId && userList.some(item => useInfo?.userId === item.user.userId)) return true
  }

  return !checkMockToken
}

export function getArraryList<T>(length: number, callback: (key: number) => T) {
  return Array.from({ length }).map((_, key) => callback(key))
}

export function getMockRequest<T = Recordable, R = Record<any, any>, D = undefined>({
  url,
  timeout,
  method,
  carryToken = true,
  callback
}: {
  url: string;
  carryToken?: boolean;
  timeout?: number;
  method: MockMethod['method'];
  callback?: (res: MockResponse<T, D>, token?: string) => Partial<R>;
}): MockMethod {
  return {
    url: `${mockPrefixUrl}${url}`,
    timeout,
    method,
    response: (request) => {
      if (carryToken) {
        const token = getRequestToken(request)
        return checkBackDataFun(token, callback?.(request, token) || {})
      }

      return callback?.(request)
    }
  }
}

export function getMockRandowList<T = any>(data: T[]) {
  return data[Random.integer(0, data.length - 1)] as T
}
