import type { AppRouteModule } from '@gx-design-vue/pro-layout'

const workplace: AppRouteModule = {
  path: '/workplace',
  name: 'Workplace',
  component: () => import('@/views/dashboard/workplace/index.vue'),
  meta: {
    order: 0,
    iconFont: 'iconfont',
    icon: 'gx-gongzuotai',
    tabState: {
      fixed: true
    },
    isHome: 1,
    title: '工作台'
  }
}

export default workplace
