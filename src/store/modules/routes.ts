import type { AppRouteModule, MenuDataItem } from '@gx-design-vue/pro-layout'
import { generator, getRootMenu } from '@/router/helper/routeHelper'
import { getFirstLastChild } from '@/router/helper/utils'
import { asyncRoutes, localRoutes } from '@/router/routes'
import { getMenuList } from '@/services/systemCenter'
import { getLevelData } from '@gx-design-vue/pro-utils'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-routes 路由
 */
export interface RoutesState {
  routes: AppRouteModule[];
}

export const useStoreRoutes = defineStore('routes', () => {
  const state = reactive<RoutesState>({
    routes: []
  })

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description intelligence（前端静态路由）模式设置路由
   */
  const setRoutes = () => {
    state.routes = localRoutes
    return [ ...localRoutes ]
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description all（后端动态路由）
   */
  const setAllRoutes = async () => {
    let routes: AppRouteModule[] = []
    const response: ResponseResult<MenuDataItem[]> = await getMenuList()
    if (response && (response?.data)?.length) {
      const notFoundRouter: AppRouteModule = {
        path: '/:path(.*)*',
        redirect: '/exception/404',
        hidden: true
      }
      const rootMenu = getRootMenu(response?.data || [])
      const asyncRouteList = generator(rootMenu)
      asyncRouteList[0].children = [ ...(asyncRouteList[0]?.children || []), ...asyncRoutes ]
      const haveHomePage = getLevelData(asyncRouteList[0].children)
        .find(item => item.meta ? item.meta.homePage === 1 : false)
      asyncRouteList[0].redirect = haveHomePage ? haveHomePage.path : getFirstLastChild(asyncRouteList[0].children)
      asyncRouteList.push(notFoundRouter)
      routes = [ ...asyncRouteList ]
    }
    state.routes = routes
    return routes
  }

  return {
    state,
    setRoutes,
    setAllRoutes
  }
})
