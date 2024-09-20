import type { ProColumnsType, ProTableProps } from '@gx-design-vue/pro-table'
import type { AdvancedTableRecord } from '@gx-mock/datasSource/profile/advanced'
import type { ListSearchParams } from '@gx-mock/util/table'
import { getAdvancedTable1, getAdvancedTable2, getAdvancedTable3 } from '@/services/profileCenter'

export type TabsStateActiveKey = 'table1' | 'table2' | 'table3'

export interface TabPaneStateRecord {
  name: string;
  key: TabsStateActiveKey;
  request: <T, D = undefined>(params: Partial<ListSearchParams>) => Promise<ResponseResult<T, D>>;
}

export const tabPaneState: TabPaneStateRecord[] = [
  {
    name: '操作日志一',
    key: 'table1',
    request: getAdvancedTable1
  },
  {
    name: '操作日志二',
    key: 'table2',
    request: getAdvancedTable2
  },
  {
    name: '操作日志三',
    key: 'table3',
    request: getAdvancedTable3
  },
]

export const columns: ProColumnsType = [
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
    key: 'memo'
  }
]

export const defaultTableState: ProTableProps = {
  options: false,
  showIndex: false,
  bordered: false,
  pagination: { pageSize: 5 }
}

export const statusState: Record<AdvancedTableRecord['status'], {
  status: 'success' | 'processing' | 'error';
  text: string;
}> = {
  agree: {
    status: 'success',
    text: '成功'
  },
  active: {
    status: 'processing',
    text: '进行中'
  },
  reject: {
    status: 'error',
    text: '驳回'
  },
}
