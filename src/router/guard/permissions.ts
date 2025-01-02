import type { Router, RouteRecordRaw } from 'vue-router'
import { usePermissions } from '@gx-admin/hooks/system'
import { defaultSettings } from '@gx-config'
import { isArray } from '@gx-design-vue/pro-utils'

const { authentication, loginInterception, recordRoute, routesWhiteList } = defaultSettings.system

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
          next({ path: '/user/login', query: { redirect: to.fullPath }, replace: true })
        } else {
          next({ path: '/user/login', replace: true })
        }
        return
      }

      const hasRoles = permissionStore.role

      if (hasRoles) {
        if (isArray(hasRoles) && hasRoles.length > 0) {
          const meta = to.meta as SystemMenuMeta
          if (meta.permissions) {
            const { permission } = usePermissions(meta.permissions, 'some')
            if (permission.value) {
              next()
            } else {
              next({ path: '/exception/403', replace: true })
            }
          } else {
            next()
          }
        } else {
          next({ path: '/exception/403', replace: true })
        }
        return
      }

      const status = await userStore.checkUserPremission()
      if (status === 1) {
        const routes = authentication === 'all'
          ? await routeStore.setAllRoutes()
          : await routeStore.setRoutes()
        if (routes?.length) {
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw)
          })
          next({ ...to, replace: true })
          return
        }
      } else {
        userStore.resetPermissions()
        if (recordRoute) {
          next({ path: '/user/login', query: { redirect: to.fullPath }, replace: true })
        } else {
          next({ path: '/user/login', replace: true })
        }
        return
      }
    }
    next()
  })
}
