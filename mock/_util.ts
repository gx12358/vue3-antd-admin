import { defaultSettings } from '@gx-config'
import { isFunction, isObject } from '@gx-design-vue/pro-utils'
import { checkToken } from '@gx-mock/util/utils'
import { omit } from 'lodash-es'

const { tokenName } = defaultSettings

export function getRequestToken({ headers }: MockResponse<any, any>): string | undefined {
  return headers?.[tokenName.toLowerCase()]
}

export const checkBackDataFun = (token, config?: Partial<ResponseResult> | Fn) => {
  const configData: Partial<ResponseResult> = isFunction(config) ? (config as Fn)?.() : config
  let code = 200
  let msg: string | undefined = ''
  let data: any
  if (isObject(configData)) {
    code = configData?.code || 200
    data = configData?.data || { ...omit(configData, [ 'code', 'msg' ]) }
    msg = configData?.msg
  } else {
    data = configData
  }

  const invaiteToken = checkToken(token)

  const result = {
    ...(invaiteToken ? { data } : {}),
    code: invaiteToken ? code : 401,
    msg: invaiteToken ? msg || code ? 'success' : 'Request failed' : 'Invalid token!'
  } as ResponseResult
  return result
}
