import type { App, DirectiveBinding } from 'vue'
import { useAuth } from '@/hooks/system'

function isAuth(el: HTMLElement, binding: any, type: 'all' | 'some', showText = false) {
  const { permission, hasAuth } = useAuth()

  const value = binding.value
  if (value) {
    hasAuth(value, type)
    if (!permission.value) {
      if (showText) {
        el.outerHTML = `<span>无权限按钮</span>`
      } else {
        el.remove()
      }
    }
  }
}

export function setupPermissionDirective(app: App) {
  app.directive('auth', {
    mounted: (el: HTMLElement, binding: DirectiveBinding) => {
      isAuth(el, binding, 'some')
    }
  })
  app.directive('auth-text', {
    mounted: (el: HTMLElement, binding: DirectiveBinding) => {
      isAuth(el, binding, 'some', true)
    }
  })
  app.directive('all-auth', {
    mounted: (el: HTMLElement, binding: DirectiveBinding) => {
      isAuth(el, binding, 'all')
    }
  })
}
