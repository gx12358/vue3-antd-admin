import { faker, fakerZH_CN } from '@faker-js/faker'
import { createMockRoute } from '../../../mock'

export default createMockRoute([
  {
    url: '/form/stepForm',
    method: 'get',
    timeout: 200,
    callback: () => ({
      payAccount: faker.internet.email(),
      receiverAccount: faker.internet.email(),
      receiverName: fakerZH_CN.person.fullName(),
      amount: faker.number.int({ min: 1000, max: 2000 }),
      receiverMode: 'alipay'
    })
  }
])
