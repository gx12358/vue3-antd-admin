import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { AppRouteModule, getLastPath, MenuDataItem } from '@gx-design-vue/pro-layout'
import { getLevelData } from '@gx-design-vue/pro-utils'
import { defineStore } from 'pinia'
import { generator, getRootMenu } from '@/router/helper/routeHelper'
import { asyncRoutes, localRoutes, notFoundRoute } from '@/router/routes'
import { getMenuList } from '@/services/systemCenter'

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
  const [ state, setValue ] = useReactiveState<RoutesState>({
    routes: []
  }, { omitEmpty: false })

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description intelligence（前端静态路由）模式设置路由
   */
  const setRoutes = () => {
    setValue({ routes: localRoutes })
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
    if (response) {
      const rootMenu = getRootMenu(response.data || [])
      const asyncRouteList = generator(rootMenu)
      asyncRouteList[0].children = asyncRoutes.concat([ ...(asyncRouteList[0]?.children || []) ])
      const haveHomePage = getLevelData(asyncRouteList[0].children)
        .find(item => item.meta ? item.meta.isHome === 1 : false)
      asyncRouteList[0].redirect = haveHomePage
        ? haveHomePage.path
        : getLastPath(asyncRouteList[0].children)
      asyncRouteList.push(notFoundRoute)
      routes = [ ...asyncRouteList ]
    }
    setValue({ routes })
    return routes
  }

  return {
    ...state,
    setValue,
    setRoutes,
    setAllRoutes
  }
})
