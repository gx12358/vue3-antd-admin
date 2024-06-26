import dayjs from 'dayjs'
import type { MenuDataItem } from '@gx-design-vue/pro-layout'
import { getLevelData } from '@gx-design-vue/pro-utils'

// Pro Components
const proComponents: MenuDataItem[] = [
  {
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    icon: 'gx-zujian',
    iconType: 1,
    menuId: 1,
    path: 'proComponents',
    redirect: '/proComponents/layout/waterMark',
    title: 'Pro组件',
    name: 'ProComponents',
    menuType: 'M',
    orderNum: '1',
    isFrame: '1',
    parentId: 0,
    target: '',
    hidden: false,
    outLinkType: 0,
    children: [
      {
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-layout',
        iconType: 1,
        menuId: 13,
        path: 'layout',
        redirect: '/proComponents/layout/waterMark',
        title: '布局',
        name: 'Layout',
        menuType: 'M',
        orderNum: '1',
        isFrame: '1',
        parentId: 1,
        target: '',
        hidden: false,
        outLinkType: 0,
        children: [
          {
            children: [],
            component: 'proComponents/layout/waterMark/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 14,
            path: 'waterMark',
            title: '水印组件',
            name: 'WaterMark',
            menuType: 'C',
            orderNum: '1',
            isFrame: '1',
            parentId: 13,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proComponents/layout/card/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 38,
            path: 'card',
            title: '高级卡片',
            name: 'ProCard',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 13,
            target: '',
            hidden: false,
            outLinkType: 0
          },
        ]
      },
      {
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-wannengbiaodan',
        iconType: 1,
        menuId: 39,
        path: 'dataEntry',
        title: '数据录入',
        name: 'DataEntry',
        menuType: 'M',
        orderNum: '2',
        isFrame: '1',
        parentId: 1,
        target: '',
        hidden: false,
        outLinkType: 0,
        children: [
          {
            children: [],
            component: 'proComponents/dataEntry/proForm/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 45,
            path: 'proForm',
            title: '高级表单',
            name: 'ProForm',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 39,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proComponents/dataEntry/proUpload/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 50,
            path: 'proUpload',
            title: '高级上传',
            name: 'ProUpload',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 39,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proComponents/dataEntry/proEditor/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 48,
            path: 'proEditor',
            title: '高级富文本',
            name: 'ProEditor',
            menuType: 'C',
            orderNum: '3',
            isFrame: '1',
            parentId: 39,
            target: '',
            hidden: false,
            outLinkType: 0
          },
        ],
      },
      {
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-shuju',
        iconType: 1,
        menuId: 3,
        path: 'dataDisplay',
        title: '数据展示',
        name: 'DataDisplay',
        menuType: 'M',
        orderNum: '3',
        isFrame: '1',
        parentId: 1,
        target: '',
        hidden: false,
        outLinkType: 0,
        children: [
          {
            children: [],
            component: 'proComponents/dataDisplay/proTable/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            tagFixed: '0',
            menuId: 6,
            path: 'proTable',
            title: '高级表格',
            name: 'ProTable',
            menuType: 'C',
            orderNum: '1',
            isFrame: '1',
            parentId: 3,
            target: '',
            hidden: false,
            outLinkType: 0
          },
        ],
      },
      {
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-gengduo-tongyong',
        iconType: 1,
        menuId: 4,
        path: 'universal',
        title: '通用',
        name: 'Universal',
        menuType: 'M',
        orderNum: '4',
        isFrame: '1',
        parentId: 1,
        target: '',
        hidden: false,
        outLinkType: 0,
        children: [
          {
            children: [],
            component: 'proComponents/universal/Media/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 49,
            path: 'media',
            title: '媒体',
            name: 'Media',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 4,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proComponents/universal/proField/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 47,
            path: 'proField',
            title: '原子组件',
            name: 'ProField',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 4,
            target: '',
            hidden: false,
            outLinkType: 0
          },
        ]
      },
    ],
  },
]

