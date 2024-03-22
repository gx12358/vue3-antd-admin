import { createApp } from 'vue'

import { router, setupRouter } from '@/router'

import { setupRouterGuard } from '@/router/guard'

import App from './App.vue'
import { setupStore } from './store'
import { setupGlobCommon } from './core'

import 'uno.css'
import 'nprogress/nprogress.css'

import './global.less'

import './plugins'

function startApp() {
  const app = createApp(App)

  // 配置store
  setupStore(app)

  setupGlobCommon(app)

  // 配置路由
  setupRouter(app)

  // 路由守卫
  setupRouterGuard(router)

  app.mount('#app')
}

startApp()
