import type { Router, RouteRecordRaw } from 'vue-router'
import { defaultSettings } from '@gx-config'

const { authentication, loginInterception, recordRoute, routesWhiteList } = defaultSettings

export function createPermissionGuard(router: Router) {
  const userStore = useStoreUser()
  const routeStore = useStoreRoutes()
  const permissionStore = useStorePermission()

  router.beforeEach(async (to, _, next) => {
    if (loginInterception) {
      const token = userStore.accessToken
      if (routesWhiteList.includes(to.path)) {
        if (token) {
          next({ path: '/', replace: true })
        }
        next()
        return
      }
      if (!token) {
        userStore.resetPermissions()
        if (recordRoute) {
          next({ path: '/user/login', query: { redirect: to.path }, replace: true })
        } else {
          next({ path: '/user/login', replace: true })
        }
        return
      }

      const hasRoles = permissionStore.role.length > 0
      if (hasRoles) {
        next()
        return
      }

      const checkUserPremission = await userStore.checkUserPremission()
      if (!checkUserPremission) {
        userStore.resetPermissions()
        if (recordRoute) {
          next({ path: '/user/login', query: { redirect: to.path }, replace: true })
        } else {
          next({ path: '/user/login', replace: true })
        }
        return
      }

      const routes = authentication === 'all'
        ? await routeStore.setAllRoutes()
        : await routeStore.setRoutes()
      if (routes?.length) {
        routes.forEach((route) => {
          router.addRoute(route as RouteRecordRaw)
        })

        next({ path: to.fullPath, replace: true })
        return
      }

      next({ path: '/exception/403', replace: true })
    }

    next()
  })
}
