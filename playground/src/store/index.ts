import type { App } from 'vue'
import { createPinia } from 'pinia'
import { useStoreGlobal } from './modules/global'
import { useStoreLayout } from './modules/layout'
import { useStoreTheme } from './modules/theme'

export {
  useStoreGlobal,
  useStoreLayout,
  useStoreTheme,
}

export function useStore() {
  return {
    theme: useStoreTheme(),
    layout: useStoreLayout(),
    global: useStoreGlobal(),
  }
}

export function setupStore(app: App<Element>) {
  app.use(createPinia())
}
