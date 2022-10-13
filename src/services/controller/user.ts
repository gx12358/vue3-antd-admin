import request from '@/utils/request'

export async function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
    isMock: true
  })
}

export function getUserInfo() {
  return request({
    url: '/userInfo',
    method: 'post',
    isMock: true
  })
}

export function logout(params) {
  return request({
    url: '/logout',
    method: 'get',
    isMock: true,
    params
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
    isMock: true
  })
}
