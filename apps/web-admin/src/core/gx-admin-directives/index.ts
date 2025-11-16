import type { App } from 'vue'
import { setupPermissionDirective } from './permission'

const directive = (app: App) => {
  setupPermissionDirective(app)
}

export default directive
