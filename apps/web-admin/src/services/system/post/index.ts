import type { RequestOptions } from '@gx/request'
import { requestClient } from '@/services/base'
import * as SystemPostApi from './typing'

export type {
  SystemPostApi
}

export function getPostPage<T = any>(params, options = {} as RequestOptions) {
  return requestClient.get<T>('/system/post/page', {
    params,
    ...options
  })
}

/** 获取岗位精简信息列表 */
export function getSimplePostList() {
  return requestClient.get<SystemPostApi.PostTableRecord[]>('/system/post/simple-list')
}

/** 查询岗位详情 */
export function getPost(id: number) {
  return requestClient.get<SystemPostApi.UpdatePostTableRecord>(`/system/post/get?id=${id}`)
}

/** 新增岗位 */
export function createPost(data: SystemPostApi.UpdatePostTableRecord) {
  return requestClient.post('/system/post/create', { data })
}

/** 修改岗位 */
export function updatePost(data: SystemPostApi.UpdatePostTableRecord) {
  return requestClient.put('/system/post/update', { data })
}

/** 删除岗位 */
export function deletePost(params) {
  return requestClient.delete(`/system/post/delete`, { params })
}

/** 批量删除岗位 */
export function deletePostList(params) {
  return requestClient.delete(`/system/post/delete-list`, { params })
}

/** 导出岗位 */
export function exportPost(params: any) {
  return requestClient.get('/system/post/export-excel', {
    download: true,
    params,
  })
}
