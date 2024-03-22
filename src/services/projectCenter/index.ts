import request from '@/utils/request'

export function getProjectNums(params) {
  return request({
    url: '/project/num',
    method: 'get',
    isMock: true,
    params
  })
}

export function getProjectList(data) {
  return request({
    url: '/project/list',
    method: 'post',
    isMock: true,
    data
  })
}

export function getArticlesList(data) {
  return request({
    url: `/project/articles/list`,
    method: 'post',
    isMock: true,
    data
  })
}

export function getProjectsList(data) {
  return request({
    url: `/project/projects/list`,
    method: 'post',
    isMock: true,
    data
  })
}

export function getApplicationsList(data) {
  return request({
    url: `/project/applications/list`,
    method: 'post',
    isMock: true,
    data
  })
}
