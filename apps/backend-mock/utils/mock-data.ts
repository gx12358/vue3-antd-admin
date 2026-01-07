import type { UserInfo } from '@gx/types'
import dayjs from 'dayjs'

export interface TenantInfo {
  /**
   * 账号数量
   */
  accountCount: number;
  /**
   * 联系手机
   */
  contactMobile?: string;
  /**
   * 联系人
   */
  contactName: string;
  /**
   * 创建时间
   */
  createTime: any;
  /**
   * 过期时间
   */
  expireTime: any;
  /**
   * 租户编号
   */
  id: number;
  /**
   * 租户名
   */
  name: string;
  /**
   * 租户套餐编号
   */
  packageId: number;
  /**
   * 租户状态
   */
  status: number;
  /**
   * 绑定域名数组
   */
  websites?: string[];

  [property: string]: any;
}

export interface TimezoneOption {
  offset: number;
  timezone: string;
}

export interface UserDatabase extends UserInfo {
  mobile: string;
  status: number;
  createTime: number;
  postIds: number[] | null;
  roleId: number[];
  tenantId?: number;
  password?: string;
}

export interface RoleDatabase {
  /**
   * 角色标志
   */
  code: string;
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * 数据范围，参见 DataScopeEnum 枚举类
   */
  dataScope: number;
  /**
   * 数据范围(指定部门数组)
   */
  dataScopeDeptIds?: number[];
  /**
   * 角色编号
   */
  id: number;
  /**
   * 角色名称
   */
  name: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 显示顺序
   */
  sort: number;
  /**
   * 状态，参见 CommonStatusEnum 枚举类
   */
  status: number;
  /**
   * 角色类型，参见 RoleTypeEnum 枚举类
   */
  type: number;
}

export interface DeptDatabase {
  /**
   * 部门编号
   */
  id: number;
  /**
   * 部门名称
   */
  name: string;
  /**
   * 父部门 ID
   */
  parentId: number;

  [property: string]: any;
}

export const TENANT_LIST: TenantInfo[] = [
  {
    'id': 1,
    'name': '智耳科技',
    'contactName': 'admin',
    'contactMobile': '18356517524',
    'status': 0,
    'websites': [
      'http://gx12358.cn',
    ],
    'packageId': 111,
    'expireTime': 1651161600000,
    'accountCount': 50,
    'createTime': 1646660278000
  },
  {
    'id': 2,
    'name': '小租户',
    'contactName': 'admin',
    'contactMobile': '18356517524',
    'status': 0,
    'websites': [
      'http://gx12358.cn',
    ],
    'packageId': 111,
    'expireTime': 1783612800000,
    'accountCount': 30,
    'createTime': 1645462574000
  },
  {
    'id': 3,
    'name': '测试租户',
    'contactName': 'admin',
    'contactMobile': '18356517524',
    'status': 0,
    'websites': [
      'http://gx12358.cn',
    ],
    'packageId': 0,
    'expireTime': 4075175656000,
    'accountCount': 9999,
    'createTime': 1609837427000
  }
]

export const MOCK_USERS: UserDatabase[] = [
  {
    'id': 1,
    'nickname': '智耳科技',
    'avatar': 'https://oss-zerkj.oss-cn-beijing.aliyuncs.com/20251211/my_1765430972904.png',
    'deptId': 103,
    'username': 'admin',
    'mobile': '18356517288',
    'email': 'gx12358@gmail.com',
    'status': 0,
    'tenantId': 1,
    'postIds': [ 1, 2 ],
    'password': 'admin123',
    'roleId': [ 1, 2 ],
    'createTime': 1609837428000
  },
  {
    'id': 143,
    'nickname': 'jack',
    'avatar': 'https://oss-zerkj.oss-cn-beijing.aliyuncs.com/20251211/my_1765430972904.png',
    'deptId': 110,
    'status': 0,
    'mobile': '18356517288',
    'username': 'jack',
    'email': 'xxx@gmail.com',
    'tenantId': 121,
    'password': '123456',
    'roleId': [ 109 ],
    'postIds': [ 1 ],
    'createTime': 1609837428000
  },
  {
    'id': 144,
    'nickname': 'gx12358',
    'avatar': 'https://oss-zerkj.oss-cn-beijing.aliyuncs.com/20251211/my_1765430972904.png',
    'deptId': 110,
    'status': 0,
    'mobile': '18356517288',
    'username': 'gx12358',
    'email': 'xxx@gmail.com',
    'tenantId': 122,
    'password': '123456',
    'roleId': [ 111 ],
    'postIds': null,
    'createTime': 1609837428000
  }
]

export const MOCK_ROLES: Record<any, RoleDatabase[]> = {
  1: [
    {
      'id': 1,
      'name': '超级管理员',
      'code': 'super_admin',
      'sort': 1,
      'status': 0,
      'type': 1,
      'remark': '超级管理员',
      'dataScope': 1,
      'dataScopeDeptIds': null,
      'createTime': 1609837428000
    },
    {
      'id': 2,
      'name': '普通角色',
      'code': 'common',
      'sort': 2,
      'status': 0,
      'type': 1,
      'remark': '普通角色',
      'dataScope': 2,
      'dataScopeDeptIds': null,
      'createTime': 1609837428000
    },
  ],
  121: [
    {
      'id': 109,
      'name': '租户管理员',
      'code': 'tenant_admin',
      'sort': 0,
      'status': 0,
      'type': 1,
      'remark': '',
      'dataScope': 1,
      'dataScopeDeptIds': [],
      'createTime': 1743404286000
    }
  ],
  122: [
    {
      'id': 111,
      'name': '租户管理员',
      'code': 'tenant_admin',
      'sort': 0,
      'status': 0,
      'type': 1,
      'remark': '',
      'dataScope': 1,
      'dataScopeDeptIds': [],
      'createTime': 1743404286000
    }
  ]
}

