import { requestClient } from '@/services/base'

export function getMailNotice(params) {
  return requestClient.get('/mail/notice', {
    isMock: true,
    params
  })
}
