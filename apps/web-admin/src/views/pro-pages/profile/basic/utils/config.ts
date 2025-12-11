import type { BasicGood, BasicProgress } from '../typings'

export const basicDetails = {
  pickNum: '1000000000',
  status: '已取货',
  saleNum: '1234123421',
  orderNum: '3214321432',
  userName: '付小小',
  phone: '18100000000',
  express: '顺丰',
  adress: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
  remark: '请于 2025-01-01 前联系'
}

export const descriptionsState: {
  name: string;
  data: Partial<Record<keyof typeof basicDetails, string>>
}[] = [
  {
    name: '退款申请',
    data: {
      pickNum: '取货单号',
      status: '状态',
      saleNum: '销售单号',
      orderNum: '子订单'
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
  }
]

export const basicGoods = [
  {
    id: '1234561',
    name: '矿泉水 550ml',
    barcode: '12421432143214321',
    price: '2.00',
    num: '1',
    amount: '2.00',
  },
  {
    id: '1234562',
    name: '凉茶 300ml',
    barcode: '12421432143214322',
    price: '3.00',
    num: '2',
    amount: '6.00',
  },
  {
    id: '1234563',
    name: '好吃的薯片',
    barcode: '12421432143214323',
    price: '7.00',
    num: '4',
    amount: '28.00',
  },
  {
    id: '1234564',
    name: '特别好吃的蛋卷',
    barcode: '12421432143214324',
    price: '8.50',
    num: '3',
    amount: '25.50',
  },
] as BasicGood[]

export const basicProgress = [
  {
    key: '1',
    time: '2017-10-01 14:10',
    rate: '联系客户',
    status: 'processing',
    operator: '取货员 ID1234',
    cost: '5mins',
  },
  {
    key: '2',
    time: '2017-10-01 14:05',
    rate: '取货员出发',
    status: 'success',
    operator: '取货员 ID1234',
    cost: '1h',
  },
  {
    key: '3',
    time: '2017-10-01 13:05',
    rate: '取货员接单',
    status: 'success',
    operator: '取货员 ID1234',
    cost: '5mins',
  },
  {
    key: '4',
    time: '2017-10-01 13:00',
    rate: '申请审批通过',
    status: 'success',
    operator: '系统',
    cost: '1h',
  },
  {
    key: '5',
    time: '2017-10-01 12:00',
    rate: '发起退货申请',
    status: 'success',
    operator: '用户',
    cost: '5mins',
  },
] as BasicProgress[]
