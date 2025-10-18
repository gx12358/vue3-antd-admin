import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'

export const isAfter = (date: ConfigType, compare: ConfigType) => {
  return dayjs(date).isAfter(dayjs(compare))
}

export const formatTime = ({ date, dateFormat }: { date: ConfigType; dateFormat: string }) => {
  return dayjs(date).format(dateFormat)
}
