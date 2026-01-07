import { GIcon } from '@gx/design'

export default {
  path: '/pro-components',
  name: 'ProComponents',
  redirect: '/pro-components/data-display/pro-table',
  meta: {
    order: 3,
    icon: h(GIcon, { type: 'apps' }),
    title: 'Pro组件',
  },
  children: [
    {
      path: '/pro-components/data-display',
      name: 'DataDisplay',
      meta: {
        order: 1,
        icon: h(GIcon, { type: 'chartData' }),
        title: '数据展示',
      },
      children: [
        {
          path: '/pro-components/data-display/pro-table',
          name: 'ProTable',
          component: () => import('@/views/pro-components/data-display/pro-table/index.vue'),
          meta: {
            order: 1,
            inlineIndent: 18,
            title: '高级表格',
          },
        }
      ]
    },
    {
      path: '/pro-components/data-entry',
      name: 'DataEntry',
      meta: {
        order: 2,
        icon: h(GIcon, { type: 'dataEntry' }),
        title: '数据录入',
      },
      children: [
        {
          path: '/pro-components/data-entry/pro-upload',
          name: 'ProUpload',
          component: () => import('@/views/pro-components/data-entry/pro-upload/index.vue'),
          meta: {
            order: 1,
            inlineIndent: 18,
            title: '高级上传',
          },
        }
      ]
    },
    {
      path: '/pro-components/layout',
      name: 'Layout',
      meta: {
        order: 3,
        icon: h(GIcon, { type: 'layout' }),
        title: '布局',
      },
      children: [
        {
          path: '/pro-components/layout/watermark',
          name: 'Watermark',
          component: () => import('@/views/pro-components/layout/watermark/index.vue'),
          meta: {
            order: 1,
            inlineIndent: 18,
            title: '水印组件',
          },
        }
      ]
    },
  ]
} as AppRouteModule
