import { currentMode, isDev } from '@/utils/env'
import { defaultSettings } from '@gx-config'

const { title } = defaultSettings.system

const commonStyle = {
  'padding': '2px 5px',
  'border-radius': '3px 0 0 3px',
  'margin': '0 0 5px 0',
  'color': '#fff',
}

export const versionStyle = {
  'background': '#00DC8250',
  'color': '#165DFF',
  'padding': '2px 5px',
  'border-radius': '0 3px 3px 0',
  'margin': '0 0 5px 0',
}

export const titleStyle = {
  ...commonStyle,
  background: '#4FC08D',
}

export function getStyleCode(style) {
  const styles = Object.entries(style).map(([key, value]) => {
    return `${key}:${value};`
  }).join('')
  return styles
}

export function logVersion() {
  if (isDev()) return
  const titleString = `%c${title}-${window.version}`
  const versionString = `%c当前环境：${currentMode()}`
  console.log(
    `${titleString}${versionString}`,
    `${getStyleCode(titleStyle)}`,
    `${getStyleCode(versionStyle)}`
  )
}
