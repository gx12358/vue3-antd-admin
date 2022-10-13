import type { configSeting } from '/types/config'
import theme from './default/theme'
import network from './default/network'
import animate from './default/animate'
import defaultSettings from './default/defaultSettings'

export * from './default/proxy'

export default {
  theme,
  network,
  animate,
  defaultSettings
} as configSeting
