import { requestClient } from '@/services/base'

export function getGroupTopList(params) {
  return requestClient.get('/group/top', {
    isMock: true,
    params
  })
}
