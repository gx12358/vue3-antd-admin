import { GIcon } from '@gx/design'

export default {
  path: '/pro-hooks',
  name: 'ProHooks',
  redirect: '/pro-hooks/use-request',
  meta: {
    order: 4,
    icon: h(GIcon, { type: 'function' }),
    title: 'ProHooks',
  },
  children: [
    {
      path: '/pro-hooks/use-request',
      name: 'UseRequest',
      component: () => import('@/views/pro-hooks/useRequest/index.vue'),
      meta: {
        order: 1,
        icon: h(GIcon, { type: 'request' }),
        title: 'useRequest',
      },
    }
  ]
} as AppRouteModule
