import { requestClient } from '@/services/base'

export function getProjectNums(params) {
  return requestClient.get('/project/num', {
    isMock: true,
    params
  })
}

export function getProjectList(data) {
  return requestClient.post('/project/list', {
    isMock: true,
    data
  })
}

export function getArticlesList(data) {
  return requestClient.post(`/project/articles/list`, {
    isMock: true,
    data
  })
}

export function getProjectsList(data) {
  return requestClient.post(`/project/projects/list`, {
    isMock: true,
    data
  })
}

export function getApplicationsList(data) {
  return requestClient.post(`/project/applications/list`, {
    isMock: true,
    data
  })
}
