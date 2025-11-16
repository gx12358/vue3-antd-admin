import type { Router, RouteRecordRaw } from 'vue-router'
import { app } from '@gx-config'
import { isArray } from '@gx-design-vue/pro-utils'
import { useAuth } from '@/hooks/system'

const { router: routerConfig, loginInterception } = app.system

function resetLogin(path: string, next: Fn) {
  const userStore = useStoreUser()

  userStore.resetPermissions()
  if (routerConfig.recordRoute) {
    next({ path: '/user/login', query: { redirect: path }, replace: true })
  } else {
    next({ path: '/user/login', replace: true })
  }
}

export function createPermissionGuard(router: Router) {
  const userStore = useStoreUser()
  const routeStore = useStoreRoutes()
  const permissionStore = useStorePermission()

  router.beforeEach(async (to, _, next) => {
    if (loginInterception) {
      const token = userStore.token
      if (routerConfig.whiteList.includes(to.path)) {
        if (token && to.path.includes('/user')) {
          next({ path: '/', replace: true })
          return
        }
        next()
        return
      }
      if (!token) {
        resetLogin(to.fullPath, next)
        return
      }

      const hasRoles = permissionStore.role

      if (hasRoles) {
        if (isArray(hasRoles) && hasRoles.length > 0) {
          const meta = to.meta as SystemMenuMeta
          if (meta.permissions) {
            const { permission } = useAuth(meta.permissions, 'some')
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

      const status = await userStore.checkUserPermission()
      if (status === 1) {
        if (routerConfig.auth === 'all') {
          const routes = await routeStore.setAllRoutes()
          if (routes?.length) {
            routes.forEach((route) => {
              router.addRoute(route as unknown as RouteRecordRaw)
            })
            next({ ...to, replace: true })
            return
          }
        }
      } else {
        resetLogin(to.fullPath, next)
        return
      }
    }
    next()
  })
}
