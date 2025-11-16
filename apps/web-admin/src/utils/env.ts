import { typeViteEnv as globaltypeViteEnv } from '@gx-core/shared/utils'

export function typeViteEnv(key: keyof (GlobalViteEnv & ViteEnv)) {
  return globaltypeViteEnv<GlobalViteEnv>(key)
}
