import { createApp } from 'vue'

import { router, setupRouter } from '@/router'
import { setupRouterGuard } from '@/router/guard'
import { isBuild, typeViteEnv } from '@/utils/env'

import App from './App.vue'
import { setupStore } from './store'
import { setupGlobCommon } from './core'
import { setupProdMockServer } from '@gx-mock/_createProductionServer'

import 'uno.css'
import 'nprogress/nprogress.css'

import './design/index.less'

import './plugins'

if (isBuild() && typeViteEnv('VITE_USE_MOCK')) setupProdMockServer()

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
