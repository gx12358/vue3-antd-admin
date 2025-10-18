import Loading from './Loading'
import { MoonIcon, SunnyIcon } from './Theme'

export type IconType = 'loading' | 'light' | 'dark'

export const Components: Record<IconType, any> = {
  loading: Loading,
  light: SunnyIcon,
  dark: MoonIcon,
}
