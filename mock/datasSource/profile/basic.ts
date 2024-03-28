import mockjs from 'mockjs'
import dayjs from 'dayjs'
import { getMockRequest } from '@gx-mock/util/utils'
import { otherAccountList } from '@gx-mock/config/user'
import { initContent } from '@gx-mock/util/table'

const { Random } = mockjs

export interface BasicDetails {
  pickNum: number;
  saleNum: number;
  orderNum: number;
  useId: number;
  userName: string;
  phone: string;
  express: string;
  adress: string;
  remark: string;
  status: 'success' | 'dispatch';
}

export interface CommodityRecord {
  key: string;
  name: string;
  barcode: string;
  price: string;
  num: number;
  amount: number;
}

export interface ScheduleRecord {
  time: string;
  rate: string;
  status: 'success' | 'processing';
  operator: string;
  cost?: string;
}

const commodity = initContent<CommodityRecord>(4, () => ({
  key: `${Random.integer(100000, 1000000)}`,
  name: Random.cname(),
  barcode: `${Random.integer(100000, 1000200)}`,
  price: `${Random.integer(10, 100)}.00`,
  num: Random.integer(10, 100),
  amount: Random.integer(100, 200),
}))

const schedule = initContent<ScheduleRecord>(5, i => ({
  time: dayjs().subtract(Random.integer(1, 120), 'minute').format('YYYY-MM-DD HH:mm'),
  rate: [ '联系客户', '取货员出发', '取货员接单', '申请审批通过', '发起退货申请' ][i % 5],
  status: [ 'success', 'processing' ][i % 2] as any,
  operator: `取货员 ID${Random.integer(10, 100)}`,
}))

export default [
  getMockRequest<any, BasicDetails>({
    url: '/profile/basic',
    method: 'get',
    timeout: 200,
    callback: () => ({
      useId: otherAccountList[Random.integer(0, otherAccountList.length - 1)]?.id,
      userName: otherAccountList[Random.integer(0, otherAccountList.length - 1)]?.name,
      pickNum: Random.integer(1000000, 1000010),
      saleNum: Random.integer(1000000, 1000010),
      orderNum: Random.integer(1000000, 1000010),
      status: ([ 'success', 'dispatch' ] as BasicDetails['status'][])[Random.integer(0, 1)],
      phone: '18100000000',
      express: '菜鸟仓储',
      adress: Random.city(),
      remark: Random.cparagraph(1)
    })
  }),
  getMockRequest({
    url: '/profile/basic/details',
    method: 'get',
    timeout: 200,
    callback: () => ({
      schedule,
      commodity
    })
  }),
]
