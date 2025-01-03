import request from '@/utils/request'

export * from './account'

export function login<T, D>(data) {
  return request<T, D>({
    url: '/user/login',
    method: 'post',
    data,
    isMock: true
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get',
    isMock: true
  })
}

export function register() {
  return request({
    url: '/user/register',
    method: 'post',
    isMock: true
  })
}
