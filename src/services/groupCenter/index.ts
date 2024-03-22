import request from '@/utils/request'

export function getGroupTopList(params) {
  return request({
    url: '/group/top',
    method: 'get',
    isMock: true,
    params
  })
}
