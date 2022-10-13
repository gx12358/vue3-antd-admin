/**
 * @description 导出默认主题配置
 */
import type { themeConfig } from '/types/config'

const themeSetting: themeConfig = {
  //布局种类 side/mix/simple/wide
  layout: 'mix',
  // 主题 light/dark
  theme: 'light',
  // 主题色
  primaryColor: '#1890FF',
  // logo标题
  title: 'GX Pro Admin',
  // 定宽-宽度
  wideWidth: 1300,
  // 头部菜单高度
  headerHeight: 48,
  // 头部菜单是否固定
  fixedMultiTab: true,
  // 头部菜单是否固定
  fixedHeader: false,
  // 侧边栏菜单是否固定
  fixSiderbar: false,
  // 菜单是否自动分割
  splitMenus: true,
  //是否显示顶部进度条
  showProgressBar: true,
  //是否显示多标签页
  showTabsBar: true,
  //是否显示全屏组件
  showFullScreen: false,
  //菜单字体链接Url
  iconfontUrl: '',
  //是否自动隐藏头部
  autoHideHeader: false,
  //页面动画配置
  animate: {
    name: 'fade',
    direction: 'default'
  }
}
export default themeSetting
