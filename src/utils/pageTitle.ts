import { defaultSettings } from '@gx-config'

const { title, titleReverse, titleSeparator } = defaultSettings

/**
 * @author gx12358 2539306317@qq.com
 * @description 设置标题
 * @param pageTitle
 * @returns {string}
 */
export default function getPageTitle(pageTitle: string) {
  let newTitles: string[] = []
  if (pageTitle)
    newTitles.push(pageTitle)
  if (title)
    newTitles.push(title)
  if (titleReverse)
    newTitles = newTitles.reverse()
  return newTitles.join(titleSeparator)
}
