import request from '@/utils/request'

export function getRadarData(params) {
  return request({
    url: '/radar',
    method: 'get',
    isMock: true,
    params
  })
}

export function getHokksRequest(params, config) {
  return request({
    url: '/hooks/request',
    method: 'get',
    isMock: true,
    params,
    ...config
  })
}
