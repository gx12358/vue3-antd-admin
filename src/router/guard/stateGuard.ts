import type { Router } from 'vue-router'

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    const user = useStoreUser()
    if (to.path === '/user/login') {
      user.resetPermissions()
    }
  })
}
