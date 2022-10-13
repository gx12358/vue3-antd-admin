import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes, basicRoutes } from '@/router'
import { getRouterList } from '@/services/controller/router'
import { generator, getRootMenu } from '@/utils/routes'
import { getFirstLastChild } from '@/utils/routeConvert'
import { getLevelData } from '@/utils/util'

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

export const useStoreRoutes = defineStore('routes', () => {
  const state = reactive({
    routes: [],
    routerLoadList: [],
    meunLoading: false,
    routerLoading: false
  } as RoutesState)

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description intelligence（前端静态路由）模式设置路由
   */
  const setRoutes = () => {
    state.meunLoading = true
    const finallyRoutes = [ ...constantRoutes, ...asyncRoutes ]
    state.routes = finallyRoutes
    state.meunLoading = false
    return [ ...finallyRoutes ]
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description all（后端动态路由）模式设置路由
   */
  const setAllRoutes = async () => {
    let routes: AppRouteModule[] = []
    state.meunLoading = true
    const response: ResponseResult<MenuDataItem[]> = await getRouterList()
    if (response && (response?.data)?.length) {
      const notFoundRouter: AppRouteModule = {
        path: '/:path(.*)*',
        redirect: '/exception/404',
        hidden: true
      }
      const rootMenu = getRootMenu(response?.data || [])
      const asyncRoutes = generator(rootMenu)
      asyncRoutes[0].children = [ ...(asyncRoutes[0]?.children || []), ...basicRoutes ]
      const haveHomePage = getLevelData(asyncRoutes[0].children)
        .find(item => item.meta ? item.meta.homePage === 1 : false)
      asyncRoutes[0].redirect = haveHomePage ? haveHomePage.path : getFirstLastChild(asyncRoutes[0].children)
      asyncRoutes.push(notFoundRouter)
      routes = [ ...asyncRoutes ]
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
  const changeValue = (type, value) => {
    state[type] = value
  }

  return {
    ...toRefs(state),
    setRoutes,
    setAllRoutes,
    resetRoute,
    addRouterLoadList,
    changeValue
  }
})
