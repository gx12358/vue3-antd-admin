import request from '@/utils/request'

export function getStepForm(params) {
  return request({
    url: '/form/stepForm',
    method: 'get',
    isMock: true,
    params
  })
}
