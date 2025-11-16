import { requestClient } from '@/services/base'

export function getRouters<T = any, R = undefined>() {
  return requestClient.post<T, R>(`/menu/navigate`, {
    isMock: true
  })
}
