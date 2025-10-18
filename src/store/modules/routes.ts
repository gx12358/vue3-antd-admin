import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { getLastPath } from '@gx-design-vue/pro-layout'
import { defineStore } from 'pinia'
import { generator, getRootMenu } from '@/router/helper/routeHelper'
import { localRoutes, notFoundRoute } from '@/router/routes'
import { getRouters } from '@/services/systemCenter'

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
   * @description all（后端动态路由）
   */
  const setAllRoutes = async () => {
    let routes: AppRouteModule[] = []
    try {
      const response: ResponseResult<SystemMenuItem[]> = await getRouters()
      if (response) {
        const rootMenu = getRootMenu(response.data || [])
        const asyncRouteList = generator(rootMenu)
        asyncRouteList[0].children = localRoutes.concat([ ...(asyncRouteList[0]?.children || []) ])
        if (!asyncRouteList[0].redirect) {
          asyncRouteList[0].redirect = getLastPath(asyncRouteList[0].children as any)
        }
        asyncRouteList.push(notFoundRoute)
        routes = [ ...asyncRouteList ]
      }
    } catch {}
    setValue({ routes })
    return routes
  }

  return {
    ...toRefs(state),
    setValue,
    setAllRoutes
  }
})
