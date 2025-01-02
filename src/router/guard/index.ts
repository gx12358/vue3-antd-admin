import type { MenuDataItem } from '@gx-design-vue/pro-layout'
import type { Router } from 'vue-router'
import { useStoreGlobal } from '@/store'
import getPageTitle from '@/utils/pageTitle'
import { scrollToContainer } from '@/utils/util'
import { defaultSettings } from '@gx-config'
import { createPermissionGuard } from './permissions'
import { createStateGuard } from './stateGuard'

const { routesWhiteList } = defaultSettings.system

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
    const { meta } = to as MenuDataItem
    document.title = getPageTitle(meta?.title || '')
  })
}

export function createPageLoadingGuard(router: Router) {
  const global = useStoreGlobal()

  const loadedPaths = new Set<string>()

  router.beforeEach(async (to) => {
    if (!loadedPaths.has(to.path) && !routesWhiteList.includes(to.path)) {
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

export function createProgressGuard(router: Router) {
  const global = useStoreGlobal()
  router.beforeEach(() => {
    if (global.showProgressBar)
      // NProgress.start()
      return true
  })

  router.afterEach(() => {
    // NProgress.done()
  })
}
