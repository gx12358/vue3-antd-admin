import { classNames as cn } from '@gx-design-vue/pro-utils'
import { twMerge } from 'tailwind-merge'

const classNames = (...cls: any) => {
  return twMerge(cn(cls))
}

export default classNames
