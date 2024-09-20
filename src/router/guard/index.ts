import type { MenuDataItem } from '@gx-design-vue/pro-layout'
import type { Router } from 'vue-router'
import getPageTitle from '@/utils/pageTitle'
import { scrollToContainer } from '@/utils/util'
import { defaultSettings } from '@gx-config'
import NProgress from 'nprogress'
import { createPermissionGuard } from './permissions'
import { createStateGuard } from './stateGuard'

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
  router.afterEach((to) => {
    const { meta } = to as MenuDataItem
    document.title = getPageTitle(meta.title || '')
  })
}

export function createPageLoadingGuard(router: Router) {
  const global = useStoreGlobal()
  const { globalLayout } = toRefs(global.state)

  const loadedPaths = new Set<string>()

  router.beforeEach(async (to) => {
    if (
      globalLayout.value.layout !== 'wide'
      && !loadedPaths.has(to.path)
      && !routesWhiteList.includes(to.path)
    ) {
      loadedPaths.add(to.path)
    }

    return true
  })

  router.afterEach((_) => {
    setTimeout(() => {
    }, globalLayout.value.layout === 'wide' ? 0 : 200)
  })
}

export function createScrollGuard(router: Router) {
  const global = useStoreGlobal()

  router.afterEach((_) => {
    !global.state.disabledScrollTop && scrollToContainer({ count: 0 })
  })
}

export function createProgressGuard(router: Router) {
  const global = useStoreGlobal()
  router.beforeEach(() => {
    if (global.state.showProgressBar)
      NProgress.start()
    return true
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
