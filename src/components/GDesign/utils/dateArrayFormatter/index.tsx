import dayjs from 'dayjs'

/**
 * 格式化区域日期
 *
 * @param value
 */
const dateArrayFormatter = (value: any[], format: string) => {
  const [startText, endText] = Array.isArray(value) ? value : []
  // activePickerIndex for https://github.com/ant-design/ant-design/issues/22158
  const parsedStartText: string = startText ? dayjs(startText).format(format) : ''
  const parsedEndText: string = endText ? dayjs(endText).format(format) : ''
  const valueStr: string =
    parsedStartText && parsedEndText && `${parsedStartText} ~ ${parsedEndText}`

  return valueStr
}

export default dateArrayFormatter
