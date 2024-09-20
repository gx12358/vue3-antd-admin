import { createApp } from 'vue'

import App from './App.vue'
import { setupGlobCommon } from './core'
import { router, setupRouter } from './router'
import { setupRouterGuard } from './router/guard'
import { setupStore } from './store'

import 'uno.css'
import 'nprogress/nprogress.css'
import './design/index.less'

// plugins
import './plugins'

function startApp() {
  const app = createApp(App)

  // store
  setupStore(app)

  // global
  setupGlobCommon(app)

  // route
  setupRouter(app)

  // guardRoute
  setupRouterGuard(router)

  app.mount('#app')
}

startApp()
