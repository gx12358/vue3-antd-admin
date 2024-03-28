import type { App, Directive, DirectiveBinding } from 'vue'

import { usePermissions } from '@gx-admin/hooks/system'

function isAuth(el: Element, binding: any) {
  const { permission, hasPermission } = usePermissions()

  const value = binding.value
  if (value) {
    hasPermission(value)
    if (!permission.value) el.parentNode?.removeChild(el)
  }
}

const mounted = (el: Element, binding: DirectiveBinding) => {
  isAuth(el, binding)
}

const authDirective: Directive = {
  mounted
}

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective)
}

export default authDirective
