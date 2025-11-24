import { createApp } from 'vue'

import App from './App.vue'
import { setupGloblCommon } from './core'
import { router, setupRouter } from './router'
import { setupRouterGuard } from './router/guard'
import { setupStore } from './store'

import 'uno.css'
import '@gx/styles'
import '@gx/styles/antd'
import './design/index.less'

function startApp() {
  const app = createApp(App)

  // store
  setupStore(app)

  // global
  setupGloblCommon(app)

  // route
  setupRouter(app)

  // guardRoute
  setupRouterGuard(router)

  app.mount('#app')
}

startApp()
