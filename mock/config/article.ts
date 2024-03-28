import mockjs from 'mockjs'
import type { ListItemDataType } from '../datasSource/list'
import { authorList } from '../config/dict'
import { handleRandomImage } from '../util/utils'

const { Random } = mockjs

export function fakeList<T = undefined>(
  count: number,
  extraFun?: (key: number) => T
): ListItemDataType<T>[] {
  const list: ListItemDataType<T>[] = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${Math.random().toString(36).slice(2, 6)}${i}`,
      owner: authorList.map(item => item.dictLabel)[i % authorList.length],
      title: Random.ctitle(),
      avatar: handleRandomImage(50, 50),
      cover: handleRandomImage(300, 200),
      status: [ 'active', 'exception', 'normal' ][i % 3] as | 'normal' | 'exception' | 'active' | 'success',
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: handleRandomImage(50, 50),
      href: 'https://next.antdv.com',
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
      subDescription: Random.cparagraph(2, Random.integer(6, 10)),
      description: Random.cparagraph(2, Random.integer(6, 10)),
      activeUser: Math.ceil(Math.random() * 100),
      newUser: Math.ceil(Math.random() * 1000 + 1000),
      star: Math.ceil(Math.random() * 100 + 100),
      like: Math.ceil(Math.random() * 100 + 100),
      message: Math.ceil(Math.random() * 10) + 10,
      content: Random.cparagraph(),
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
          id: 'member1'
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
          id: 'member2'
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
          id: 'member3'
        }
      ],
      ...(extraFun?.(i) || {})
    } as ListItemDataType<T>)
  }

  return list
}
