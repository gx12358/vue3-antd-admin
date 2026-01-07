import { GIcon } from '@gx/design'

export default {
  path: '/pro-pages',
  name: 'ProPages',
  redirect: '/pro-pages/form/basic-form',
  meta: {
    order: 5,
    icon: h(GIcon, { type: 'page' }),
    title: '页面模板',
  },
  children: [
    {
      path: '/pro-pages/form',
      name: 'ProPageForm',
      meta: {
        order: 1,
        icon: h(GIcon, { type: 'form' }),
        title: '表单页',
      },
      children: [
        {
          path: '/pro-pages/form/basic-form',
          name: 'BasicForm',
          component: () => import('@/views/pro-pages/form/basic-form/index.vue'),
          meta: {
            order: 1,
            inlineIndent: 18,
            title: '基础表单',
          },
        },
        {
          path: '/pro-pages/form/step-form',
          name: 'StepForm',
          component: () => import('@/views/pro-pages/form/step-form/index.vue'),
          meta: {
            order: 2,
            inlineIndent: 18,
            title: '分步表单',
          },
        },
        {
          path: '/pro-pages/form/advanced-form',
          name: 'AdvancedForm',
          component: () => import('@/views/pro-pages/form/advanced-form/index.vue'),
          meta: {
            order: 3,
            inlineIndent: 18,
            title: '高级表单',
          },
        },
      ]
    },
    {
      path: '/pro-pages/list',
      name: 'ProPageList',
      redirect: '/pro-pages/list/table-list',
      meta: {
        order: 2,
        icon: h(GIcon, { type: 'list' }),
        title: '列表页',
      },
      children: [
        {
          path: '/pro-pages/list/search',
          name: 'TableSearch',
          redirect: '/pro-pages/list/search/articles',
          component: () => import('@/views/pro-pages/list/search/index.vue'),
          meta: {
            order: 1,
            inlineIndent: 18,
            hideChildrenInMenu: true,
            title: '搜索列表',
          },
          children: [
            {
              path: '/pro-pages/list/search/articles',
              name: 'TableSearchArticles',
              component: () => import('@/views/pro-pages/list/search/articles.vue'),
              meta: {
                order: 1,
                menuSelectKey: 'TableSearch',
                title: '搜索列表-文章',
              },
            },
            {
              path: '/pro-pages/list/search/projects',
              name: 'TableSearchProjects',
              component: () => import('@/views/pro-pages/list/search/projects.vue'),
              meta: {
                order: 2,
                menuSelectKey: 'TableSearch',
                title: '搜索列表-项目',
              },
            },
            {
              path: '/pro-pages/list/search/applications',
              name: 'TableSearchApplications',
              component: () => import('@/views/pro-pages/list/search/applications.vue'),
              meta: {
                order: 3,
                menuSelectKey: 'TableSearch',
                title: '搜索列表-应用',
              },
            },
          ]
        },
        {
          path: '/pro-pages/list/table-list',
          name: 'TableList',
          component: () => import('@/views/pro-pages/list/table/index.vue'),
          meta: {
            order: 2,
            inlineIndent: 18,
            title: '查询表格',
          },
        },
        {
          path: '/pro-pages/list/basic-list',
          name: 'BasicList',
          component: () => import('@/views/pro-pages/list/basic/index.vue'),
          meta: {
            order: 3,
            inlineIndent: 18,
            title: '标准表格',
          },
        },
        {
          path: '/pro-pages/list/card-list',
          name: 'CardList',
          component: () => import('@/views/pro-pages/list/card/index.vue'),
          meta: {
            order: 4,
            inlineIndent: 18,
            title: '卡片表格',
          },
        },
      ]
    },
    {
      path: '/pro-pages/profile',
      name: 'PageProfile',
      meta: {
        order: 3,
        icon: h(GIcon, { type: 'news' }),
        title: '详情页',
      },
      children: [
        {
          path: '/pro-pages/profile/basic',
          name: 'ProfileBasic',
          component: () => import('@/views/pro-pages/profile/basic/index.vue'),
          meta: {
            order: 1,
            inlineIndent: 18,
            title: '基础详情页',
          },
        },
        {
          path: '/pro-pages/profile/advanced',
          name: 'ProfileAdvanced',
          component: () => import('@/views/pro-pages/profile/advanced/index.vue'),
          meta: {
            order: 2,
            inlineIndent: 18,
            title: '高级详情页',
          },
        },
      ]
    },
    {
      path: '/pro-pages/result',
      name: 'PageResult',
      meta: {
        order: 4,
        icon: h(GIcon, { type: 'checkCircle' }),
        title: '结果页',
      },
      children: [
        {
          path: '/pro-pages/result/success',
          name: 'ResultSuccess',
          component: () => import('@/views/pro-pages/result/success/index.vue'),
          meta: {
            order: 1,
            inlineIndent: 18,
            title: '成功页',
          },
        },
        {
          path: '/pro-pages/result/fail',
          name: 'ResultFail',
          component: () => import('@/views/pro-pages/result/fail/index.vue'),
          meta: {
            order: 2,
            inlineIndent: 18,
            title: '失败页',
          },
        },
      ]
    },
    {
      path: '/pro-pages/exception',
      name: 'PageException',
      meta: {
        order: 5,
        icon: h(GIcon, { type: 'cloudAlert' }),
        title: '异常页',
      },
      children: [
        {
          path: '/pro-pages/exception/403',
          name: 'Exception403',
          component: () => import('@/views/pro-pages/exception/403/index.vue'),
          meta: {
            order: 1,
            inlineIndent: 18,
            title: '403',
          },
        },
        {
          path: '/pro-pages/exception/404',
          name: 'Exception404',
          component: () => import('@/views/pro-pages/exception/404/index.vue'),
          meta: {
            order: 2,
            inlineIndent: 18,
            title: '404',
          },
        },
        {
          path: '/pro-pages/exception/500',
          name: 'Exception500',
          component: () => import('@/views/pro-pages/exception/500/index.vue'),
          meta: {
            order: 3,
            inlineIndent: 18,
            title: '500',
          },
        },
      ]
    },
    {
      path: '/pro-pages/iframe',
      name: 'PageIframe',
      meta: {
        order: 6,
        icon: h(GIcon, { type: 'links' }),
        title: '外部页面',
      },
      children: [
        {
          path: '/pro-pages/iframe/ant-design',
          name: 'IframeAntDesign',
          meta: {
            order: 1,
            inlineIndent: 18,
            linkStatus: 0,
            link: 'https://ant.design/components/overview-cn/',
            title: 'Ant DesIgn',
          },
        },
        {
          path: '/pro-pages/iframe/ant-design-x',
          name: 'IframeAntDesignX',
          meta: {
            order: 2,
            inlineIndent: 18,
            link: 'https://ant-design-x.antgroup.com/index-cn',
            linkStatus: 1,
            title: 'Ant DesIgn X',
          },
        },
      ]
    },
  ]
} as AppRouteModule
