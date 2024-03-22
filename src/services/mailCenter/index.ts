import request from '@/utils/request'

export function getMailNotice(params) {
  return request({
    url: '/mail/notice',
    method: 'get',
    isMock: true,
    params
  })
}
