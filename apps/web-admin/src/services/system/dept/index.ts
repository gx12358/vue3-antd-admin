import { requestClient } from '@/services/base'
import * as SystemDeptApi from './typing'

export type {
  SystemDeptApi
}

/** 查询部门（精简)列表 */
export async function getSimpleDeptList() {
  return requestClient.get<SystemDeptApi.Dept[]>('/system/dept/simple-list')
}

/** 查询部门列表 */
export async function getDeptList<T = any>() {
  return requestClient.get<T>('/system/dept/list')
}

/** 查询部门详情 */
export async function getDept(id: number) {
  return requestClient.get<SystemDeptApi.Dept>(`/system/dept/get?id=${id}`)
}

/** 新增部门 */
export async function createDept<T = any>(data) {
  return requestClient.post<T>('/system/dept/create', {
    data
  })
}

/** 修改部门 */
export async function updateDept<T = any>(data) {
  return requestClient.put<T>('/system/dept/update', { data })
}

/** 删除部门 */
export async function deleteDept<T = any>(params) {
  return requestClient.delete<T>(`/system/dept/delete`, {
    params
  })
}

/** 批量删除部门 */
export async function deleteDeptList<T = any>(params) {
  return requestClient.delete<T>(`/system/dept/delete-list`, {
    params
  })
}
