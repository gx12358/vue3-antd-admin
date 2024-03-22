import type { App } from 'vue'
import { createPinia } from 'pinia'
import { useStoreGlobal } from './modules/global'
import { useStoreDict } from './modules/dict'
import { useStoreUser } from './modules/user'
import { useStoreRoutes } from './modules/routes'
import { useStorePermission } from './modules/permission'
import { useStoreTabsRouter } from './modules/tabsRouter'
import { useStoreOss } from './modules/oss'

export {
  useStoreOss,
  useStoreGlobal,
  useStoreDict,
  useStoreUser,
  useStoreRoutes,
  useStorePermission,
  useStoreTabsRouter
}

export function useStore() {
  return {
    oss: useStoreOss(),
    user: useStoreUser(),
    dict: useStoreDict(),
    global: useStoreGlobal(),
    routes: useStoreRoutes(),
    permission: useStorePermission(),
    tabsRouter: useStoreTabsRouter()
  }
}

export function setupStore(app: App<Element>) {
  app.use(createPinia())
}
