import request from '@/utils/request'

export interface basicFormParameters {
  title: string;
  startTime: string;
  endTime: string;
  goal: string;
  standard: string;
  client?: string;
  weight?: number;
  publicType?: string;
  publicUsers?: string;
}

export function updateBasicForm(data: basicFormParameters) {
  return request({
    url: '/update/basicForm',
    method: 'post',
    isMock: true,
    data
  })
}

export function getAdvancedForm(data) {
  return request({
    url: '/advancedForm',
    method: 'post',
    isMock: true,
    data
  })
}

export function getAdvancedFormTable(data) {
  return request({
    url: '/advancedFormTable',
    method: 'post',
    isMock: true,
    data
  })
}
