import type { ExtendIfDefined } from '@gx-design-vue/pro-utils'

/** 岗位信息 */
interface PostRow {
  name: string;
  code: string;
  sort?: number;
  status: number;
  remark: string;
}

type DefaultSearchConfig = Partial<Pick<PostTableRecord, 'name' | 'code' | 'status'>>

export type SearchConfig<T = undefined> = ExtendIfDefined<DefaultSearchConfig, T>

export type PostTableRecord<T = undefined> = ExtendIfDefined<TableRecord<PostRow>, T>

export type UpdatePostTableRecord = UpdateTableRecord<PostRow>
