import type { ProAliasToken } from '@gx-design-vue/pro-provider'
import { useProConfigContext } from '@gx-design-vue/pro-provider'

export default function (options: Record<keyof CSSObject, keyof ProAliasToken>) {
  const { token } = useProConfigContext()

  const styleRef = reactive({})

  watchEffect(() => {
    for (const key in options) {
      styleRef[key] = token.value[options[key]]
    }
  })

  return styleRef
}
