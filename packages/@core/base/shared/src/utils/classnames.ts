import { classNames } from '@gx-design-vue/pro-utils'
import { twMerge } from 'tailwind-merge'

export const cn = (...cls: any) => {
  return twMerge(classNames(cls))
}
