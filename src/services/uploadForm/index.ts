import request from '@/utils/request'

export function translateVideo(data) {
  return request({
    url: '/video/translate',
    method: 'post',
    isMock: true,
    data
  })
}
