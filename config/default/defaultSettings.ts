/**
 * @description 导出默认通用配置
 */
const settingConfig: SettingConfig = {
  // 开发以及部署时的URL，hash模式时在不确定二级目录名称的情况下建议使用""代表相对路径或者"/二级目录/"，history模式默认使用"/"或者"/二级目录/"
  publicPath: './',
  // 生产环境构建文件的目录名
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
  title: 'GX Pro Admin',
  // 短标题
  shortName: 'gx_pro_admin',
  // 标题分隔符
  titleSeparator: ' - ',
  // 标题是否反转 如果为false:"page - title"，如果为ture:"title - page"
  titleReverse: false,
  // 是否开启水印
  waterMark: true,
  // 水印字符
  waterMarkTitle: 'GX Pro Admin',
  // 滚动区域选择器
  viewScrollRoot: '#gx-pro-admin>.gx-scrollbar>.gx-scrollbar-wrap',
  // 开启cdn
  useCdn: true,
  // cdn 地址
  cdnUrl: 'https://cdn.bootcdn.net/ajax/libs/{name}/{version}/{path}',
  // cdn 模块集合
  cdnModules: [
    {
      name: 'axios',
      globalName: 'axios',
      path: 'axios.min.js'
    },
    {
      name: 'dayjs',
      globalName: 'dayjs',
      path: 'dayjs.min.js'
    },
    {
      name: 'echarts',
      globalName: 'echarts',
      path: 'echarts.min.js'
    }
  ],
  // 开启proxy
  useProxy: true,
  // proxy target
  proxyTarget: 'http://127.0.0.1:3000',
  // 接口前缀
  requestPrefix: '/api',
  // mock-接口前缀
  mockPrefixUrl: '/mock-server',
  // 开发环境端口号
  devPort: 9260,
  // pro版本copyright可随意修改
  copyright: 'gx12358 2539306317@qq.com',
  // 缓存路由的最大数量
  keepAliveMaxNum: 99,
  // 路由模式，可选值为 browser 或 hash
  routerMode: 'hash',
  // 不经过token校验的路由
  routesWhiteList: [ '/user/login', '/user/register', '/exception/404', '/exception/403' ],
  // token名称
  tokenName: 'Authorization',
  // token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: 'GxAccessToken',
  // token存储位置localStorage sessionStorage cookie
  storage: 'localStorage',
  // token失效回退到登录页时是否记录本次的路由
  recordRoute: false,
  // 是否开启登录拦截
  loginInterception: true,
  // 是否开启登录RSA加密
  loginRSA: false,
  // front（前端导出路由）和 all（后端导出路由）两种方式
  authentication: 'all',
  // mock数据是否检查token
  checkMockToken: true
}

export default settingConfig
