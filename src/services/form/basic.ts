import request from '@/utils/request'

export function getBasicForm() {
  return request({
    url: '/basicForm',
    method: 'post',
    isMock: true
  })
}
