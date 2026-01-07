import type { ExtendIfDefined } from '@gx-design-vue/pro-utils'

/** 用户信息 */
interface UserRow {
  username: string;
  nickname: string;
  deptId: number;
  postIds: string[];
  email: string;
  mobile: string;
  sex: number;
  status: CommonStatus;
  avatar?: string;
  loginIp?: string;
  remark: string;
}

type DefaultSearchConfig = Partial<Pick<UserTableRecord, 'username' | 'mobile' | 'createTime' | 'deptId'>>

export type UpdateUserRow = PartialFields<UpdateTableRecord<UserRow>, 'deptId'>

export type SearchConfig<T = undefined> = ExtendIfDefined<DefaultSearchConfig, T>

export type UserTableRecord<T = undefined> = ExtendIfDefined<TableRecord<UserRow>, T>

export type UpdateUserTableRecord = ExtendIfDefined<UpdateUserRow, {
  password: string;
}>
