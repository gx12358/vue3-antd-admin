import type { RequestOptions } from '@gx/request'
import { requestClient } from '@/services/base'

export function getRadarData(params) {
  return requestClient.get('/radar', {
    isMock: true,
    params
  })
}

export function getHooksRequest(params, config: Partial<RequestOptions> = {}) {
  return requestClient.get('/hooks/request', {
    isMock: true,
    params,
    ...config
  })
}