// Pro Hooks
const proHooks: MenuDataItem[] = [
  {
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    icon: 'gx-gongjuxiang',
    iconType: 1,
    menuId: 51,
    path: 'proHooks',
    redirect: '/ProHooks/useRequest/index',
    title: 'proHooks',
    name: 'ProHooks',
    menuType: 'M',
    orderNum: '1',
    isFrame: '1',
    parentId: 0,
    target: '',
    hidden: false,
    outLinkType: 0,
    children: [
      {
        component: '/proHooks/useRequest/index',
        children: [],
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-fuwuqingqiu',
        iconType: 1,
        menuId: 52,
        path: 'useRequest',
        title: 'useRequest',
        name: 'UseRequest',
        menuType: 'C',
        orderNum: '1',
        isFrame: '1',
        parentId: 51,
        target: '',
        hidden: false,
        outLinkType: 0
      },
    ],
  },
]

// Pro Page
const proPage: MenuDataItem[] = [
  {
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    icon: 'gx-iconset0335',
    iconType: 1,
    menuId: 15,
    path: 'proPage',
    title: 'Pro页面',
    name: 'ProPage',
    menuType: 'M',
    orderNum: '1',
    isFrame: '1',
    parentId: 0,
    target: '',
    hidden: false,
    outLinkType: 0,
    children: [
      {
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-wannengbiaodan',
        iconType: 1,
        menuId: 16,
        path: 'form',
        title: '表单页',
        name: 'Form',
        menuType: 'M',
        orderNum: '1',
        isFrame: '1',
        parentId: 15,
        target: '',
        hidden: false,
        outLinkType: 0,
        children: [
          {
            children: [],
            component: 'proPages/form/basicForm/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 17,
            path: 'basicForm',
            title: '基础表单',
            name: 'BasicForm',
            menuType: 'C',
            orderNum: '1',
            isFrame: '1',
            parentId: 16,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proPages/form/stepForm/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 18,
            path: 'stepForm',
            title: '分布表单',
            name: 'StepForm',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 16,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proPages/form/advancedForm/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 19,
            path: 'advancedForm',
            title: '高级表单',
            name: 'AdvancedForm',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 16,
            target: '',
            hidden: false,
            outLinkType: 0
          },
        ],
      },
      {
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-biaoge',
        iconType: 1,
        menuId: 20,
        path: 'list',
        title: '列表页',
        name: 'List',
        menuType: 'M',
        orderNum: '2',
        isFrame: '1',
        parentId: 15,
        target: '',
        hidden: false,
        outLinkType: 0,
        children: [
          {
            component: 'proPages/list/search/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 21,
            path: 'search',
            title: '搜索列表',
            name: 'SearchList',
            menuType: 'M',
            orderNum: '1',
            isFrame: '1',
            parentId: 20,
            target: '',
            hidden: false,
            keepAlive: true,
            outLinkType: 0,
            children: [
              {
                component: 'proPages/list/search/components/Articles',
                createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                menuId: 53,
                path: 'articles',
                title: '搜索列表（文章）',
                name: 'SearchArticleList',
                menuType: 'C',
                orderNum: '1',
                isFrame: '1',
                parentId: 21,
                target: '',
                hidden: false,
                outLinkType: 0,
              },
              {
                component: 'proPages/list/search/components/Projects',
                createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                menuId: 54,
                path: 'projects',
                title: '搜索列表（项目）',
                name: 'SearchProjectsList',
                menuType: 'C',
                orderNum: '2',
                isFrame: '1',
                parentId: 21,
                target: '',
                hidden: false,
                outLinkType: 0,
              },
              {
                component: 'proPages/list/search/components/Applications',
                createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                menuId: 55,
                path: 'applications',
                title: '搜索列表（应用）',
                name: 'SearchApplicationsList',
                menuType: 'C',
                orderNum: '3',
                isFrame: '1',
                parentId: 21,
                target: '',
                hidden: false,
                outLinkType: 0,
              },
            ],
          },
          {
            children: [],
            component: 'proPages/list/tableList/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 22,
            path: 'tableList',
            title: '查询表格',
            name: 'TableList',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 20,
            target: '',
            hidden: false,
            keepAlive: true,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proPages/list/basicList/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 23,
            path: 'basicList',
            title: '标准列表',
            name: 'BasicList',
            menuType: 'C',
            orderNum: '3',
            isFrame: '1',
            parentId: 20,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proPages/list/cardList/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 24,
            path: 'cardList',
            title: '卡片列表',
            name: 'CardList',
            menuType: 'C',
            orderNum: '4',
            isFrame: '1',
            parentId: 20,
            target: '',
            hidden: false,
            outLinkType: 0
          },
        ],
      },
      {
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-xiangqing',
        iconType: 1,
        menuId: 25,
        path: 'profile',
        title: '详情页',
        name: 'Profile',
        menuType: 'M',
        orderNum: '3',
        isFrame: '1',
        parentId: 15,
        target: '',
        hidden: false,
        outLinkType: 0,
        children: [
          {
            children: [],
            component: 'proPages/profile/basic/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 26,
            path: 'profileBasic',
            title: '基础详情页',
            name: 'ProfileBasic',
            menuType: 'C',
            orderNum: '1',
            isFrame: '1',
            parentId: 25,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proPages/profile/advanced/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 27,
            path: 'advanced',
            title: '高级详情页',
            name: 'Advanced',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 25,
            target: '',
            hidden: false,
            outLinkType: 0
          },
        ],
      },
      {
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-jieguoye',
        iconType: 1,
        menuId: 28,
        path: 'result',
        title: '结果页',
        name: 'Result',
        menuType: 'M',
        orderNum: '4',
        isFrame: '1',
        parentId: 15,
        target: '',
        hidden: false,
        outLinkType: 0,
        children: [
          {
            children: [],
            component: 'proPages/result/success/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 29,
            path: 'success',
            title: '成功页',
            name: 'Success',
            menuType: 'C',
            orderNum: '1',
            isFrame: '1',
            parentId: 28,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proPages/result/fail/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 30,
            path: 'fail',
            title: '失败页',
            name: 'Fail',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 28,
            target: '',
            hidden: false,
            outLinkType: 0
          },
        ],
      },
      {
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-yichangguanli',
        iconType: 1,
        menuId: 31,
        path: 'exception',
        title: '异常页',
        name: 'Exception',
        menuType: 'M',
        orderNum: '5',
        isFrame: '1',
        parentId: 15,
        target: '',
        hidden: false,
        outLinkType: 0,
        children: [
          {
            children: [],
            component: 'proPages/exception/403/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 32,
            path: '403',
            title: '403',
            name: '403',
            menuType: 'C',
            orderNum: '1',
            isFrame: '1',
            parentId: 31,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proPages/exception/404/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 33,
            path: '404',
            title: '404',
            name: '404',
            menuType: 'C',
            orderNum: '2',
            isFrame: '1',
            parentId: 31,
            target: '',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            component: 'proPages/exception/500/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 34,
            path: '500',
            title: '500',
            name: '500',
            menuType: 'C',
            orderNum: '3',
            isFrame: '1',
            parentId: 31,
            target: '',
            hidden: false,
            outLinkType: 0
          },
        ],
      },
      {
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-waibushuju',
        iconType: 1,
        menuId: 41,
        path: 'webIframe',
        title: '外部页面',
        name: 'WebIframe',
        menuType: 'M',
        orderNum: '7',
        isFrame: '1',
        parentId: 15,
        target: '',
        hidden: false,
        outLinkType: 0,
        children: [
          {
            children: [],
            component: 'IframeView',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 42,
            title: 'antVue文档(内嵌)',
            name: 'AntVue',
            menuType: 'C',
            orderNum: '1',
            isFrame: '0',
            parentId: 41,
            path: 'antVue',
            target: 'https://next.antdv.com/components/overview-cn/',
            hidden: false,
            outLinkType: 0
          },
          {
            children: [],
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 43,
            title: 'procomponents(外链)',
            name: 'Procomponents',
            menuType: 'C',
            orderNum: '2',
            isFrame: '0',
            parentId: 41,
            target: 'https://procomponents.ant.design/',
            hidden: false,
            outLinkType: 1
          }
        ],
      },
    ],
  },
]

