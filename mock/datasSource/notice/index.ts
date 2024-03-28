import dayjs from 'dayjs'
import mockjs from 'mockjs'
import { getMockRequest } from '@gx-mock/util/utils'

const { Random } = mockjs

export interface MailNoticeListItem {
  id: string;
  updatedAt: number;
  user: {
    name: string;
    avatar: string;
  };
  comment?: {
    name: string;
    link: string;
  };
  group?: {
    name: string;
    link: string;
  };
  project: {
    name: string;
    link: string;
  };
  template: string;
}

const avatars2 = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png'
]

const getActivities: MailNoticeListItem[] = [
  {
    id: 'trend-1',
    updatedAt: dayjs().subtract(Random.integer(1, 10), 'day').valueOf(),
    user: {
      name: '曲丽丽',
      avatar: avatars2[0]
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/'
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/'
    },
    template: '在 @{group} 新建项目 @{project}'
  },
  {
    id: 'trend-2',
    updatedAt: dayjs().subtract(Random.integer(1, 10), 'day').valueOf(),
    user: {
      name: '付小小',
      avatar: avatars2[1]
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/'
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/'
    },
    template: '在 @{group} 新建项目 @{project}'
  },
  {
    id: 'trend-3',
    updatedAt: dayjs().subtract(Random.integer(1, 10), 'day').valueOf(),
    user: {
      name: '林东东',
      avatar: avatars2[2]
    },
    group: {
      name: '中二少女团',
      link: 'http://github.com/'
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/'
    },
    template: '在 @{group} 新建项目 @{project}'
  },
  {
    id: 'trend-4',
    updatedAt: dayjs().subtract(Random.integer(1, 10), 'day').valueOf(),
    user: {
      name: '周星星',
      avatar: avatars2[4]
    },
    project: {
      name: '5 月日常迭代',
      link: 'http://github.com/'
    },
    template: '将 @{project} 更新至已发布状态'
  },
  {
    id: 'trend-5',
    updatedAt: dayjs().subtract(Random.integer(1, 10), 'day').valueOf(),
    user: {
      name: '朱偏右',
      avatar: avatars2[3]
    },
    project: {
      name: '工程效能',
      link: 'http://github.com/'
    },
    comment: {
      name: '留言',
      link: 'http://github.com/'
    },
    template: '在 @{project} 发布了 @{comment}'
  },
  {
    id: 'trend-6',
    updatedAt: dayjs().subtract(Random.integer(1, 10), 'day').valueOf(),
    user: {
      name: '乐哥',
      avatar: avatars2[5]
    },
    group: {
      name: '程序员日常',
      link: 'http://github.com/'
    },
    project: {
      name: '品牌迭代',
      link: 'http://github.com/'
    },
    template: '在 @{group} 新建项目 @{project}'
  }
]

export default [
  getMockRequest({
    url: '/mail/notice',
    method: 'get',
    callback: () => getActivities
  })
]
