import mockjs from 'mockjs'
import type { GroupListItem } from '@gx-mock/datasSource/group'
import { groupList } from './group'
import { permissions } from './permissions'

const { Random, mock } = mockjs

const admin = [ 1, 2 ]

export interface RolesInfo {
  roleId: number;
  roleKey: string;
  roleName: string;
  status: string;
}

export interface UserDetails {
  roles: RolesInfo[];
  userId: number;
  roleIds: number[];
  userName: string;
  nickName: string;
  avatar: string;
  admin: boolean;
  address: string;
  signature: string;
  introduction: string;
  tags?: string;
  phone?: string;
  email?: string;
  levelName?: string;
  group?: GroupListItem;
  provinceCode?: string;
  cityCode?: string;
  districtCode?: string;
  loginDate?: string;
}

export interface UserInfo {
  roles: string[];
  permissions: string[];
  user: UserDetails;
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

export const defaultUser = {
  permissions: permissions[String(2)],
  roles: rolesInfoAccount[String(2)].map(item => item.roleKey),
  user: {
    userId: 2,
    admin: admin.includes(2),
    roles: rolesInfoAccount[String(2)],
    levelName: '前端开发工程师',
    roleIds: rolesInfoAccount[String(2)].map(item => item.roleId),
    nickName: nickNameAccount[String(2)],
    group: groupList?.find((_, key) => key === Random.integer(0, groupList.length - 1)),
    address: '安徽省合肥市瑶海区',
    provinceCode: '340000',
    cityCode: '340100',
    districtCode: '340102',
    email: 'gx12358@gmail.com',
    phone: '18811217623',
    introduction: Random.cparagraph(10, 15),
    tags: Array.from({ length: Random.integer(4, 8) }).map(_ => Random.cword(2, 6)).join(),
    userName: Object.keys(accessTokens).find(el => tokenAccount[String(2)] === accessTokens[el])
  } as Partial<UserDetails>
}

export const otherAccountList: UserList[] = [ '付小小', '曲丽丽', '林东东', '周星星', '吴加好', '朱偏右', '鱼酱', '乐哥', '谭小仪', '仲尼' ]
  .map((name, key) => {
    return {
      id: key + 1,
      name
    }
  })

const createAccountInfoList = (): UserInfo[] => {
  const list = mock({
    'data|4': [
      {
        'id|+1': 1
      }
    ]
  })

  return list.data.map((item: any) => ({
    permissions: permissions[String(item.id)] as string[],
    roles: rolesInfoAccount[String(item.id)].map(item => item.roleKey) as string[],
    user: {
      userId: item.id,
      admin: admin.includes(item.id),
      roles: rolesInfoAccount[String(item.id)],
      roleIds: rolesInfoAccount[String(item.id)].map(item => item.roleId),
      nickName: nickNameAccount[String(item.id)],
      levelName: '前端开发工程师',
      signature: '海纳百川，有容乃大',
      group: groupList?.find((_, key) => key === Random.integer(0, groupList.length - 1)),
      userName: Object.keys(accessTokens).find(el => tokenAccount[String(item.id)] === accessTokens[el]),
      address: '安徽省合肥市瑶海区',
      provinceCode: '340000',
      cityCode: '340100',
      districtCode: '340102',
      email: 'gx12358@gmail.com',
      phone: '18811217623',
      introduction: Random.cparagraph(10, 15),
      tags: Array.from({ length: Random.integer(4, 8) }).map(_ => Random.cword(2, 6)).join(),
      avatar: 'https://ahtv-obs.obs.cn-north-4.myhuaweicloud.com/20211111162748.jpg'
    }
  }))
}

export const userList: UserInfo[] = createAccountInfoList()
