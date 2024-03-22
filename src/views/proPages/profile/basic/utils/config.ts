import type { ProTableProps } from '@gx-design-vue/pro-table'
import type { BasicDetails } from '@gx-mock/datasSource/profile/basic'

export const descriptionsState: {
  name: string;
  data: Partial<Record<keyof BasicDetails, string>>
}[] = [
  {
    name: '退款申请',
    data: {
      pickNum: '取货单号',
      status: '状态',
      saleNum: '销售单号',
      orderNum: '子订单',
    }
  },
  {
    name: '用户信息',
    data: {
      userName: '用户姓名',
      phone: '联系电话',
      express: '常用快递',
      adress: '取货地址',
      remark: '备注'
    }
  },
]

export const statusState: Record<BasicDetails['status'], string> = {
  success: '已取货',
  dispatch: '已派件',
}

export const defaultSTableState: ProTableProps = {
  options: false,
  bordered: false,
  pagination: false,
  showIndex: false,
  rowKey: 'id',
  showLoading: false
}
