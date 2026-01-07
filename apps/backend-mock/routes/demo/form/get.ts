import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { eventHandler, getQuery } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response'

const mock_data = {
  'step': {
    payAccount: 'ant-design@alipay.com',
    receiverAccount: 'test@example.com',
    receiverName: 'Alex',
    amount: '500',
    receiverMode: 'alipay'
  },
  // name: '',
  // url: '',
  // owner: undefined,
  // approver: undefined,
  // dateRange: [],
  // type: undefined,
  // name2: '',
  // url2: '',
  // owner2: undefined,
  // approver2: undefined,
  // dateRange2: null,
  // type2: undefined
  'advanced': {
    name: faker.lorem.words(),
    url: faker.internet.url(),
    owner: 'xiao',
    approver: 'xiao',
    dateRange: [dayjs().format('YYYY-MM-DD HH:mm:ss'), dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')],
    type: 'private',
    name2: faker.lorem.words(),
    url2: faker.internet.url(),
    owner2: 'xiao',
    approver2: 'xiao',
    dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    type2: 'private'
  }
}

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  const { type } = getQuery(event)

  return useResponseSuccess(type ? mock_data[type as any] : {})
})
