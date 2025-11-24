import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { app } from '@gx-config'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { basicRoutes } from './routes'

const { router: routerConfig } = app.system

function handleRouterMode() {
  switch (routerConfig.mode) {
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
  routes: basicRoutes(routerConfig.auth) as unknown as RouteRecordRaw[]
})

// 配置路由器
export function setupRouter(app: App<Element>) {
  app.use(router)
}
