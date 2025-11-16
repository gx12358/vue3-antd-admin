import { GIcon } from '@gx/design'

export default [
  {
    path: '/workspace',
    name: 'Workspace',
    component: () => import('@/views/dashboard/workplace/index.vue'),
    meta: {
      order: 1,
      icon: h(GIcon, { type: 'desktop' }),
      title: '工作台',
      tabState: {
        fixed: 0
      }
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    redirect: '/dashboard/analytics',
    meta: {
      order: 2,
      icon: h(GIcon, { type: 'dashboard' }),
      title: '仪表盘',
    },
    children: [
      {
        path: '/dashboard/analytics',
        name: 'Analytics',
        component: () => import('@/views/dashboard/analytics/index.vue'),
        meta: {
          order: 1,
          icon: h(GIcon, { type: 'chart' }),
          title: '分析页',
        },
      }
    ]
  }
] as AppRouteModule[]
