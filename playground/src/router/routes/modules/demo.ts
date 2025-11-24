import { GIcon } from '@gx/design'

export default [
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/demo.vue'),
    meta: {
      order: 1,
      icon: h(GIcon, { type: 'desktop' }),
      title: 'Demo',
    }
  },
] as AppRouteModule[]
