import type { Router } from 'vue-router'

export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, _, next) => {
    next()
  })
}
