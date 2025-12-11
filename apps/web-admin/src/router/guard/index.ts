import type { Router } from 'vue-router'
import { app } from '@gx-config'
import NProgress from 'nprogress'
import { useStoreGlobal, useStoreLayout } from '@/store'
import getPageTitle from '@/utils/pageTitle'
import { scrollToContainer } from '@/utils/util'
import { createPermissionGuard } from './permissions'
import { createStateGuard } from './stateGuard'

const { router: routerConfig } = app.system

export function setupRouterGuard(router: Router) {
  createPageGuard(router)
  createPageLoadingGuard(router)
  createScrollGuard(router)
  createProgressGuard(router)
  createPermissionGuard(router)
  createStateGuard(router)
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
      global.setState({ pageLoading: true })
      loadedPaths.add(to.path)
    }

    return true
  })

  router.afterEach((_) => {
    global.setState({ pageLoading: false })
  })
}

export function createScrollGuard(router: Router) {
  const global = useStoreGlobal()

  router.afterEach((_) => {
    !global.disabledScrollTop && scrollToContainer({ count: 0 })
  })
}

export function createProgressGuard(router: Router) {
  const layout = useStoreLayout()
  router.beforeEach(() => {
    if (layout.config.settings.progress) {
      NProgress.start()
    }
    return true
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
