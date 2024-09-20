import type { App } from 'vue'
import { createPinia } from 'pinia'
import { useStoreDict } from './modules/dict'
import { useStoreGlobal } from './modules/global'
import { useStoreOss } from './modules/oss'
import { useStorePermission } from './modules/permission'
import { useStoreRoutes } from './modules/routes'
import { useStoreUser } from './modules/user'

export {
  useStoreDict,
  useStoreGlobal,
  useStoreOss,
  useStorePermission,
  useStoreRoutes,
  useStoreUser
}

export function useStore() {
  return {
    oss: useStoreOss(),
    user: useStoreUser(),
    dict: useStoreDict(),
    global: useStoreGlobal(),
    routes: useStoreRoutes(),
    permission: useStorePermission()
  }
}

export function setupStore(app: App<Element>) {
  app.use(createPinia())
}
