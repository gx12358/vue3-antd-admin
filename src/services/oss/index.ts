import request from '@/utils/request'

export function getOssClient() {
  return request({
    url: '/aliOss/token',
    method: 'get',
    isMock: true
  })
}
