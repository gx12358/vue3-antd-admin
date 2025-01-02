import { faker, fakerZH_CN } from '@faker-js/faker'
import { groupList } from '../group'
import { permissions } from '../permissions'
import userIds from './id'

const admin = [ 1, 2 ]

export interface RolesInfo {
  roleId: number;
  roleKey: string;
  roleName: string;
  status: string;
}

export interface UserList {
  id: number;
  name: string;
}

export const accessTokens = {
  gx12358: 'gx-accessToken',
  admin: 'admin-accessToken',
  editor: 'editor-accessToken',
  no_editor: 'test-accessToken'
}

export const accounts = {
  admin: 'gx.design',
  gx12358: 'aa123456',
  editor: 'gx.design',
  no_editor: 'gx.design'
}

export const rolesInfo: RolesInfo[] = [
  {
    roleId: 1,
    roleKey: 'gx-admin',
    roleName: 'gx12358-超级管理员',
    status: '0'
  },
  {
    roleId: 2,
    roleKey: 'admin',
    roleName: '超级管理员',
    status: '0'
  },
  {
    roleId: 3,
    roleKey: 'editor',
    roleName: '编辑人员',
    status: '0'
  }
]

export const tokenAccount = {
  '1': accessTokens.gx12358,
  '2': accessTokens.admin,
  '3': accessTokens.editor,
  '4': accessTokens.no_editor
}

const rolesInfoAccount = {
  '1': rolesInfo.filter(item => [ 1 ].includes(item.roleId)),
  '2': rolesInfo.filter(item => [ 2 ].includes(item.roleId)),
  '3': rolesInfo.filter(item => [ 3 ].includes(item.roleId)),
  '4': rolesInfo.filter(item => [ 3 ].includes(item.roleId))
}

const nickNameAccount = {
  '1': 'gx12358',
  '2': 'admin',
  '3': 'editor',
  '4': 'no_editor'
}

export const defaultUser = (id = 2) => ({
  permissions: permissions[String(id)],
  roles: rolesInfoAccount[String(id)].map(item => item.roleKey),
  user: {
    userId: Number(id),
    admin: admin.includes(Number(id)),
    roles: rolesInfoAccount[String(id)],
    levelName: '前端开发工程师',
    roleIds: rolesInfoAccount[String(id)].map(item => item.roleId),
    nickName: nickNameAccount[String(id)],
    group: groupList?.find((_, key) => key === faker.number.int({
      min: 0,
      max: groupList.length - 1
    })),
    avatar: fakerZH_CN.image.avatar(),
    address: fakerZH_CN.location.city(),
    provinceCode: '340000',
    cityCode: '340100',
    districtCode: '340102',
    email: 'gx12358@gmail.com',
    phonenumber: fakerZH_CN.phone.number(),
    introduction: faker.lorem.paragraph(1),
    tags: Array.from({ length: faker.number.int({ min: 4, max: 8 }) }).map(_ => faker.lorem.words({ min: 1, max: 1 })).join(),
    userName: Object.keys(accessTokens).find(el => tokenAccount[String(id)] === accessTokens[el])
  } as Partial<UserDetails>
})

export const otherAccountList: UserList[] = [ '付小小', '曲丽丽', '林东东', '周星星', '吴加好', '朱偏右', '鱼酱', '乐哥', '谭小仪', '仲尼' ]
  .map((name, key) => {
    return {
      id: key + 1,
      name
    }
  })

export const userList: UserInfo[] = userIds.map(item => defaultUser(item.id)) as unknown as UserInfo[]
