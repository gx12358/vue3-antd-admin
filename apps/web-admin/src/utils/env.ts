import type { ViteEnv } from '@gx/types'
import { typeViteEnv as globalTypeViteEnv } from '@gx-core/shared/utils'

export function typeViteEnv(key: keyof (GlobalViteEnv & ViteEnv)) {
  return globalTypeViteEnv<GlobalViteEnv>(key)
}
