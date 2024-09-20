import { defaultSettings } from '@gx-config'

const { title, titleReverse, titleSeparator } = defaultSettings

/**
 * @Author      gx12358
 * @DateTime    2024/9/20
 * @lastTime    2024/9/20
 * @description 设置标题
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
