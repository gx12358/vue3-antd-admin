import request from '@/utils/request'

export function getForm() {
  return request({
    url: '/form',
    method: 'post',
    isMock: true,
  })
}
