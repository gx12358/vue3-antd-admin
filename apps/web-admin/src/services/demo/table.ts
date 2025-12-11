import type { RequestOptions } from '@gx/request'
import { requestClient } from '@/services/base'

export type DefaultSearchConfig = Partial<Pick<MockTableRecord, 'adress' | 'age' | 'name' | 'createTime' | 'date' | 'status' | 'title'>>

export type SearchConfig<T = undefined> = T extends undefined ? DefaultSearchConfig : DefaultSearchConfig & T

export interface DefaultRecord {
  name?: string;
  title: string;
  author?: string;
  age?: number;
  address?: string;
  pageViews?: number;
  img?: string;
  logo?: string;
  content?: string;
  description: string;
  percent?: number;
  switch?: boolean;
  rate?: number;
  callNo?: number;
  adress?: string;
  date?: string;
  status?: 'processing' | 'error' | 'success';
  status1?: 0 | 1 | 2 | 3;
}

export type MockTableRecord<T = undefined> = T extends undefined
  ? TableRecord<DefaultRecord>
  : TableRecord<DefaultRecord> & T

export type UpdateMockTableRecord<T = undefined> = T extends undefined
  ? UpdateTableRecord<DefaultRecord>
  : UpdateTableRecord<DefaultRecord> & T

export function getList<T = any>(params, options = {} as RequestOptions) {
  return requestClient.get<T>('/demo/table/list', {
    params,
    ...options,
  })
}

export function getInfo<T = any>(params, options = {} as RequestOptions) {
  return requestClient.get<T>('/demo/table/get', {
    params,
    ...options,
  })
}

export function createList<T = any>(params, options = {} as RequestOptions) {
  return requestClient.post<T>('/demo/table/create', {
    params,
    ...options,
  })
}

export function updateList<T = any>(data, options = {} as RequestOptions) {
  return requestClient.post<T>('/demo/table/update', {
    data,
    ...options,
  })
}

export function deleteList<T = any>(params, options = {} as RequestOptions) {
  return requestClient.delete<T>('/demo/table/delete', {
    params,
    ...options,
  })
}
