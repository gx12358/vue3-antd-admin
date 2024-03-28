import dayjs from 'dayjs'
import mockjs from 'mockjs'
import { handleRandomImage } from '@gx-mock/util/utils'
import type { GroupListItem } from '@gx-mock/datasSource/group'

const { Random } = mockjs

export const groupList: GroupListItem[] = Array.from({ length: 20 }).map((_, key) => {
  return {
    id: key + 1,
    icon: handleRandomImage(),
    title: Random.ctitle(5, 10),
    creatTime: dayjs().subtract(Random.integer(1, 10), 'day').format('YYYY-MM-DD HH:mm:ss'),
    joinNum: Random.integer(1, 100)
  }
})
