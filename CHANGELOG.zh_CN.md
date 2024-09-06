## 3.0.4(2024-09.06)

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

