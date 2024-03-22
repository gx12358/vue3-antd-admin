import request from '@/utils/request'

export * from './step'
export * from './advanced'

export function submitForm(data) {
  return request({
    url: '/form/submit',
    method: 'post',
    isMock: true,
    data
  })
}

export function getFormDetails() {
  return request({
    url: '/form/details',
    method: 'get',
    isMock: true,
  })
}
