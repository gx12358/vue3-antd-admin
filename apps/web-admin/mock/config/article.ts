import type { DefaultToT } from '@gx-design-vue/pro-utils'
import { faker, fakerZH_CN } from '@faker-js/faker'
import { handleRandomImage } from '../utils/util'
import { authorList } from './dict'

export interface Member {
  avatar: string;
  name: string;
  id: string;
}

interface DefaultListItemDataType {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
}

export type ListItemDataType<T = undefined> = DefaultToT<DefaultListItemDataType, T>

export function fakeList<T = undefined>(
  count: number,
  extraFun?: (key: number) => T
): ListItemDataType<T>[] {
  const list: ListItemDataType<T>[] = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${Math.random().toString(36).slice(2, 6)}${i}`,
      owner: authorList.map(item => item.dictLabel)[i % authorList.length],
      title: faker.book.title(),
      avatar: handleRandomImage(50, 50),
      cover: handleRandomImage(300, 200),
      status: [ 'active', 'exception', 'normal' ][i % 3] as | 'normal' | 'exception' | 'active' | 'success',
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: handleRandomImage(50, 50),
      href: 'https://next.antdv.com',
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
      subDescription: faker.lorem.paragraph(1),
      description: faker.lorem.paragraphs(2),
      activeUser: Math.ceil(Math.random() * 100),
      newUser: Math.ceil(Math.random() * 1000 + 1000),
      star: Math.ceil(Math.random() * 100 + 100),
      like: Math.ceil(Math.random() * 100 + 100),
      message: Math.ceil(Math.random() * 10) + 10,
      content: faker.lorem.paragraphs(),
      members: [
        {
          name: fakerZH_CN.person.fullName(),
          avatar: faker.image.avatar(),
          id: 'member1'
        },
        {
          name: fakerZH_CN.person.fullName(),
          avatar: faker.image.avatar(),
          id: 'member2'
        },
        {
          name: fakerZH_CN.person.fullName(),
          avatar: faker.image.avatar(),
          id: 'member3'
        }
      ],
      ...(extraFun?.(i) || {})
    } as ListItemDataType<T>)
  }

  return list
}
