import type { App } from 'vue'
import { createPinia } from 'pinia'
import { useStoreDict } from './modules/dict'
import { useStoreGlobal } from './modules/global'
import { useStoreLayout } from './modules/layout'
import { useStoreOss } from './modules/oss'
import { useStorePermission } from './modules/permission'
import { useStoreRoutes } from './modules/routes'
import { useStoreTheme } from './modules/theme'
import { useStoreUser } from './modules/user'

export {
  useStoreDict,
  useStoreGlobal,
  useStoreLayout,
  useStoreOss,
  useStorePermission,
  useStoreRoutes,
  useStoreTheme,
  useStoreUser
}

export function useStore() {
  return {
    oss: useStoreOss(),
    user: useStoreUser(),
    dict: useStoreDict(),
    theme: useStoreTheme(),
    layout: useStoreLayout(),
    global: useStoreGlobal(),
    routes: useStoreRoutes(),
    permission: useStorePermission()
  }
}

export function setupStore(app: App<Element>) {
  app.use(createPinia())
}
