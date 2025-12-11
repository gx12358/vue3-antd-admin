import type { Fn } from '@gx/types'
import type { MaybeRef } from 'vue'
import { useProConfigContext } from '@gx-design-vue/pro-provider'
import { getRandomNumber, isFunction } from '@gx-design-vue/pro-utils'
import { useStyleTag } from '@vueuse/core'
import { computed, unref } from 'vue'

const id = `global_style_${getRandomNumber().uuid(7)}`

export type ModulesStyles = Fn[]

export function useGlobalIconStyle(modules: MaybeRef<ModulesStyles> = []) {
  const { token } = useProConfigContext()

  const cssStr = computed(() => {
    const moduleStyleStr: string[] = []
    const data = unref(modules)
    data.forEach((mod) => {
      if (isFunction(mod)) {
        moduleStyleStr.push(mod(token.value))
      }
    })
    return moduleStyleStr.join('\n')
  })

  useStyleTag(cssStr, {
    id
  })
}