// Account
const account: MenuDataItem[] = [
  {
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    icon: 'gx-gerenziliao',
    iconType: 1,
    menuId: 2,
    path: 'account',
    title: '个人页',
    name: 'Account',
    menuType: 'M',
    orderNum: '2',
    isFrame: '1',
    parentId: 0,
    target: '',
    hidden: false,
    outLinkType: 0,
    children: [
      {
        component: 'account/center/index',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        menuId: 5,
        icon: 'gx-gerenzhongxin2',
        iconType: 1,
        path: 'center',
        title: '个人中心',
        name: 'AccountCenter',
        menuType: 'M',
        orderNum: '1',
        isFrame: '1',
        parentId: 2,
        redirect: '/account/center/articles',
        hidden: false,
        keepAlive: true,
        hideChildrenInMenu: true,
        outLinkType: 0,
        children: [
          {
            component: 'account/center/components/Articles/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 56,
            path: 'articles',
            title: '个人中心',
            name: 'AccountArticleList',
            menuType: 'C',
            orderNum: '1',
            isFrame: '1',
            parentId: 5,
            target: '',
            outLinkType: 0,
            animateDisabled: true,
            currenFulltPath: '/account/center'
          },
          {
            component: 'account/center/components/Applications/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 58,
            path: 'applications',
            title: '个人中心',
            name: 'AccountApplicationsList',
            menuType: 'C',
            orderNum: '1',
            isFrame: '1',
            parentId: 5,
            target: '',
            outLinkType: 0,
            animateDisabled: true,
            currenFulltPath: '/account/center'
          },
          {
            component: 'account/center/components/Projects/index',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            menuId: 57,
            path: 'projects',
            title: '个人中心',
            name: 'AccountProjectsList',
            menuType: 'C',
            orderNum: '1',
            isFrame: '1',
            parentId: 5,
            target: '',
            outLinkType: 0,
            animateDisabled: true,
            currenFulltPath: '/account/center'
          },
        ]
      },
      {
        children: [],
        component: 'account/settings/index',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-gerenshezhi',
        iconType: 1,
        menuId: 37,
        path: 'settings',
        title: '个人设置',
        name: 'AccountSettings',
        menuType: 'C',
        orderNum: '2',
        isFrame: '1',
        parentId: 2,
        target: '',
        hidden: false,
        outLinkType: 0
      },
    ],
  },
]

// Setting
const settings: MenuDataItem[] = [
  {
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    icon: 'gx-xitongpeizhi',
    iconType: 1,
    menuId: 10,
    path: 'system',
    title: '系统配置',
    name: 'System',
    menuType: 'M',
    orderNum: '3',
    isFrame: '1',
    parentId: 0,
    target: '',
    hidden: false,
    outLinkType: 0,
    children: [
      {
        children: [],
        component: 'system/menu/index',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        icon: 'gx-a-zu5',
        iconType: 1,
        menuId: 11,
        path: 'menu',
        title: '菜单管理',
        name: 'Menu',
        menuType: 'C',
        orderNum: '7',
        isFrame: '1',
        parentId: 10,
        target: '',
        hidden: false,
        outLinkType: 0
      },
    ],
  },
]

export const menuList: MenuDataItem[] = getLevelData([
  ...proComponents,
  ...proHooks,
  ...proPage,
  ...account,
  ...settings,
]).map(item => ({ ...item, children: [] }))
