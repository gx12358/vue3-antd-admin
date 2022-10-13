import type { PropType, ExtractPropTypes } from 'vue'
import config from '/config/config'
import type { themeConfig } from '/types/config'

const { title } = config.defaultSettings

export interface RenderSetting {
  headerRender?: false;
  footerRender?: false;
  menuRender?: false;
  menuHeaderRender?: false
}

export type ProSettings = themeConfig & RenderSetting;

export const defaultSettings: themeConfig = {
  //布局种类 side/mix/simple/wide
  layout: 'mix',
  // 主题 light/dark
  theme: 'light',
  // 主题色
  primaryColor: '#1890FF',
  // logo标题
  title: title || '互动直播',
  // 头部菜单高度
  headerHeight: 48,
  // 定宽高度
  wideWidth: 1300,
  // 头部菜单是否固定
  fixedHeader: false,
  // 侧边栏菜单是否固定
  fixSiderbar: false,
  // 标签页栏是否固定
  fixedMultiTab: false,
  //是否显示顶部进度条
  showProgressBar: true,
  //菜单是否自动分割
  splitMenus: true,
  //是否显示多标签页
  showTabsBar: true,
  //是否显示全屏组件
  showFullScreen: false,
  //是否自动隐藏头部
  autoHideHeader: false,
  //菜单字体链接Url
  iconfontUrl: '',
  //页面动画配置
  animate: {
    name: 'fade',
    direction: 'default'
  }
}

export const defaultSettingProps = {
  theme: {
    type: String as PropType<themeConfig['theme']>,
    default: defaultSettings.theme
  },
  primaryColor: {
    type: String as PropType<themeConfig['primaryColor']>,
    default: defaultSettings.primaryColor
  },
  layout: {
    type: String as PropType<themeConfig['layout']>,
    default: defaultSettings.layout
  },
  wideWidth: {
    type: Number as PropType<themeConfig['wideWidth']>,
    default: defaultSettings.wideWidth
  },
  splitMenus: {
    type: Boolean as PropType<themeConfig['splitMenus']>,
    default: defaultSettings.splitMenus
  },
  fixedMultiTab: {
    type: Boolean as PropType<themeConfig['fixedMultiTab']>,
    default: defaultSettings.fixedMultiTab
  },
  showProgressBar: {
    type: Boolean as PropType<themeConfig['showProgressBar']>,
    default: defaultSettings.showProgressBar
  },
  fixedHeader: {
    type: Boolean as PropType<themeConfig['fixedHeader']>,
    default: defaultSettings.fixedHeader
  },
  fixSiderbar: {
    type: Boolean as PropType<themeConfig['fixSiderbar']>,
    default: defaultSettings.fixSiderbar
  },
  showTabsBar: {
    type: Boolean as PropType<themeConfig['showTabsBar']>,
    default: defaultSettings.showTabsBar
  },
  showFullScreen: {
    type: Boolean as PropType<themeConfig['showFullScreen']>,
    default: defaultSettings.showFullScreen
  },
  autoHideHeader: {
    type: Boolean as PropType<themeConfig['autoHideHeader']>,
    default: defaultSettings.autoHideHeader
  },
  headerHeight: {
    type: Number as PropType<themeConfig['headerHeight']>,
    default: defaultSettings.headerHeight
  },
  title: {
    type: String as PropType<themeConfig['title']>,
    default: () => defaultSettings.title
  },
  iconfontUrl: {
    type: String as PropType<themeConfig['iconfontUrl']>,
    default: () => defaultSettings.iconfontUrl
  },
  animate: {
    type: Object as PropType<themeConfig['animate']>,
    default: defaultSettings.animate
  }
}

export type ProSettingsProps = ExtractPropTypes<typeof defaultSettingProps>;
