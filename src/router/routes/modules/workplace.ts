import type { AppRouteModule } from '@gx-design-vue/pro-layout'

const workplace: AppRouteModule = {
  path: '/workplace',
  name: 'Workplace',
  component: () => import('@/views/dashboard/workplace/index.vue'),
  meta: {
    tagHidden: true,
    hideInMenu: true,
    homePage: 1,
    title: '工作台'
  }
}

export default workplace
