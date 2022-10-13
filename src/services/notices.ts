import request from '@/utils/request'

export function getNotices() {
  return request({
    url: '/notices',
    method: 'post',
    isMock: true
  })
}
