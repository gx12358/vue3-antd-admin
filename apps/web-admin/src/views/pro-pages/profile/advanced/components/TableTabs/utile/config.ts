import type { HttpResponse } from '@gx/request'
import type { MockTableRecord } from '@/services/demo/table'
import { getList } from '@/services/demo'

export type TabsStateActiveKey = 'table1' | 'table2' | 'table3'
export type StatusState = 'success' | 'processing' | 'error'

export interface TabPaneStateRecord {
  name: string;
  key: TabsStateActiveKey;
  request: <T, R = undefined>(params: Partial<any>) => Promise<HttpResponse<T, R>>;
}

export const tabPaneState: TabPaneStateRecord[] = [
  {
    name: '操作日志一',
    key: 'table1',
    request: getList
  },
  {
    name: '操作日志二',
    key: 'table2',
    request: getList
  },
  {
    name: '操作日志三',
    key: 'table3',
    request: getList
  }
]

export const columns: ProColumnsType<MockTableRecord> = [
  {
    title: '操作类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '操作人',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '执行结果',
    dataIndex: 'status',
    key: 'status'
  },

  {
    title: '操作时间',
    dataIndex: 'updateTime',
    key: 'updateTime'
  },
  {
    title: '备注',
    dataIndex: 'memo',
    key: 'memo',
    columnEmptyText: '-'
  }
]

export const statusState: Partial<Record<StatusState, string>> = {
  success: '成功',
  processing: '进行中',
  error: '驳回'
}
