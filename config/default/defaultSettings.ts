/**
 * @description 导出默认通用配置
 */
const settingConfig: SettingConfig = {
  system: {
    // 标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
    title: 'GX Pro Admin',
    // 短标题
    shortName: 'gx_pro_admin',
    // 标题分隔符
    titleSeparator: ' - ',
    // 标题是否反转 如果为false:"page - title"，如果为ture:"title - page"
    titleReverse: false,
    waterMark: {
      // 是否开启水印
      use: true,
      // 水印字符
      content: 'GX Pro Admin',
    },
    // 滚动区域选择器
    viewScrollRoot: '.gx-pro-app>.gx-scrollbar>.gx-scrollbar-wrap',
    // pro版本copyright可随意修改
    copyright: 'gx12358 2539306317@qq.com',
    // 缓存路由的最大数量
    keepAliveMaxNum: 99,
    // 路由模式，可选值为 browser 或 hash
    routerMode: 'hash',
    // 不经过token校验的路由
    routesWhiteList: [ '/user/login', '/user/register', '/exception/404', '/exception/403' ],
    // token失效回退到登录页时是否记录本次的路由
    recordRoute: true,
    // 是否开启登录拦截
    loginInterception: true,
    // 是否开启登录RSA加密
    loginRSA: false,
    // front（前端导出路由）和 all（后端导出路由）两种方式
    authentication: 'all',
  },
  servive: {
    // 开发环境端口号
    port: 9260,
  },
  build: {
    // 开发以及部署时的URL，hash模式时在不确定二级目录名称的情况下建议使用""代表相对路径或者"/二级目录/"，history模式默认使用"/"或者"/二级目录/"
    publicPath: './',
    // 生产环境构建文件的目录名
    outputDir: 'dist',
    // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: 'static',
  },
  cdn: {
    // 开启cdn
    use: false,
    // cdn 地址
    url: 'https://cdn.bootcdn.net/ajax/libs/{name}/{version}/{path}',
    // 模块集合
    modules: []
  },
  // proxy 配置
  proxy: {
    // 是否开启代理
    use: true,
    // 代理的目标地址
    target: 'http://127.0.0.1:3000',
  },
  mock: {
    prefix: '/mock-server',
    checkToken: 0,
  },
  token: {
    // token名称
    name: 'Authorization',
    // token在localStorage、sessionStorage、cookie存储的key的名称
    storageName: 'accessToken',
    // token存储位置localStorage sessionStorage cookie
    storage: 'localStorage',
  },
}

export default settingConfig
