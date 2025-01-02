import type { GroupListItem } from '@gx-mock/routers/group/index.fake'
import { faker, fakerZH_CN } from '@faker-js/faker'
import dayjs from 'dayjs'

export const groupList: GroupListItem[] = Array.from({ length: 20 }).map((_, key) => {
  return {
    id: key + 1,
    icon: faker.image.avatar(),
    title: fakerZH_CN.book.title(),
    creatTime: dayjs().subtract(faker.number.int({
      min: 0,
      max: 10
    }), 'day').format('YYYY-MM-DD HH:mm:ss'),
    joinNum: faker.number.int({
      min: 10,
      max: 100
    })
  }
})
