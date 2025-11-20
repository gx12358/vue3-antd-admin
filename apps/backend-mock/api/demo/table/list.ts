import { faker } from '@faker-js/faker'
import { eventHandler, getQuery } from 'h3'
import { verifyAccessToken } from '~/utils/jwt-utils'
import {
  sleep,
  unAuthorizedResponse,
  usePageResponseSuccess,
} from '~/utils/response'

function generateMockDataList(count: number) {
  const dataList = []

  for (let i = 0; i < count; i++) {
    const dataItem = {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      age: faker.number.int({ min: 18, max: 100 }),
      adress: faker.location.city(),
      author: faker.person.fullName(),
      productName: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      percent: `${faker.number.int({ min: 1, max: 100 })}%`,
      img: faker.image.url(),
    }

    dataList.push(dataItem)
  }

  return dataList
}

const mockData = generateMockDataList(100)

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event)
  if (!userinfo) {
    return unAuthorizedResponse(event)
  }

  await sleep(200)

  const { page, pageSize } = getQuery(event)
  // 规范化分页参数，处理 string[]
  const pageRaw = Array.isArray(page) ? page[0] : page
  const pageSizeRaw = Array.isArray(pageSize) ? pageSize[0] : pageSize
  const pageNumber = Math.max(
    1,
    Number.parseInt(String(pageRaw ?? '1'), 10) || 1,
  )
  const pageSizeNumber = Math.min(
    100,
    Math.max(1, Number.parseInt(String(pageSizeRaw ?? '10'), 10) || 10),
  )
  const listData = structuredClone(mockData)

  return usePageResponseSuccess(
    String(pageNumber),
    String(pageSizeNumber),
    listData,
  )
})
