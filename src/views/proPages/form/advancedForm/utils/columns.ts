import type { TableRecord } from '@gx-mock/datasSource/form/advanced'

export interface FormState {
  name: string;
  url: string;
  owner?: any;
  approver?: any;
  dateRange: any;
  type?: any;
  name2: string;
  url2: string;
  owner2?: any;
  approver2?: any;
  dateRange2?: any;
  type2?: any;
}

export const columns: ProColumnsType<TableRecord, FormState> = [
  {
    title: '成员姓名',
    dataIndex: 'name',
    key: 'name',
    width: '20%'
  },
  {
    title: '工号',
    dataIndex: 'workId',
    key: 'workId',
    width: '20%'
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    key: 'department',
    width: '40%'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action'
  }
]
