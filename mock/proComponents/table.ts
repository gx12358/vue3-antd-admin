import { MockMethod } from 'vite-plugin-mock'
import { mock, Random } from 'mockjs'

const List = []
const count = 50

/**
 * @author gx12358 2539306317@qq.com
 * @description 随机生成图片url。
 * @param width
 * @param height
 * @returns {string}
 */
function handleRandomImage(width = 50, height = 50) {
  return `https://picsum.photos/${width}/${height}?random=${Random.guid()}`
}

for (let i = 0; i < count; i++) {
  List.push(
    mock({
      uuid: Random.guid(),
      id: '@id',
      title: '@title(1, 2)',
      description: '@csentence',
      'status|1': [ 'published', 'draft', 'deleted' ],
      author: '@cname',
      datetime: '@datetime',
      pageViews: '@integer(300, 5000)',
      img: handleRandomImage(228, 228),
      switch: '@boolean',
      percent: '@integer(80,99)',
      'rate|1': [ 1, 2, 3, 4, 5 ],
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`
    })
  )
}

export default [
  {
    url: '/mock-server/table/getList',
    type: 'get',
    response({ query }) {
      const { title, pageNum = 1, pageSize = 10 } = query
      const mockList = List.filter((item: any) => {
        return !(title && item.title.indexOf(title) < 0)
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageNum && index >= pageSize * (pageNum - 1)
      )
      return {
        code: 200,
        msg: 'success',
        total: mockList.length,
        data: pageList
      }
    }
  },
  {
    url: '/mock-server/table/doEdit',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功'
      }
    }
  },
  {
    url: '/mock-server/table/doDelete',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功'
      }
    }
  }
] as unknown as MockMethod[]
