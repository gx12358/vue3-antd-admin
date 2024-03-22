import request from '@/utils/request'

export function getRadarData(params) {
  return request({
    url: '/radar',
    method: 'get',
    isMock: true,
    params
  })
}
