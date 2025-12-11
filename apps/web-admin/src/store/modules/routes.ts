import { app } from '@gx-config'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { getLastPath } from '@gx-design-vue/pro-layout'
import { defineStore } from 'pinia'
import { generator, getRootMenu } from '@/router/helper/routeHelper'
import { localRoutes, notFoundRoute } from '@/router/routes'

const { router } = app.system

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
  const [ state, setState, clear ] = useReactiveState<RoutesState>({
    routes: []
  })

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description all（后端动态路由）
   */
  const setAllRoutes = async (menus: SystemMenuItem[]) => {
    try {
      const rootMenu = getRootMenu(menus || [])
      const asyncRouteList = generator(rootMenu)
      asyncRouteList[0].children = localRoutes.concat([ ...(asyncRouteList[0]?.children || []) ])
      asyncRouteList[0].redirect = router.rootPath || getLastPath(asyncRouteList[0].children as any)
      asyncRouteList.push(notFoundRoute)
      setState({ routes: asyncRouteList })
      return asyncRouteList
    } catch {}
    return []
  }

  return {
    ...toRefs(state),
    clear,
    setState,
    setAllRoutes
  }
})
