import { faker, fakerZH_CN } from '@faker-js/faker'
import { toChinesNum } from '@gx-design-vue/pro-utils'
import dayjs from 'dayjs'

export const categoryList: DictRecord[] = Array.from({ length: 12 }).map((_, key) => {
  return {
    dictSort: key,
    dictValue: `${key}`,
    dictCode: key + 1,
    dictLabel: '类目' + toChinesNum(key + 1),
    remark: '类目' + toChinesNum(key + 1),
    dictType: 'sys_common_category',
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
})

export const commonStatus: DictRecord[] = Array.from({ length: 2 }).map((_, key) => {
  return {
    dictSort: key,
    dictValue: `${key}`,
    dictCode: key + 1,
    dictLabel: key === 0 ? '成功' : '失败',
    remark: key === 0 ? '正常状态' : '停用状态',
    dictType: 'sys_common_status',
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
})

export const authorList: DictRecord[] = Array.from({ length: 8 }).map((_, key) => {
  return {
    dictSort: key,
    dictValue: `${key}`,
    dictCode: key + 1,
    dictLabel: fakerZH_CN.person.fullName(),
    remark: faker.lorem.text(),
    dictType: 'sys_common_author',
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
})
