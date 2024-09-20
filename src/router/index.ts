import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { defaultSettings } from '@gx-config'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { constantRoutes } from './routes'

const { routerMode } = defaultSettings

function handleRouterMode() {
  switch (routerMode) {
    case 'hash':
      return createWebHashHistory()
      break
    case 'browser':
      return createWebHistory()
      break
    default:
      return createWebHashHistory()
      break
  }
}

export const router = createRouter({
  history: handleRouterMode(),
  routes: constantRoutes as unknown as RouteRecordRaw[]
})

// 配置路由器
export function setupRouter(app: App<Element>) {
  app.use(router)
}
