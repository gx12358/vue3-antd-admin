import { getRandomNumber } from '@gx-design-vue/pro-utils'
import dayjs from 'dayjs'

/**
 * @Author      gx12358
 * @DateTime    2022/4/22
 * @lastTime    2022/4/22
 * @description 修改文件名
 */
export const createFileName = ({
  file,
  name
}: {
  file: File | string;
  name?: string;
}) => {
  if (name !== 'image' && name !== 'vod')
    return name
  const names = file instanceof File ? file.name.split('.') : file.split('.')
  const time1 = dayjs().format('YYYYMMDDHH')
  const uuid = `${name || 'vod'}/creator/${time1}/${getRandomNumber().uuid(32).toLowerCase()}`
  if (names.length > 1) {
    return uuid + '.' + names[names.length - 1]
  } else {
    return uuid
  }
}
