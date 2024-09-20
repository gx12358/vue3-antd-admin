import request from '@/utils/request'

export * from './advanced'
export * from './step'

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
