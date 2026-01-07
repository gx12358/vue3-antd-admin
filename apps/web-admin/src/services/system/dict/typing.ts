import type { ExtendIfDefined } from '@gx-design-vue/pro-utils'

/** 用户信息 */
interface DictTypeRow {
  name: string;
  remark: string;
  status: number;
  type: DictType;
}

type DefaultSearchConfig = Partial<Pick<DictTypeTableRecord, 'name' | 'type' | 'status'>>

export type SearchConfig<T = undefined> = ExtendIfDefined<DefaultSearchConfig, T>

export type DictTypeTableRecord<T = undefined> = ExtendIfDefined<TableRecord<DictTypeRow>, T>

export type UpdateDictTypeTableRecord = Omit<UpdateTableRecord<DictTypeRow>, 'type'> & {
  type: string;
}
