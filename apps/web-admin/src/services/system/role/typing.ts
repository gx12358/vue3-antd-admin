import type { ExtendIfDefined } from '@gx-design-vue/pro-utils'

/** 角色信息 */
interface RoleRow {
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number;
  dataScope: number;
  remark?: string;
  dataScopeDeptIds: number[];
}

type DefaultSearchConfig = Partial<Pick<RoleTableRecord, 'name' | 'code' | 'status' | 'createTime'>>

export type SearchConfig<T = undefined> = ExtendIfDefined<DefaultSearchConfig, T>

export type RoleTableRecord<T = undefined> = ExtendIfDefined<TableRecord<RoleRow>, T>

export type UpdateRoleTableRecord = PartialFields<UpdateTableRecord<RoleRow>, 'sort' | 'type' | 'dataScope' | 'dataScopeDeptIds'>
