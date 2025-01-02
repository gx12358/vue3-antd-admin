import { faker, fakerZH_CN } from '@faker-js/faker'
import dayjs from 'dayjs'
import { createMockRoute } from '../../../mock'
import { otherAccountList } from '../../config/user'
import { initContent } from '../../utils/table'
import { mockNumber } from '../../utils/util'

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
  key: `${mockNumber(100000, 1000000)}`,
  name: fakerZH_CN.person.fullName(),
  barcode: `${mockNumber(100000, 1000200)}`,
  price: `${mockNumber(10, 100)}.00`,
  num: mockNumber(10, 100),
  amount: mockNumber(100, 200)
}))

const schedule = initContent<ScheduleRecord>(5, i => ({
  time: dayjs().subtract(mockNumber(1, 120), 'minute').format('YYYY-MM-DD HH:mm'),
  rate: [ '联系客户', '取货员出发', '取货员接单', '申请审批通过', '发起退货申请' ][i % 5],
  status: [ 'success', 'processing' ][i % 2] as any,
  operator: `取货员 ID${mockNumber(10, 100)}`
}))

export default createMockRoute([
  {
    url: '/profile/basic',
    method: 'get',
    timeout: 200,
    callback: () => ({
      useId: otherAccountList[mockNumber(0, otherAccountList.length - 1)]?.id,
      userName: otherAccountList[mockNumber(0, otherAccountList.length - 1)]?.name,
      pickNum: mockNumber(1000000, 1000010),
      saleNum: mockNumber(1000000, 1000010),
      orderNum: mockNumber(1000000, 1000010),
      status: ([ 'success', 'dispatch' ] as BasicDetails['status'][])[mockNumber(0, 1)],
      phone: '18100000000',
      express: '菜鸟仓储',
      adress: fakerZH_CN.location.city(),
      remark: faker.lorem.paragraph(1)
    })
  },
  {
    url: '/profile/basic/details',
    method: 'get',
    timeout: 200,
    callback: () => ({
      schedule,
      commodity
    })
  }
])
