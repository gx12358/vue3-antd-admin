import type { Router } from 'vue-router'
import { app } from '@gx-config'
import { useStoreGlobal } from '@/store'
import getPageTitle from '@/utils/pageTitle'
import { scrollToContainer } from '@/utils/util'
import { createPermissionGuard } from './permissions'

const { router: routerConfig } = app.system

export function setupRouterGuard(router: Router) {
  createPageGuard(router)
  createPageLoadingGuard(router)
  createScrollGuard(router)
  createPermissionGuard(router)
}

export function createPageGuard(router: Router) {
  router.afterEach((to) => {
    const { meta } = to as SystemMenuItem
    document.title = getPageTitle(meta?.title || '')
  })
}

export function createPageLoadingGuard(router: Router) {
  const global = useStoreGlobal()

  const loadedPaths = new Set<string>()

  router.beforeEach(async (to) => {
    if (!loadedPaths.has(to.path) && !routerConfig.whiteList.includes(to.path)) {
      global.setValue({ pageLoading: true })
      loadedPaths.add(to.path)
    }

    return true
  })

  router.afterEach((_) => {
    global.setValue({ pageLoading: false })
  })
}

export function createScrollGuard(router: Router) {
  const global = useStoreGlobal()

  router.afterEach((_) => {
    !global.disabledScrollTop && scrollToContainer({ count: 0 })
  })
}
