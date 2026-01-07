import type { ExtendIfDefined } from '@gx-design-vue/pro-utils'
import type { Dayjs } from 'dayjs'

/** 租户信息 */
export interface TenantRow {
  name: string;
  packageId: number;
  contactName: string;
  contactMobile: string;
  accountCount: number;
  expireTime: Date;
  websites: string[];
  status: number;
}

type DefaultSearchConfig = Partial<Pick<TenantTableRecord, 'name' | 'contactName' | 'contactMobile' | 'createTime' | 'status'>>

export type UpdateTenantRow = Omit<PartialFields<UpdateTableRecord<TenantRow>, 'packageId' | 'accountCount'>, 'expireTime'>

export type SearchConfig<T = undefined> = ExtendIfDefined<DefaultSearchConfig, T>

export type TenantTableRecord<T = undefined> = ExtendIfDefined<TableRecord<TenantRow>, T>

export type UpdateTenantTableRecord = ExtendIfDefined<UpdateTenantRow, {
  username: string;
  password: string;
  expireTime: Dayjs | undefined;
}>
