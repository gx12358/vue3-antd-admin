import { requestClient } from '@/services/base'

export * from './account'

export function login<T, D>(data) {
  return requestClient.post<T, D>('/user/login', {
    data,
    isMock: true
  })
}

export function logout() {
  return requestClient.get('/user/logout', {
    isMock: true
  })
}

export function register(data) {
  return requestClient.post('/user/register', {
    data,
    isMock: true
  })
}
