import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { getArraryList } from './util'

export interface ListItem {
  createTime: string | null;
  id: number;
}

export interface ListSearchParams {
  pageNum?: number;
  pageSize?: number;
  sord?: 'asc' | 'desc';
  sidx?: 'createTime';
}

export function initContent<T>(
  max,
  callbackParams?: (key: number) => Omit<T, 'id' | 'createTime'> & Partial<ListItem>
): (Omit<T, 'id' | 'createTime'> & ListItem)[] {
  const mockParams = {} as any
  const list: (T & ListItem)[] = getArraryList(max, () => mockParams)

  return list.map((item, index) => {
    return {
      ...item,
      createTime: dayjs()
        .subtract(faker.number.int({ min: 3, max: 60 }), 'day')
        .subtract(faker.number.int({ min: 2, max: 6 }), 'hour')
        .subtract(faker.number.int({ min: 1, max: 59 }), 'minute')
        .subtract(faker.number.int({ min: 1, max: 59 }), 'second')
        .format('YYYY-MM-DD HH:mm:ss'),
      ...callbackParams?.(index)
    }
  })
}

export function handlePageList<T>(
  dataSource: T[],
  { pageNum, pageSize, callBack }: {
    pageNum: number;
    pageSize: number;
    callBack?: (data: T[]) => T[]
  }
): T[] {
  if (callBack)
    dataSource = callBack?.(dataSource)
  return cloneDeep(dataSource).filter(
    (_, sort) => (sort < pageNum * pageSize) && (sort >= pageSize * (pageNum - 1))
  )
}

export function compareToMaxTime(obj1, obj2, key, type: 0 | 1 = 0) {
  const val1 = obj1[key]
  const val2 = obj2[key]
  let result = 0
  if (dayjs(val1).isBefore(dayjs(val2))) {
    result = type === 0 ? -1 : 0
  } else if (dayjs(val1).isAfter(dayjs(val2))) {
    result = type === 0 ? 0 : (-1)
  }
  return result
}

export function postDataSource<T>(
  dataSource: (Omit<T, 'id' | 'createTime'> & ListItem)[],
  type: 'delete' | 'add' | 'update' = 'update',
  options?: { key?: string; params: Partial<(Omit<T, 'id' | 'createTime'> & ListItem)> }
) {
  if (type === 'update') {
    dataSource = dataSource.map((item: any) => {
      // @ts-ignore
      if (options?.params?.[options.key] === item[options?.key])
        return { ...item, ...options?.params }
      return item
    })
}
  if (type === 'add') {
    dataSource.unshift({
      ...options?.params as (Omit<T, 'id' | 'createTime'> & ListItem),
      id: dataSource.length + 1
    })
}
  if (type === 'delete') {
    // @ts-ignore
    dataSource = dataSource.filter(item => options?.params?.[options.key] !== item[options?.key])
  }

  return dataSource
}
