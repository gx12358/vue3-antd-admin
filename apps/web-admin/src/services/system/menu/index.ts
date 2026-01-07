import { requestClient } from '@/services/base'

/** 查询菜单（精简）列表 */
export async function getSimpleMenusList() {
  return requestClient.get<SystemMenuItem[]>('/system/menu/simple-list')
}

/** 查询菜单列表 */
export async function getMenuList<T = any>(params?: any) {
  return requestClient.get<T>('/system/menu/list', {
    params
  })
}

/** 删除菜单 */
export async function deleteMenu(params) {
  return requestClient.delete(`/system/menu/delete`, {
    params
  })
}

/** 获取菜单详情 */
export async function getMenu(id: number) {
  return requestClient.get<SystemMenuItem>(`/system/menu/get?id=${id}`)
}

/** 新增菜单 */
export async function createMenu(data) {
  return requestClient.post('/system/menu/create', {
    data
  })
}

/** 修改菜单 */
export async function updateMenu(data) {
  return requestClient.put('/system/menu/update', { data })
}
