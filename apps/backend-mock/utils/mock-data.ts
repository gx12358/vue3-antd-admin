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
  createTime: Date;
  /**
   * 过期时间
   */
  expireTime: Date;
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
  password: string;
  tenantId: number;
  roleId: number[];
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
    'name': 'Super',
    'contactName': null,
    'contactMobile': null,
    'status': null,
    'websites': null,
    'packageId': null,
    'expireTime': null,
    'accountCount': null,
    'createTime': null
  },
  {
    'id': 121,
    'name': 'Admin',
    'contactName': null,
    'contactMobile': null,
    'status': null,
    'websites': null,
    'packageId': null,
    'expireTime': null,
    'accountCount': null,
    'createTime': null
  },
  {
    'id': 122,
    'name': 'User',
    'contactName': null,
    'contactMobile': null,
    'status': null,
    'websites': null,
    'packageId': null,
    'expireTime': null,
    'accountCount': null,
    'createTime': null
  }
]

export const MOCK_USERS: UserDatabase[] = [
  {
    'id': 1,
    'nickname': '智耳科技',
    'avatar': 'https://oss-zerkj.oss-cn-beijing.aliyuncs.com/20251211/my_1765430972904.png',
    'deptId': 103,
    'username': 'admin',
    'email': 'gx12358@gmail.com',
    'tenantId': 1,
    'password': 'admin123',
    'roleId': [1, 2]
  },
  {
    'id': 143,
    'nickname': 'jack',
    'avatar': 'https://oss-zerkj.oss-cn-beijing.aliyuncs.com/20251211/my_1765430972904.png',
    'deptId': 110,
    'username': 'jack',
    'email': 'gx12358@gmail.com',
    'tenantId': 121,
    'password': '123456',
    'roleId': [109]
  },
  {
    'id': 144,
    'nickname': 'gx12358',
    'avatar': 'https://oss-zerkj.oss-cn-beijing.aliyuncs.com/20251211/my_1765430972904.png',
    'deptId': 110,
    'username': 'gx12358',
    'email': 'gx12358@gmail.com',
    'tenantId': 122,
    'password': '123456',
    'roleId': [111]
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
    {
      'id': 3,
      'name': 'CRM 管理员',
      'code': 'crm_admin',
      'sort': 2,
      'status': 0,
      'type': 1,
      'remark': 'CRM 专属角色',
      'dataScope': 1,
      'dataScopeDeptIds': null,
      'createTime': 1708743073000
    },
    {
      'id': 155,
      'name': '测试数据权限',
      'code': 'test-dp',
      'sort': 3,
      'status': 0,
      'type': 2,
      'remark': '',
      'dataScope': 2,
      'dataScopeDeptIds': [
        100,
        102,
        103,
        104,
        105,
        108
      ],
      'createTime': 1743404286000
    }
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
  ],
}

export const MOCK_DEPT: Record<any, DeptDatabase[]> = {
  1: [
    {
      'id': 100,
      'name': '芋道源码',
      'parentId': 0
    },
    {
      'id': 101,
      'name': '深圳总公司',
      'parentId': 100
    },
    {
      'id': 103,
      'name': '研发部门',
      'parentId': 101
    },
    {
      'id': 108,
      'name': '市场部门',
      'parentId': 102
    },
    {
      'id': 102,
      'name': '长沙分公司',
      'parentId': 100
    },
    {
      'id': 104,
      'name': '市场部门',
      'parentId': 101
    },
    {
      'id': 109,
      'name': '财务部门',
      'parentId': 102
    },
    {
      'id': 105,
      'name': '测试部门',
      'parentId': 101
    },
    {
      'id': 106,
      'name': '财务部门',
      'parentId': 101
    },
    {
      'id': 107,
      'name': '运维部门',
      'parentId': 101
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

export const MOCK_MENUS: Record<any, any> = {
  1: [
    {
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      icon: 'setting',
      menuId: 1,
      path: 'system',
      redirect: '/system/user',
      name: '系统管理',
      componentName: 'System',
      menuType: 'M',
      sort: 6,
      parentId: 0,
      children: [
        {
          component: 'system/user/index',
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          icon: 'user',
          menuId: 2,
          path: 'user',
          name: '用户管理',
          componentName: 'SystemUser',
          menuType: 'C',
          sort: 1,
          parentId: 1,
        },
        {
          component: 'system/role/index',
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          icon: 'roleBinding',
          menuId: 3,
          path: 'role',
          name: '角色管理',
          componentName: 'SystemRole',
          menuType: 'C',
          sort: 2,
          parentId: 1,
        },
        {
          component: 'system/menu/index',
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          icon: 'menu',
          menuId: 4,
          path: 'menu',
          name: '菜单管理',
          componentName: 'SystemMenu',
          menuType: 'C',
          sort: 3,
          parentId: 1,
        },
      ]
    }
  ],
  2: [
    {
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      icon: 'setting',
      menuId: 1,
      path: 'system',
      redirect: '/system/user',
      name: '系统管理',
      componentName: 'System',
      menuType: 'M',
      sort: 6,
      parentId: 0,
      children: [
        {
          component: 'system/user/index',
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          icon: 'user',
          menuId: 2,
          path: 'user',
          name: '用户管理',
          componentName: 'SystemUser',
          menuType: 'C',
          sort: 1,
          parentId: 1,
        },
      ]
    }
  ],
  3: [
    {
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      icon: 'setting',
      menuId: 1,
      path: 'system',
      redirect: '/system/user',
      name: '系统管理',
      componentName: 'System',
      menuType: 'M',
      sort: 6,
      parentId: 0,
      children: [
        {
          component: 'system/user/index',
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          icon: 'user',
          menuId: 2,
          path: 'user',
          name: '用户管理',
          componentName: 'SystemUser',
          menuType: 'C',
          sort: 1,
          parentId: 1,
        },
      ]
    }
  ],
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
    timezone: 'America/New_York',
  },
  {
    offset: 0,
    timezone: 'Europe/London',
  },
  {
    offset: 8,
    timezone: 'Asia/Shanghai',
  },
  {
    offset: 9,
    timezone: 'Asia/Tokyo',
  },
  {
    offset: 9,
    timezone: 'Asia/Seoul',
  },
]
