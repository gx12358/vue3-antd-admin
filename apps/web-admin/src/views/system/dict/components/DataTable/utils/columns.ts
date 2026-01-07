import type { ExtendIfDefined } from '@gx-design-vue/pro-utils'

type DefaultSearchConfig = Partial<Pick<DictRecord, 'label' | 'status' | 'dictType'>>

export type SearchConfig<T = undefined> = ExtendIfDefined<DefaultSearchConfig, T>

export const columns: ProColumnsType<DictRecord, SearchConfig> = [
  {
    title: '字典编码',
    width: 90,
    dataIndex: 'id'
  },
  {
    title: '字典标签',
    dataIndex: 'label',
    searchConfig: {
      name: 'label',
      order: 2,
      valueType: 'text',
      placeholder: '请输入字典标签'
    }
  },
  {
    dataIndex: 'value',
    title: '字典键值',
    minWidth: 100,
  },
  {
    title: '字典排序',
    width: 90,
    dataIndex: 'sort'
  },
  {
    title: '状态',
    width: 90,
    dataIndex: 'status'
  },
  {
    title: '颜色类型',
    dataIndex: 'colorType'
  },
  {
    title: 'CSS Class',
    minWidth: 120,
    dataIndex: 'cssClass'
  },
  {
    title: '创建时间',
    width: 180,
    valueType: 'dateTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    width: 120,
    dataIndex: 'action'
  }
]
