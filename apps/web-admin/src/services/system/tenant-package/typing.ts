import type { ExtendIfDefined } from '@gx-design-vue/pro-utils'

export interface TenantPackageRow {
  name: string;
  status: number;
  remark: string;
  menuIds: number[];
}

type DefaultSearchConfig = Partial<Pick<TenantPackageTable, 'name' | 'status' | 'createTime'>>

export type SearchConfig<T = undefined> = ExtendIfDefined<DefaultSearchConfig, T>

export type TenantPackageTable<T = undefined> = ExtendIfDefined<TableRecord<TenantPackageRow>, T>

export type UpdateTenantPackageTable = UpdateTableRecord<TenantPackageRow>
