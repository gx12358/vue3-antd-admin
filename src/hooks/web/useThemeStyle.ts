import type { ProAliasToken } from '@gx-design-vue/pro-provider'
import { useProConfigContext } from '@gx-design-vue/pro-provider'

export default function (options: Record<string, keyof ProAliasToken>) {
  const { token } = useProConfigContext()

  const styleRef = reactive<Record<keyof typeof options, any>>({})

  watchEffect(() => {
    if (!token?.value) return
    for (const key in options) {
      styleRef[key] = token.value[options[key]]
    }
  })

  return styleRef
}
