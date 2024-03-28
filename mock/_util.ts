import { omit } from 'lodash-es'
import { defaultSettings } from '@gx-config'
import { checkToken } from '@gx-mock/util/utils'
import { isFunction, isObject } from '@gx-design-vue/pro-utils'

const { tokenName } = defaultSettings

export function getRequestToken({ headers }: MockResponse<any, any>): string | undefined {
  return headers?.[tokenName.toLowerCase()]
}

export const checkBackDataFun = (token, config?: Partial<ResponseResult> | Function) => {
  const configData: Partial<ResponseResult> = isFunction(config) ? (config as Function)?.() : config
  let code = 200
  let msg = ''
  let data: any
  if (isObject(configData)) {
    code = configData?.code || 200
    data = configData?.data || { ...omit(configData, [ 'code', 'msg' ]) }
    msg = configData?.msg
  } else {
    data = configData
  }

  const invaiteToken = checkToken(token)

  const result: ResponseResult = {
    ...(invaiteToken ? { data } : {}),
    code: invaiteToken ? code : 401,
    msg: invaiteToken ? msg || code ? 'success' : 'Request failed' : 'Invalid token!'
  }
  return result
}
