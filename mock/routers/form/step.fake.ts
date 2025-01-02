import { faker, fakerZH_CN } from '@faker-js/faker'
import { createMockRoute } from '@gx-mock'

export default createMockRoute([
  {
    url: '/form/stepForm',
    method: 'get',
    timeout: 200,
    callback: () => ({
      payAccount: faker.internet.email(),
      receiverAccount: faker.internet.email(),
      receiverName: fakerZH_CN.person.fullName(),
      amount: faker.number.int({ min: 100000, max: 50000 }),
      receiverMode: 'alipay'
    })
  }
])
