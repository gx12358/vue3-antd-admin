import { app } from '@gx-config'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { getLastPath } from '@gx-design-vue/pro-layout'
import { defineStore } from 'pinia'
import { generator, getRootMenu } from '@/router/helper/routeHelper'
import { localRoutes, notFoundRoute } from '@/router/routes'
import { getRouters } from '@/services/system-center'

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
    try {
      const response: ResponseResult<SystemMenuItem[]> = await getRouters()
      if (response) {
        const rootMenu = getRootMenu(response.data || [])
        const asyncRouteList = generator(rootMenu)
        asyncRouteList[0].children = localRoutes.concat([ ...(asyncRouteList[0]?.children || []) ])
        asyncRouteList[0].redirect = router.rootPath || getLastPath(asyncRouteList[0].children as any)
        asyncRouteList.push(notFoundRoute)
        setValue({ routes: asyncRouteList })
        return asyncRouteList
      }
    } catch {}
    return []
  }

  return {
    ...toRefs(state),
    setValue,
    setAllRoutes
  }
})
