import { getLevelData } from '@gx-design-vue/pro-utils'
import dayjs from 'dayjs'

const systemMenus: SystemMenuItem[] = [
  {
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    icon: 'setting',
    menuId: 1,
    path: 'system',
    redirect: '/system/user',
    title: '系统管理',
    name: 'System',
    menuType: 'M',
    order: 6,
    parentId: 0,
    children: [
      {
        component: 'system/user/index',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'user',
        menuId: 2,
        path: 'user',
        title: '用户管理',
        name: 'SystemUser',
        menuType: 'C',
        order: 1,
        parentId: 1,
      },
      {
        component: 'system/role/index',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'roleBinding',
        menuId: 3,
        path: 'role',
        title: '角色管理',
        name: 'SystemRole',
        menuType: 'C',
        order: 2,
        parentId: 1,
      },
      {
        component: 'system/menu/index',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'menu',
        menuId: 4,
        path: 'menu',
        title: '菜单管理',
        name: 'SystemMenu',
        menuType: 'C',
        order: 3,
        parentId: 1,
      },
    ]
  }
]

export const menuList: SystemMenuItem[] = getLevelData([
  ...systemMenus,
]).map(item => ({ ...item, children: [] }))
