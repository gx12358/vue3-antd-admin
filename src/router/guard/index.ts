import type { Router } from 'vue-router'
import type { MenuDataItem } from '@gx-design-vue/pro-layout'
import NProgress from 'nprogress'
import { defaultSettings } from '@gx-config'
import getPageTitle from '@/utils/pageTitle'
import { scrollToContainer } from '@/utils/util'
import { createStateGuard } from './stateGuard'
import { createPermissionGuard } from './permissions'

const { routesWhiteList } = defaultSettings

export function setupRouterGuard(router: Router) {
  createPageGuard(router)
  createPageLoadingGuard(router)
  createScrollGuard(router)
  createProgressGuard(router)
  createPermissionGuard(router)
  createStateGuard(router)
}

export function createPageGuard(router: Router) {
  const routes = useStoreRoutes()
  const global = useStoreGlobal()

  router.afterEach((to) => {
    const { meta } = to as MenuDataItem
    document.title = getPageTitle(meta.title || '')
    if (
      global.globalLayout.layout !== 'wide' && routes.routerLoadList.every(item => item !== to.path) && routesWhiteList.includes(
        to.path)
    ) {
      routes.addRouterLoadList(to.path)
    }
  })
}

export function createPageLoadingGuard(router: Router) {
  const routes = useStoreRoutes()
  const global = useStoreGlobal()

  router.beforeEach(async (to) => {
    if (
      global.globalLayout.layout !== 'wide' &&
      routes.routerLoadList.every(item => item !== to.path) &&
      routesWhiteList.includes(to.path)
    ) {
      routes.setRouteState({
        routerLoading: true
      })
    }

    return true
  })

  router.afterEach((_) => {
    setTimeout(() => {
      routes.setRouteState({
        routerLoading: false
      })
    }, global.globalLayout.layout === 'wide' ? 0 : 200)
  })
}

export function createScrollGuard(router: Router) {
  const global = useStoreGlobal()

  router.afterEach((_) => {
    !global.disabledScrollTop && scrollToContainer({ count: 0 })
  })
}

export function createProgressGuard(router: Router) {
  const global = useStoreGlobal()
  router.beforeEach(() => {
    if (global.showProgressBar)
      NProgress.start()
    return true
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
