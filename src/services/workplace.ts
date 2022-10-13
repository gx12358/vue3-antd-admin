import request from '@/utils/request'

export function notice() {
  return request({
    url: '/project/notice',
    method: 'get',
    isMock: true
  })
}

export function activities() {
  return request({
    url: '/activities',
    method: 'get',
    isMock: true
  })
}

export function radar() {
  return request({
    url: '/radar',
    method: 'get',
    isMock: true
  })
}
