import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import type { AppRouteModule, MenuDataItem } from '@gx-design-vue/pro-layout'
import { asyncRoutes, localRoutes } from '@/router/routes'
import { getMenuList } from '@/services/systemCenter'
import { generator, getRootMenu } from '@/router/helper/routeHelper'
import { getFirstLastChild } from '@/router/helper/utils'
import { getLevelData } from '@gx-design-vue/pro-utils'

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-routes 路由
 */
export interface RoutesState {
  routes: AppRouteModule[];
  routerLoadList: string[];
  meunLoading: boolean;
  routerLoading: boolean;
}

type RouteStateKey = keyof RoutesState

export const useStoreRoutes = defineStore('routes', () => {
  const state = reactive<RoutesState>({
    routes: [],
    routerLoadList: [],
    meunLoading: false,
    routerLoading: false
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
    state.meunLoading = true
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
    state.meunLoading = false
    return routes
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 重置路由
   */
  const resetRoute = () => {
    state.routes = []
    state.routerLoadList = []
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 添加路由记录
   */
  const addRouterLoadList = (path) => {
    state.routerLoadList.push(path)
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 修改state状态
   */
  const setRouteState: (params: Partial<Record<RouteStateKey, RoutesState[RouteStateKey]>>) => void = (params) => {
    Object.assign(state, params)
  }

  return {
    ...toRefs(state),
    setRoutes,
    setAllRoutes,
    resetRoute,
    addRouterLoadList,
    setRouteState
  }
})
