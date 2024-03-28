import dayjs from 'dayjs'
import mockjs from 'mockjs'
import { toChinesNum } from '@/utils/util'

const { Random } = mockjs

export type DictType = 'sys_common_status' | 'sys_common_category' | 'sys_common_author'

export interface DictRecord {
  dictType: DictType;
  dictValue: string | number;
  dictSort: number;
  dictCode: number;
  dictLabel: string;
  createTime: string;
  remark?: string;
}

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
    dictLabel: Random.cname(),
    remark: Random.cname(),
    dictType: 'sys_common_author',
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
})
