export default [
  {
    path: '/account',
    name: 'Account',
    meta: {
      hideInMenu: true,
      order: 1,
    },
    children: [
      {
        path: '/account/center',
        name: 'AccountCenter',
        meta: {
          title: '个人中心',
          menuSelectKey: 'Workspace'
        },
        component: () => import('@/views/account/center/index.vue'),
      },
    ]
  },
] as AppRouteModule[]
