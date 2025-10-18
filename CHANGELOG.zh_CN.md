## 3.1.0 (2025-10-18)

## 升级说明

### ✨ CHORE

- **插件升级**
    - [@gx-design-vue/***] 系列组件升级到最新版本，并重构了相关代码
    - [vue] 升级至 `^3.5.22`
    - [vue-router] 升级至 `^4.6.3`
    - [@antfu/eslint-config] 升级至 `^6.0.0`

### ✨ REFACTOR

- **配置结构优化**
    - [defaultSettings.ts](/config/default/defaultSettings.ts) 中的配置项进行了重新组织和结构调整
    - 新增 [theme](/public/js/tinymce/tinymce.d.ts#L1504-L1504) 主题配置项，支持系统主题模式切换
    - [router](/src/router/index.ts#L22-L25) 配置项整合，包含 [mode](/public/js/tinymce/tinymce.d.ts#L2069-L2069)、`whiteList`、`recordRoute` 和 [auth](/src/components/GlobalLayout/AuthGroup/index.vue#L10-L10) 参数
    - [token](/src/store/modules/user.ts#L14-L14) 存储配置优化，支持刷新令牌和存储类型配置
- **构建系统重构**
    - 移除了 `rollupOptions/optimizer.ts` 文件，优化了代码分割策略
    - 使用 [rolldown] 替代 [rollup]，提升构建性能
    - 重构了代码分割的 `groups` 配置
- **CDN和资源管理**
    - 移除了多个内部工具文件，简化了 CDN 管理逻辑
    - 重构了 HTML 模板注入逻辑，支持主题 CSS 注入
- **Mock系统优化**
    - 调整了 [vite-plugin-fake-server]插件配置，关闭了日志输出
    - 优化了 mock 路由路径命名规范，统一使用 kebab-case 命名

### ✨ FEAT

- **主题支持**
    - 新增系统主题配置支持，可在 `data-theme` 属性中设置 `light` 或 `dark` 模式
    - 支持系统自动检测用户偏好主题模式
    - `ProLayout` 升级后，优化了主题色的搭配，重构了系统设置界面
- **依赖增强**
    - 新增 [color]依赖包，增强颜色处理能力

### ✨ FIX

- **路径和命名规范**
    - 统一了路由路径命名规范，全部改为 kebab-case 格式
    - 修正了多个组件路径和重定向路径
- **登录**
  - 
    - 修正了登录接口参数名从 [userName](/mock/routers/profile/basic.fake.ts#L12-L12) 改为 [username](/src/views/user/login/index.vue#L12-L12)
    - 统一了接口返回字段，使用 [message](/src/utils/request/checkStatus.ts#L33-L33) 替代 `msg`
- **HTML模板**
    - 优化了加载动画 SVG 图标
    - 调整了资源文件引用路径
- **组件升级适配**
    - `ProTable` 使用 `hooks` 下的 `usePorTable` 替代 `ProTable` 原生方法 `useTable` 使其更适合项目使用
    - 移除 `ProForm` `ProField` 组件，并去除相关组件的页面和代码

## 3.0.8 (2025-02-27)

## 升级说明

### ✨ CHORE

- **插件**
  - `@gx-design-vue/***` 升级最新版本
  - `vite` 等插件升级到最新版本

### ✨ REFACTOR

- **prettier、editorconfig**
  - 去除 `prettier` `editorconfig` 插件，统一使用 `@antfu/eslint-config` 管理代码风格
- **useRequest**
  - 重构 `useRequest` 以提高性能和可维护性

### ✨ FIX

- **@gx-design-vue**
  - 针对 `@gx-design-vue/***` 的升级进行代码重构

### ✨ TYPES

- `types/system.d.ts` `TableRecord` 类型调整
- 全局系统菜单类型使用 `types/system.d.ts` `SystemMenuItem`
- 全局系统路由类型使用 `types/system.d.ts` `AppRouteModule`

## 3.0.7(2025-01.02)

## 升级说明

### ✨ CHORE

- **插件**
  - `@gx-design-vue/***` 升级最新版本
  - `vite` 等插件升级到最新版本

### ✨ REFACTOR

- **build 目录**
  - 重构到 `internal/vite-config`, 方便后期改为 `pnpm-workspace`
  - 去除 `vite-plugin-pwa` 等不常用插件
- **mock**
  - 去除 `mock` 、 `viteMock` 等相关插件
  - 新增 `vite-plugin-fake-server` 、 `@faker-js/faker` 插件, `mock` 改为 `faker`
  - `mock` 重构，包括使用方法、本地token检验等
- **config/default/defaultSettings.ts**
  - 参数进行归纳调整
- **Pro Layout(`@gx-design-vue/pro-layout`)**
  - `props` 参数重新调整，适配重构后的 `@gx-design-vue/pro-layout` 插件
- **src/store**
  - `PiniaStoreValue` 类型去除, `useReactiveState` 新增 `omitEmpty` 等参数，用于合并

### ✨ FIX

- **Pro Table**
  - 针对 `useTable` 的升级进行代码重构
  - `props` 参数重新调整，适配重构后的 `@gx-design-vue/pro-table` 插件
- **utils/request**
  - `baseUrl` 新增 `VITE_PROXY_PREFIX` 前缀
- **utils/accessToken**
  - `token` 存储名称不在使用合并名称
- **utils/storage**
  - 修复 `getStorage` 方法返回有值的情况下返回空的问题
- **eslint**
  - 使用 `@antfu/eslint-config` 插件，并将全局代码进行格式

### ✨ TYPES
  - `types/mock.d.ts` 类型重构, 适配 `@faker-js/faker` 插件类型
  - 重构 `SettingConfig` 类型
  - `ViteEnv` 新增 `VITE_PROXY_PREFIX` 、`VITE_IS_MOCK` 环境变量
  - 新增 `system.d.ts`, 插件类型统一归纳到 `system.d`

## 3.0.6(2024-11.02)

## 升级说明

### ✨ CHORE

- **插件**
  - `@gx-desing-pro/pro-table` 优化 `useTable` `hooks` 的类型提示、并进行了重构
  - `@gx-desing-pro/pro-layout` 
    - `layout-token` 新增多个变量，方便用户自定义主题
    - 修复多模式下的主题配色不生效问题
    - 新增 `ProAppPage` 组件，简化系统使用
  - `@gx-desing-pro/image` 
    - 重构多个 `api` 方法
    - `ImagePreview` 组件重构，样式调整
  - 多个插件版本进行了升级

### ✨ FIX

- **Pro Table**
  - 针对 `useTable` 的升级进行代码重构
- **store**
  - 使用 `useReactiveState` `hooks` 方法以及 `PiniaStoreValue` 类型，使 `useStore` 的类型提示更加准确
- **useForm** 
  - 将 `ant` 的 `useForm` 改为 `useProForm`，类型提示更加准确
- **eslint**
  - 使用 `@antfu/eslint-config` 插件，并将全局代码进行格式

## 3.0.5(2024-09.06)

## 升级说明

### ✨ CHORE

- **插件**
  - `package.json`相关插件`@gx-desing-pro/****` `vue` 版本升级
  
### ✨ FIX

- **Pro Layout**
  - 修复暗黑模式下 `ProLayout` 的 `layout` 样式不生效
  - 调整 `ProLayout` 的主题配置方案，改为 `theme:layout` 方式，来完成多模式下的主题配色
- **Pro Provider**
  - 调整 `hashId` 的取值问题，改为 `ant` 的 `hashId`，解决暗黑模式不生效问题
  - `token:layout` 新增 `theme:layout` 值，解决 `ProLayout` 下的多模式配色不生效问题

## 3.0.4(2024-07.01)

## 升级说明

### ✨ CHORE

- **插件**
  - `package.json`相关插件`vite` `vue` `ant-design-vue`升级版本

### ✨ FIX

- **Dayjs**
  - 修复`dayjs`在`vite5`版本下使用`local` `build`报错，将`dayjs`的`local`配置文件写到本地

## 3.0.3(2024-04.25)

## 升级说明

### ✨ FIX

- **插件**
  - 修复 `rollup-plugin-visualizer`低版本在 `vite5` 执行 `report` 失败

## 3.0.3(2024-04.10)

## 升级说明

### ✨ Feat

- **其它**
  - `config`新增`theme`主题配置

### ✨ Refactor

- **主题参数**
  - `BasicLayout.vue` 新增 `state` 参数迁移至 `store/global`
  - `store/global`重构
    - 新增 `layout` 参数


## 3.0.2(2024-04.02)

## 升级说明

### ✨ Feat

- **其它**
  - `.env`新增`VITE_GITHUB_PAGE``VITE_GITEE_PAGE`环境变量
  - `assets/public_icon/`新增`gitee``github`图标icon
- **GlobalLayout/RightContent组件**
  - 新增`gitee``github`图标和地址跳转

## 3.0.1(2024-03.28)

## 升级说明

### ✨ Refactor

- **其它**
  - `package.json`新增`"type": "module"`
  - `package.json`去除`eslint`相关插件
  - 更新`.eslintrc.js`文件为`eslint.config.js`，并引入`@antfu/eslint-config`插件
  - 更新`stylelint.config.js`文件为`esm`语法
  - 更新`prettier.config.js`文件为`esm`语法
  - 更新`commitlint.config.js`文件为`esm`语法
  - `.stylelintrc.cjs`规则修改
- **vite 插件**
  - 重构`viteMock`插件，更新为`vite-plugin-mock`最新版本，已适应esm语法
  - 新增`appConfig`代替之前的`node-postBuild.ts`脚本
  - `viteBuildInfo`更改为 `viteNotice`，打包后提示语改为在`viteNotice`的`closeBundle`函数

