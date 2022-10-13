// Interface data format used to return a unified format

import config from '/config/config'

const { tokenName } = config.defaultSettings

export function resultSuccess<T = Recordable>(result: T, { msg = 'success' } = {}) {
  return {
    code: 200,
    result,
    msg
  }
}

export function resultError(msg = 'Request failed', { code = -1, result = null } = {}) {
  return {
    code,
    result,
    msg
  }
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize)
  const ret =
    offset + Number(pageSize) >= array.length
      ? array.slice(offset, array.length)
      : array.slice(offset, offset + Number(pageSize))
  return ret
}

export interface requestParams {
  method: string;
  body: any;
  headers?: any;
  query: any;
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.[tokenName.toLowerCase()]
}

export const builder = (token, config?: Partial<ResponseResult>) => {
  const code = config?.code || 200
  const result: ResponseResult = {
    ...config,
    code: token ? code : 401,
    msg: token ? config?.msg || code ? 'success' : 'Request failed' : 'Request failed'
  }
  return result
}