export const MOCK_DEPT: Record<any, DeptDatabase[]> = {
  1: [
    {
      'id': 100,
      'name': '芋道源码',
      'parentId': 0,
      'sort': 0,
      'leaderUserId': 1,
      'phone': '15888888888',
      'email': 'ry@qq.com',
      'status': 0,
      'createTime': 1609837427000
    },
    {
      'id': 101,
      'name': '深圳总公司',
      'parentId': 100,
      'sort': 1,
      'leaderUserId': 1,
      'phone': '15888888888',
      'email': 'ry@qq.com',
      'status': 0,
      'createTime': 1609837427000
    },
    {
      'id': 103,
      'name': '研发部门',
      'parentId': 101,
      'sort': 1,
      'leaderUserId': 1,
      'phone': '15888888888',
      'email': 'ry@qq.com',
      'status': 0,
      'createTime': 1609837427000
    },
    {
      'id': 108,
      'name': '市场部门',
      'parentId': 102,
      'sort': 1,
      'leaderUserId': null,
      'phone': '15888888888',
      'email': 'ry@qq.com',
      'status': 0,
      'createTime': 1609837427000
    },
    {
      'id': 102,
      'name': '长沙分公司',
      'parentId': 100,
      'sort': 2,
      'leaderUserId': null,
      'phone': '15888888888',
      'email': 'ry@qq.com',
      'status': 0,
      'createTime': 1609837427000
    },
    {
      'id': 104,
      'name': '市场部门',
      'parentId': 101,
      'sort': 2,
      'leaderUserId': null,
      'phone': '15888888888',
      'email': 'ry@qq.com',
      'status': 0,
      'createTime': 1609837427000
    },
    {
      'id': 109,
      'name': '财务部门',
      'parentId': 102,
      'sort': 2,
      'leaderUserId': null,
      'phone': '15888888888',
      'email': 'ry@qq.com',
      'status': 0,
      'createTime': 1609837427000
    },
    {
      'id': 105,
      'name': '测试部门',
      'parentId': 101,
      'sort': 3,
      'leaderUserId': null,
      'phone': '15888888888',
      'email': 'ry@qq.com',
      'status': 0,
      'createTime': 1609837427000
    },
    {
      'id': 113,
      'name': '支持部门',
      'parentId': 102,
      'sort': 3,
      'leaderUserId': 1,
      'phone': null,
      'email': null,
      'status': 1,
      'createTime': 1701481658000
    },
    {
      'id': 106,
      'name': '财务部门',
      'parentId': 101,
      'sort': 4,
      'leaderUserId': 1,
      'phone': '15888888888',
      'email': 'ry@qq.com',
      'status': 0,
      'createTime': 1609837427000
    },
    {
      'id': 107,
      'name': '运维部门',
      'parentId': 101,
      'sort': 5,
      'leaderUserId': 1,
      'phone': '15888888888',
      'email': 'ry@qq.com',
      'status': 0,
      'createTime': 1609837427000
    },
    {
      'id': 112,
      'name': '产品部门',
      'parentId': 101,
      'sort': 100,
      'leaderUserId': 1,
      'phone': null,
      'email': null,
      'status': 1,
      'createTime': 1701481513000
    }
  ],
  121: [
    {
      'id': 110,
      'name': '新部门',
      'parentId': 0,
      'sort': 1,
      'leaderUserId': null,
      'phone': null,
      'email': null,
      'status': 0,
      'createTime': 1645620390000
    }
  ],
  122: [
    {
      'id': 111,
      'name': '顶级部门',
      'parentId': 0,
      'sort': 1,
      'leaderUserId': null,
      'phone': null,
      'email': null,
      'status': 0,
      'createTime': 1646660690000
    }
  ]
}

export const MOCK_POST: Record<any, any> = {
  1: [
    {
      'id': 5,
      'name': '人力资源',
      'code': 'HR',
      'sort': 5,
      'status': 0,
      'remark': '`',
      'createTime': 1711284340000
    },
    {
      'id': 4,
      'name': '普通员工',
      'code': 'user',
      'sort': 4,
      'status': 0,
      'remark': '111222',
      'createTime': 1609837428000
    },
    {
      'id': 2,
      'name': '项目经理',
      'code': 'se',
      'sort': 2,
      'status': 0,
      'remark': '',
      'createTime': 1609837428000
    },
    {
      'id': 1,
      'name': '董事长',
      'code': 'ceo',
      'sort': 1,
      'status': 0,
      'remark': '',
      'createTime': 1609923828000
    }
  ]
}

/**
 * @Author      gx12358
 * @DateTime    2025/11/17
 * @lastTime    2025/11/17
 * @description 时区选项
 */
export const TIME_ZONE_OPTIONS: TimezoneOption[] = [
  {
    offset: -5,
    timezone: 'America/New_York'
  },
  {
    offset: 0,
    timezone: 'Europe/London'
  },
  {
    offset: 8,
    timezone: 'Asia/Shanghai'
  },
  {
    offset: 9,
    timezone: 'Asia/Tokyo'
  },
  {
    offset: 9,
    timezone: 'Asia/Seoul'
  }
]
